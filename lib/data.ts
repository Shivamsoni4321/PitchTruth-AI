import stadiumsData from "@/data/stadiums.json";
import pitchScienceData from "@/data/pitch-science.json";
import type {
  PitchScienceSnippet,
  QuestionType,
  StadiumId,
  StadiumProfile
} from "@/lib/types";

const stadiums = stadiumsData as Record<StadiumId, StadiumProfile>;
const snippets = pitchScienceData as PitchScienceSnippet[];

export const QUESTION_OPTIONS: Array<{
  id: QuestionType;
  label: string;
  shortLabel: string;
  icon: string;
  prompt: string;
}> = [
  {
    id: "ball-speed",
    label: "Why is the ball moving slower today?",
    shortLabel: "Ball Speed",
    icon: "◎",
    prompt: "Explain why ball speed may be slower on this temporary World Cup surface."
  },
  {
    id: "defensive-bias",
    label: "Is this pitch helping defensive teams?",
    shortLabel: "Defensive Bias",
    icon: "▦",
    prompt: "Explain whether this pitch condition could favor defensive teams and why."
  },
  {
    id: "injury-risk",
    label: "Could surface hardness increase injury risk?",
    shortLabel: "Injury Risk",
    icon: "▲",
    prompt: "Explain whether the surface profile raises injury-risk concerns."
  },
  {
    id: "dribbler-vs-long-ball",
    label: "How does temporary grass affect dribblers vs long-ball teams?",
    shortLabel: "Style Impact",
    icon: "⇄",
    prompt: "Explain how temporary grass changes the balance between dribblers and long-ball teams."
  },
  {
    id: "player-complaints",
    label: "Why are players complaining about this venue?",
    shortLabel: "Complaints",
    icon: "!",
    prompt: "Explain why players might complain about this venue's surface in practical football terms."
  }
];

export const DEFAULT_STADIUM_ID: StadiumId = "metlife";
export const DEFAULT_QUESTION_TYPE: QuestionType = "ball-speed";

export function getStadiums(): StadiumProfile[] {
  return Object.values(stadiums);
}

export function getStadiumById(stadiumId: StadiumId): StadiumProfile {
  return stadiums[stadiumId];
}

export function getQuestionMeta(questionType: QuestionType) {
  return QUESTION_OPTIONS.find((item) => item.id === questionType) ?? QUESTION_OPTIONS[0];
}

export function getSnippetsForQuestion(questionType: QuestionType) {
  return snippets.filter((snippet) => snippet.supports.includes(questionType)).slice(0, 4);
}
