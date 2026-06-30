import { getQuestionMeta, getSnippetsForQuestion, getStadiumById } from "@/lib/data";
import type {
  ExplanationResult,
  PitchScienceSnippet,
  QuestionType,
  StadiumId,
  StadiumProfile
} from "@/lib/types";

function buildTechnicalFallback(
  stadium: StadiumProfile,
  questionType: QuestionType,
  snippets: PitchScienceSnippet[]
) {
  const question = getQuestionMeta(questionType);
  const primaryEvidence = snippets.map((snippet) => snippet.text).join(" ");

  return `${stadium.name} is modeled as a ${stadium.surfaceType} venue, which matters for the question "${question.label}". ${stadium.tacticalBias.charAt(0).toUpperCase()}${stadium.tacticalBias.slice(1)}. ${primaryEvidence} In practical terms, that means analysts should interpret player complaints and tempo shifts as surface-behavior signals, not just form or effort.`;
}

function buildFanFallback(stadium: StadiumProfile, technicalExplanation: string) {
  return `${stadium.name} is the kind of venue where the grass setup can change how the game feels. If the surface is softer, slower, or less predictable than players expect, passes can die early, footing can feel uncertain, and fans notice a scrappier match. In short: the pitch can quietly tilt rhythm, trust, and tactics even before the score changes.`;
}

async function runOpenRouterChat(options: {
  system: string;
  prompt: string;
  model: string;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_REFERER ?? "https://pitchtruth.local",
      "X-Title": process.env.OPENROUTER_APP_NAME ?? "PitchTruth AI"
    },
    body: JSON.stringify({
      model: options.model,
      messages: [
        { role: "system", content: options.system },
        { role: "user", content: options.prompt }
      ]
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

async function runClaudeTechnicalPass(
  stadium: StadiumProfile,
  questionType: QuestionType,
  snippets: PitchScienceSnippet[]
) {
  const question = getQuestionMeta(questionType);
  const snippetBlock = snippets
    .map((snippet) => `- [${snippet.source}] ${snippet.text}`)
    .join("\n");

  const prompt = `Stadium profile:
Name: ${stadium.name}
City: ${stadium.city}
Surface: ${stadium.surfaceType}
Venue type: ${stadium.domeOrOpen}
Hybrid grass percent: ${stadium.hybridGrassPercent}
Hardness gauge: ${stadium.hardnessGauge}/100
Known issues: ${stadium.knownIssues.join("; ")}
Source notes: ${stadium.sourceNotes}

Question:
${question.prompt}

Evidence snippets:
${snippetBlock}

Write a technical explanation in 4 to 6 sentences. Mention uncertainty carefully. Do not invent live conditions or stats.`;

  try {
    const response = await runOpenRouterChat({
      model: process.env.OPENROUTER_TECHNICAL_MODEL ?? "anthropic/claude-3.5-sonnet",
      system:
        "You are a football surface analyst. Explain temporary World Cup grass behavior clearly and accurately. Be specific, restrained, and evidence-grounded.",
      prompt
    });

    return response ?? buildTechnicalFallback(stadium, questionType, snippets);
  } catch {
    return buildTechnicalFallback(stadium, questionType, snippets);
  }
}

async function runGraniteFanPass(stadium: StadiumProfile, technicalExplanation: string) {
  try {
    const response = await runOpenRouterChat({
      model: process.env.OPENROUTER_FAN_MODEL ?? "ibm/granite-3.3-8b-instruct",
      system:
        "You rewrite technical football analysis for casual fans. Keep the meaning faithful, use plain language, and stay concise.",
      prompt: `Rewrite this for a casual football fan in 3 to 4 sentences, no jargon, no hype, and keep the meaning faithful:\n\n${technicalExplanation}`
    });

    if (response) {
      return response;
    }
  } catch {
    // Fall through to local fallback for deadline-safe behavior.
  }

  return (
    technicalExplanation
      .replace(/\btraction\b/gi, "footing")
      .replace(/\bdeceleration\b/gi, "slowing down")
      .replace(/\btempo\b/gi, "rhythm")
      .split(". ")
      .slice(0, 4)
      .join(". ")
      .trim() || buildFanFallback(stadium, technicalExplanation)
  );
}

export async function generateExplanation(
  stadiumId: StadiumId,
  questionType: QuestionType
): Promise<ExplanationResult> {
  const stadium = getStadiumById(stadiumId);
  const snippets = getSnippetsForQuestion(questionType);
  const technicalExplanation = await runClaudeTechnicalPass(stadium, questionType, snippets);
  const fanExplanation = await runGraniteFanPass(stadium, technicalExplanation);

  return {
    questionType,
    stadium,
    technicalExplanation,
    fanExplanation,
    snippets,
    sourceLabels: [...new Set(snippets.map((snippet) => snippet.source))]
  };
}
