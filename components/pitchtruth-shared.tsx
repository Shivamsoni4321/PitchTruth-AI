"use client";

import { type ReactNode } from "react";
import {
  Activity,
  BookOpen,
  BrainCircuit,
  CloudRain,
  Compass,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Goal,
  HeartPulse,
  MapPinned,
  Radar,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Waves,
  Wind
} from "lucide-react";
import clsx from "clsx";

import { getStadiums } from "@/lib/data";
import type { StadiumId, StadiumProfile } from "@/lib/types";

export const stadiums = getStadiums();

export const metricCards = [
  { label: "Pitch Quality Score", value: "81", delta: "+4.2%", icon: Gauge, tone: "blue" },
  { label: "Surface Hardness", value: "67", delta: "High", icon: ShieldAlert, tone: "amber" },
  { label: "Grass Health", value: "88%", delta: "+2.1%", icon: Waves, tone: "green" },
  { label: "Humidity", value: "64%", delta: "-3%", icon: CloudRain, tone: "cyan" },
  { label: "Injury Risk", value: "71", delta: "Elevated", icon: HeartPulse, tone: "red" },
  { label: "Ball Speed Index", value: "0.84x", delta: "-9%", icon: Activity, tone: "violet" }
] as const;

export const stadiumMarkers = [
  { id: "metlife" as StadiumId, label: "MetLife", x: "27%", y: "34%", temperature: "23C", humidity: "64%", roof: "Open" },
  { id: "attStadium" as StadiumId, label: "AT&T", x: "20%", y: "46%", temperature: "31C", humidity: "48%", roof: "Closed" },
  { id: "lumenField" as StadiumId, label: "Lumen", x: "12%", y: "24%", temperature: "18C", humidity: "72%", roof: "Open" }
];

export const featureCards = [
  { title: "Pitch Condition AI", body: "Explains how grass density, seams, and softness change the match.", icon: BrainCircuit },
  { title: "Weather Intelligence", body: "Humidity, rain risk, and wind mapped into match-speed interpretation.", icon: CloudRain },
  { title: "Ball Speed Analysis", body: "Translates surface friction into fan-friendly tempo insight.", icon: Goal },
  { title: "Injury Risk", body: "Highlights stress zones driven by hardness, fatigue, and footing confidence.", icon: HeartPulse },
  { title: "Tactical Fairness", body: "Shows who benefits when the pitch gets sticky, slow, or unstable.", icon: Radar },
  { title: "Grass Science", body: "Makes FIFA guidance and turf research legible inside an enterprise UI.", icon: BookOpen },
  { title: "Historical Match Comparison", body: "Benchmarks venue behavior against likely pace and movement patterns.", icon: Database },
  { title: "AI Match Explanation", body: "Claude-style technical analysis rewritten into Granite-friendly fan language.", icon: Sparkles }
];

export const workflowSteps = [
  { label: "Research Papers", icon: FileText },
  { label: "Docling", icon: Search },
  { label: "Granite AI", icon: BrainCircuit },
  { label: "LangFlow", icon: GitBranch },
  { label: "PitchTruth AI", icon: Compass },
  { label: "Fan-friendly Insights", icon: Sparkles }
];

export const weatherTrend = [
  { time: "12:00", humidity: 58, rain: 12 },
  { time: "14:00", humidity: 61, rain: 16 },
  { time: "16:00", humidity: 64, rain: 22 },
  { time: "18:00", humidity: 62, rain: 18 },
  { time: "20:00", humidity: 59, rain: 10 }
];

export const fairnessData = [
  { subject: "Possession", possession: 84, counter: 66 },
  { subject: "Acceleration", possession: 58, counter: 79 },
  { subject: "Long Passing", possession: 62, counter: 83 },
  { subject: "Press Resistance", possession: 76, counter: 57 },
  { subject: "Duel Safety", possession: 61, counter: 69 }
];

export const bodyStress = [
  { label: "Ankles", value: 79 },
  { label: "Knees", value: 71 },
  { label: "Hamstrings", value: 63 },
  { label: "Groin", value: 57 }
];

export const previewDocs = [
  "FIFA pitch standards",
  "Temporary grass logistics briefing",
  "Turf biomechanics review",
  "Venue criticism coverage"
];

export const navItems = [
  { label: "Overview", icon: Compass, target: "overview" },
  { label: "Stadium Explorer", icon: MapPinned, target: "stadium-explorer" },
  { label: "Match Analysis", icon: BrainCircuit, target: "analysis" },
  { label: "Weather", icon: Wind, target: "weather" },
  { label: "Reports", icon: FileText, target: "report" },
  { label: "Research", icon: BookOpen, target: "research" },
  { label: "Settings", icon: Settings, target: "report" }
] as const;

export const pipelineCards = [
  { label: "Upload PDF", icon: FileText },
  { label: "Docling Extraction", icon: Search },
  { label: "Granite Analysis", icon: BrainCircuit },
  { label: "LangFlow Orchestration", icon: GitBranch },
  { label: "PitchTruth Response", icon: Sparkles }
] as const;

export function RiskPill({ level }: { level: StadiumProfile["riskLevel"] }) {
  const styles = {
    low: "bg-[#24A148]/12 text-[#7fda9d] border-[#24A148]/20",
    medium: "bg-[#F1C21B]/12 text-[#f6dc77] border-[#F1C21B]/20",
    high: "bg-[#DA1E28]/12 text-[#ff9da4] border-[#DA1E28]/20"
  };

  return (
    <span className={clsx("rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.24em]", styles[level])}>
      {level} risk
    </span>
  );
}

export function ToneDot({ tone }: { tone: (typeof metricCards)[number]["tone"] }) {
  const classes = {
    blue: "bg-[#0F62FE]",
    amber: "bg-[#F1C21B]",
    green: "bg-[#24A148]",
    cyan: "bg-[#3DDBD9]",
    red: "bg-[#DA1E28]",
    violet: "bg-[#8A3FFC]"
  };

  return <span className={clsx("h-2.5 w-2.5 rounded-full", classes[tone])} />;
}

export function HardnessGauge({ value }: { value: number }) {
  const rotation = Math.round((value / 100) * 180 - 90);

  return (
    <div className="glass-panel metric-glow rounded-[24px] border p-5">
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
        <Gauge className="h-4 w-4 text-[#4589FF]" />
        Surface Hardness Gauge
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-24 w-48 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 h-24 w-48 -translate-x-1/2 rounded-t-full border border-white/15 border-b-0" />
          <div className="absolute bottom-0 left-1/2 h-20 w-40 -translate-x-1/2 rounded-t-full border border-white/8 border-b-0" />
          <div
            className="absolute bottom-0 left-1/2 h-20 w-1 -translate-x-1/2 origin-bottom rounded-full bg-[#0F62FE] shadow-[0_0_28px_rgba(15,98,254,0.8)]"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          />
        </div>
        <div>
          <div className="text-4xl font-semibold tracking-tight text-white">{value}</div>
          <div className="mt-1 max-w-[180px] text-sm leading-6 text-white/65">
            Elevated readings increase cutting stress and change how quickly the ball releases.
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  actions
}: {
  eyebrow: string;
  title: string;
  body: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="mb-3 text-xs uppercase tracking-[0.28em] text-[#4589FF]">{eyebrow}</div>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 text-base leading-7 text-white/64">{body}</p>
      </div>
      {actions}
    </div>
  );
}

export function buildDashboardHref(stadiumId: StadiumId) {
  return `/dashboard?stadium=${stadiumId}`;
}
