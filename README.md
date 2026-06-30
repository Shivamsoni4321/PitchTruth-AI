# PitchTruth AI

AI that helps people understand how World Cup pitch conditions can change match speed, player safety, and tactical fairness.

## Challenge Fit

PitchTruth AI is built for the IBM SkillsBuild June Innovation Challenge prompt: use AI to help humans better understand soccer before, during, or after a match.

Our angle is simple: the pitch itself changes the game, but most fans cannot see or explain that layer. PitchTruth turns hidden surface behavior into plain-English insights.

## The Problem

World Cup 2026 will place elite soccer matches inside several stadiums that do not normally host tournament-grade natural grass year-round. Temporary and hybrid grass systems can affect ball roll, traction, cutting confidence, fatigue, and injury risk.

When players or coaches complain about the field, fans usually hear the reaction but not the reason. That creates confusion around fairness, performance, and trust.

## The Solution

PitchTruth AI gives fans, analysts, journalists, and coaches an explainable AI view of how pitch conditions may influence a match.

The prototype answers five high-value questions:

- Why is the ball moving slower today?
- Is this pitch helping defensive teams?
- Could surface hardness increase injury risk?
- How does temporary grass affect dribblers vs long-ball teams?
- Why are players complaining about this venue?

The current prototype includes three 2026-style venue profiles:

- MetLife Stadium
- AT&T Stadium
- Lumen Field

## Why It Matters

This project matters because tournament fairness is not only about tactics, referees, or talent. Surface conditions can quietly shape rhythm, confidence, and injury exposure.

PitchTruth helps people understand:

- how the field can change the speed of play
- why certain team styles may gain or lose an advantage
- why player complaints may be valid and evidence-based
- why surface quality matters in the context of a World Cup

## AI And Technical Approach

PitchTruth uses AI as the core product experience, not as decoration.

### IBM-Supported Tooling

- **IBM Granite**: fan-friendly explanation layer through the Granite model family via OpenRouter
- **Docling**: source documents were converted into structured chunks and committed under [`docling-output/`](./docling-output)
- **LangFlow**: orchestration evidence is included under [`langflow-export/pitchtruth.json`](./langflow-export/pitchtruth.json)

### Application Flow

1. Stadium profile data and pitch-science snippets are loaded from the local knowledge base.
2. A technical reasoning pass is generated through OpenRouter.
3. A Granite rewrite converts that analysis into a clear fan-facing explanation.
4. The dashboard presents the result with source labels, stadium context, and supporting visualizations.

## Architecture

```text
Stadium Profiles + Docling Chunks
              |
              v
   OpenRouter Technical Pass
              |
              v
   Granite Fan Explanation
              |
              v
        PitchTruth UI
```

## Product Features

- Separate landing page and dashboard experience
- Responsive UI for desktop and mobile
- Stadium selector for three World Cup-style venues
- Five explainable AI question flows
- Fan View and Analyst View outputs
- Source labels attached to each explanation
- Exportable text report
- Fallback local explanation path if API credentials are missing

## Project Structure

- `app/` - Next.js App Router pages and API route
- `components/` - landing page, dashboard, and shared UI modules
- `data/` - static stadium and pitch-science knowledge
- `docling-output/` - extracted source chunks committed to the repo
- `langflow-export/` - orchestration evidence
- `lib/` - data access and AI pipeline logic

## API

`POST /api/explain`

```json
{
  "stadiumId": "metlife",
  "questionType": "ball-speed"
}
```

Returns:

- `fanExplanation`
- `technicalExplanation`
- `snippets`
- `sourceLabels`
- `stadium`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Copy `.env.example` to `.env.local` and fill in your values.

```bash
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_TECHNICAL_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_FAN_MODEL=ibm/granite-3.3-8b-instruct
OPENROUTER_REFERER=http://localhost:3000
OPENROUTER_APP_NAME=PitchTruth AI
```

### 3. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo Flow

1. Open the landing page and explain the World Cup pitch problem.
2. Move into the dashboard.
3. Pick a venue.
4. Switch between question types.
5. Show Fan View and Analyst View.
6. Export a report.

## Demo Video Guide

Record a short demo between **2 minutes and 45 seconds** and **3 minutes maximum**.

### Recommended Recording Setup

1. Start the app and confirm `http://localhost:3000` is loading.
2. Use a clean browser window with only the project tab visible.
3. Set browser zoom to `100%`.
4. Record in `1920x1080` if possible.
5. Keep your narration calm and direct.
6. Avoid typing during the recording unless it is necessary.

### Suggested Recording Tools

- Windows Snipping Tool screen recording
- OBS Studio
- Loom
- Zoom local recording

### Best Demo Path

1. Show the landing page hero.
2. Click into the dashboard.
3. Select `Lumen Field` or `MetLife Stadium`.
4. Show the animated stadium preview and pitch-science panel.
5. Click one question such as `Why are players complaining about this venue?`
6. Show the `Fan View` response.
7. Switch to `Analyst View`.
8. Point out the source labels, tactical fairness chart, and weather panel.
9. Click `Export Report`.
10. End with why the project matters for World Cup fairness and understanding.

### Narration Structure

- Problem: temporary and hybrid World Cup grass can affect match behavior in ways fans cannot easily interpret.
- Solution: PitchTruth AI converts pitch science into plain-English soccer insight.
- AI workflow: Docling structures inputs, OpenRouter runs the technical pass, and Granite delivers the fan-friendly explanation.
- Value: fans, analysts, and coaches can better understand ball speed, fairness, and injury-risk signals.

## Submission Checklist

This repository includes the assets needed to support the challenge submission:

- [x] Working prototype
- [x] AI is the core experience
- [x] IBM-supported tooling is used
- [x] Clear README with problem, approach, and why it matters
- [x] Public-ready project narrative
- [x] Demo script draft in [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md)
- [x] Submission packaging guide in [`SUBMISSION_CHECKLIST.md`](./SUBMISSION_CHECKLIST.md)
- [x] Demo video guide in this README

Items still to complete outside the codebase:

- [ ] Push the project to a **public GitHub repository**
- [ ] Record a **demo or presentation video up to 3 minutes**
- [ ] Submit project details, team details, and the repo link on the challenge platform

## Sources

- FIFA pitch standards and pitch-quality guidance
- Turf biomechanics and hybrid grass behavior research
- Reporting on 2026 World Cup grass logistics and venue criticism
- Venue-specific surface discussion and criticism around major U.S. stadiums

## Notes

This is a focused prototype designed for challenge judging. It does not depend on live match feeds, weather APIs, or a vector database. The goal is a fast, clear, working demonstration of explainable soccer intelligence.
