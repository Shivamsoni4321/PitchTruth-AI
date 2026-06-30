# PitchTruth AI — Dev Plan

**AI that explains how temporary World Cup grass affects ball speed, injuries, and tactical fairness.**

Built for: IBM SkillsBuild "AI Inside the Match" June Innovation Challenge
Deadline: June 30, 11:59 PM ET

---

## 0. Scope Lock (Read This First)

This is due **tonight**. PitchTruth is a strong idea but a bigger build than a single-PDF explainer — it touches three data domains (turf science, weather/conditions, stadium profiles). To actually ship, scope is locked down hard:

Build only these **5 hardcoded question types** as scenario cards, not a free-text query engine over live data:

1. Why is the ball moving slower today?
2. Is this pitch helping defensive teams?
3. Could surface hardness increase injury risk?
4. How does temporary grass affect dribblers vs long-ball teams?
5. Why are players complaining about this venue?

Each card maps to one of **3 real 2026 venues** (e.g. MetLife Stadium, AT&T Stadium, Lumen Field). No live weather API, no live match data feed — use realistic static profiles per stadium (turf type, hybrid grass %, dome/open, known surface complaints pulled from your sources).

This is the difference between shipping and not shipping. Resist scope creep.

---

## 1. Stack

- **Next.js 14 + Tailwind** — fast to scaffold, your standard stack
- **Claude API** (Anthropic SDK direct, not OpenRouter) — explanation generation / technical reasoning
- **Docling** — ingest 2–3 source docs (FIFA pitch standards, turf research article, Business Insider / NY Post coverage) into structured text, chunked, stored as static JSON at build time. Not live RAG — no time for a vector DB tonight.
- **Granite** — second-pass call that takes Claude's technical explanation and rewrites it in fan-friendly tone. Lets you honestly claim a "Claude + Granite pipeline" in the README.
- **LangFlow** — wire the actual orchestration (stadium profile + Docling chunks + question type → Granite explainer) as a visual flow. Export the flow JSON into the repo as evidence of integration, even if the live app calls the chain directly in code. Judges check for usage, not necessarily that LangFlow is the runtime — having the flow file is sufficient proof on a deadline.

---

## 2. Data Layer (Build This First — ~45 min)

Create `data/stadiums.json` with 3 entries:

```json
{
  "metlife": {
    "name": "MetLife Stadium",
    "surfaceType": "hybrid grass (temporary, laid over turf base)",
    "domeOrOpen": "open",
    "knownIssues": [
      "players reported softness/slipperiness",
      "ball speed inconsistency reported in early tests"
    ],
    "sourceNotes": "NY Post coverage of pitch criticism"
  },
  "attStadium": { "...": "fill in similarly" },
  "lumenField": { "...": "fill in similarly" }
}
```

Create `data/pitch-science.json` from your Docling pass — 5 to 8 short factual snippets (turf hardness vs injury risk, grass length vs ball roll speed, hybrid grass mechanics) extracted from your sources, each tagged with a source name.

---

## 3. Docling Step (Document It Even If Abbreviated)

Run once, offline. Don't call Docling live in the app:

```bash
docling convert fifa-pitch-standards.pdf --output pitch-standards.json
docling convert turf-research-article.pdf --output turf-research.json
```

Commit the extracted JSON to the repo under `/docling-output/`.

README should state explicitly: *"Docling was used to convert source PDFs/articles into structured chunks feeding the Granite explanation layer."*

---

## 4. API Route — The Actual AI Pipeline

`app/api/explain/route.ts`

1. Take `{ stadiumId, questionType }`
2. Pull stadium profile + relevant pitch-science snippets (simple keyword match by questionType — no need for real retrieval)
3. **Call 1 (Claude):** reasoning pass — *"Given this stadium profile and this pitch science, explain [question] technically and accurately."*
4. **Call 2 (Granite):** tone pass — *"Rewrite this explanation for a casual fan, 3-4 sentences, no jargon."*
5. Return both: technical explanation (for an "Analyst Mode" toggle) + fan explanation (default view)

This two-call structure is the strongest "explainability" story for judges — show your reasoning, don't just output an answer.

---

## 5. UI — Landing Page + Dashboard

### Prompt to feed your AI coding tool (Claude Code / Antigravity) to generate the UI:

> Build a Next.js 14 + Tailwind landing page and dashboard for "PitchTruth AI," a World Cup 2026 pitch-condition explainer. Visual direction: editorial sports-broadcast aesthetic — think a hybrid of a stadium turf texture and a tactical analysis board, NOT a generic SaaS dashboard. Use a deep grass-green and chalk-white palette with one accent (amber/gold) for risk warnings. Typography: a strong condensed sans for headers (sports-broadcast feel) paired with a clean readable sans for body text — avoid default system fonts.
>
> **Landing page:** full-bleed hero with a stylized stadium pitch illustration (SVG, top-down view with yard markings), headline "Why does the pitch matter more than you think?", subhead explaining the 2026 temporary-grass problem in one sentence, and a row of 3 stadium cards (MetLife, AT&T Stadium, Lumen Field) each showing surface type and a risk indicator pill (low/medium/high), clickable into the dashboard.
>
> **Dashboard:** left sidebar lists the 5 question types as clickable cards with icons (ball speed, defensive advantage, injury risk, dribbler impact, player complaints). Main panel shows: stadium profile summary at top (surface type, dome/open, condition pills), then the AI explanation in two tabs — "Fan View" (Granite output, larger friendly text) and "Analyst View" (Claude technical output, with cited source snippets shown as small footnoted cards pulled from the Docling-extracted data). Include a subtle pitch-hardness gauge component (semicircular gauge, SVG) and a small "sources" strip at the bottom showing which documents informed the answer — this is your transparency/trust signal for judges.
>
> Motion: subtle fade/slide on tab switches and card selection, nothing heavy. Mobile-responsive but desktop-first since judges will view on laptop.
>
> Avoid: generic blue/purple SaaS gradients, default shadcn look without customization, stock dashboard templates.

---

## 6. README Structure (Judges Read This First)

```markdown
# PitchTruth AI

## The Problem
[2-3 sentences: 2026 World Cup uses NFL stadiums with temporary/hybrid grass...]

## What It Does
[5 question types, who it's for: fans, coaches, analysts]

## AI/Technical Approach
- Docling: extracted FIFA pitch standards + turf research into structured knowledge
- Claude API: technical reasoning over stadium profile + pitch science
- Granite: fan-friendly explanation rewriting
- LangFlow: orchestration flow (see /langflow-export/pitchtruth.json)

## Why This Matters for the World Cup
[Trust/fairness angle — fans deserve to know why conditions affect the game they're watching]

## Architecture
[One diagram: Stadium Data + Docling Chunks → Claude (technical) → Granite (fan tone) → UI]

## Sources
[Business Insider, NY Post, FIFA pitch standards — list explicitly]
```

---

## 7. Build Order (Priority If Time Runs Out)

| Step | Task | Time |
|---|---|---|
| 1 | Data JSON (stadiums + pitch science) | 45 min |
| 2 | API route with Claude call only, working end to end | 1 hr |
| 3 | Basic UI, even unstyled | 1 hr |
| 4 | Add Granite second call | 30 min |
| 5 | Style pass using the UI prompt above | 1.5 hr |
| 6 | Docling offline extraction + commit JSON, write README | 45 min |
| 7 | LangFlow flow export (lowest priority — screenshot is enough if short on time) | 30 min |
| 8 | Record 3-min demo | 30 min |

**If you have to cut something, cut LangFlow runtime integration before you cut UI polish or the README.** Judges weight "functioning prototype + clear README" higher than a fourth tool checkbox.

---

## 8. Judging Self-Assessment

| Criterion | Score |
|---|---|
| Technical Execution | 8/10 |
| Innovation | 10/10 |
| Challenge Fit | 8/10 |
| Implementation & Feasibility | 8/10 |

**Why it can win:** pitch explainability is an underserved angle, highly specific to 2026 World Cup venues, strong technical storytelling, and an easy visual demo (stadium map + risk/explanation cards).

**Sources:** Business Insider coverage of World Cup grass logistics, NY Post coverage of MetLife pitch criticism.
