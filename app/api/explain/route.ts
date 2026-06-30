import { NextResponse } from "next/server";

import { generateExplanation } from "@/lib/ai";
import type { ExplanationPayload, QuestionType, StadiumId } from "@/lib/types";

const validStadiums: StadiumId[] = ["metlife", "attStadium", "lumenField"];
const validQuestions: QuestionType[] = [
  "ball-speed",
  "defensive-bias",
  "injury-risk",
  "dribbler-vs-long-ball",
  "player-complaints"
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ExplanationPayload>;

    if (!body.stadiumId || !validStadiums.includes(body.stadiumId)) {
      return NextResponse.json({ error: "Invalid stadiumId" }, { status: 400 });
    }

    if (!body.questionType || !validQuestions.includes(body.questionType)) {
      return NextResponse.json({ error: "Invalid questionType" }, { status: 400 });
    }

    const result = await generateExplanation(body.stadiumId, body.questionType);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
