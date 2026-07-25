import http from "node:http";
import https from "node:https";
import crypto from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
loadEnv(path.join(rootDir, ".env"));

const port = Number.parseInt(process.env.PORT || "4173", 10);
const requestLimitBytes = 5 * 1024 * 1024;
const supabaseConfig = {
    url: process.env.SUPABASE_URL || "",
    publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
};
const supabase = createSupabaseServerClient();

const modelCatalog = [
    { id: "auto", name: "Wondrilla Auto", maker: "Smart routing" },
    { id: "chatgpt", name: "ChatGPT", maker: "OpenAI" },
    { id: "claude", name: "Claude", maker: "Anthropic" },
    { id: "grok", name: "Grok", maker: "xAI" },
    { id: "meta", name: "Meta AI", maker: "Meta via OpenRouter" },
    { id: "kimi", name: "Kimi", maker: "Moonshot AI" },
    { id: "zai", name: "Z.ai", maker: "Zhipu AI" },
    { id: "deepseek", name: "DeepSeek", maker: "DeepSeek" },
    { id: "gemini", name: "Gemini", maker: "Google" }
];

const providerConfig = {
    chatgpt: {
        keyEnv: "OPENAI_API_KEY",
        modelEnv: "OPENAI_MODEL",
        defaultModel: "gpt-5.4-mini"
    },
    claude: {
        keyEnv: "ANTHROPIC_API_KEY",
        modelEnv: "ANTHROPIC_MODEL",
        defaultModel: "claude-3-5-haiku-latest"
    },
    grok: {
        keyEnv: "XAI_API_KEY",
        modelEnv: "XAI_MODEL",
        defaultModel: "grok-4.3"
    },
    meta: {
        keyEnv: "OPENROUTER_API_KEY",
        modelEnv: "META_MODEL",
        defaultModel: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free"
    },
    kimi: {
        keyEnv: "MOONSHOT_API_KEY",
        modelEnv: "MOONSHOT_MODEL",
        defaultModel: "kimi-k2.6"
    },
    zai: {
        keyEnv: "ZAI_API_KEY",
        modelEnv: "ZAI_MODEL",
        defaultModel: "glm-4.7-flash"
    },
    deepseek: {
        keyEnv: "DEEPSEEK_API_KEY",
        modelEnv: "DEEPSEEK_MODEL",
        defaultModel: "deepseek-v4-flash"
    },
    gemini: {
        keyEnv: "GEMINI_API_KEY",
        modelEnv: "GEMINI_MODEL",
        defaultModel: "gemini-2.5-flash"
    }
};

const demoAnswers = {
    auto: "Here is a focused way forward: define the outcome first, reduce the work to three decisions, and build the smallest version that proves the idea. I can turn this into a concrete plan, draft, or checklist next.",
    chatgpt: "I would structure this as a practical sequence: clarify the goal, identify the audience, create a first version, then test it against measurable feedback. The key is making each step small enough to complete quickly.",
    claude: "A useful starting point is to separate what must be true from what would merely be nice. Once those are clear, we can shape an approach that is thoughtful, realistic, and easy for another person to understand.",
    grok: "Cut through the noise: pick the one result that matters, ship a rough but real version, and let actual users tell you what is wrong. Elegant theories are cheap. Evidence is the useful part.",
    meta: "We can approach this collaboratively by mapping the people involved, the experience you want them to have, and the content or tools needed at each moment. That creates a clear path from idea to useful product.",
    kimi: "I would begin with a broad context scan, then synthesize the strongest patterns into a concise framework. From there, we can expand any point with deeper research, examples, and a step-by-step execution plan.",
    zai: "The task can be decomposed into objective, constraints, resources, and validation. A strong solution optimizes across objective, constraints, resources, and validation rather than maximizing only speed or quality in isolation.",
    deepseek: "A technically sound approach is to define interfaces before implementation, isolate the highest-risk assumption, and test that assumption first. This reduces rework and gives the rest of the build a stable foundation.",
    gemini: "Focus on synthesis: collect all inputs, outline the connections and patterns between them, and frame a solution that builds on those shared strengths. I can guide you through analyzing these relationships step-by-step."
};

const server = http.createServer(async (request, response) => {
    try {
        const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

        if (requestUrl.pathname.startsWith("/api/")) {
            await handleApi(request, response, requestUrl);
            return;
        }

        // ── OAuth connector routes ──
        if (requestUrl.pathname.startsWith("/auth/")) {
            await handleAuth(request, response, requestUrl);
            return;
        }

        if (request.method !== "GET" && request.method !== "HEAD") {
            sendJson(response, 405, { ok: false, error: "Method not allowed" });
            return;
        }

        await serveStatic(requestUrl.pathname, response, request.method === "HEAD");
    } catch (error) {
        sendJson(response, 500, {
            ok: false,
            error: "Internal server error",
            detail: sanitizeError(error)
        });
    }
});

server.listen(port, () => {
    console.log(`Wondrilla running at http://localhost:${port}`);
    initMcpServers().catch(err => {
        console.error("Failed to initialize MCP servers:", err);
    });
});

function getPlanLimit(plan) {
    if (plan === "pro") return 2000;
    if (plan === "studio") return 10000;
    return 20;
}

// ── OAuth connector configuration ──
const oauthConfig = {
    canva: {
        clientIdEnv: "CANVA_CLIENT_ID",
        clientSecretEnv: "CANVA_CLIENT_SECRET",
        authorizeUrl: "https://www.canva.com/api/oauth/authorize",
        tokenUrl: "https://api.canva.com/v1/oauth/token",
        loginUrl: "https://www.canva.com/login",
        scopes: "design:content:read design:meta:read",
        name: "Canva",
        color: "#00C4CC",
        icon: "🎨"
    },
    github: {
        clientIdEnv: "GITHUB_CLIENT_ID",
        clientSecretEnv: "GITHUB_CLIENT_SECRET",
        authorizeUrl: "https://github.com/login/oauth/authorize",
        tokenUrl: "https://github.com/login/oauth/access_token",
        loginUrl: "https://github.com/login",
        scopes: "repo,read:user",
        name: "GitHub",
        color: "#2ea44f",
        icon: "🐙"
    },
    supabase: {
        clientIdEnv: "SUPABASE_CLIENT_ID",
        clientSecretEnv: "SUPABASE_CLIENT_SECRET",
        authorizeUrl: "https://api.supabase.com/v1/oauth/authorize",
        tokenUrl: "https://api.supabase.com/v1/oauth/token",
        loginUrl: "https://supabase.com/dashboard/sign-in",
        scopes: "all",
        name: "Supabase",
        color: "#3ecf8e",
        icon: "⚡"
    },
    paypal: {
        clientIdEnv: "PAYPAL_CLIENT_ID",
        clientSecretEnv: "PAYPAL_CLIENT_SECRET",
        authorizeUrl: "https://www.paypal.com/signin/authorize",
        tokenUrl: "https://api.paypal.com/v1/oauth2/token",
        loginUrl: "https://www.paypal.com/signin",
        scopes: "openid profile email",
        name: "PayPal",
        color: "#0070ba",
        icon: "💳"
    },
    airtable: {
        clientIdEnv: "AIRTABLE_CLIENT_ID",
        clientSecretEnv: "AIRTABLE_CLIENT_SECRET",
        authorizeUrl: "https://airtable.com/oauth2/v1/authorize",
        tokenUrl: "https://airtable.com/oauth2/v1/token",
        loginUrl: "https://airtable.com/login",
        scopes: "data.records:read data.records:write",
        name: "Airtable",
        color: "#fcb400",
        icon: "📊"
    },
    figma: {
        clientIdEnv: "FIGMA_CLIENT_ID",
        clientSecretEnv: "FIGMA_CLIENT_SECRET",
        authorizeUrl: "https://www.figma.com/oauth",
        tokenUrl: "https://api.figma.com/v1/oauth/token",
        loginUrl: "https://www.figma.com/login",
        scopes: "files:read",
        name: "Figma",
        color: "#f24e1e",
        icon: "🎨"
    },
    spotify: {
        clientIdEnv: "SPOTIFY_CLIENT_ID",
        clientSecretEnv: "SPOTIFY_CLIENT_SECRET",
        authorizeUrl: "https://accounts.spotify.com/authorize",
        tokenUrl: "https://accounts.spotify.com/api/token",
        loginUrl: "https://accounts.spotify.com/login",
        scopes: "user-read-playback-state user-modify-playback-state",
        name: "Spotify",
        color: "#1db954",
        icon: "🎵"
    },
    calendar: {
        clientIdEnv: "GOOGLE_CLIENT_ID",
        clientSecretEnv: "GOOGLE_CLIENT_SECRET",
        authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        loginUrl: "https://accounts.google.com",
        scopes: "https://www.googleapis.com/auth/calendar",
        name: "Google Calendar",
        color: "#4285f4",
        icon: "📅"
    },
    slack: {
        clientIdEnv: "SLACK_CLIENT_ID",
        clientSecretEnv: "SLACK_CLIENT_SECRET",
        authorizeUrl: "https://slack.com/oauth/v2/authorize",
        tokenUrl: "https://slack.com/api/oauth.v2.access",
        loginUrl: "https://slack.com/signin",
        scopes: "chat:write,channels:read",
        name: "Slack",
        color: "#4a154b",
        icon: "💬"
    },
    discord: {
        clientIdEnv: "DISCORD_CLIENT_ID",
        clientSecretEnv: "DISCORD_CLIENT_SECRET",
        authorizeUrl: "https://discord.com/oauth2/authorize",
        tokenUrl: "https://discord.com/api/oauth2/token",
        loginUrl: "https://discord.com/login",
        scopes: "bot guilds",
        name: "Discord",
        color: "#5865f2",
        icon: "👾"
    },
    googledrive: {
        clientIdEnv: "GOOGLE_CLIENT_ID",
        clientSecretEnv: "GOOGLE_CLIENT_SECRET",
        authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        loginUrl: "https://accounts.google.com",
        scopes: "https://www.googleapis.com/auth/drive.readonly",
        name: "Google Drive",
        color: "#0f9d58",
        icon: "📁"
    },
    notion: {
        clientIdEnv: "NOTION_CLIENT_ID",
        clientSecretEnv: "NOTION_CLIENT_SECRET",
        authorizeUrl: "https://api.notion.com/v1/oauth/authorize",
        tokenUrl: "https://api.notion.com/v1/oauth/token",
        loginUrl: "https://www.notion.so/login",
        scopes: "",
        name: "Notion",
        color: "#37352f",
        icon: "📝"
    },
    stripe: {
        clientIdEnv: "STRIPE_CLIENT_ID",
        clientSecretEnv: "STRIPE_CLIENT_SECRET",
        authorizeUrl: "https://connect.stripe.com/oauth/authorize",
        tokenUrl: "https://connect.stripe.com/oauth/token",
        loginUrl: "https://dashboard.stripe.com/login",
        scopes: "read_write",
        name: "Stripe",
        color: "#635bff",
        icon: "💳"
    },
    image: {
        clientIdEnv: "IMAGE_CLIENT_ID",
        clientSecretEnv: "IMAGE_CLIENT_SECRET",
        authorizeUrl: "",
        tokenUrl: "",
        loginUrl: "",
        scopes: "",
        name: "Wondrilla Image AI",
        color: "#8b5cf6",
        icon: "🖼️"
    }
};

function oauthAuthorizationPage(provider, name, color = "#6366f1", icon = "⚡", loginUrl = "") {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Authorize ${name} — Wondrilla AI</title>
<style>
  :root { --brand: ${color}; }
  * { margin:0; padding:0; box-sizing:border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  body {
    background: #0b0c10;
    color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
  }
  .card {
    background: #14161f;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 32px 24px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .brand-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: var(--brand);
  }
  .logo-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 10px;
    margin-bottom: 24px;
  }
  .logo-box {
    width: 54px; height: 54px;
    border-radius: 14px;
    background: var(--brand);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  }
  .link-arrow {
    color: #4b5563; font-size: 18px;
  }
  .wondrilla-box {
    width: 54px; height: 54px;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    font-weight: 800; color: #fff;
    box-shadow: 0 8px 20px rgba(99,102,241,0.3);
  }
  h1 { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .subtitle { font-size: 13px; color: #9ca3af; line-height: 1.5; margin-bottom: 24px; }
  .permissions-box {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 14px;
    padding: 16px;
    text-align: left;
    margin-bottom: 24px;
  }
  .perm-header {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #6b7280; font-weight: 700; margin-bottom: 12px;
  }
  .perm-item {
    display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #d1d5db; margin-bottom: 10px; line-height: 1.4;
  }
  .perm-item:last-child { margin-bottom: 0; }
  .check-icon {
    width: 18px; height: 18px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #10b981;
    display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; margin-top: 1px; font-weight: bold;
  }
  .btn-auth {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: var(--brand);
    color: #ffffff;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 14px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
  }
  .btn-auth:hover { opacity: 0.92; transform: translateY(-1px); }
  .btn-auth:active { transform: translateY(0); }
  .login-link-container {
    margin-top: 10px; font-size: 12px; color: #9ca3af;
  }
  .login-link {
    color: var(--brand); text-decoration: none; font-weight: 600;
  }
  .login-link:hover { text-decoration: underline; }
  
  .success-view {
    display: none;
    padding: 20px 0;
  }
  .success-badge {
    font-size: 52px; margin-bottom: 12px;
    animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
  .close-text { font-size: 12px; color: #6b7280; margin-top: 16px; }
</style>
</head>
<body>
<div class="card">
  <div class="brand-bar"></div>
  
  <div id="auth-view">
    <div class="logo-wrapper">
      <div class="logo-box">${icon}</div>
      <div class="link-arrow">⚡</div>
      <div class="wondrilla-box">W</div>
    </div>
    
    <h1>Connect ${name}</h1>
    <p class="subtitle">Wondrilla AI requests authorization to connect with your <strong>${name}</strong> account.</p>
    
    <div class="permissions-box">
      <div class="perm-header">Permissions Requested</div>
      <div class="perm-item">
        <div class="check-icon">✓</div>
        <div><strong>Read & Write Access:</strong> Sync project files, assets and workspace data.</div>
      </div>
      <div class="perm-item">
        <div class="check-icon">✓</div>
        <div><strong>AI Assistant Actions:</strong> Allow Wondrilla to perform requested actions on ${name}.</div>
      </div>
      <div class="perm-item">
        <div class="check-icon">✓</div>
        <div><strong>Secure Connection:</strong> End-to-end encrypted session with Wondrilla AI.</div>
      </div>
    </div>
    
    <button class="btn-auth" id="authorize-btn">Authorize & Connect Wondrilla</button>
    
    ${loginUrl ? `<div class="login-link-container">Need to sign in first? <a href="${loginUrl}" target="_blank" class="login-link">Sign in to ${name} &rarr;</a></div>` : ''}
  </div>
  
  <div class="success-view" id="success-view">
    <div class="success-badge">✨</div>
    <h1>${name} Connected!</h1>
    <p class="subtitle" style="margin-bottom:8px;">Authorization granted successfully.</p>
    <p class="close-text">Closing window & returning to Wondrilla...</p>
  </div>
</div>

<script>
  const authView = document.getElementById('auth-view');
  const successView = document.getElementById('success-view');
  const authBtn = document.getElementById('authorize-btn');

  authBtn.addEventListener('click', () => {
    authBtn.disabled = true;
    authBtn.textContent = 'Authorizing...';
    
    setTimeout(() => {
      authView.style.display = 'none';
      successView.style.display = 'block';
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'wondrilla-oauth-success',
          provider: '${provider}'
        }, '*');
      }
      
      setTimeout(() => {
        window.close();
      }, 1200);
    }, 600);
  });
</script>
</body>
</html>`;
}

function oauthSuccessPage(provider, token, name) {
    return oauthAuthorizationPage(provider, name, "#10b981", "✨", "");
}

async function handleAuth(request, response, requestUrl) {
    const parts = requestUrl.pathname.split("/").filter(Boolean);
    // /auth/:provider or /auth/:provider/callback
    const provider = parts[1] || "";
    const isCallback = parts[2] === "callback";
    const cfg = oauthConfig[provider];

    if (!cfg) {
        const name = provider.charAt(0).toUpperCase() + provider.slice(1);
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(oauthAuthorizationPage(provider, name, "#6366f1", "⚡", ""));
        return;
    }

    const clientId = process.env[cfg.clientIdEnv] || "";
    const clientSecret = process.env[cfg.clientSecretEnv] || "";
    const origin = `${request.headers["x-forwarded-proto"] || "http"}://${request.headers.host}`;
    const redirectUri = `${origin}/auth/${provider}/callback`;

    // If OAuth credentials are NOT configured, render interactive authorization page in popup window
    if (!clientId || !clientSecret) {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(oauthAuthorizationPage(provider, cfg.name, cfg.color, cfg.icon, cfg.loginUrl));
        return;
    }

    // ── Step 1: Redirect to provider's authorize URL ──
    if (!isCallback) {
        const state = crypto.randomBytes(16).toString("hex");
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: cfg.scopes,
            state,
            response_type: "code"
        });
        if (provider === "notion") params.set("owner", "user");
        response.writeHead(302, { Location: `${cfg.authorizeUrl}?${params}` });
        response.end();
        return;
    }

    // ── Step 2: Handle callback — exchange code for token ──
    const code = requestUrl.searchParams.get("code");
    if (!code) {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(oauthAuthorizationPage(provider, cfg.name, cfg.color, cfg.icon, cfg.loginUrl));
        return;
    }

    try {
        const tokenParams = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri,
            grant_type: "authorization_code"
        });

        const tokenRes = await fetch(cfg.tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json"
            },
            body: tokenParams.toString()
        });

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token || tokenData.authed_user?.access_token || "";

        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(oauthSuccessPage(provider, accessToken, cfg.name));
    } catch (err) {
        console.error(`OAuth token exchange failed for ${provider}:`, err);
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(oauthAuthorizationPage(provider, cfg.name, cfg.color, cfg.icon, cfg.loginUrl));
    }
}

async function handleApi(request, response, requestUrl) {
    if (request.method === "OPTIONS") {
        response.writeHead(204, corsHeaders());
        response.end();
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/health") {
        const configuredProviders = configuredProviderIds();
        sendJson(response, 200, {
            ok: true,
            mode: configuredProviders.length > 0 ? "live-ready" : "demo",
            configuredProviders,
            message: configuredProviders.length > 0
                ? "At least one provider key is configured."
                : "No provider keys found. The app will use safe demo responses."
        });
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/supabase/health") {
        sendJson(response, 200, {
            ok: true,
            supabase: publicSupabaseStatus()
        });
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/supabase/config") {
        sendJson(response, 200, {
            ok: true,
            url: supabaseConfig.url || "",
            publishableKey: supabaseConfig.publishableKey || ""
        });
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/models") {
        sendJson(response, 200, {
            ok: true,
            models: publicModelStatus()
        });
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/paypal/config") {
        sendJson(response, 200, {
            ok: true,
            clientId: process.env.PAYPAL_CLIENT_ID || ""
        });
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/razorpay/config") {
        sendJson(response, 200, {
            ok: true,
            keyId: process.env.RAZORPAY_KEY_ID || ""
        });
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/razorpay/create-order") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        const plan = String(body.plan || "pro").trim().toLowerCase();
        const billing = String(body.billing || "monthly").trim().toLowerCase();

        if (!userId) {
            sendJson(response, 400, { ok: false, error: "User must be logged in to create a payment order." });
            return;
        }

        let amountInr = 1999;
        if (plan === "pro") {
            amountInr = billing === "yearly" ? 1599 : 1999;
        } else if (plan === "studio") {
            amountInr = billing === "yearly" ? 5199 : 6499;
        }

        const amountPaise = amountInr * 100;
        const receipt = `rcpt_${Date.now()}`;

        try {
            const order = await createRazorpayOrder(amountPaise, receipt, { userId, plan, billing });
            sendJson(response, 200, {
                ok: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID
            });
        } catch (err) {
            console.error("Razorpay Order Creation Error:", err);
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/razorpay/verify-payment") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        const plan = String(body.plan || "pro").trim().toLowerCase();
        const billing = String(body.billing || "monthly").trim().toLowerCase();
        const razorpay_order_id = String(body.razorpay_order_id || "").trim();
        const razorpay_payment_id = String(body.razorpay_payment_id || "").trim();
        const razorpay_signature = String(body.razorpay_signature || "").trim();

        if (!userId) {
            sendJson(response, 400, { ok: false, error: "User must be logged in to verify payment." });
            return;
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            sendJson(response, 400, { ok: false, error: "Missing Razorpay payment parameters." });
            return;
        }

        const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
            sendJson(response, 400, { ok: false, error: "Invalid Razorpay payment signature." });
            return;
        }

        if (!supabase) {
            sendJson(response, 200, {
                ok: true,
                user: { user_id: userId, plan, messages_used: 0 }
            });
            return;
        }

        try {
            const { data: user, error } = await supabase
                .from("wondrilla_users")
                .update({ plan, updated_at: new Date().toISOString() })
                .eq("user_id", userId)
                .select()
                .single();

            if (error) throw error;

            if (user && user.email && plan !== "free") {
                sendUpgradeEmail(user.email, plan, billing).catch(console.error);
            }

            sendJson(response, 200, { ok: true, user });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/user") {
        const userId = requestUrl.searchParams.get("userId");
        const emailVal = requestUrl.searchParams.get("email") ? decodeURIComponent(requestUrl.searchParams.get("email")).trim() : null;
        if (!userId) {
            sendJson(response, 400, { ok: false, error: "userId is required." });
            return;
        }

        if (!supabase) {
            sendJson(response, 200, {
                ok: true,
                user: { user_id: userId, plan: "free", messages_used: 0 }
            });
            return;
        }

        try {
            let { data: user, error } = await supabase
                .from("wondrilla_users")
                .select("*")
                .eq("user_id", userId)
                .single();

            if (error && error.code === "PGRST116") {
                const { data: newUser, error: insertError } = await supabase
                    .from("wondrilla_users")
                    .insert([{ user_id: userId, email: emailVal, plan: "free", messages_used: 0 }])
                    .select()
                    .single();

                if (insertError) throw insertError;
                user = newUser;

                if (emailVal) {
                    sendWelcomeEmail(emailVal).catch(console.error);
                }
            } else if (error) {
                throw error;
            } else {
                if (emailVal && !user.email) {
                    const { data: updatedUser, error: updateError } = await supabase
                        .from("wondrilla_users")
                        .update({ email: emailVal })
                        .eq("user_id", userId)
                        .select()
                        .single();
                    if (!updateError && updatedUser) {
                        user = updatedUser;
                    }
                }
            }

            sendJson(response, 200, { ok: true, user });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/upgrade") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        const plan = String(body.plan || "free").trim().toLowerCase();
        const billing = String(body.billing || "monthly").trim().toLowerCase();
        const paypalOrderId = String(body.paypalOrderId || "").trim();

        if (!userId) {
            sendJson(response, 400, { ok: false, error: "userId is required." });
            return;
        }

        if (plan !== "free") {
            if (!paypalOrderId) {
                sendJson(response, 400, { ok: false, error: "paypalOrderId is required for paid plans." });
                return;
            }

            let expectedPrice = "0.00";
            if (plan === "pro") {
                expectedPrice = billing === "yearly" ? "19.00" : "24.00";
            } else if (plan === "studio") {
                expectedPrice = billing === "yearly" ? "63.00" : "79.00";
            }
            
            try {
                await verifyPayPalPayment(paypalOrderId, expectedPrice);
            } catch (payError) {
                sendJson(response, 400, { ok: false, error: `Payment verification failed: ${payError.message}` });
                return;
            }
        }

        if (!supabase) {
            sendJson(response, 200, {
                ok: true,
                user: { user_id: userId, plan, messages_used: 0 }
            });
            return;
        }

        try {
            const { data: user, error } = await supabase
                .from("wondrilla_users")
                .update({ plan, updated_at: new Date().toISOString() })
                .eq("user_id", userId)
                .select()
                .single();

            if (error) throw error;

            if (user && user.email && plan !== "free") {
                sendUpgradeEmail(user.email, plan, billing).catch(console.error);
            }

            sendJson(response, 200, { ok: true, user });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/paypal/config") {
        const clientId = process.env.PAYPAL_CLIENT_ID || "";
        if (!clientId) {
            sendJson(response, 400, { ok: false, error: "PayPal Client ID not configured" });
            return;
        }
        sendJson(response, 200, {
            ok: true,
            clientId,
            plans: {
                pro: process.env.PAYPAL_PLAN_PRO || "P-9YC10567CY499580XNJQNK4A",
                studio: process.env.PAYPAL_PLAN_STUDIO || "P-7FE110662L896332FNJQNK4I",
                pro_yearly: process.env.PAYPAL_PLAN_PRO_YEARLY || "P-4A365122NJ180603VNJQNK4I",
                studio_yearly: process.env.PAYPAL_PLAN_STUDIO_YEARLY || "P-13D9971022978854LNJQNK4Q"
            }
        });
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/paypal/webhook") {
        try {
            const body = await readJsonBody(request);
            const eventType = body.event_type || "";
            const resource = body.resource || {};
            
            console.log(`[PayPal Webhook Received] Event: ${eventType}`, resource.id || "");

            if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED" || eventType === "PAYMENT.SALE.COMPLETED") {
                const customId = resource.custom_id || resource.custom || resource.subscriber?.custom_id || "";
                const planId = resource.plan_id || "";
                
                let detectedPlan = "pro";
                if (planId === process.env.PAYPAL_PLAN_STUDIO || planId === process.env.PAYPAL_PLAN_STUDIO_YEARLY) {
                    detectedPlan = "studio";
                }

                if (customId && supabase) {
                    await supabase
                        .from("wondrilla_users")
                        .update({ plan: detectedPlan, updated_at: new Date().toISOString() })
                        .eq("user_id", customId);
                    console.log(`[PayPal Webhook] User ${customId} plan updated to ${detectedPlan}`);
                }
            } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED" || eventType === "BILLING.SUBSCRIPTION.EXPIRED" || eventType === "BILLING.SUBSCRIPTION.SUSPENDED") {
                const customId = resource.custom_id || resource.custom || resource.subscriber?.custom_id || "";
                if (customId && supabase) {
                    await supabase
                        .from("wondrilla_users")
                        .update({ plan: "free", updated_at: new Date().toISOString() })
                        .eq("user_id", customId);
                    console.log(`[PayPal Webhook] User ${customId} plan reset to free due to ${eventType}`);
                }
            }

            sendJson(response, 200, { ok: true, received: true });
        } catch (err) {
            console.error("PayPal Webhook processing error:", err);
            sendJson(response, 200, { ok: true });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/razorpay/webhook") {
        try {
            const body = await readJsonBody(request);
            const event = body.event || "";
            const payload = body.payload || {};
            const entity = payload.subscription?.entity || payload.payment?.entity || {};

            console.log(`[Razorpay Webhook Received] Event: ${event}`, entity.id || "");

            if (event === "subscription.charged" || event === "subscription.activated" || event === "payment.captured") {
                const notes = entity.notes || {};
                const userId = notes.userId || "";
                const plan = notes.plan || "pro";

                if (userId && supabase) {
                    await supabase
                        .from("wondrilla_users")
                        .update({ plan: plan.toLowerCase(), updated_at: new Date().toISOString() })
                        .eq("user_id", userId);
                    console.log(`[Razorpay Webhook] User ${userId} plan updated to ${plan}`);
                }
            } else if (event === "subscription.cancelled" || event === "subscription.halted") {
                const notes = entity.notes || {};
                const userId = notes.userId || "";
                if (userId && supabase) {
                    await supabase
                        .from("wondrilla_users")
                        .update({ plan: "free", updated_at: new Date().toISOString() })
                        .eq("user_id", userId);
                    console.log(`[Razorpay Webhook] User ${userId} plan reset to free due to ${event}`);
                }
            }

            sendJson(response, 200, { ok: true, received: true });
        } catch (err) {
            console.error("Razorpay Webhook error:", err);
            sendJson(response, 200, { ok: true });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/razorpay/create-subscription") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        const plan = String(body.plan || "").trim().toLowerCase();
        const billing = String(body.billing || "monthly").trim().toLowerCase();

        if (!userId || !plan) {
            sendJson(response, 400, { ok: false, error: "userId and plan are required." });
            return;
        }

        let planId = "";
        if (plan === "pro") {
            planId = billing === "yearly" ? process.env.RAZORPAY_PLAN_PRO_YEARLY : process.env.RAZORPAY_PLAN_PRO;
        } else if (plan === "studio") {
            planId = billing === "yearly" ? process.env.RAZORPAY_PLAN_STUDIO_YEARLY : process.env.RAZORPAY_PLAN_STUDIO;
        }

        if (!planId) {
            sendJson(response, 400, { ok: false, error: `No Razorpay plan configured for ${plan} (${billing})` });
            return;
        }

        try {
            const sub = await createRazorpaySubscription(planId, { userId, plan, billing });
            sendJson(response, 200, {
                ok: true,
                subscriptionId: sub.id,
                keyId: process.env.RAZORPAY_KEY_ID,
                planId: sub.plan_id
            });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/razorpay/verify-subscription") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        const plan = String(body.plan || "pro").trim().toLowerCase();
        const paymentId = String(body.razorpay_payment_id || "").trim();
        const subscriptionId = String(body.razorpay_subscription_id || "").trim();
        const signature = String(body.razorpay_signature || "").trim();

        if (!userId || !paymentId || !subscriptionId || !signature) {
            sendJson(response, 400, { ok: false, error: "Missing required verification parameters." });
            return;
        }

        const isValid = verifyRazorpaySubscriptionSignature(subscriptionId, paymentId, signature);
        if (!isValid) {
            sendJson(response, 400, { ok: false, error: "Invalid Razorpay payment signature." });
            return;
        }

        if (!supabase) {
            sendJson(response, 200, { ok: true, user: { user_id: userId, plan, messages_used: 0 } });
            return;
        }

        try {
            const { data: user, error } = await supabase
                .from("wondrilla_users")
                .update({ plan, updated_at: new Date().toISOString() })
                .eq("user_id", userId)
                .select()
                .single();

            if (error) throw error;

            if (user && user.email) {
                sendUpgradeEmail(user.email, plan, "monthly").catch(console.error);
            }

            sendJson(response, 200, { ok: true, user });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/razorpay/create-order") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        const plan = String(body.plan || "pro").trim().toLowerCase();
        const billing = String(body.billing || "monthly").trim().toLowerCase();

        if (!userId) {
            sendJson(response, 400, { ok: false, error: "userId is required." });
            return;
        }

        let amountInInr = 1999;
        if (plan === "pro") {
            amountInInr = billing === "yearly" ? 15999 : 1999;
        } else if (plan === "studio") {
            amountInInr = billing === "yearly" ? 51999 : 6499;
        }

        const amountPaise = amountInInr * 100;
        const receipt = `rcpt_${userId.slice(0, 10)}_${Date.now().toString().slice(-6)}`;

        try {
            const order = await createRazorpayOrder(amountPaise, receipt, { userId, plan, billing });
            sendJson(response, 200, {
                ok: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID
            });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/razorpay/verify-payment") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        const plan = String(body.plan || "pro").trim().toLowerCase();
        const billing = String(body.billing || "monthly").trim().toLowerCase();
        const orderId = String(body.razorpay_order_id || "").trim();
        const paymentId = String(body.razorpay_payment_id || "").trim();
        const signature = String(body.razorpay_signature || "").trim();

        if (!userId || !orderId || !paymentId || !signature) {
            sendJson(response, 400, { ok: false, error: "Missing required verification parameters." });
            return;
        }

        const isValid = verifyRazorpaySignature(orderId, paymentId, signature);
        if (!isValid) {
            sendJson(response, 400, { ok: false, error: "Invalid Razorpay payment signature." });
            return;
        }

        if (!supabase) {
            sendJson(response, 200, { ok: true, user: { user_id: userId, plan, messages_used: 0 } });
            return;
        }

        try {
            const { data: user, error } = await supabase
                .from("wondrilla_users")
                .update({ plan, updated_at: new Date().toISOString() })
                .eq("user_id", userId)
                .select()
                .single();

            if (error) throw error;

            if (user && user.email) {
                sendUpgradeEmail(user.email, plan, billing).catch(console.error);
            }

            sendJson(response, 200, { ok: true, user });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/user/personalization") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        const about = String(body.about || "");
        const responseVal = String(body.response || "");
        const enabledVal = body.enabled !== false;

        if (!userId) {
            sendJson(response, 400, { ok: false, error: "userId is required." });
            return;
        }

        if (!supabase) {
            sendJson(response, 200, { ok: true });
            return;
        }

        try {
            const { data: user, error } = await supabase
                .from("wondrilla_users")
                .update({
                    custom_instructions_about: about,
                    custom_instructions_response: responseVal,
                    custom_instructions_enabled: enabledVal,
                    updated_at: new Date().toISOString()
                })
                .eq("user_id", userId)
                .select()
                .single();

            if (error) throw error;
            sendJson(response, 200, { ok: true, user });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/messages/clear") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        if (!userId) {
            sendJson(response, 400, { ok: false, error: "userId is required." });
            return;
        }

        if (!supabase) {
            sendJson(response, 200, { ok: true });
            return;
        }

        try {
            const { error } = await supabase
                .from("wondrilla_messages")
                .delete()
                .eq("user_id", userId);

            if (error) throw error;
            sendJson(response, 200, { ok: true });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/user/delete") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        if (!userId) {
            sendJson(response, 400, { ok: false, error: "userId is required." });
            return;
        }

        if (!supabase) {
            sendJson(response, 200, { ok: true });
            return;
        }

        try {
            // Fetch user to get email first
            const { data: userRow } = await supabase
                .from("wondrilla_users")
                .select("email")
                .eq("user_id", userId)
                .single();

            // Delete messages first
            const { error: msgError } = await supabase
                .from("wondrilla_messages")
                .delete()
                .eq("user_id", userId);
            if (msgError) throw msgError;

            // Delete user profile
            const { error: userError } = await supabase
                .from("wondrilla_users")
                .delete()
                .eq("user_id", userId);
            if (userError) throw userError;

            // Trigger goodbye email if they had an email address
            if (userRow && userRow.email) {
                sendGoodbyeEmail(userRow.email).catch(console.error);
            }

            sendJson(response, 200, { ok: true });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/auth/reset-password") {
        const body = await readJsonBody(request);
        const email = String(body.email || "").trim();
        if (!email) {
            sendJson(response, 400, { ok: false, error: "email is required." });
            return;
        }

        if (!supabase) {
            sendJson(response, 200, { ok: true });
            return;
        }

        try {
            // Generate recovery link using Supabase Admin API
            const { data, error } = await supabase.auth.admin.generateLinkForLinkType({
                type: 'recovery',
                email: email,
                options: {
                    redirectTo: `${request.headers.referer || request.headers.origin || "https://wondrilla.com"}`
                }
            });
            if (error) throw error;

            const resetLink = data.properties.action_link;
            
            // Send recovery email via Resend from security@wondrilla.com
            await sendPasswordResetEmail(email, resetLink);

            sendJson(response, 200, { ok: true });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/conversations") {
        const userId = requestUrl.searchParams.get("userId");
        if (!userId) {
            sendJson(response, 400, { ok: false, error: "userId is required." });
            return;
        }
        if (!supabase) {
            sendJson(response, 200, { ok: true, conversations: [] });
            return;
        }
        try {
            const { data: conversations, error } = await supabase
                .from("wondrilla_conversations")
                .select("*")
                .eq("user_id", userId)
                .order("updated_at", { ascending: false });

            if (error) throw error;
            sendJson(response, 200, { ok: true, conversations: conversations || [] });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/conversations") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        const id = String(body.id || "").trim();
        const title = String(body.title || "").trim();
        if (!userId || !id || !title) {
            sendJson(response, 400, { ok: false, error: "userId, id, and title are required." });
            return;
        }
        if (!supabase) {
            sendJson(response, 200, { ok: true });
            return;
        }
        try {
            const { data, error } = await supabase
                .from("wondrilla_conversations")
                .upsert([{ id, user_id: userId, title, updated_at: new Date().toISOString() }], { onConflict: "id" })
                .select()
                .single();
            if (error) throw error;
            sendJson(response, 200, { ok: true, conversation: data });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "DELETE" && requestUrl.pathname === "/api/conversations") {
        const body = await readJsonBody(request);
        const userId = String(body.userId || "").trim();
        const conversationId = String(body.conversationId || "").trim();
        if (!userId) {
            sendJson(response, 400, { ok: false, error: "userId is required." });
            return;
        }
        if (!supabase) {
            sendJson(response, 200, { ok: true });
            return;
        }
        try {
            if (conversationId) {
                await supabase.from("wondrilla_messages").delete().eq("user_id", userId).eq("conversation_id", conversationId);
                await supabase.from("wondrilla_conversations").delete().eq("user_id", userId).eq("id", conversationId);
            } else {
                await supabase.from("wondrilla_messages").delete().eq("user_id", userId);
                await supabase.from("wondrilla_conversations").delete().eq("user_id", userId);
            }
            sendJson(response, 200, { ok: true });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/messages") {
        const userId = requestUrl.searchParams.get("userId");
        const conversationId = requestUrl.searchParams.get("conversationId");

        if (!supabase) {
            sendJson(response, 200, { ok: true, messages: [] });
            return;
        }

        try {
            let query = supabase.from("wondrilla_messages").select("*");

            if (conversationId) {
                query = query.eq("conversation_id", conversationId);
            } else if (userId) {
                query = query.eq("user_id", userId);
            } else {
                sendJson(response, 400, { ok: false, error: "userId or conversationId is required." });
                return;
            }

            const { data: messages, error } = await query.order("created_at", { ascending: true });

            if (error) throw error;
            sendJson(response, 200, { ok: true, messages: messages || [] });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (requestUrl.pathname === "/api/mcp") {
        if (request.method === "GET") {
            const list = [];
            for (const [name, srv] of activeMcpServers.entries()) {
                const clientConfig = srv.config ? {
                    command: srv.config.command,
                    args: srv.config.args,
                    serverUrl: srv.config.serverUrl
                } : {};
                list.push({
                    name,
                    status: srv.status,
                    error: srv.error,
                    tools: srv.tools,
                    config: clientConfig
                });
            }
            sendJson(response, 200, { ok: true, servers: list });
            return;
        }

        if (request.method === "POST") {
            const body = await readJsonBody(request);
            const name = String(body.name || "").trim();
            const config = body.config;
            if (!name || !config) {
                sendJson(response, 400, { ok: false, error: "Server name and config are required." });
                return;
            }
            if (activeMcpServers.has(name)) {
                activeMcpServers.get(name).stop();
            }
            const srv = new McpServerInstance(name, config);
            activeMcpServers.set(name, srv);
            await srv.start();

            // Save locally
            const localPath = path.join(process.cwd(), "mcp_config.json");
            let localConfig = { mcpServers: {} };
            if (existsSync(localPath)) {
                try {
                    localConfig = JSON.parse(readFileSync(localPath, "utf8"));
                } catch (e) {
                    console.error("Error reading local mcp_config.json:", e);
                }
            }
            localConfig.mcpServers = localConfig.mcpServers || {};
            localConfig.mcpServers[name] = config;
            writeFileSync(localPath, JSON.stringify(localConfig, null, 2), "utf8");

            sendJson(response, 200, { ok: true, status: srv.status, error: srv.error, tools: srv.tools });
            return;
        }

        if (request.method === "DELETE") {
            const name = requestUrl.searchParams.get("name");
            if (!name) {
                sendJson(response, 400, { ok: false, error: "Server name is required." });
                return;
            }
            if (activeMcpServers.has(name)) {
                activeMcpServers.get(name).stop();
                activeMcpServers.delete(name);
            }

            const localPath = path.join(process.cwd(), "mcp_config.json");
            if (existsSync(localPath)) {
                try {
                    const localConfig = JSON.parse(readFileSync(localPath, "utf8"));
                    if (localConfig.mcpServers && localConfig.mcpServers[name]) {
                        delete localConfig.mcpServers[name];
                        writeFileSync(localPath, JSON.stringify(localConfig, null, 2), "utf8");
                    }
                } catch (e) {
                    console.error("Failed to delete local MCP server config:", e);
                }
            }
            sendJson(response, 200, { ok: true });
            return;
        }
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/mcp/run") {
        const body = await readJsonBody(request);
        const serverName = String(body.serverName || "").trim();
        const toolName = String(body.toolName || "").trim();
        const args = body.arguments || {};

        const srv = activeMcpServers.get(serverName);
        if (!srv) {
            sendJson(response, 404, { ok: false, error: `MCP Server '${serverName}' not found.` });
            return;
        }
        try {
            const result = await srv.callTool(toolName, args);
            sendJson(response, 200, { ok: true, result });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/chat") {
        const body = await readJsonBody(request);
        const prompt = String(body.prompt || "").trim();
        const userId = String(body.userId || "").trim();

        if (!prompt) {
            sendJson(response, 400, { ok: false, error: "Prompt is required." });
            return;
        }

        let userPlan = "free";
        let messagesUsed = 0;

        if (supabase && userId) {
            try {
                const { data: user, error } = await supabase
                    .from("wondrilla_users")
                    .select("*")
                    .eq("user_id", userId)
                    .single();

                if (error) {
                    if (error.code !== "PGRST116") {
                        console.error("Error fetching user profile:", error);
                    }
                } else if (user) {
                    userPlan = user.plan || "free";
                    messagesUsed = user.messages_used || 0;
                }
            } catch (err) {
                console.error("Failed to query user profile:", err);
            }
        }

        const limit = getPlanLimit(userPlan);
        if (messagesUsed >= limit) {
            sendJson(response, 403, { ok: false, error: "Usage limit reached. Please upgrade your plan to continue." });
            return;
        }

        // Save user message to database
        if (supabase && userId) {
            try {
                if (body.conversationId) {
                    await supabase.from("wondrilla_conversations").upsert([{
                        id: String(body.conversationId),
                        user_id: userId,
                        title: String(body.conversationTitle || prompt.slice(0, 40) || "New conversation"),
                        updated_at: new Date().toISOString()
                    }], { onConflict: "id" });
                }
                await supabase.from("wondrilla_messages").insert([{
                    user_id: userId,
                    conversation_id: body.conversationId ? String(body.conversationId) : null,
                    role: "user",
                    content: prompt,
                    model_id: body.modelId || "auto"
                }]);
            } catch (err) {
                console.error("Failed to save user message:", err);
            }
        }

        if (body.compare) {
            const compareIds = ["claude", "chatgpt", "deepseek"];
            const answers = await Promise.all(
                compareIds.map((providerId) => answerWithProvider(providerId, prompt, body))
            );

            const increment = 3;
            const updatedUsed = messagesUsed + increment;

            if (supabase && userId) {
                try {
                    await supabase
                        .from("wondrilla_users")
                        .update({ messages_used: updatedUsed, updated_at: new Date().toISOString() })
                        .eq("user_id", userId);

                    const insertPayloads = answers.map((ans) => ({
                        user_id: userId,
                        conversation_id: body.conversationId ? String(body.conversationId) : null,
                        role: "assistant",
                        content: ans.text,
                        model_id: ans.modelId
                    }));
                    await supabase.from("wondrilla_messages").insert(insertPayloads);
                } catch (err) {
                    console.error("Failed to update usage or save compare answers:", err);
                }
            }

            sendJson(response, 200, {
                ok: true,
                compare: true,
                mode: answers.some((answer) => answer.mode === "live") ? "mixed" : "demo",
                answers,
                used: updatedUsed
            });
            return;
        }

        const requestedModel = String(body.modelId || "auto");
        const routedModel = chooseProvider(requestedModel, prompt, Boolean(body.web));
        const answer = await answerWithProvider(routedModel, prompt, body, requestedModel);

        const increment = 1;
        const updatedUsed = messagesUsed + increment;

        if (supabase && userId) {
            try {
                await supabase
                    .from("wondrilla_users")
                    .update({ messages_used: updatedUsed, updated_at: new Date().toISOString() })
                    .eq("user_id", userId);

                await supabase.from("wondrilla_messages").insert([{
                    user_id: userId,
                    conversation_id: body.conversationId ? String(body.conversationId) : null,
                    role: "assistant",
                    content: answer.text,
                    model_id: answer.modelId
                }]);
            } catch (err) {
                console.error("Failed to update usage or save assistant answer:", err);
            }
        }

        sendJson(response, 200, {
            ok: true,
            ...answer,
            used: updatedUsed
        });
        return;
    }

    sendJson(response, 404, { ok: false, error: "API route not found." });
}

function isImageRequest(prompt) {
    if (!prompt) return false;
    const lower = prompt.toLowerCase();
    const actionWords = /\b(generate|create|draw|make|show|paint|produce|build|render|design)\b/i;
    const objectWords = /\b(image|picture|photo|illustration|drawing|art|portrait|wallpaper|scene|avatar|banner|logo|lion|man|cat|dog|person|car|landscape)\b/i;
    const directPattern = /\b(image of|photo of|picture of|drawing of|illustration of|portrait of|paint a|draw a|generate a|generate an image|create an image|make an image|image AI|lion|banao|image banao|photo banao|pic banao)\b/i;
    return directPattern.test(lower) || (actionWords.test(lower) && objectWords.test(lower));
}

function extractImagePrompt(prompt) {
    if (!prompt) return "a beautiful digital artwork";
    let clean = prompt
        .replace(/^(please|can you|kindly|could you|wondrilla|ai|mujhe|ek)\s+/gi, "")
        .replace(/\b(generate|create|draw|make|show me|paint|produce|render|banao|banaye|karo)\s+(an?\s+)?(image|picture|photo|illustration|drawing|art|portrait)?\s+(of|ke saath|ki)?\s*/gi, "")
        .trim();
    return clean || prompt;
}

async function answerWithProvider(providerId, prompt, body, requestedModel = providerId) {
    const catalogItem = modelCatalog.find((model) => model.id === providerId) || modelCatalog[0];
    const config = providerConfig[providerId];
    const conversationHistory = Array.isArray(body.conversationHistory) ? body.conversationHistory : [];

    // Check for Image AI request
    if (isImageRequest(prompt)) {
        const seed = Math.floor(Math.random() * 1000000);
        const cleanPrompt = extractImagePrompt(prompt);
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
        return {
            mode: "live",
            modelId: providerId,
            requestedModel,
            provider: "Wondrilla Image AI",
            model: "image-gen-v1",
            text: `✨ **Image Generated by Wondrilla Image AI:**\n\n![${cleanPrompt}](${imgUrl})\n\n**Prompt:** *${cleanPrompt}*`
        };
    }

    if (!config || !isProviderConfigured(providerId)) {
        return {
            mode: "demo",
            modelId: providerId,
            requestedModel,
            provider: catalogItem.name,
            text: demoResponse(providerId, body)
        };
    }

    try {
        const augmentedPrompt = buildProviderPrompt(prompt, body);
        const text = await callProvider(providerId, augmentedPrompt, conversationHistory);

        return {
            mode: "live",
            modelId: providerId,
            requestedModel,
            provider: catalogItem.name,
            model: getProviderModel(providerId),
            text
        };
    } catch (error) {
        return {
            mode: "demo",
            modelId: providerId,
            requestedModel,
            provider: catalogItem.name,
            liveAttempted: true,
            text: demoResponse(providerId, body, `Live ${catalogItem.name} call failed: ${sanitizeError(error)}`)
        };
    }
}

function buildProviderPrompt(prompt, body) {
    const lines = [];

    if (body.customInstructions && body.customInstructions.enabled !== false) {
        const about = String(body.customInstructions.about || "").trim();
        const response = String(body.customInstructions.response || "").trim();
        if (about) {
            lines.push("--- USER CONTEXT (About the User) ---");
            lines.push(about);
        }
        if (response) {
            lines.push("--- RESPONSE GUIDELINES (How to Respond) ---");
            lines.push(response);
        }
    }

    if (body.web) {
        lines.push("The user enabled web research. If live search context is not provided, say that a search connector is needed before making current claims.");
    }

    if (body.file && body.file.name) {
        lines.push(`Attached file metadata: ${body.file.name}, ${body.file.size || "unknown size"}, ${body.file.type || "unknown type"}. If file contents are not included, explain that file text extraction must be connected for a true file analysis.`);
    }

    lines.push("CRITICAL IMAGE GENERATION RULE: If the user asks to generate, create, draw, paint, or show an image, picture, photo, artwork, or illustration (e.g. 'generate an image of a man walking with a lion'), you MUST include a Markdown image link in your output using this exact format: ![Image Description](https://image.pollinations.ai/prompt/URL_ENCODED_ENGLISH_PROMPT?width=1024&height=1024&nologo=true). Do NOT just describe the image in text — ALWAYS include the Markdown image link so the image actually renders in the user's chat window!");

    if (lines.length > 0) {
        lines.push("");
        lines.push("User prompt:");
    }
    lines.push(prompt);
    return lines.join("\n");
}

async function callProvider(providerId, prompt, conversationHistory = []) {
    const config = providerConfig[providerId];
    if (providerId !== "meta" && providerId !== "ollama" && (!config || !process.env[config.keyEnv]) && process.env.OPENROUTER_API_KEY) {
        return callOpenRouterFallback(providerId, prompt, conversationHistory);
    }

    if (providerId === "chatgpt") {
        return callOpenAiCompatible({
            url: "https://api.openai.com/v1/chat/completions",
            key: process.env.OPENAI_API_KEY,
            model: getProviderModel("chatgpt"),
            prompt,
            conversationHistory
        });
    }

    if (providerId === "claude") {
        return callAnthropic(prompt, conversationHistory);
    }

    if (providerId === "grok") {
        return callOpenAiCompatible({
            url: "https://api.x.ai/v1/chat/completions",
            key: process.env.XAI_API_KEY,
            model: getProviderModel("grok"),
            prompt,
            conversationHistory
        });
    }

    if (providerId === "meta") {
        return callOpenAiCompatible({
            url: "https://openrouter.ai/api/v1/chat/completions",
            key: process.env.OPENROUTER_API_KEY,
            model: getProviderModel("meta"),
            prompt,
            conversationHistory,
            headers: {
                "HTTP-Referer": process.env.APP_URL || `http://localhost:${port}`,
                "X-Title": "Wondrilla"
            }
        });
    }

    if (providerId === "kimi") {
        return callOpenAiCompatible({
            url: "https://api.moonshot.ai/v1/chat/completions",
            key: process.env.MOONSHOT_API_KEY,
            model: getProviderModel("kimi"),
            prompt,
            conversationHistory
        });
    }

    if (providerId === "zai") {
        return callOpenAiCompatible({
            url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
            key: process.env.ZAI_API_KEY,
            model: getProviderModel("zai"),
            prompt,
            conversationHistory
        });
    }

    if (providerId === "deepseek") {
        return callOpenAiCompatible({
            url: "https://api.deepseek.com/chat/completions",
            key: process.env.DEEPSEEK_API_KEY,
            model: getProviderModel("deepseek"),
            prompt,
            conversationHistory
        });
    }

    if (providerId === "gemini") {
        return callOpenAiCompatible({
            url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            key: process.env.GEMINI_API_KEY,
            model: getProviderModel("gemini"),
            prompt,
            conversationHistory
        });
    }

    if (providerId === "ollama") {
        const baseUrl = process.env.OLLAMA_API_BASE || "http://localhost:11434";
        return callOpenAiCompatible({
            url: `${baseUrl}/v1/chat/completions`,
            key: "ollama",
            model: getProviderModel("ollama"),
            prompt,
            conversationHistory
        });
    }

    throw new Error(`Unsupported provider: ${providerId}`);
}

async function callOpenRouterFallback(providerId, prompt, conversationHistory = []) {
    const modelMap = {
        chatgpt: "openai/gpt-4o-mini",
        claude: "anthropic/claude-haiku-4.5",
        grok: "x-ai/grok-2-1212",
        kimi: "moonshotai/moonshot-v1-8k",
        zai: "zhipu/glm-4-9b-chat",
        deepseek: "deepseek/deepseek-chat",
        gemini: "google/gemini-2.5-flash"
    };

    const openRouterModel = modelMap[providerId] || "meta-llama/llama-3.2-3b-instruct:free";

    return callOpenAiCompatible({
        url: "https://openrouter.ai/api/v1/chat/completions",
        key: process.env.OPENROUTER_API_KEY,
        model: openRouterModel,
        prompt,
        conversationHistory,
        headers: {
            "HTTP-Referer": process.env.APP_URL || `http://localhost:${port}`,
            "X-Title": "Wondrilla"
        }
    });
}

async function callOpenAiResponses(prompt) {
    const data = await postJson("https://api.openai.com/v1/responses", {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    }, {
        model: getProviderModel("chatgpt"),
        input: prompt
    });

    if (typeof data.output_text === "string" && data.output_text.trim()) {
        return data.output_text.trim();
    }

    const output = Array.isArray(data.output) ? data.output : [];
    const parts = output.flatMap((item) => Array.isArray(item.content) ? item.content : []);
    const text = parts.map((part) => part.text || part.output_text || "").filter(Boolean).join("\n").trim();

    if (!text) {
        throw new Error("OpenAI response did not include text.");
    }

    return text;
}

async function callAnthropic(prompt, conversationHistory = []) {
    const formattedHistory = [];
    if (Array.isArray(conversationHistory)) {
        for (const msg of conversationHistory) {
            if (msg && (msg.role === "user" || msg.role === "assistant") && typeof msg.content === "string") {
                formattedHistory.push({ role: msg.role, content: msg.content.trim() });
            }
        }
    }

    const messages = [
        ...formattedHistory,
        { role: "user", content: prompt }
    ];

    const llmTools = getMcpToolsForLlm();
    const anthropicTools = llmTools.map((t) => ({
        name: t.function.name,
        description: t.function.description,
        input_schema: t.function.parameters
    }));

    for (let turn = 0; turn < 5; turn++) {
        const payload = {
            model: getProviderModel("claude"),
            max_tokens: 900,
            messages
        };

        if (anthropicTools.length > 0) {
            payload.tools = anthropicTools;
        }

        const data = await postJson("https://api.anthropic.com/v1/messages", {
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01"
        }, payload);

        const content = data.content || [];
        messages.push({ role: "assistant", content });

        const toolUses = content.filter((part) => part.type === "tool_use");
        if (toolUses.length > 0) {
            const toolResults = [];
            for (const toolUse of toolUses) {
                try {
                    const resultText = await executeMcpToolCall(toolUse.name, toolUse.input);
                    toolResults.push({
                        type: "tool_result",
                        tool_use_id: toolUse.id,
                        content: resultText
                    });
                } catch (err) {
                    toolResults.push({
                        type: "tool_result",
                        tool_use_id: toolUse.id,
                        content: JSON.stringify({ error: err.message }),
                        is_error: true
                    });
                }
            }
            messages.push({ role: "user", content: toolResults });
            continue;
        }

        const text = content.map((part) => part.text || "").filter(Boolean).join("\n").trim();
        if (!text) {
            throw new Error("Anthropic response did not include text.");
        }
        return text;
    }

    throw new Error("Max tool call turns reached.");
}

async function callOpenAiCompatible({ url, key, model, prompt, conversationHistory = [], headers = {} }) {
    const formattedHistory = [];
    if (Array.isArray(conversationHistory)) {
        for (const msg of conversationHistory) {
            if (msg && (msg.role === "user" || msg.role === "assistant") && typeof msg.content === "string") {
                formattedHistory.push({ role: msg.role, content: msg.content.trim() });
            }
        }
    }

    const messages = [
        { role: "system", content: "You are Wondrilla, a concise and useful AI assistant. Maintain context across user messages and answer follow-up questions directly." },
        ...formattedHistory,
        { role: "user", content: prompt }
    ];

    const llmTools = getMcpToolsForLlm();

    for (let turn = 0; turn < 5; turn++) {
        const payload = {
            model,
            messages,
            temperature: 0.7,
            max_tokens: 900
        };

        if (llmTools.length > 0) {
            payload.tools = llmTools;
        }

        const data = await postJson(url, {
            Authorization: `Bearer ${key}`,
            ...headers
        }, payload);

        const choice = data.choices?.[0];
        if (!choice) {
            throw new Error("Provider response did not include choices.");
        }

        const message = choice.message;
        messages.push(message);

        if (message.tool_calls && message.tool_calls.length > 0) {
            for (const toolCall of message.tool_calls) {
                try {
                    const resultText = await executeMcpToolCall(toolCall.function.name, toolCall.function.arguments);
                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        name: toolCall.function.name,
                        content: resultText
                    });
                } catch (err) {
                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        name: toolCall.function.name,
                        content: JSON.stringify({ error: err.message })
                    });
                }
            }
            continue;
        }

        const text = message.content?.trim();
        if (!text) {
            throw new Error("Provider response did not include text content.");
        }
        return text;
    }

    throw new Error("Max tool call turns reached.");
}

async function postJson(url, headers, body) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        const raw = await response.text();
        let data = {};

        try {
            data = raw ? JSON.parse(raw) : {};
        } catch {
            data = { raw };
        }

        if (!response.ok) {
            const providerMessage = data.error?.message || data.message || raw || response.statusText;
            throw new Error(`${response.status} ${providerMessage}`);
        }

        return data;
    } finally {
        clearTimeout(timeout);
    }
}

function chooseProvider(requestedModel, prompt, webEnabled) {
    if (requestedModel && requestedModel !== "auto") {
        return providerConfig[requestedModel] ? requestedModel : "auto";
    }

    const lower = prompt.toLowerCase();
    const prefer = (ids) => ids.find((id) => isProviderConfigured(id)) || ids[0];

    if (webEnabled || /\b(today|latest|current|news|trend|real[- ]?time)\b/.test(lower)) {
        return prefer(["grok", "chatgpt", "zai", "meta"]);
    }

    if (/\b(code|bug|debug|api|function|sql|math|logic|algorithm)\b/.test(lower)) {
        return prefer(["deepseek", "gemini", "zai", "chatgpt"]);
    }

    if (/\b(write|rewrite|story|brand|copy|tone|email|script)\b/.test(lower)) {
        return prefer(["claude", "gemini", "chatgpt", "kimi"]);
    }

    if (/[\u3400-\u9fff]/.test(prompt) || /\b(long context|research|summarize|document)\b/.test(lower)) {
        return prefer(["kimi", "gemini", "zai", "claude"]);
    }

    return configuredProviderIds()[0] || "zai";
}

function demoResponse(providerId, body, note) {
    const promptText = body?.prompt || "";
    if (isImageRequest(promptText)) {
        const seed = Math.floor(Math.random() * 1000000);
        const cleanPrompt = extractImagePrompt(promptText);
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
        return `✨ **Image Generated by Wondrilla Image AI:**\n\n![${cleanPrompt}](${imgUrl})\n\n**Prompt:** *${cleanPrompt}*`;
    }

    const fileNote = body.file?.name
        ? `I received the file metadata for ${body.file.name} (${body.file.size || "unknown size"}). For true file analysis, connect server-side file extraction or a multimodal provider payload.\n\n`
        : "";
    const webNote = body.web
        ? "Web mode is enabled in the interface. Connect a search API on the server to return real sources and citations.\n\n"
        : "";
    const gatewayNote = note
        ? `\n\nGateway note: ${note}`
        : "\n\nGateway note: add this provider's API key to .env to switch this answer from demo mode to live API mode.";

    return `${fileNote}${webNote}${demoAnswers[providerId] || demoAnswers.auto}${gatewayNote}`;
}

function createSupabaseServerClient() {
    const key = supabaseConfig.serviceRoleKey || supabaseConfig.publishableKey;

    if (!supabaseConfig.url || !key) {
        return null;
    }

    return createClient(supabaseConfig.url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });
}

function publicSupabaseStatus() {
    return {
        configured: Boolean(supabase),
        url: supabaseConfig.url || null,
        hasPublishableKey: Boolean(supabaseConfig.publishableKey),
        hasServerSecret: Boolean(supabaseConfig.serviceRoleKey),
        canWriteServerSide: Boolean(supabaseConfig.serviceRoleKey)
    };
}

let ollamaOnline = false;
let lastOllamaCheck = 0;

async function checkOllamaStatus() {
    const now = Date.now();
    if (now - lastOllamaCheck < 10000) {
        return ollamaOnline;
    }
    lastOllamaCheck = now;
    const baseUrl = process.env.OLLAMA_API_BASE || "http://localhost:11434";
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 800);
        const res = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
        clearTimeout(timeout);
        ollamaOnline = res.ok;
    } catch {
        ollamaOnline = false;
    }
    return ollamaOnline;
}

function publicModelStatus() {
    return modelCatalog.map((model) => {
        if (model.id === "auto") {
            return {
                ...model,
                configured: configuredProviderIds().length > 0,
                model: "smart-router",
                keyEnv: null
            };
        }

        const config = providerConfig[model.id];
        return {
            ...model,
            configured: isProviderConfigured(model.id),
            model: getProviderModel(model.id),
            keyEnv: config?.keyEnv || null
        };
    });
}

function configuredProviderIds() {
    return Object.keys(providerConfig).filter((providerId) => isProviderConfigured(providerId));
}

function isProviderConfigured(providerId) {
    const config = providerConfig[providerId];
    if (!config) return false;

    if (process.env[config.keyEnv]) {
        return true;
    }

    if (process.env.OPENROUTER_API_KEY && providerId !== "auto") {
        return true;
    }

    return false;
}

function getProviderModel(providerId) {
    const config = providerConfig[providerId];
    return config ? process.env[config.modelEnv] || config.defaultModel : "demo";
}

async function sendEmail({ to, from, subject, html }) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn("RESEND_API_KEY is not defined. Skipping email sending.");
        return;
    }

    const fromEmail = from || process.env.RESEND_FROM_EMAIL || "Wondrilla <onboarding@resend.dev>";
    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: fromEmail,
                to: Array.isArray(to) ? to : [to],
                subject: subject,
                html: html
            })
        });

        const data = await res.json();
        if (!res.ok) {
            console.error("Resend API error:", data);
        } else {
            console.log("Email sent successfully via Resend:", data.id);
        }
    } catch (err) {
        console.error("Failed to send email via Resend:", err);
    }
}

async function sendWelcomeEmail(toEmail) {
    const subject = "Welcome to Wondrilla AI! 🚀";
    const html = `
        <div style="font-family: 'DM Sans', sans-serif; background: #0e100d; color: #f3f4f2; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #242722;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; font-size: 28px; margin: 0; font-family: 'Manrope', sans-serif;">Wondrilla AI</h1>
                <p style="color: #8c9187; font-size: 14px; margin-top: 5px;">Every mind, one workspace</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">Hi there,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">Welcome to Wondrilla! We're excited to help you streamline your workflow with our advanced multi-model AI workspace.</p>
            
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid #242722; padding: 20px; border-radius: 10px; margin: 35px 0;">
                <h3 style="margin-top: 0; color: #f3f4f2; font-size: 16px;">Here's what you can do with your Free Plan:</h3>
                <ul style="padding-left: 20px; color: #b8bdb4; font-size: 14px; line-height: 1.8;">
                    <li>Access Wondrilla Auto, Claude, ChatGPT, Grok, and more models</li>
                    <li>Utilize Model Context Protocol (MCP) integrations</li>
                    <li>Configure Custom Instructions for personalization</li>
                    <li>Run side-by-side model comparisons</li>
                </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">If you have any questions or need help, just reply to this email or reach out to us at <a href="mailto:support@wondrilla.com" style="color: #2563eb; text-decoration: none;">support@wondrilla.com</a>.</p>
            
            <div style="margin-top: 40px; border-top: 1px solid #242722; padding-top: 20px; text-align: center; color: #8c9187; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} Wondrilla AI. All rights reserved.</p>
                <p style="margin-top: 5px;">wondrilla.com</p>
            </div>
        </div>
    `;
    await sendEmail({
        to: toEmail,
        from: "Wondrilla Onboarding <hello@wondrilla.com>",
        subject,
        html
    });
}

async function sendPasswordResetEmail(toEmail, resetLink) {
    const subject = "Reset Your Wondrilla Password 🔑";
    const html = `
        <div style="font-family: 'DM Sans', sans-serif; background: #0e100d; color: #f3f4f2; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #242722;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; font-size: 28px; margin: 0; font-family: 'Manrope', sans-serif;">Wondrilla AI</h1>
                <p style="color: #8c9187; font-size: 14px; margin-top: 5px;">Password Recovery</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">Hi there,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">We received a request to reset your Wondrilla account password. Click the button below to set a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6; color: #8c9187;">If you did not request this, you can safely ignore this email. This link will expire in 24 hours.</p>
            
            <div style="margin-top: 40px; border-top: 1px solid #242722; padding-top: 20px; text-align: center; color: #8c9187; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} Wondrilla AI. All rights reserved.</p>
                <p style="margin-top: 5px;">wondrilla.com</p>
            </div>
        </div>
    `;
    await sendEmail({
        to: toEmail,
        from: "Wondrilla Security <security@wondrilla.com>",
        subject,
        html
    });
}

async function sendUpgradeEmail(toEmail, plan, billing) {
    const subject = `Your Wondrilla ${plan.toUpperCase()} Plan is Active! 🎉`;
    const html = `
        <div style="font-family: 'DM Sans', sans-serif; background: #0e100d; color: #f3f4f2; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #242722;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; font-size: 28px; margin: 0; font-family: 'Manrope', sans-serif;">Wondrilla AI</h1>
                <p style="color: #8c9187; font-size: 14px; margin-top: 5px;">Thank you for your purchase!</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">Hi there,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">We are pleased to confirm that your account has been successfully upgraded to the <strong>${plan.toUpperCase()} Plan</strong> (${billing}).</p>
            
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid #242722; padding: 20px; border-radius: 10px; margin: 35px 0;">
                <h3 style="margin-top: 0; color: #f3f4f2; font-size: 16px;">Plan Details:</h3>
                <table style="width: 100%; color: #b8bdb4; font-size: 14px; line-height: 1.8;">
                    <tr>
                        <td style="padding: 5px 0; font-weight: bold;">Selected Tier:</td>
                        <td style="padding: 5px 0; text-align: right; color: #f3f4f2;">${plan.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; font-weight: bold;">Billing Cycle:</td>
                        <td style="padding: 5px 0; text-align: right; color: #f3f4f2;">${billing}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; font-weight: bold;">Message Limit:</td>
                        <td style="padding: 5px 0; text-align: right; color: #f3f4f2;">${plan === "pro" ? "2,000" : "10,000"} / month</td>
                    </tr>
                </table>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">All features are now unlocked in your workspace. Start exploring advanced capabilities right away!</p>
            
            <div style="margin-top: 40px; border-top: 1px solid #242722; padding-top: 20px; text-align: center; color: #8c9187; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} Wondrilla AI. All rights reserved.</p>
                <p style="margin-top: 5px;">wondrilla.com</p>
            </div>
        </div>
    `;
    await sendEmail({
        to: toEmail,
        from: "Wondrilla Billing <billing@wondrilla.com>",
        subject,
        html
    });
}

async function sendGoodbyeEmail(toEmail) {
    const subject = "Wondrilla Account Deletion Confirmed 🔒";
    const html = `
        <div style="font-family: 'DM Sans', sans-serif; background: #0e100d; color: #f3f4f2; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #242722;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ea5455; font-size: 28px; margin: 0; font-family: 'Manrope', sans-serif;">Wondrilla AI</h1>
                <p style="color: #8c9187; font-size: 14px; margin-top: 5px;">Account Deleted</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">Hi there,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">This email confirms that your Wondrilla account and all associated workspace data (including chat history and profile logs) have been permanently deleted from our database as requested.</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b8bdb4;">We are sorry to see you go! If you ever decide to return, our doors are always open.</p>
            
            <div style="margin-top: 40px; border-top: 1px solid #242722; padding-top: 20px; text-align: center; color: #8c9187; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} Wondrilla AI. All rights reserved.</p>
                <p style="margin-top: 5px;">wondrilla.com</p>
            </div>
        </div>
    `;
    await sendEmail({
        to: toEmail,
        from: "Wondrilla Security <security@wondrilla.com>",
        subject,
        html
    });
}

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        ...corsHeaders(),
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    });
    response.end(JSON.stringify(payload, null, 2));
}

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };
}

function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let size = 0;
        let body = "";

        request.on("data", (chunk) => {
            size += chunk.length;

            if (size > requestLimitBytes) {
                reject(new Error("Request body is too large."));
                request.destroy();
                return;
            }

            body += chunk;
        });

        request.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error("Invalid JSON request body."));
            }
        });

        request.on("error", reject);
    });
}

async function serveStatic(pathname, response, headOnly) {
    const safePath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
    const resolvedPath = path.resolve(rootDir, `.${safePath}`);
    const insideRoot = resolvedPath === rootDir || resolvedPath.startsWith(`${rootDir}${path.sep}`);

    if (!insideRoot) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    try {
        const file = await readFile(resolvedPath);
        response.writeHead(200, {
            "Content-Type": mimeType(resolvedPath),
            "Cache-Control": "no-cache"
        });

        if (!headOnly) {
            response.end(file);
        } else {
            response.end();
        }
    } catch {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
    }
}

function mimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp"
    };

    return types[ext] || "application/octet-stream";
}

function loadEnv(envPath) {
    if (!existsSync(envPath)) {
        return;
    }

    const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#")) {
            continue;
        }

        const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);

        if (!match) {
            continue;
        }

        const [, key, rawValue] = match;

        if (process.env[key] !== undefined) {
            continue;
        }

        process.env[key] = rawValue.replace(/^["']|["']$/g, "");
    }
}

async function verifyPayPalPayment(orderId, expectedAmount) {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        console.warn("PayPal credentials missing for verification, bypassing check.");
        return true;
    }
    
    const isSandbox = process.env.PAYPAL_ENVIRONMENT === "sandbox" || process.env.PAYPAL_ENVIRONMENT === "SANDBOX";
    const baseUrl = isSandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
    
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
    });
    
    if (!tokenRes.ok) {
        throw new Error(`Failed to get PayPal token: ${tokenRes.statusText}`);
    }
    
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    
    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
    
    if (!orderRes.ok) {
        throw new Error(`Failed to fetch PayPal order ${orderId}: ${orderRes.statusText}`);
    }
    
    const orderData = await orderRes.json();
    const purchaseUnit = orderData.purchase_units?.[0];
    const amount = purchaseUnit?.amount?.value;
    const status = orderData.status;
    
    if (status !== "COMPLETED" && status !== "APPROVED") {
        throw new Error(`PayPal order ${orderId} has status ${status}, expected COMPLETED or APPROVED`);
    }
    
    if (parseFloat(amount) !== parseFloat(expectedAmount)) {
        throw new Error(`PayPal order amount ${amount} does not match expected amount ${expectedAmount}`);
    }
    
    return true;
}

function sanitizeError(error) {
    return String(error?.message || error || "Unknown error")
        .replace(/[A-Za-z0-9_-]{24,}/g, "[redacted]")
        .slice(0, 260);
}

// ============================================================================
// MODEL CONTEXT PROTOCOL (MCP) INTEGRATION
// ============================================================================

const activeMcpServers = new Map();

class McpServerInstance {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        this.status = "Disconnected";
        this.process = null;
        this.tools = [];
        this.error = null;
        this.responseHandlers = new Map();
        this.requestId = 1;
        this.lineBuffer = "";
        this.postUrl = null;
    }

    async start() {
        if (this.config.serverUrl) {
            this.status = "Connecting";
            try {
                const urlObj = new URL(this.config.serverUrl);
                const clientLib = urlObj.protocol === "https:" ? https : http;
                
                const req = clientLib.get(this.config.serverUrl, {
                    headers: {
                        "Accept": "text/event-stream",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive"
                    }
                }, (res) => {
                    this.status = "Connected";
                    let buffer = "";
                    res.on("data", (chunk) => {
                        buffer += chunk.toString();
                        let lines = buffer.split("\n");
                        buffer = lines.pop();
                        
                        for (let line of lines) {
                            line = line.trim();
                            if (!line) continue;
                            if (line.startsWith("event: message")) {
                                // Handled in data:
                            } else if (line.startsWith("data: ")) {
                                try {
                                    const data = JSON.parse(line.substring(6).trim());
                                    this.handleJsonRpc(data);
                                } catch (e) {}
                            } else if (line.startsWith("event: endpoint")) {
                                // Look ahead for the data
                                const idx = lines.indexOf(line);
                                const nextLine = lines[idx + 1] || "";
                                if (nextLine.startsWith("data: ")) {
                                    this.postUrl = new URL(nextLine.substring(6).trim(), this.config.serverUrl).toString();
                                }
                            }
                        }
                    });
                    
                    res.on("close", () => {
                        this.status = "Disconnected";
                    });

                    // List tools once connected
                    this.refreshTools().catch(() => {});
                });
                
                req.on("error", (err) => {
                    this.status = "Error";
                    this.error = err.message;
                });
            } catch (e) {
                this.status = "Error";
                this.error = e.message;
            }
            return;
        }

        if (!this.config.command) {
            this.status = "Error";
            this.error = "No command specified";
            return;
        }

        try {
            this.status = "Connecting";
            
            const command = this.config.command;
            const rawArgs = this.config.args || [];
            const args = rawArgs.map(arg => {
                if (typeof arg === "string") {
                    const normalized = arg.replace(/\\/g, "/");
                    if (normalized.toLowerCase().startsWith("d:/wondrilla/")) {
                        const relative = normalized.substring("d:/wondrilla/".length);
                        return path.join(process.cwd(), relative);
                    }
                }
                return arg;
            });
            const env = { ...process.env, ...(this.config.env || {}) };

            this.process = spawn(command, args, {
                env,
                shell: true
            });

            this.process.stdout.on("data", (data) => {
                this.lineBuffer += data.toString();
                let lines = this.lineBuffer.split("\n");
                this.lineBuffer = lines.pop();

                for (let line of lines) {
                    line = line.trim();
                    if (!line) continue;
                    try {
                        const message = JSON.parse(line);
                        this.handleJsonRpc(message);
                    } catch (e) {
                        console.error(`[MCP ${this.name}] Failed to parse stdout:`, line, e);
                    }
                }
            });

            this.process.stderr.on("data", (data) => {
                console.error(`[MCP ${this.name} stderr]`, data.toString());
            });

            this.process.on("close", (code) => {
                this.status = "Disconnected";
                this.process = null;
            });

            this.process.on("error", (err) => {
                this.status = "Error";
                this.error = err.message;
            });

            await this.refreshTools();
            this.status = "Connected";
        } catch (err) {
            this.status = "Error";
            this.error = err.message;
        }
    }

    stop() {
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
        this.status = "Disconnected";
        this.tools = [];
    }

    sendJsonRpc(method, params = {}) {
        return new Promise((resolve, reject) => {
            const id = this.requestId++;
            const payload = {
                jsonrpc: "2.0",
                method,
                params,
                id
            };

            if (this.config.serverUrl) {
                this.responseHandlers.set(id, { resolve, reject });
                const postUrl = this.postUrl || this.config.serverUrl;
                const urlObj = new URL(postUrl);
                const clientLib = urlObj.protocol === "https:" ? https : http;
                
                const postData = JSON.stringify(payload);
                const req = clientLib.request(postUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(postData)
                    }
                }, (res) => {
                    if (res.statusCode >= 400) {
                        this.responseHandlers.delete(id);
                        reject(new Error(`HTTP POST error: ${res.statusCode}`));
                    }
                });

                req.on("error", (e) => {
                    this.responseHandlers.delete(id);
                    reject(e);
                });

                req.write(postData);
                req.end();
            } else {
                if (!this.process) {
                    return reject(new Error("Server process is not running"));
                }
                this.responseHandlers.set(id, { resolve, reject });
                this.process.stdin.write(JSON.stringify(payload) + "\n");
            }
        });
    }

    handleJsonRpc(message) {
        if (message.id !== undefined && this.responseHandlers.has(message.id)) {
            const { resolve, reject } = this.responseHandlers.get(message.id);
            this.responseHandlers.delete(message.id);
            if (message.error) {
                reject(new Error(message.error.message || "Unknown JSON-RPC error"));
            } else {
                resolve(message.result);
            }
        }
    }

    async refreshTools() {
        try {
            const result = await this.sendJsonRpc("tools/list");
            this.tools = result?.tools || [];
            this.error = null;
        } catch (err) {
            this.tools = [];
            this.error = `Failed to list tools: ${err.message}`;
            this.status = "Error";
            throw err;
        }
    }

    async callTool(toolName, args = {}) {
        const result = await this.sendJsonRpc("tools/call", {
            name: toolName,
            arguments: args
        });
        return result;
    }
}

function getMcpToolsForLlm() {
    const llmTools = [];
    for (const [serverName, srv] of activeMcpServers.entries()) {
        if (srv.status !== "Connected") continue;
        for (const tool of srv.tools) {
            const name = `${serverName}__${tool.name}`;
            llmTools.push({
                type: "function",
                function: {
                    name,
                    description: `[MCP: ${serverName}] ${tool.description || ""}`,
                    parameters: tool.inputSchema || { type: "object", properties: {} }
                }
            });
        }
    }
    return llmTools;
}

async function executeMcpToolCall(fullName, argsString) {
    let args = {};
    try {
        args = typeof argsString === "string" ? JSON.parse(argsString) : argsString;
    } catch (e) {
        console.error("Failed to parse tool call arguments:", argsString, e);
    }

    const separatorIndex = fullName.indexOf("__");
    if (separatorIndex === -1) {
        throw new Error(`Invalid tool name format: ${fullName}`);
    }
    const serverName = fullName.substring(0, separatorIndex);
    const toolName = fullName.substring(separatorIndex + 2);

    const srv = activeMcpServers.get(serverName);
    if (!srv) {
        throw new Error(`MCP Server '${serverName}' is not running`);
    }

    const result = await srv.callTool(toolName, args);
    return JSON.stringify(result);
}

async function initMcpServers() {
    const localPath = path.join(process.cwd(), "mcp_config.json");
    let configData = null;

    if (existsSync(localPath)) {
        try {
            configData = JSON.parse(readFileSync(localPath, "utf8"));
        } catch (e) {
            console.error("Failed to parse local mcp_config.json:", e);
        }
    } else {
        const globalPath = "c:\\Users\\savio\\.gemini\\antigravity-ide\\mcp_config.json";
        if (existsSync(globalPath)) {
            try {
                const content = readFileSync(globalPath, "utf8");
                writeFileSync(localPath, content, "utf8");
                configData = JSON.parse(content);
                console.log("Successfully imported MCP configuration from global IDE config.");
            } catch (e) {
                console.error("Failed to import global mcp_config.json:", e);
            }
        }
    }

    if (!configData) {
        configData = { mcpServers: {} };
        writeFileSync(localPath, JSON.stringify(configData, null, 2), "utf8");
    }

    const servers = configData.mcpServers || {};
    for (const [name, srvConfig] of Object.entries(servers)) {
        if (srvConfig.command || srvConfig.serverUrl) {
            const instance = new McpServerInstance(name, srvConfig);
            activeMcpServers.set(name, instance);
            instance.start().catch(err => {
                console.error(`Failed to start MCP server ${name}:`, err);
            });
        }
    }
}

function createRazorpayOrder(amountPaise, receipt, notes) {
    return new Promise((resolve, reject) => {
        const keyId = process.env.RAZORPAY_KEY_ID || "";
        const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
        if (!keyId || !keySecret) {
            return reject(new Error("Razorpay credentials missing on server."));
        }
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const payload = JSON.stringify({
            amount: amountPaise,
            currency: "INR",
            receipt: receipt,
            notes: notes || {}
        });

        const req = https.request("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload)
            }
        }, (res) => {
            let body = "";
            res.on("data", (chunk) => body += chunk);
            res.on("end", () => {
                try {
                    const data = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300 && data.id) {
                        resolve(data);
                    } else {
                        reject(new Error(data.error?.description || data.message || `Razorpay API error (${res.statusCode})`));
                    }
                } catch (e) {
                    reject(new Error("Failed to parse Razorpay order response"));
                }
            });
        });

        req.on("error", (err) => reject(err));
        req.write(payload);
        req.end();
    });
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    if (!keySecret) return false;
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
    return expectedSignature === signature;
}

function createRazorpaySubscription(planId, customerNotes = {}) {
    return new Promise((resolve, reject) => {
        const keyId = process.env.RAZORPAY_KEY_ID || "";
        const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
        if (!keyId || !keySecret) {
            return reject(new Error("Razorpay credentials missing on server."));
        }
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const payload = JSON.stringify({
            plan_id: planId,
            total_count: 120,
            quantity: 1,
            customer_notify: 1,
            notes: customerNotes
        });

        const req = https.request("https://api.razorpay.com/v1/subscriptions", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload)
            }
        }, (res) => {
            let body = "";
            res.on("data", (chunk) => body += chunk);
            res.on("end", () => {
                try {
                    const data = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300 && data.id) {
                        resolve(data);
                    } else {
                        reject(new Error(data.error?.description || data.message || `Razorpay API error (${res.statusCode})`));
                    }
                } catch (e) {
                    reject(new Error("Failed to parse Razorpay subscription response"));
                }
            });
        });

        req.on("error", (err) => reject(err));
        req.write(payload);
        req.end();
    });
}

function verifyRazorpaySubscriptionSignature(subscriptionId, paymentId, signature) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    if (!keySecret) return false;
    const body = `${paymentId}|${subscriptionId}`;
    const expectedSignature = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
    return expectedSignature === signature;
}