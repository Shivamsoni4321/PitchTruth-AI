"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Goal, Menu, PlayCircle, Sparkles, X } from "lucide-react";
import clsx from "clsx";

import {
  buildDashboardHref,
  featureCards,
  metricCards,
  RiskPill,
  SectionHeading,
  stadiumMarkers,
  stadiums,
  ToneDot,
  workflowSteps
} from "@/components/pitchtruth-shared";
import type { StadiumId } from "@/lib/types";

export function PitchTruthLanding() {
  const [selectedStadium, setSelectedStadium] = useState<StadiumId>("metlife");
  const [menuOpen, setMenuOpen] = useState(false);

  const activeStadium = useMemo(
    () => stadiums.find((stadium) => stadium.id === selectedStadium) ?? stadiums[0],
    [selectedStadium]
  );

  const activeMarker = stadiumMarkers.find((marker) => marker.id === selectedStadium) ?? stadiumMarkers[0];

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-[1500px] px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel sticky top-4 z-40 rounded-[24px] border px-5 py-3"
        >
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0F62FE,#8A3FFC)] shadow-[0_0_30px_rgba(15,98,254,0.25)]">
                <Goal className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide">PitchTruth AI</div>
                <div className="text-xs text-white/45">IBM SkillsBuild Challenge</div>
              </div>
            </Link>

            <div className="hidden items-center gap-6 text-sm text-white/60 lg:flex">
              <a href="#home" className="hover:text-white">Home</a>
              <a href="#features" className="hover:text-white">Features</a>
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              <a href="#technology" className="hover:text-white">Technology</a>
              <a href="#about" className="hover:text-white">About</a>
              <Link href="/dashboard#research" className="hover:text-white">Research</Link>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-[#4589FF]/30 bg-[#0F62FE]/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-[#9dc0ff] sm:inline-flex">
                IBM SkillsBuild
              </span>
              <Link
                href={buildDashboardHref(selectedStadium)}
                className="hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-[#060B14] transition hover:bg-[#dfe9ff] sm:inline-flex"
              >
                Get Started
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="rounded-full border border-white/10 p-2 text-white/70 lg:hidden"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {menuOpen ? (
            <div className="mt-4 grid gap-2 border-t border-white/8 pt-4 lg:hidden">
              <a href="#home" className="rounded-2xl px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white">Home</a>
              <a href="#features" className="rounded-2xl px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white">Features</a>
              <a href="#technology" className="rounded-2xl px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white">Technology</a>
              <a href="#about" className="rounded-2xl px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white">About</a>
              <Link href={buildDashboardHref(selectedStadium)} className="rounded-2xl bg-[#0F62FE] px-3 py-2 text-sm font-medium text-white">
                Open Dashboard
              </Link>
            </div>
          ) : null}
        </motion.nav>

        <section id="home" className="relative mt-6 overflow-hidden rounded-[32px] border border-white/8 mesh-hero px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
          <div className="pitch-lines absolute inset-0 opacity-10" />
          <div className="absolute -left-12 top-10 h-36 w-36 rounded-full bg-[#0F62FE]/20 blur-3xl" />
          <div className="absolute bottom-0 right-8 h-44 w-44 rounded-full bg-[#8A3FFC]/15 blur-3xl" />
          <div className="relative grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/60">
                AI that explains how pitch conditions affect football matches
              </div>
              <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-7xl">
                Understand the Pitch. Understand the Game.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                AI-powered explanations showing how grass quality, weather, and stadium conditions influence ball speed,
                player movement, injuries, and tactical fairness.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={buildDashboardHref(selectedStadium)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F62FE] px-5 py-3 text-sm font-medium shadow-[0_10px_40px_rgba(15,98,254,0.3)] transition hover:bg-[#4589FF]"
                >
                  Analyze Stadium
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard#analysis"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10"
                >
                  <PlayCircle className="h-4 w-4" />
                  Watch Demo
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stadiums.map((stadium) => (
                  <button
                    key={stadium.id}
                    type="button"
                    onClick={() => setSelectedStadium(stadium.id)}
                    className={clsx(
                      "glass-panel rounded-[24px] border p-4 text-left transition duration-200",
                      selectedStadium === stadium.id
                        ? "border-[#4589FF]/50 bg-[#0F62FE]/10"
                        : "border-white/8 hover:border-white/18"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-lg font-semibold">{stadium.name}</div>
                      <RiskPill level={stadium.riskLevel} />
                    </div>
                    <div className="mt-3 text-sm leading-6 text-white/56">{stadium.surfaceType}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute -left-4 top-8 rounded-[22px] border border-[#3DDBD9]/20 bg-[#0d1828]/90 px-4 py-3 shadow-[0_0_30px_rgba(61,219,217,0.15)]"
              >
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#3DDBD9]">Ball Speed</div>
                <div className="mt-1 text-2xl font-semibold">0.84x</div>
                <div className="text-xs text-white/45">slower release detected</div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute -right-2 bottom-16 rounded-[22px] border border-[#8A3FFC]/20 bg-[#0d1828]/90 px-4 py-3 shadow-[0_0_30px_rgba(138,63,252,0.16)]"
              >
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#b8a3ff]">Injury Risk</div>
                <div className="mt-1 text-2xl font-semibold">71</div>
                <div className="text-xs text-white/45">cutting load elevated</div>
              </motion.div>
              <div className="glass-panel field-outline metric-glow rounded-[32px] border p-5">
                <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#0b1730,#0f1f36)] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-white/45">Live Match Model</div>
                        <div className="mt-1 text-xl font-semibold">{activeStadium.name} Surface Dashboard</div>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F62FE]/16 text-[#8cb1ff]">
                        <Sparkles className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#102442,#0d1830)] p-4">
                      <div className="relative h-[320px] rounded-[20px] bg-[linear-gradient(180deg,#0f7a46_0%,#0b5f34_100%)]">
                        <div className="absolute inset-5 rounded-[18px] border border-white/30" />
                        <div className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-white/60" />
                        <div className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-white/50" />
                        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
                        <div className="absolute inset-y-14 left-5 w-16 border border-white/50" />
                        <div className="absolute inset-y-14 right-5 w-16 border border-white/50" />
                        <motion.div
                          animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
                          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                          className="absolute left-[44%] top-[56%] h-6 w-6 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.9)]"
                        />
                        <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-[#08101d]/50 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/70">
                          Temporary grass monitor
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="glass-panel rounded-[24px] border p-4">
                      <div className="text-xs uppercase tracking-[0.24em] text-white/45">AI Summary</div>
                      <div className="mt-2 text-xl font-semibold">Defensive tempo advantage detected</div>
                      <p className="mt-3 text-sm leading-6 text-white/60">
                        Surface softness plus humidity are suppressing fast combinations and rewarding compact shapes.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {metricCards.slice(0, 4).map((metric) => (
                        <div key={metric.label} className="glass-panel rounded-[24px] border p-4">
                          <div className="flex items-center justify-between">
                            <ToneDot tone={metric.tone} />
                            <metric.icon className="h-4 w-4 text-white/45" />
                          </div>
                          <div className="mt-5 text-xs uppercase tracking-[0.2em] text-white/45">{metric.label}</div>
                          <div className="mt-2 text-2xl font-semibold">{metric.value}</div>
                          <div className="mt-2 text-sm text-white/52">{metric.delta}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid items-start gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="glass-panel rounded-[28px] border p-6 lg:p-8">
            <SectionHeading
              eyebrow="Live Stadium Preview"
              title="World Cup venues translated into match-readable context"
              body="A judge should immediately see that PitchTruth is not a toy chatbot. It is a live-feeling stadium intelligence layer turning venue conditions into tactical and health signals."
            />
          </div>
          <div className="glass-panel relative min-h-[420px] rounded-[28px] border p-6">
            <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_30%_30%,rgba(15,98,254,0.18),transparent_28%),radial-gradient(circle_at_70%_55%,rgba(61,219,217,0.08),transparent_24%)]" />
            <div className="relative h-full rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,#0b1524,#0a1220)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/45">Venue Atlas</div>
                  <div className="mt-1 text-lg font-semibold">2026 Host Preview</div>
                </div>
                <Globe className="h-5 w-5 text-[#4589FF]" />
              </div>
              <div className="relative mt-6 h-[280px] overflow-hidden rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,#0a1b2e,#0b2438)]">
                <svg viewBox="0 0 800 380" className="h-full w-full opacity-80">
                  <path d="M98 160c48-42 95-62 153-58 31 2 66 11 92 26 30 18 60 22 99 10 43-14 74-10 104 13 24 17 54 31 101 43 29 7 54 21 89 47" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
                  <path d="M72 217c44-16 81-17 125-8 34 7 74 19 108 39 28 16 55 22 89 18 39-4 79-18 115-17 45 2 81 18 127 47 23 15 52 30 82 38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                </svg>
                {stadiumMarkers.map((marker) => {
                  const isActive = marker.id === selectedStadium;
                  return (
                    <button
                      key={marker.id}
                      type="button"
                      onClick={() => setSelectedStadium(marker.id)}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: marker.x, top: marker.y }}
                    >
                      <div className={clsx("relative flex h-5 w-5 items-center justify-center rounded-full border", isActive ? "border-[#3DDBD9] bg-[#3DDBD9]/20" : "border-white/30 bg-white/10")}>
                        <span className={clsx("h-2.5 w-2.5 rounded-full", isActive ? "bg-[#3DDBD9]" : "bg-white")} />
                        <span className={clsx("absolute h-8 w-8 rounded-full animate-ping", isActive ? "bg-[#3DDBD9]/20" : "bg-white/5")} />
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                  <div className="text-sm font-medium">{activeMarker.label}</div>
                  <div className="mt-3 space-y-2 text-sm text-white/58">
                    <div className="flex justify-between"><span>Temperature</span><span>{activeMarker.temperature}</span></div>
                    <div className="flex justify-between"><span>Humidity</span><span>{activeMarker.humidity}</span></div>
                    <div className="flex justify-between"><span>Roof</span><span>{activeMarker.roof}</span></div>
                  </div>
                </div>
                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                  <div className="text-sm font-medium">Risk Summary</div>
                  <div className="mt-3 text-sm leading-6 text-white/58">
                    Surface hardness {activeStadium.hardnessGauge}/100 with {activeStadium.hybridGrassPercent}% hybrid grass and{" "}
                    {activeStadium.domeOrOpen.toLowerCase()} conditions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-24">
          <div className="max-w-4xl">
            <SectionHeading
              eyebrow="Feature Grid"
              title="An enterprise AI sports product, not a generic hackathon wrapper"
              body="Every panel is designed to reinforce explainability, surface intelligence, and premium product credibility inside the first ten seconds."
            />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className={clsx(
                  "glass-panel flex h-full flex-col rounded-[24px] border p-5 transition hover:-translate-y-1 hover:border-[#4589FF]/30",
                  index === 0 || index === 5 ? "xl:col-span-2" : ""
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[#8eb4ff]">
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="mt-6 text-lg font-semibold">{card.title}</div>
                <p className="mt-3 text-sm leading-6 text-white/58">{card.body}</p>
                <div className="mt-auto pt-6 text-xs uppercase tracking-[0.2em] text-white/38">
                  Surface intelligence
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="technology" className="mt-24 grid items-start gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="glass-panel rounded-[28px] border p-6 lg:p-8">
            <SectionHeading
              eyebrow="AI Workflow"
              title="Research to insight, visualized like a production pipeline"
              body="PitchTruth shows how source documents become transparent, fan-friendly analysis through a layered AI workflow using Docling, Granite, and orchestration logic."
              actions={
                <Link
                  href="/dashboard#analysis"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/78 transition hover:bg-white/10"
                >
                  Open Analysis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          </div>
          <div className="glass-panel rounded-[28px] border p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {workflowSteps.map((step, index) => (
                <div key={step.label} className="relative">
                  <div className="flex h-full min-h-[148px] flex-col items-center justify-center rounded-[22px] border border-white/8 bg-white/5 p-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(15,98,254,0.18),rgba(138,63,252,0.18))]">
                      <step.icon className="h-5 w-5 text-[#b7ccff]" />
                    </div>
                    <div className="mt-4 text-sm font-medium">{step.label}</div>
                  </div>
                  {index < workflowSteps.length - 1 ? (
                    <div className="absolute right-[-14px] top-1/2 hidden h-px w-7 -translate-y-1/2 bg-white/12 xl:block" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mt-24">
          <div className="max-w-4xl">
            <SectionHeading
              eyebrow="Why Pitch Matters"
              title="What the surface changes before the match narrative catches up"
              body="Pitch conditions quietly shape rhythm, movement, and fairness. This section gives judges an immediate story arc for why the product matters."
            />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Ball Speed", "Passes release slower when friction and softness increase."],
              ["Player Fatigue", "Uncertain footing makes acceleration and recovery more demanding."],
              ["Passing Accuracy", "Bounce and roll inconsistency punish precision patterns."],
              ["Sliding", "Wet or unstable grass changes braking confidence and tackle timing."],
              ["Injury Risk", "Hardness plus traction shifts increase lower-limb stress."],
              ["Defensive Advantage", "Reduced tempo gives compact teams more reset time."],
              ["Attacking Advantage", "Stable quick surfaces reward dribblers and one-touch play."],
              ["Fairness", "Tournament integrity depends on predictable, trusted surfaces."]
            ].map(([title, body]) => (
              <div key={title} className="glass-panel flex h-full flex-col rounded-[24px] border p-5">
                <div className="text-lg font-semibold">{title}</div>
                <p className="mt-3 text-sm leading-6 text-white/58">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
