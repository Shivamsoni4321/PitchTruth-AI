# PitchTruth AI

AI that explains how temporary World Cup grass affects ball speed, injuries, and tactical fairness.

## The Problem

World Cup 2026 will place elite football matches inside several NFL venues that normally do not run on tournament-grade natural grass. That creates a trust problem: when players complain about footing, ball roll, or surface hardness, fans usually hear the noise but not the explanation.

PitchTruth AI turns that hidden layer into something understandable. It gives fans, analysts, and coaches a structured explanation of how temporary or hybrid grass can influence what they are watching.

## What It Does

PitchTruth focuses on 5 locked scenario questions:

- Why is the ball moving slower today?
- Is this pitch helping defensive teams?
- Could surface hardness increase injury risk?
- How does temporary grass affect dribblers vs long-ball teams?
- Why are players complaining about this venue?

The prototype is scoped to 3 static 2026-style venue profiles:

- MetLife Stadium
- AT&T Stadium
- Lumen Field

## AI/Technical Approach

- **Docling**: source PDFs/articles were converted into structured chunks and stored under [`docling-output/`](./docling-output)
- **OpenRouter**: first-pass technical reasoning over stadium profile + pitch science snippets
- **Granite via OpenRouter**: second-pass fan-friendly rewrite for the default "Fan View"
- **LangFlow**: orchestration flow exported under [`langflow-export/pitchtruth.json`](./langflow-export/pitchtruth.json)

## Why This Matters for the World Cup

Tournament fairness is not just about refereeing or tactics. If players are competing on temporary or unfamiliar grass systems, then the pitch itself becomes part of the story. Fans deserve a way to understand how venue conditions can shape speed, trust, and performance.

## Architecture

```text
Stadium Profiles + Docling Chunks
              |
              v
     Claude Technical Pass
              |
              v
      Granite Fan Rewrite
              |
              v
         PitchTruth UI
```

## Project Structure

- `app/` - Next.js App Router pages and API route
- `components/` - UI components
- `data/` - static stadium and pitch-science knowledge
- `docling-output/` - extracted source chunks committed to the repo
- `langflow-export/` - exported orchestration evidence
- `lib/` - data access and AI pipeline logic

## API Route

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

## Environment Variables

```bash
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_TECHNICAL_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_FAN_MODEL=ibm/granite-3.3-8b-instruct
OPENROUTER_REFERER=http://localhost:3000
OPENROUTER_APP_NAME=PitchTruth AI
```

If OpenRouter credentials are missing or a model call fails, the app falls back to local technical/fan rewrites so the demo still works.

## Sources

- FIFA pitch standards / pitch-quality guidance
- Turf biomechanics and hybrid grass behavior research
- Media reporting on 2026 World Cup grass logistics and venue criticism
- NY Post coverage of MetLife surface criticism
- Business Insider reporting on World Cup grass logistics

## Notes

This is a deadline-safe prototype. It intentionally does **not** use live weather APIs, match feeds, or a vector database. The goal is explainability, clarity, and a functioning demo that judges can understand quickly.
