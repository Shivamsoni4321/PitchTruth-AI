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
  weatherTrend,
  fairnessData,
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
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
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

        <section id="overview" className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metricCards.map((metric) => (
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
                  <div className="relative h-[280px] rounded-[20px] bg-[linear-gradient(180deg,#0f7a46_0%,#0c5c34_100%)]">
                    <div className="absolute inset-5 rounded-[16px] border border-white/30" />
                    <div className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-white/60" />
                    <div className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-white/50" />
                    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
                    <div className="absolute inset-y-12 left-5 w-16 border border-white/50" />
                    <div className="absolute inset-y-12 right-5 w-16 border border-white/50" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#08111d]/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/65">
                      {activeMarker.label} live preview
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {[
                    ["Weather panel", `${activeMarker.temperature} / ${activeMarker.humidity}`],
                    ["Roof status", activeMarker.roof],
                    ["Grass installation date", "Tournament temporary lay"],
                    ["Indoor/Outdoor", activeStadium.domeOrOpen],
                    ["Temporary/Permanent grass", "Temporary hybrid system"]
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
                    <LineChart data={weatherTrend}>
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

            <div id="analysis" className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="glass-panel rounded-[28px] border p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/45">AI Analysis Panel</div>
                    <div className="mt-2 text-2xl font-semibold">Explain the surface in plain English</div>
                  </div>
                  <div className="rounded-full border border-white/8 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/55">
                    Confidence 0.86
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
                  className="mt-5 rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,#091321,#0c1727)] p-5"
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
                    <div className="relative h-[270px] rounded-[18px] bg-[linear-gradient(180deg,#0f7a46_0%,#0b6439_100%)]">
                      <div className="absolute inset-4 rounded-[16px] border border-white/30" />
                      <div className="absolute left-[26%] top-[36%] h-20 w-20 rounded-full bg-[#DA1E28]/20 blur-md" />
                      <div className="absolute left-[58%] top-[28%] h-16 w-24 rounded-full bg-[#F1C21B]/18 blur-md" />
                      <div className="absolute left-[44%] top-[56%] h-20 w-28 rounded-full bg-[#0F62FE]/20 blur-md" />
                      <div className="absolute left-[70%] top-[58%] h-14 w-14 rounded-full bg-[#3DDBD9]/18 blur-md" />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {["Surface hardness map", "Wetness zones", "Passing speed zones", "Running friction"].map((item) => (
                        <div key={item} className="rounded-[18px] border border-white/8 bg-white/5 px-3 py-3 text-sm text-white/62">
                          {item}
                        </div>
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
                      <RadarChart data={fairnessData}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} />
                        <RechartsRadar name="Possession Team" dataKey="possession" stroke="#4589FF" fill="#4589FF" fillOpacity={0.25} />
                        <RechartsRadar name="Counter Team" dataKey="counter" stroke="#F1C21B" fill="#F1C21B" fillOpacity={0.18} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-[20px] border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/62">
                    Advantage meter: current venue profile slightly favors organized counter-attacking shapes over high-rhythm possession.
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

                <div className="glass-panel rounded-[28px] border p-6">
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
                  <AreaChart data={weatherTrend}>
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
