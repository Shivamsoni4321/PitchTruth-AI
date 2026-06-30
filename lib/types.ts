export type StadiumId = "metlife" | "attStadium" | "lumenField";

export type QuestionType =
  | "ball-speed"
  | "defensive-bias"
  | "injury-risk"
  | "dribbler-vs-long-ball"
  | "player-complaints";

export interface StadiumProfile {
  id: StadiumId;
  name: string;
  city: string;
  surfaceType: string;
  domeOrOpen: string;
  hybridGrassPercent: number;
  hardnessGauge: number;
  riskLevel: "low" | "medium" | "high";
  tacticalBias: string;
  knownIssues: string[];
  sourceNotes: string;
}

export interface PitchScienceSnippet {
  id: string;
  topic: string;
  supports: QuestionType[];
  source: string;
  sourceType: "research" | "standard" | "media";
  text: string;
}

export interface ExplanationPayload {
  stadiumId: StadiumId;
  questionType: QuestionType;
}

export interface ExplanationResult {
  questionType: QuestionType;
  stadium: StadiumProfile;
  technicalExplanation: string;
  fanExplanation: string;
  snippets: PitchScienceSnippet[];
  sourceLabels: string[];
}
