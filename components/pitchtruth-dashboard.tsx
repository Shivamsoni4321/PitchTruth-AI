"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar as RechartsRadar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  ArrowLeft,
  BrainCircuit,
  CloudRain,
  Goal,
  HeartPulse,
  MapPinned,
  Search,
  ShieldAlert
} from "lucide-react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

import { DEFAULT_QUESTION_TYPE, DEFAULT_STADIUM_ID, getQuestionMeta, QUESTION_OPTIONS } from "@/lib/data";
import type { ExplanationResult, QuestionType, StadiumId } from "@/lib/types";
import {
  bodyStress,
  HardnessGauge,
  navItems,
  pipelineCards,
  previewDocs,
  RiskPill,
  stadiumMarkers,
  stadiums,
  ToneDot,
  metricCards
} from "@/components/pitchtruth-shared";

async function fetchExplanation(stadiumId: StadiumId, questionType: QuestionType) {
  const response = await fetch("/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stadiumId, questionType })
  });

  if (!response.ok) {
    throw new Error("Failed to generate explanation");
  }

  return (await response.json()) as ExplanationResult;
}

const validStadiums: StadiumId[] = ["metlife", "attStadium", "lumenField"];
const validQuestions: QuestionType[] = [
  "ball-speed",
  "defensive-bias",
  "injury-risk",
  "dribbler-vs-long-ball",
  "player-complaints"
];

const questionConfidence: Record<QuestionType, number> = {
  "ball-speed": 0.86,
  "defensive-bias": 0.83,
  "injury-risk": 0.88,
  "dribbler-vs-long-ball": 0.8,
  "player-complaints": 0.78
};

const weatherProfiles: Record<StadiumId, { humidity: number[]; rain: number[] }> = {
  metlife: {
    humidity: [60, 63, 66, 64, 61],
    rain: [16, 18, 24, 19, 13]
  },
  attStadium: {
    humidity: [46, 48, 49, 47, 45],
    rain: [4, 6, 8, 6, 5]
  },
  lumenField: {
    humidity: [68, 70, 72, 69, 65],
    rain: [14, 18, 24, 21, 15]
  }
};

const tacticalFairnessProfiles: Record<StadiumId, Record<QuestionType, number[]>> = {
  metlife: {
    "ball-speed": [82, 55, 64, 73, 60],
    "defensive-bias": [78, 57, 70, 74, 63],
    "injury-risk": [76, 59, 62, 71, 58],
    "dribbler-vs-long-ball": [72, 53, 80, 69, 57],
    "player-complaints": [74, 56, 68, 70, 59]
  },
  attStadium: {
    "ball-speed": [80, 64, 72, 78, 68],
    "defensive-bias": [77, 62, 69, 76, 67],
    "injury-risk": [79, 61, 70, 75, 65],
    "dribbler-vs-long-ball": [74, 67, 78, 73, 64],
    "player-complaints": [76, 63, 71, 74, 66]
  },
  lumenField: {
    "ball-speed": [75, 61, 71, 74, 66],
    "defensive-bias": [70, 66, 78, 69, 68],
    "injury-risk": [72, 58, 67, 70, 63],
    "dribbler-vs-long-ball": [69, 64, 82, 67, 62],
    "player-complaints": [68, 60, 74, 65, 61]
  }
};

const stadiumPreviewMotion: Record<
  StadiumId,
  {
    path: string;
    ballStart: { x: string; y: string };
    ballEnd: { x: string; y: string };
    sweepAngle: string;
    accent: string;
    glow: string;
    tags: [string, string];
  }
> = {
  metlife: {
    path: "M88 182 C220 145, 300 212, 414 158 S620 115, 720 190",
    ballStart: { x: "18%", y: "61%" },
    ballEnd: { x: "78%", y: "40%" },
    sweepAngle: "18deg",
    accent: "#0F62FE",
    glow: "rgba(15,98,254,0.28)",
    tags: ["slower release", "compact-shape edge"]
  },
  attStadium: {
    path: "M72 204 C185 172, 320 118, 432 138 S612 190, 734 150",
    ballStart: { x: "14%", y: "67%" },
    ballEnd: { x: "80%", y: "47%" },
    sweepAngle: "-10deg",
    accent: "#3DDBD9",
    glow: "rgba(61,219,217,0.26)",
    tags: ["stable roof control", "seam watch"]
  },
  lumenField: {
    path: "M84 150 C208 132, 286 226, 426 210 S624 134, 728 164",
    ballStart: { x: "17%", y: "48%" },
    ballEnd: { x: "80%", y: "58%" },
    sweepAngle: "24deg",
    accent: "#F1C21B",
    glow: "rgba(241,194,27,0.25)",
    tags: ["wet zones drifting", "direct-play bias"]
  }
};

const questionSurfaceSignals: Record<
  QuestionType,
  Array<{
    label: string;
    color: string;
    x: string;
    y: string;
    width: number;
    height: number;
    delay: number;
  }>
> = {
  "ball-speed": [
    { label: "Surface hardness map", color: "#DA1E28", x: "28%", y: "33%", width: 124, height: 108, delay: 0 },
    { label: "Wetness zones", color: "#3DDBD9", x: "60%", y: "62%", width: 138, height: 104, delay: 0.3 },
    { label: "Passing speed zones", color: "#0F62FE", x: "48%", y: "50%", width: 172, height: 118, delay: 0.6 },
    { label: "Running friction", color: "#F1C21B", x: "72%", y: "30%", width: 120, height: 90, delay: 0.9 }
  ],
  "defensive-bias": [
    { label: "Compact shape edge", color: "#F1C21B", x: "32%", y: "54%", width: 148, height: 112, delay: 0 },
    { label: "Counter lanes", color: "#0F62FE", x: "68%", y: "38%", width: 160, height: 104, delay: 0.25 },
    { label: "Central slowdown", color: "#DA1E28", x: "50%", y: "48%", width: 112, height: 112, delay: 0.5 },
    { label: "Wide reset zones", color: "#3DDBD9", x: "74%", y: "68%", width: 118, height: 88, delay: 0.75 }
  ],
  "injury-risk": [
    { label: "Plant-foot stress", color: "#DA1E28", x: "38%", y: "44%", width: 132, height: 124, delay: 0 },
    { label: "Stud penetration", color: "#F1C21B", x: "62%", y: "58%", width: 136, height: 110, delay: 0.3 },
    { label: "Shear-force load", color: "#0F62FE", x: "52%", y: "34%", width: 126, height: 94, delay: 0.6 },
    { label: "Recovery traction", color: "#3DDBD9", x: "74%", y: "30%", width: 108, height: 90, delay: 0.9 }
  ],
  "dribbler-vs-long-ball": [
    { label: "Dribble drag", color: "#DA1E28", x: "30%", y: "46%", width: 124, height: 100, delay: 0 },
    { label: "Long-ball skip", color: "#0F62FE", x: "60%", y: "36%", width: 166, height: 108, delay: 0.25 },
    { label: "Second-ball bounce", color: "#F1C21B", x: "52%", y: "64%", width: 132, height: 96, delay: 0.5 },
    { label: "Footing confidence", color: "#3DDBD9", x: "76%", y: "56%", width: 110, height: 86, delay: 0.75 }
  ],
  "player-complaints": [
    { label: "Seam inconsistency", color: "#DA1E28", x: "34%", y: "34%", width: 124, height: 114, delay: 0 },
    { label: "Ball-roll drift", color: "#0F62FE", x: "58%", y: "56%", width: 146, height: 110, delay: 0.25 },
    { label: "Softness pockets", color: "#F1C21B", x: "74%", y: "36%", width: 118, height: 90, delay: 0.5 },
    { label: "Confidence drop", color: "#3DDBD9", x: "46%", y: "70%", width: 112, height: 84, delay: 0.75 }
  ]
};

function downloadReport(result: ExplanationResult | null) {
  const text = result
    ? [
        "PitchTruth AI Match Report",
        "",
        `Venue: ${result.stadium.name}`,
        `Question: ${getQuestionMeta(result.questionType).label}`,
        "",
        "Fan View",
        result.fanExplanation,
        "",
        "Analyst View",
        result.technicalExplanation,
        "",
        `Sources: ${result.sourceLabels.join(", ")}`
      ].join("\n")
    : "PitchTruth AI Match Report\n\nGenerate an analysis first to export a full report.";

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "pitchtruth-report.txt";
  link.click();
  URL.revokeObjectURL(url);
}

function updateQueryString(
  pathname: string,
  searchParams: URLSearchParams,
  stadium: StadiumId,
  question: QuestionType
) {
  const next = new URLSearchParams(searchParams.toString());
  next.set("stadium", stadium);
  next.set("question", question);
  return `${pathname}?${next.toString()}`;
}

export function PitchTruthDashboard({
  initialStadium,
  initialQuestion
}: {
  initialStadium?: string;
  initialQuestion?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedStadium, setSelectedStadium] = useState<StadiumId>(DEFAULT_STADIUM_ID);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionType>(DEFAULT_QUESTION_TYPE);
  const [selectedView, setSelectedView] = useState<"fan" | "analyst">("fan");
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const stadiumParam = initialStadium;
    const questionParam = initialQuestion;

    if (stadiumParam && validStadiums.includes(stadiumParam as StadiumId)) {
      setSelectedStadium(stadiumParam as StadiumId);
    }

    if (questionParam && validQuestions.includes(questionParam as QuestionType)) {
      setSelectedQuestion(questionParam as QuestionType);
    }
  }, [initialQuestion, initialStadium]);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        const nextResult = await fetchExplanation(selectedStadium, selectedQuestion);
        startTransition(() => {
          setResult(nextResult);
        });
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Unknown error");
      }
    };

    void run();
  }, [selectedQuestion, selectedStadium]);

  useEffect(() => {
    const nextUrl = updateQueryString(pathname, new URLSearchParams(), selectedStadium, selectedQuestion);
    router.replace(nextUrl as never, { scroll: false });
  }, [pathname, router, selectedQuestion, selectedStadium]);

  const activeStadium = useMemo(
    () => stadiums.find((stadium) => stadium.id === selectedStadium) ?? stadiums[0],
    [selectedStadium]
  );
  const activeMarker = stadiumMarkers.find((marker) => marker.id === selectedStadium) ?? stadiumMarkers[0];
  const activePreviewMotion = stadiumPreviewMotion[selectedStadium];
  const activeSurfaceSignals = questionSurfaceSignals[selectedQuestion];
  const confidenceScore = result ? questionConfidence[selectedQuestion] : 0;
  const dynamicMetricCards = useMemo(() => {
    const humidityValue = Number.parseInt(activeMarker.humidity, 10);
    const riskOffset =
      activeStadium.riskLevel === "high" ? 6 : activeStadium.riskLevel === "medium" ? 2 : -2;
    const questionBallSpeed =
      selectedQuestion === "ball-speed"
        ? 0.84
        : selectedQuestion === "dribbler-vs-long-ball"
          ? 0.9
          : selectedQuestion === "injury-risk"
            ? 0.88
            : 0.92;
    const qualityScore = Math.max(72, 96 - activeStadium.hardnessGauge + activeStadium.hybridGrassPercent / 3);
    const injuryRisk = Math.min(91, activeStadium.hardnessGauge + riskOffset + (selectedQuestion === "injury-risk" ? 8 : 0));

    return [
      { ...metricCards[0], value: String(Math.round(qualityScore)), delta: activeStadium.riskLevel === "high" ? "-3.4%" : "+2.1%" },
      { ...metricCards[1], value: String(activeStadium.hardnessGauge), delta: activeStadium.riskLevel === "high" ? "High" : "Moderate" },
      { ...metricCards[2], value: `${activeStadium.hybridGrassPercent}%`, delta: activeStadium.domeOrOpen.includes("climate") ? "+3.0%" : "+1.4%" },
      { ...metricCards[3], value: `${humidityValue}%`, delta: activeStadium.id === "attStadium" ? "-1%" : "+2%" },
      { ...metricCards[4], value: String(injuryRisk), delta: injuryRisk >= 70 ? "Elevated" : "Manageable" },
      { ...metricCards[5], value: `${questionBallSpeed.toFixed(2)}x`, delta: questionBallSpeed < 0.9 ? "-8%" : "-3%" }
    ];
  }, [activeMarker.humidity, activeStadium, selectedQuestion]);
  const dynamicWeatherTrend = useMemo(
    () =>
      ["12:00", "14:00", "16:00", "18:00", "20:00"].map((time, index) => ({
        time,
        humidity: weatherProfiles[selectedStadium].humidity[index],
        rain: weatherProfiles[selectedStadium].rain[index]
      })),
    [selectedStadium]
  );
  const dynamicFairnessData = useMemo(() => {
    const counterProfile = tacticalFairnessProfiles[selectedStadium][selectedQuestion];
    const possessionProfile = counterProfile.map((value, index) =>
      Math.max(52, Math.min(86, value + (index === 0 ? 8 : index === 3 ? 6 : -4)))
    );

    return [
      { subject: "Possession", possession: possessionProfile[0], counter: counterProfile[0] },
      { subject: "Acceleration", possession: possessionProfile[1], counter: counterProfile[1] },
      { subject: "Long Passing", possession: possessionProfile[2], counter: counterProfile[2] },
      { subject: "Press Resistance", possession: possessionProfile[3], counter: counterProfile[3] },
      { subject: "Duel Safety", possession: possessionProfile[4], counter: counterProfile[4] }
    ];
  }, [selectedQuestion, selectedStadium]);
  const fairnessNarrative = useMemo(() => {
    const questionLabel = getQuestionMeta(selectedQuestion).shortLabel.toLowerCase();

    if (selectedStadium === "lumenField") {
      return `Advantage meter: ${questionLabel} conditions lean slightly toward direct, transition-heavy phases when moisture builds.`;
    }

    if (selectedStadium === "attStadium") {
      return `Advantage meter: ${questionLabel} conditions are relatively balanced, with climate control reducing volatility but not removing seam risk.`;
    }

    return `Advantage meter: ${questionLabel} conditions slightly favor organized counter-attacking shapes over high-rhythm possession.`;
  }, [selectedQuestion, selectedStadium]);

  const jumpToSection = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-[1500px] px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <div className="glass-panel sticky top-4 z-40 rounded-[24px] border px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/78 transition hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Landing Page
              </Link>
              <div>
                <div className="text-sm font-semibold tracking-wide">PitchTruth Dashboard</div>
                <div className="text-xs text-white/45">Enterprise match-surface analytics workspace</div>
              </div>
            </div>
            <div className="min-w-0 overflow-hidden lg:flex-1">
              <div className="hide-scrollbar flex max-w-full gap-2 overflow-x-auto overflow-y-hidden pb-1 md:flex-wrap md:justify-end md:overflow-visible md:pb-0">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => jumpToSection(item.target)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/64 transition hover:bg-white/10 hover:text-white"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section id="overview" className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dynamicMetricCards.map((metric) => (
            <div key={metric.label} className="glass-panel metric-glow rounded-[24px] border p-5">
              <div className="flex items-center justify-between">
                <ToneDot tone={metric.tone} />
                <metric.icon className="h-4 w-4 text-white/45" />
              </div>
              <div className="mt-5 text-xs uppercase tracking-[0.2em] text-white/45">{metric.label}</div>
              <div className="mt-2 text-3xl font-semibold">{metric.value}</div>
              <div className="mt-2 text-sm text-white/52">{metric.delta}</div>
            </div>
          ))}
        </section>

        <section id="stadium-explorer" className="mt-8 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="glass-panel h-fit rounded-[28px] border p-4">
            <div className="mb-4 flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F62FE]/14">
                <MapPinned className="h-5 w-5 text-[#8eb4ff]" />
              </div>
              <div>
                <div className="text-sm font-semibold">Stadium Explorer</div>
                <div className="text-xs text-white/45">Choose venue profile</div>
              </div>
            </div>
            <div className="space-y-3">
              {stadiums.map((stadium) => (
                <button
                  key={stadium.id}
                  type="button"
                  onClick={() => setSelectedStadium(stadium.id)}
                  className={clsx(
                    "w-full rounded-[20px] border p-4 text-left transition",
                    selectedStadium === stadium.id
                      ? "border-[#4589FF]/40 bg-[#0F62FE]/10"
                      : "border-white/8 bg-white/5 hover:border-white/18"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold">{stadium.name}</div>
                    <RiskPill level={stadium.riskLevel} />
                  </div>
                  <div className="mt-2 text-xs leading-5 text-white/54">{stadium.surfaceType}</div>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="glass-panel rounded-[28px] border p-6">
              <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-white/45">Interactive Stadium Explorer</div>
                  <div className="mt-2 text-2xl font-semibold">{activeStadium.name}</div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
                    {activeStadium.surfaceType} in a {activeStadium.domeOrOpen} setting, modeled to surface ball-speed, traction,
                    and fairness effects for the 2026 tournament story.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <RiskPill level={activeStadium.riskLevel} />
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/60">
                    {activeStadium.hybridGrassPercent}% hybrid
                  </span>
                </div>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,#0a1829,#0f2239)] p-4">
                  <div className="relative h-[280px] overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#0f7a46_0%,#0c5c34_100%)]">
                    <motion.div
                      key={`${selectedStadium}-wash`}
                      animate={{ x: ["-16%", "105%"], opacity: [0, 0.28, 0] }}
                      transition={{ duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="absolute inset-y-0 w-28"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${activePreviewMotion.glow}, transparent)`,
                        transform: `skewX(${activePreviewMotion.sweepAngle})`
                      }}
                    />
                    <div className="absolute inset-5 rounded-[16px] border border-white/30" />
                    <div className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-white/60" />
                    <div className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-white/50" />
                    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
                    <div className="absolute inset-y-12 left-5 w-16 border border-white/50" />
                    <div className="absolute inset-y-12 right-5 w-16 border border-white/50" />
                    <svg viewBox="0 0 800 280" className="absolute inset-0 h-full w-full">
                      <motion.path
                        key={`${selectedStadium}-path`}
                        d={activePreviewMotion.path}
                        fill="none"
                        stroke={activePreviewMotion.accent}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="12 16"
                        initial={{ pathLength: 0.15, opacity: 0.2 }}
                        animate={{ pathLength: [0.15, 1], opacity: [0.25, 0.7, 0.25] }}
                        transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        style={{ filter: `drop-shadow(0 0 10px ${activePreviewMotion.glow})` }}
                      />
                    </svg>
                    <motion.div
                      key={`${selectedStadium}-ball`}
                      animate={{
                        left: [activePreviewMotion.ballStart.x, activePreviewMotion.ballEnd.x],
                        top: [activePreviewMotion.ballStart.y, activePreviewMotion.ballEnd.y],
                        scale: [0.95, 1.15, 0.95]
                      }}
                      transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", ease: "easeInOut" }}
                      className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white shadow-[0_0_24px_rgba(255,255,255,0.9)]"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                        transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
                        className="absolute inset-[-10px] rounded-full border"
                        style={{ borderColor: activePreviewMotion.glow }}
                      />
                    </motion.div>
                    {[
                      { x: "24%", y: "58%" },
                      { x: "51%", y: "46%" },
                      { x: "70%", y: "40%" }
                    ].map((marker, index) => (
                      <motion.div
                        key={`${selectedStadium}-marker-${index}`}
                        animate={{ scale: [0.9, 1.12, 0.9], opacity: [0.3, 0.75, 0.3] }}
                        transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, delay: index * 0.35 }}
                        className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50"
                        style={{ left: marker.x, top: marker.y, backgroundColor: activePreviewMotion.accent }}
                      />
                    ))}
                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#08111d]/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/65">
                      {activeMarker.label} live preview
                    </div>
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      {activePreviewMotion.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-[#08111d]/55 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {[
                    ["Weather panel", `${activeMarker.temperature} / ${activeMarker.humidity}`],
                    ["Roof status", activeMarker.roof],
                    ["Grass installation date", "Tournament temporary lay"],
                    ["Indoor/Outdoor", activeStadium.domeOrOpen],
                    [
                      "Temporary/Permanent grass",
                      activeStadium.surfaceType.includes("temporary")
                        ? "Temporary hybrid system"
                        : "Tournament-managed system"
                    ]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/42">{label}</div>
                      <div className="mt-2 text-base font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="weather" className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <HardnessGauge value={activeStadium.hardnessGauge} />
              <div className="glass-panel rounded-[28px] border p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
                  <CloudRain className="h-4 w-4 text-[#3DDBD9]" />
                  Weather Intelligence
                </div>
                <div className="mt-5 h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dynamicWeatherTrend}>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                      <YAxis stroke="rgba(255,255,255,0.4)" />
                      <Tooltip
                        contentStyle={{
                          background: "#0c1524",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 16
                        }}
                      />
                      <Line type="monotone" dataKey="humidity" stroke="#4589FF" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="rain" stroke="#3DDBD9" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div id="analysis" className="grid items-start gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="glass-panel self-start rounded-[28px] border p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/45">AI Analysis Panel</div>
                    <div className="mt-2 text-2xl font-semibold">Explain the surface in plain English</div>
                  </div>
                  <div className="rounded-full border border-white/8 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/55">
                    {result ? `Confidence ${confidenceScore.toFixed(2)}` : "Generating insight"}
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {QUESTION_OPTIONS.map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setSelectedQuestion(question.id)}
                      className={clsx(
                        "rounded-[22px] border p-4 text-left transition",
                        selectedQuestion === question.id
                          ? "border-[#4589FF]/40 bg-[#0F62FE]/10"
                          : "border-white/8 bg-white/5 hover:border-white/18"
                      )}
                    >
                      <div className="text-sm font-medium">{question.label}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(["fan", "analyst"] as const).map((view) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => setSelectedView(view)}
                      className={clsx(
                        "rounded-full border px-4 py-2 text-sm",
                        selectedView === view ? "border-[#4589FF]/40 bg-[#0F62FE]/10" : "border-white/8 bg-white/5 text-white/60"
                      )}
                    >
                      {view === "fan" ? "Fan View" : "Analyst View"}
                    </button>
                  ))}
                </div>
                <motion.div
                  key={`${selectedView}-${selectedQuestion}-${selectedStadium}-${isPending}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 min-h-[240px] rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,#091321,#0c1727)] p-5"
                >
                  {error ? (
                    <p className="text-[#ff9da4]">{error}</p>
                  ) : !result ? (
                    <div className="space-y-3">
                      <div className="h-5 w-40 animate-pulse rounded-full bg-white/8" />
                      <div className="h-4 w-full animate-pulse rounded-full bg-white/8" />
                      <div className="h-4 w-[88%] animate-pulse rounded-full bg-white/8" />
                      <div className="h-4 w-[72%] animate-pulse rounded-full bg-white/8" />
                    </div>
                  ) : (
                    <>
                      <div className="text-xs uppercase tracking-[0.22em] text-white/42">
                        {getQuestionMeta(selectedQuestion).shortLabel}
                      </div>
                      <p className={clsx("mt-4 leading-8", selectedView === "fan" ? "text-xl text-white" : "text-[15px] text-white/84")}>
                        {selectedView === "fan" ? result.fanExplanation : result.technicalExplanation}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {result.sourceLabels.map((source) => (
                          <span key={source} className="rounded-full border border-white/8 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.16em] text-white/58">
                            {source}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

              <div className="space-y-6">
                <div className="glass-panel rounded-[28px] border p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
                    <MapPinned className="h-4 w-4 text-[#3DDBD9]" />
                    Pitch Science Visualization
                  </div>
                  <div className="mt-5 rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,#0b1727,#091321)] p-4">
                    <div className="relative h-[270px] overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#0f7a46_0%,#0b6439_100%)]">
                      <motion.div
                        key={`${selectedQuestion}-scan`}
                        animate={{ x: ["-14%", "104%"], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="absolute inset-y-0 w-24 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]"
                      />
                      <motion.div
                        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                        transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at center, rgba(255,255,255,0.18) 0 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                          backgroundSize: "26px 26px, 84px 84px, 84px 84px"
                        }}
                      />
                      <div className="absolute inset-4 rounded-[16px] border border-white/30" />
                      {activeSurfaceSignals.map((signal) => (
                        <motion.div
                          key={`${selectedQuestion}-${signal.label}`}
                          initial={{ opacity: 0.24, scale: 0.92 }}
                          animate={{
                            opacity: [0.24, 0.62, 0.24],
                            scale: [0.92, 1.12, 0.92]
                          }}
                          transition={{
                            duration: 3.6,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: signal.delay,
                            ease: "easeInOut"
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                          style={{
                            left: signal.x,
                            top: signal.y,
                            width: signal.width,
                            height: signal.height,
                            backgroundColor: signal.color
                          }}
                        />
                      ))}
                      {activeSurfaceSignals.map((signal) => (
                        <motion.div
                          key={`${selectedQuestion}-pin-${signal.label}`}
                          animate={{ opacity: [0.35, 0.85, 0.35], y: [0, -3, 0] }}
                          transition={{
                            duration: 2.4,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: signal.delay + 0.1,
                            ease: "easeInOut"
                          }}
                          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60"
                          style={{ left: signal.x, top: signal.y, backgroundColor: signal.color }}
                        />
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {activeSurfaceSignals.map((signal, index) => (
                        <motion.div
                          key={signal.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.06 }}
                          className="rounded-[18px] border border-white/8 bg-white/5 px-3 py-3 text-sm text-white/62"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span>{signal.label}</span>
                            <span
                              className="h-2.5 w-2.5 rounded-full shadow-[0_0_14px_currentColor]"
                              style={{ backgroundColor: signal.color, color: signal.color }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-[28px] border p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
                    <ShieldAlert className="h-4 w-4 text-[#F1C21B]" />
                    Tactical Fairness
                  </div>
                  <div className="mt-5 h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={dynamicFairnessData}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} />
                        <RechartsRadar name="Possession Team" dataKey="possession" stroke="#4589FF" fill="#4589FF" fillOpacity={0.25} />
                        <RechartsRadar name="Counter Team" dataKey="counter" stroke="#F1C21B" fill="#F1C21B" fillOpacity={0.18} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-[20px] border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/62">
                    {fairnessNarrative}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="glass-panel rounded-[28px] border p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
                  <HeartPulse className="h-4 w-4 text-[#DA1E28]" />
                  Injury Risk Center
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,#0b1423,#0c192c)] p-5">
                    <div className="mx-auto flex h-[260px] w-[120px] flex-col items-center justify-between">
                      <div className="h-14 w-14 rounded-full bg-[#DA1E28]/18" />
                      <div className="h-24 w-16 rounded-[40px] bg-[#DA1E28]/12" />
                      <div className="flex gap-3">
                        <div className="h-24 w-5 rounded-full bg-[#F1C21B]/18" />
                        <div className="h-24 w-5 rounded-full bg-[#F1C21B]/18" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {bodyStress.map((part) => (
                      <div key={part.label} className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>{part.label}</span>
                          <span>{part.value}</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-white/8">
                          <div className="h-2 rounded-full bg-[linear-gradient(90deg,#F1C21B,#DA1E28)]" style={{ width: `${part.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div id="research" className="glass-panel rounded-[28px] border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-white/45">Research Library</div>
                      <div className="mt-2 text-2xl font-semibold">Imported knowledge base</div>
                    </div>
                    <div className="rounded-full border border-white/8 bg-white/5 p-3">
                      <Search className="h-4 w-4 text-white/58" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {previewDocs.map((doc, index) => (
                      <div key={doc} className="flex flex-col gap-3 rounded-[20px] border border-white/8 bg-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-sm font-medium">{doc}</div>
                          <div className="mt-1 text-xs text-white/45">Docling extraction preview • source citation ready</div>
                        </div>
                        <div className="rounded-full bg-[#0F62FE]/12 px-3 py-2 text-xs text-[#9dc0ff]">PDF {index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div id="settings" className="glass-panel rounded-[28px] border p-6">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/45">IBM AI Pipeline</div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
                    {pipelineCards.map((item) => (
                      <div key={item.label} className="rounded-[20px] border border-white/8 bg-white/5 p-4 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
                          <item.icon className="h-4 w-4 text-[#8eb4ff]" />
                        </div>
                        <div className="mt-3 text-sm font-medium">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="report" className="glass-panel rounded-[28px] border p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/45">Match Report</div>
                  <div className="mt-2 text-2xl font-semibold">Executive-ready pitch report page</div>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    Overview, key findings, pitch summary, weather summary, AI recommendation, and export-ready structure for judges,
                    coaches, and journalists.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadReport(result)}
                  className="rounded-full bg-[#0F62FE] px-5 py-3 text-sm font-medium shadow-[0_10px_30px_rgba(15,98,254,0.25)]"
                >
                  Export Report
                </button>
              </div>
              <div className="mt-6 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dynamicWeatherTrend}>
                    <defs>
                      <linearGradient id="pitchGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#0F62FE" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="#0F62FE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                    <YAxis stroke="rgba(255,255,255,0.4)" />
                    <Tooltip
                      contentStyle={{
                        background: "#0c1524",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16
                      }}
                    />
                    <Area type="monotone" dataKey="humidity" stroke="#0F62FE" fill="url(#pitchGradient)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
