import http from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
    { id: "ollama", name: "Ollama Local", maker: "Local Llama/DeepSeek" }
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
    ollama: {
        keyEnv: "OLLAMA_API_BASE",
        modelEnv: "OLLAMA_MODEL",
        defaultModel: "llama3"
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
    ollama: "Running locally with Ollama allows for completely private and free computation. Ensure you have started Ollama locally and run a model like llama3.2 to switch this from demo mode to live local execution."
};

const server = http.createServer(async (request, response) => {
    try {
        const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

        if (requestUrl.pathname.startsWith("/api/")) {
            await handleApi(request, response, requestUrl);
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
});

function getPlanLimit(plan) {
    if (plan === "pro") return 2000;
    if (plan === "studio") return 10000;
    return 20;
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
        await checkOllamaStatus();
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

    if (request.method === "GET" && requestUrl.pathname === "/api/user") {
        const userId = requestUrl.searchParams.get("userId");
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
                    .insert([{ user_id: userId, plan: "free", messages_used: 0 }])
                    .select()
                    .single();

                if (insertError) throw insertError;
                user = newUser;
            } else if (error) {
                throw error;
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

        if (paypalOrderId) {
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
            sendJson(response, 200, { ok: true, user });
        } catch (err) {
            sendJson(response, 500, { ok: false, error: err.message });
        }
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/messages") {
        const userId = requestUrl.searchParams.get("userId");
        if (!userId) {
            sendJson(response, 400, { ok: false, error: "userId is required." });
            return;
        }

        if (!supabase) {
            sendJson(response, 200, { ok: true, messages: [] });
            return;
        }

        try {
            const { data: messages, error } = await supabase
                .from("wondrilla_messages")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: true });

            if (error) throw error;
            sendJson(response, 200, { ok: true, messages });
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
                await supabase.from("wondrilla_messages").insert([{
                    user_id: userId,
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

async function answerWithProvider(providerId, prompt, body, requestedModel = providerId) {
    const catalogItem = modelCatalog.find((model) => model.id === providerId) || modelCatalog[0];
    const config = providerConfig[providerId];

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
        const text = await callProvider(providerId, augmentedPrompt);

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
    const lines = [
        "You are Wondrilla, a helpful multi-model AI workspace.",
        "Give a clear, useful answer. Be concise unless the user asks for detail."
    ];

    if (body.web) {
        lines.push("The user enabled web research. If live search context is not provided, say that a search connector is needed before making current claims.");
    }

    if (body.file && body.file.name) {
        lines.push(`Attached file metadata: ${body.file.name}, ${body.file.size || "unknown size"}, ${body.file.type || "unknown type"}. If file contents are not included, explain that file text extraction must be connected for a true file analysis.`);
    }

    lines.push("");
    lines.push("User prompt:");
    lines.push(prompt);
    return lines.join("\n");
}

async function callProvider(providerId, prompt) {
    const config = providerConfig[providerId];
    if (providerId !== "meta" && providerId !== "ollama" && (!config || !process.env[config.keyEnv]) && process.env.OPENROUTER_API_KEY) {
        return callOpenRouterFallback(providerId, prompt);
    }

    if (providerId === "chatgpt") {
        return callOpenAiResponses(prompt);
    }

    if (providerId === "claude") {
        return callAnthropic(prompt);
    }

    if (providerId === "grok") {
        return callOpenAiCompatible({
            url: "https://api.x.ai/v1/chat/completions",
            key: process.env.XAI_API_KEY,
            model: getProviderModel("grok"),
            prompt
        });
    }

    if (providerId === "meta") {
        return callOpenAiCompatible({
            url: "https://openrouter.ai/api/v1/chat/completions",
            key: process.env.OPENROUTER_API_KEY,
            model: getProviderModel("meta"),
            prompt,
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
            prompt
        });
    }

    if (providerId === "zai") {
        return callOpenAiCompatible({
            url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
            key: process.env.ZAI_API_KEY,
            model: getProviderModel("zai"),
            prompt
        });
    }

    if (providerId === "deepseek") {
        return callOpenAiCompatible({
            url: "https://api.deepseek.com/chat/completions",
            key: process.env.DEEPSEEK_API_KEY,
            model: getProviderModel("deepseek"),
            prompt
        });
    }

    if (providerId === "ollama") {
        const baseUrl = process.env.OLLAMA_API_BASE || "http://localhost:11434";
        return callOpenAiCompatible({
            url: `${baseUrl}/v1/chat/completions`,
            key: "ollama",
            model: getProviderModel("ollama"),
            prompt
        });
    }

    throw new Error(`Unsupported provider: ${providerId}`);
}

async function callOpenRouterFallback(providerId, prompt) {
    const modelMap = {
        chatgpt: "openai/gpt-4o-mini",
        claude: "anthropic/claude-3.5-haiku",
        grok: "x-ai/grok-2-1212",
        kimi: "moonshotai/moonshot-v1-8k",
        zai: "zhipu/glm-4-9b-chat",
        deepseek: "deepseek/deepseek-chat"
    };

    const openRouterModel = modelMap[providerId] || "meta-llama/llama-3.2-3b-instruct:free";

    return callOpenAiCompatible({
        url: "https://openrouter.ai/api/v1/chat/completions",
        key: process.env.OPENROUTER_API_KEY,
        model: openRouterModel,
        prompt,
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

async function callAnthropic(prompt) {
    const data = await postJson("https://api.anthropic.com/v1/messages", {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
    }, {
        model: getProviderModel("claude"),
        max_tokens: 900,
        messages: [{ role: "user", content: prompt }]
    });

    const text = (Array.isArray(data.content) ? data.content : [])
        .map((part) => part.text || "")
        .filter(Boolean)
        .join("\n")
        .trim();

    if (!text) {
        throw new Error("Anthropic response did not include text.");
    }

    return text;
}

async function callOpenAiCompatible({ url, key, model, prompt, headers = {} }) {
    const data = await postJson(url, {
        Authorization: `Bearer ${key}`,
        ...headers
    }, {
        model,
        messages: [
            { role: "system", content: "You are Wondrilla, a concise and useful AI assistant." },
            { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 900
    });

    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
        throw new Error("Provider response did not include text.");
    }

    return text;
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
        return prefer(["deepseek", "zai", "chatgpt"]);
    }

    if (/\b(write|rewrite|story|brand|copy|tone|email|script)\b/.test(lower)) {
        return prefer(["claude", "chatgpt", "kimi"]);
    }

    if (/[\u3400-\u9fff]/.test(prompt) || /\b(long context|research|summarize|document)\b/.test(lower)) {
        return prefer(["kimi", "zai", "claude"]);
    }

    return configuredProviderIds()[0] || "zai";
}

function demoResponse(providerId, body, note) {
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
    if (providerId === "ollama") {
        return ollamaOnline;
    }
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

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        ...corsHeaders(),
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
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
    
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
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
    
    const orderRes = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
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