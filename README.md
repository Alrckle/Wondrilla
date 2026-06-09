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

---

## Production Integration & Monetization Guide

This section outlines how you can turn this frontend prototype into a revenue-generating production SaaS app.

### 💰 How to Generate Money (SaaS Monetization)
1. **Subscription Plans (Stripe Integration)**:
   - Integrate **Stripe Billing** or **PayPal subscriptions** to charge users monthly/yearly (e.g., Pro for $24/mo, Studio for $79/mo).
   - Set up **Stripe Webhooks** to listen for `customer.subscription.created` and `customer.subscription.deleted` events. When a payment succeeds, update the user's plan and message quota limit in your production database (e.g., PostgreSQL or MongoDB).
   - Provide a **Customer Billing Portal** link where users can self-manage subscriptions, update credit cards, or cancel.
2. **Quota Tiering & Limits**:
   - Restrict Free users to a small trial quota (e.g., 20 messages) and basic model access.
   - Place premium capabilities (e.g. **File Uploads**, **Web Research**, **3-Model Comparison**, and advanced models like Grok or Claude Opus) behind Pro or Studio plan access checks.
   - Implement rate-limiting and soft/hard limits on your secure backend to prevent API abuse.

### 🔌 Connecting Real AI APIs
1. **Secure Backend Gateway**:
   - **DO NOT** make direct calls to AI provider APIs from the browser, as this exposes your secret API keys to the public!
   - Build a lightweight backend API gateway using Node.js/Express, Next.js API Routes, or Python/FastAPI.
   - Use environment variables (e.g. `.env`) on the server to store your provider API keys (OpenAI, Anthropic, xAI, Meta, Moonshot, Zhipu, DeepSeek).
2. **Implementing Wondrilla Auto Router**:
   - When a user submits a prompt to "Wondrilla Auto", use a cheap, fast model (e.g., `gpt-4o-mini` or `claude-3-haiku`) as a classification step.
   - Ask the router model to output a single JSON token indicating which provider is best suited:
     - Coding / Math / Logic -> Route to `DeepSeek-V3` or `GPT-4o`.
     - Creative Writing / Copywriting -> Route to `Claude-3.5-Sonnet`.
     - Real-Time / News / Trending Topics -> Route to `Grok-2`.
   - Forward the user's prompt to the selected model and return the stream.
3. **Web Research Integration**:
   - When the user enables Web Research, use a search API like **Google Custom Search JSON API**, **Tavily Search**, or **Brave Search API** on your backend to retrieve search results matching the query.
   - Inject the search results as context into the system prompt of the model, and instruct the model to cite the sources (e.g., `[1]`, `[2]`).
4. **File Processing**:
   - When a user uploads a document or image, save it securely in a storage bucket (e.g. AWS S3 or Google Cloud Storage).
   - Pass the file contents (extracted text or image pixels) as part of the multimodality payload to the LLM API (e.g., Claude 3.5 Sonnet supports PDF and image inputs directly).

---

Provider names are trademarks of their respective owners. Wondrilla is not presented as affiliated with those providers.
