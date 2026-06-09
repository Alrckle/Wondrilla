# Wondrilla AI

Wondrilla is a multi-model AI workspace concept that brings leading providers into one interface.

## Included in this prototype

- Model switching and Wondrilla Auto routing UI
- Chat and three-model comparison modes
- Conversation history and prompt starters
- Responsive desktop and mobile layouts
- Free, Pro, and Studio pricing
- Demo responses for OpenAI, Anthropic, xAI, Meta, Moonshot, Zhipu, and DeepSeek models

## Run locally

```bash
npm install
npm run dev
```

## Production integration

The browser prototype intentionally contains no API keys and makes no direct provider requests. A production build needs:

1. A secure server-side model gateway.
2. Provider API credentials and terms-compliant integrations.
3. Authentication, usage metering, rate limits, and billing.
4. Persistent chat storage and file processing.
5. Safety, moderation, privacy, and data-retention controls.

Provider names are trademarks of their respective owners. Wondrilla is not presented as affiliated with those providers.
