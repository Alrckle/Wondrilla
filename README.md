# Wondrilla AI

Wondrilla is a multi-model AI workspace that brings ChatGPT, Claude, Grok, Meta/Llama, Kimi, Z.ai, and DeepSeek-style workflows into one interface.

## What works now

- Responsive chat workspace with model switching and Wondrilla Auto routing.
- Server-side `/api/chat` gateway so provider keys stay out of the browser.
- Live provider adapters for OpenAI, Anthropic, xAI, Moonshot/Kimi, Z.ai, DeepSeek, and Meta/Llama through OpenRouter.
- Safe demo fallback when no API key is configured.
- Pricing UI with local demo plan activation for Free, Pro, and Studio.
- Three-model comparison mode, web-mode placeholder, file metadata flow, history, and usage counters.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:4173`.

## Connect real AI APIs

1. Copy `.env.example` to `.env`.
2. Add the provider keys you want to use.
3. Run `npm run dev` again.

The app checks `/api/health` and shows whether it is using live APIs or demo fallback mode. You can configure only one provider at first; Wondrilla Auto will route to configured providers when possible.

## Environment variables

- `OPENAI_API_KEY` for ChatGPT/OpenAI.
- `ANTHROPIC_API_KEY` for Claude.
- `XAI_API_KEY` for Grok.
- `MOONSHOT_API_KEY` for Kimi.
- `ZAI_API_KEY` for Z.ai.
- `DEEPSEEK_API_KEY` for DeepSeek.
- `OPENROUTER_API_KEY` for OpenRouter and Meta/Llama models.

Each provider also has a matching model variable in `.env.example`.

## Production work still required

- Real authentication and user accounts.
- Stripe Billing or another payment provider for real subscriptions.
- Database-backed usage metering and rate limits.
- Search provider integration for live web citations.
- Server-side file parsing or multimodal file payloads for real file analysis.
- Safety, privacy, logging, and provider terms review.

Provider names are trademarks of their respective owners. Wondrilla is not presented as affiliated with those providers.