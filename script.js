import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

(function () {
    "use strict";

    const models = [
        { id: "auto", name: "Wondrilla Auto", maker: "Smart routing", mark: "W", color: "#1f211d", text: "#d9ff43", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="m12 3-1.912 5.886L4.2 9l5.886 1.912L12 16.8l1.912-5.886L19.8 9l-5.886-1.912z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/></svg>` },
        { id: "chatgpt", name: "ChatGPT", maker: "OpenAI", mark: "O", color: "#1c1e19", text: "#10a37f", svg: `<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><path d="M21.3,10.2A5.5,5.5,0,0,0,17.7,4.9a5.6,5.6,0,0,0-5.8,1.4A5.5,5.5,0,0,0,6.8,4.9,5.6,5.6,0,0,0,2.7,10.2a5.5,5.5,0,0,0,3.6,5.3,5.6,5.6,0,0,0,5.8-1.4,5.5,5.5,0,0,0,5.1,1.4,5.6,5.6,0,0,0,4.1-5.3ZM12.7,6.8a3.8,3.8,0,0,1,2,.6v4.6L10.7,9.3V7.2A3.8,3.8,0,0,1,12.7,6.8ZM6.2,9.3a3.8,3.8,0,0,1,2-2.7l4,2.3L8.2,11.2,4.2,8.9A3.8,3.8,0,0,1,6.2,9.3ZM4.5,13.7a3.8,3.8,0,0,1-.5-2.1,3.8,3.8,0,0,1,.8-2.3L8.8,11.6v4.6ZM11.3,17.2a3.8,3.8,0,0,1-2-.6v-4.6l4,2.3v2.3A3.8,3.8,0,0,1,11.3,17.2Zm6.5-2.5a3.8,3.8,0,0,1-2,2.7l-4-2.3,4-2.3,4,2.3A3.8,3.8,0,0,1,17.8,14.7Zm1.7-4.4a3.8,3.8,0,0,1,.5,2.1,3.8,3.8,0,0,1-.8,2.3l-4-2.3V7.8Z"/></svg>` },
        { id: "claude", name: "Claude", maker: "Anthropic", mark: "A", color: "#1c1e19", text: "#cc785c", svg: `<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>` },
        { id: "grok", name: "Grok", maker: "xAI", mark: "X", color: "#1c1e19", text: "#ffffff", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;"><line x1="4" y1="20" x2="20" y2="4"/><line x1="14" y1="20" x2="20" y2="14"/><line x1="4" y1="10" x2="10" y2="4"/></svg>` },
        { id: "meta", name: "Meta AI", maker: "Meta via OpenRouter", mark: "M", color: "#1c1e19", text: "#0081fb", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"/></svg>` },
        { id: "kimi", name: "Kimi", maker: "Moonshot AI", mark: "K", color: "#1c1e19", text: "#e63e32", svg: `<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm4-8a4 4 0 1 1-4-4 4 4 0 0 1 4 4z"/></svg>` },
        { id: "zai", name: "Z.ai", maker: "Zhipu AI", mark: "Z", color: "#1c1e19", text: "#3a8bfd", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>` },
        { id: "deepseek", name: "DeepSeek", maker: "DeepSeek", mark: "D", color: "#1c1e19", text: "#0050fe", svg: `<svg viewBox="0 0 63.1196 46.4033" fill="currentColor" style="width:16px;height:16px;"><path d="M62.4575 3.89441C61.7888 3.56726 61.501 4.1908 61.1101 4.50769C60.9763 4.60999 60.863 4.7428 60.75 4.86548C59.7727 5.9082 58.6311 6.59302 57.1394 6.51123C54.9587 6.38855 53.0969 7.07349 51.4512 8.73975C51.1013 6.68506 49.939 5.45837 48.1699 4.67126C47.2441 4.26233 46.3081 3.85352 45.6599 2.96411C45.2073 2.33032 45.084 1.625 44.8577 0.929932C44.7136 0.510864 44.5696 0.081543 44.0862 0.0098877C43.5615 -0.0718994 43.3557 0.367676 43.1501 0.735718C42.3271 2.2384 42.0083 3.89441 42.0391 5.5708C42.1111 9.34277 43.7056 12.3481 46.8738 14.4846C47.2336 14.73 47.3264 14.9753 47.2131 15.333C46.9971 16.0691 46.74 16.7847 46.5137 17.5206C46.3696 17.9908 46.1538 18.093 45.6497 17.8887C43.9114 17.1628 42.4094 16.0895 41.0825 14.7913C38.8298 12.6139 36.7932 10.2117 34.2524 8.33081C33.6558 7.89124 33.0593 7.48242 32.4421 7.09399C29.8499 4.57922 32.7815 2.5144 33.4604 2.26904C34.1702 2.01343 33.7073 1.1344 31.4133 1.14465C29.1196 1.15479 27.0212 1.92151 24.3467 2.94373C23.9558 3.09705 23.5444 3.20947 23.1226 3.30151C20.6951 2.84143 18.1748 2.73926 15.5415 3.03577C10.5835 3.58777 6.62329 5.92859 3.7124 9.92554C0.215088 14.73 -0.60791 20.1886 0.400146 25.8824C1.45972 31.8828 4.5249 36.8508 9.23608 40.7354C14.1221 44.7629 19.7488 46.7357 26.1675 46.3575C30.0659 46.1327 34.4067 45.6113 39.303 41.4713C40.5374 42.0847 41.8335 42.33 43.9834 42.514C45.6394 42.6674 47.2336 42.4323 48.468 42.1766C50.4019 41.7678 50.2683 39.9789 49.5688 39.6517C43.9009 37.0144 45.1455 38.0878 44.0142 37.2189C46.8943 33.8148 51.2351 30.278 52.9324 18.8188C53.0662 17.9091 52.9529 17.3367 52.9324 16.6006C52.9221 16.1509 53.0249 15.9771 53.5393 15.9259C54.9587 15.7625 56.3372 15.3739 57.6023 14.6788C61.2747 12.6753 62.7559 9.38367 63.1055 5.43799C63.157 4.83484 63.0952 4.2113 62.4575 3.89441ZM30.4568 39.4065C24.9639 35.0927 22.2998 33.6718 21.199 33.7332C20.1704 33.7944 20.3557 34.97 20.5818 35.7367C20.8186 36.493 21.1272 37.0144 21.5591 37.6788C21.8574 38.1184 22.0632 38.7727 21.2607 39.2633C19.4915 40.3571 16.416 38.8953 16.272 38.8237C12.6924 36.718 9.69897 33.9375 7.59033 30.1349C5.55347 26.4753 4.37061 22.5499 4.17529 18.3589C4.12378 17.3468 4.42212 16.989 5.43018 16.8051C6.75708 16.5597 8.12524 16.5087 9.45215 16.7029C15.0581 17.5206 19.8311 20.025 23.8323 23.9913C26.116 26.2504 27.844 28.9491 29.6235 31.5864C31.5164 34.3873 33.553 37.0553 36.145 39.2429C37.0605 40.0095 37.791 40.5922 38.4905 41.0215C36.3816 41.2567 32.8638 41.3077 30.4568 39.4065ZM33.0901 22.4886C33.0901 22.0388 33.4502 21.681 33.9026 21.681C34.0056 21.681 34.0981 21.7015 34.1804 21.7322C34.2935 21.7731 34.3965 21.8344 34.4788 21.9264C34.6228 22.0695 34.7051 22.2739 34.7051 22.4886C34.7051 22.9384 34.345 23.2961 33.8923 23.2961C33.4397 23.2961 33.0901 22.9384 33.0901 22.4886ZM41.2676 26.6798C40.7432 26.8944 40.2185 27.0784 39.7144 27.0989C38.9326 27.1398 38.0789 26.8229 37.616 26.4344C36.896 25.8313 36.3816 25.494 36.1658 24.441C36.073 23.9913 36.1245 23.2961 36.2068 22.8975C36.3921 22.0388 36.1863 21.4868 35.5793 20.986C35.0857 20.577 34.4583 20.4646 33.769 20.4646C33.5117 20.4646 33.2751 20.3522 33.1003 20.2601C32.8123 20.1171 32.5757 19.7593 32.802 19.3197C32.874 19.1766 33.2239 18.8291 33.3062 18.7677C34.2422 18.2362 35.3223 18.4099 36.3201 18.8086C37.2458 19.1869 37.9453 19.882 38.9534 20.8633C39.9819 22.0491 40.167 22.3762 40.7534 23.2655C41.2163 23.9607 41.6379 24.6761 41.926 25.494C42.1008 26.0051 41.8745 26.4242 41.2676 26.6798Z"/></svg>` },
        { id: "ollama", name: "Ollama Local", maker: "Local Llama/DeepSeek", mark: "🦙", color: "#1c1e19", text: "#ffffff", svg: `<svg viewBox="0 0 48 48" fill="currentColor" style="width:16px;height:16px;"><path d="M25.2 14.9c2.7-1.5 6.4-2 9.7 0 .7-8.8 9.7-11 8.4 4.6 5 3.8 4.1 10.8 2.2 13 2.2 4.1 1.6 8-.2 11.3a13 13 0 0 1 .9 7.1c-.3 1.6-2.7 1.2-2.6-.4.3-2 0-4.1-1-6.2-.2-.4-.2-1 .1-1.3 1-1.5 3-5.4 0-10-.4-.6-.2-1.4.4-1.8.8-.5 1.9-3 1-6.2-1.3-4.2-5-4.7-7-4.5-.6 0-1-.3-1.3-.8-2.6-5.6-10.2-3.8-11.6-.1-.2.5-.7.8-1.2.8-2.5 0-6 .7-7.1 4.6-.8 3 .3 5.7 1 6.3.5.4.6 1 .3 1.6-.8 1.2-2.8 6.2.1 9.9.3.5.4 1 .2 1.5-1.2 2.4-1.5 4.5-1.1 6 .3 1.7-2.2 2.3-2.6.7a12 12 0 0 1 1-7.1c-3.1-4.8-.9-10.2-.3-11.5-2.1-3-2.4-9.7 2.3-13-1.3-15.3 7.6-13.6 8.4-4.5M30 26.4c4 0 7 2.8 7 5.6 0 7-14.1 6.6-14.1 0 0-2.8 3.2-5.6 7.1-5.6M24.8 32c0 4.4 10.3 4.5 10.3 0 0-1.8-2-3.8-5-3.8-2.9 0-5.3 2-5.3 3.8zm6.5-.4-.6.4v1c0 1-1.5 1-1.5 0v-1l-.6-.4c-.6-.6.3-1.7 1-1.1l.4.3.4-.3c.8-.5 1.7.5.9 1.1zm-10.4-21c-2 .9-1.6 6.9-1.5 7.7.9-.3 1.8-.4 2.8-.5 1-1.9 0-6.4-1.3-7.2zm16.9 7.3c1 0 2 .1 3 .4 0-.9.5-7-1.5-7.7-1.2.3-2.5 5.7-1.5 7.3zm2.7 10.5c0 2.4-3.6 2.4-3.6 0s3.6-2.4 3.6 0zm-17.5 0c0 2.4-3.6 2.4-3.6 0s3.6-2.4 3.6 0z"/></svg>` }
    ];

    const demoAnswers = {
        auto: "Here is a focused way forward: define the outcome first, reduce the work to three decisions, and build the smallest version that proves the idea. I can turn this into a concrete plan, draft, or checklist next.",
        chatgpt: "I would structure this as a practical sequence: clarify the goal, identify the audience, create a first version, then test it against measurable feedback. The key is making each step small enough to complete quickly.",
        claude: "A useful starting point is to separate what must be true from what would merely be nice. Once those are clear, we can shape an approach that is thoughtful, realistic, and easy for another person to understand.",
        grok: "Cut through the noise: pick the one result that matters, ship a rough but real version, and let actual users tell you what is wrong. Elegant theories are cheap. Evidence is the useful part.",
        meta: "We can approach this collaboratively by mapping the people involved, the experience you want them to have, and the content or tools needed at each moment. That creates a clear path from idea to useful product.",
        kimi: "I would begin with a broad context scan, then synthesize the strongest patterns into a concise framework. From there, we can expand any point with deeper research, examples, and a step-by-step execution plan.",
        zai: "The task can be decomposed into objective, constraints, resources, and validation. A strong solution optimizes across all four rather than maximizing only speed or quality in isolation.",
        deepseek: "A technically sound approach is to define interfaces before implementation, isolate the highest-risk assumption, and test that assumption first. This reduces rework and gives the rest of the build a stable foundation.",
        ollama: "Running locally with Ollama allows for completely private and free computation. Ensure you have started Ollama locally and run a model like llama3.2 to switch this from demo mode to live local execution."
    };

    const state = {
        userId: null,
        selectedModel: "auto",
        compare: false,
        web: false,
        used: Number.parseInt(localStorage.getItem("wondrilla_used") || "7", 10),
        plan: localStorage.getItem("wondrilla_plan") || "free",
        billing: "monthly",
        attachedFile: null,
        gatewayOnline: false,
        providerStatus: new Map(),
        history: [],
        compareModels: ["claude", "chatgpt", "deepseek"]
    };

    let supabaseClient = null;
    let authMode = "signin";
    let loggedInUser = null;

    const elements = {
        sidebar: document.getElementById("sidebar"),
        menuBtn: document.getElementById("menu-btn"),
        sidebarClose: document.getElementById("sidebar-close"),
        scrim: document.getElementById("scrim"),
        modelList: document.getElementById("model-list"),
        modalModelGrid: document.getElementById("modal-model-grid"),
        modelPicker: document.getElementById("model-picker"),
        modelModal: document.getElementById("model-modal"),
        pricingModal: document.getElementById("pricing-modal"),
        selectedModelName: document.getElementById("selected-model-name"),
        selectedModelAvatar: document.getElementById("selected-model-avatar"),
        historyList: document.getElementById("history-list"),
        welcomeState: document.getElementById("welcome-state"),
        messages: document.getElementById("messages"),
        conversation: document.getElementById("conversation"),
        composer: document.getElementById("composer"),
        promptInput: document.getElementById("prompt-input"),
        compareToggle: document.getElementById("compare-toggle"),
        webToggle: document.getElementById("web-toggle"),
        sendBtn: document.getElementById("send-btn"),
        chatView: document.getElementById("chat-view"),
        libraryView: document.getElementById("library-view"),
        usageProgress: document.getElementById("usage-progress"),
        usedMessages: document.getElementById("used-messages"),
        usagePercent: document.getElementById("usage-percent"),
        toast: document.getElementById("toast"),
        checkoutModal: document.getElementById("checkout-modal"),
        checkoutForm: document.getElementById("checkout-form"),
        checkoutPlanName: document.getElementById("checkout-plan-name"),
        checkoutSummaryPlan: document.getElementById("checkout-summary-plan"),
        checkoutPriceBtn: document.getElementById("checkout-price-btn"),
        checkoutSuccessState: document.getElementById("checkout-success-state"),
        successPlanName: document.getElementById("success-plan-name"),
        checkoutSuccessCloseBtn: document.getElementById("checkout-success-close-btn"),
        filePreviewContainer: document.getElementById("file-preview-container"),
        fileInput: document.getElementById("composer-file-input"),
        attachBtn: document.getElementById("attach-btn"),
        runtimePill: document.getElementById("runtime-pill"),
        liveIndicator: document.querySelector(".live-indicator"),
        authModal: document.getElementById("auth-modal"),
        authForm: document.getElementById("auth-form"),
        authNameGroup: document.getElementById("auth-name-group"),
        authName: document.getElementById("auth-name"),
        authEmail: document.getElementById("auth-email"),
        authPassword: document.getElementById("auth-password"),
        authSubmitBtn: document.getElementById("auth-submit-btn"),
        authSubmitText: document.getElementById("auth-submit-text"),
        authToggleBtn: document.getElementById("auth-toggle-btn"),
        authToggleText: document.getElementById("auth-toggle-text"),
        authClose: document.getElementById("auth-modal-close"),
        profileRow: document.querySelector(".profile-row"),
        profileModal: document.getElementById("profile-modal"),
        profileEmail: document.getElementById("profile-email"),
        profileName: document.getElementById("profile-name"),
        profilePlan: document.getElementById("profile-plan"),
        profileUsed: document.getElementById("profile-used"),
        profileClose: document.getElementById("profile-modal-close"),
        logoutBtn: document.getElementById("logout-btn"),
        oauthGoogleBtn: document.getElementById("oauth-google-btn"),
        oauthGithubBtn: document.getElementById("oauth-github-btn"),
        authPasswordToggle: document.getElementById("auth-password-toggle")
    };
    function modelById(id) {
        return models.find((model) => model.id === id) || models[0];
    }

    function avatarStyle(model) {
        return `background:${model.color};color:${model.text}`;
    }

    function modelStatus(id) {
        return state.providerStatus.get(id);
    }

    function isModelLive(id) {
        if (id === "auto") {
            return Array.from(state.providerStatus.values()).some((provider) => provider.configured);
        }

        return Boolean(modelStatus(id)?.configured);
    }

    function renderModels() {
        elements.modelList.innerHTML = models.map((model) => {
            const configured = isModelLive(model.id);
            const statusLabel = configured ? "Live API ready" : "Demo fallback";
            const detail = model.id === "auto"
                ? (configured ? "Routes to configured APIs" : "Routes to demo answers")
                : `${model.maker} - ${statusLabel}`;

            let activeClass = "";
            let badgeHtml = "";
            if (state.compare) {
                if (model.id === "auto") {
                    activeClass = "disabled";
                } else if (state.compareModels.includes(model.id)) {
                    activeClass = "active comparing";
                    const idx = state.compareModels.indexOf(model.id) + 1;
                    badgeHtml = `<span class="compare-badge">${idx}</span>`;
                }
            } else {
                activeClass = model.id === state.selectedModel ? "active" : "";
            }

            return `
                <button class="model-row ${activeClass}" type="button" data-model="${model.id}" ${model.id === "auto" && state.compare ? "disabled" : ""}>
                    <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="position: relative; ${avatarStyle(model)}">
                        ${model.svg || model.mark}
                        ${badgeHtml}
                    </span>
                    <span class="model-copy">
                        <strong>${model.name}</strong>
                        <small>${escapeHtml(detail)}</small>
                    </span>
                    <span class="model-status ${configured ? "live" : "demo"}" title="${statusLabel}"></span>
                </button>
            `;
        }).join("");

        elements.modalModelGrid.innerHTML = models.map((model) => {
            const configured = isModelLive(model.id);
            const provider = modelStatus(model.id);
            const detail = model.id === "auto"
                ? "Automatically route every prompt"
                : `${model.maker} - ${configured ? provider?.model || "configured" : "add API key for live mode"}`;

            let activeClass = "";
            let badgeHtml = "";
            if (state.compare) {
                if (model.id === "auto") {
                    activeClass = "disabled";
                } else if (state.compareModels.includes(model.id)) {
                    activeClass = "active comparing";
                    const idx = state.compareModels.indexOf(model.id) + 1;
                    badgeHtml = `<span class="compare-badge">${idx}</span>`;
                }
            } else {
                activeClass = model.id === state.selectedModel ? "active" : "";
            }

            return `
                <button class="modal-model-option ${activeClass}" type="button" data-model="${model.id}" ${model.id === "auto" && state.compare ? "disabled" : ""}>
                    <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="position: relative; ${avatarStyle(model)}">
                        ${model.svg || model.mark}
                        ${badgeHtml}
                    </span>
                    <span>
                        <strong>${model.name}</strong>
                        <small>${escapeHtml(detail)}</small>
                    </span>
                </button>
            `;
        }).join("");

        document.querySelectorAll("[data-model]").forEach((button) => {
            button.addEventListener("click", () => selectModel(button.dataset.model));
        });
    }

    function renderHistory() {
        const historyBlock = document.querySelector(".history-block");
        if (historyBlock) {
            historyBlock.classList.toggle("hidden", state.history.length === 0);
        }
        elements.historyList.innerHTML = state.history.map((item, index) => `
            <button class="history-item ${index === 0 ? "active" : ""}" type="button">${escapeHtml(item)}</button>
        `).join("");
    }

    function selectModel(id) {
        if (state.compare) {
            if (id === "auto") {
                showToast("Wondrilla Auto cannot be used in Comparison mode");
                return;
            }
            if (state.compareModels.includes(id)) {
                if (state.compareModels.length <= 1) {
                    showToast("Select at least one model to compare");
                    return;
                }
                state.compareModels = state.compareModels.filter((m) => m !== id);
            } else {
                if (state.compareModels.length >= 3) {
                    state.compareModels.shift();
                }
                state.compareModels.push(id);
            }
            renderModels();
            showToast(`Comparing: ${state.compareModels.map((m) => modelById(m).name).join(", ")}`);
        } else {
            state.selectedModel = id;
            const model = modelById(id);
            elements.selectedModelName.textContent = model.name;
            elements.selectedModelAvatar.innerHTML = model.svg || model.mark;
            elements.selectedModelAvatar.className = `model-avatar selected-model-avatar ${id === "auto" ? "auto" : ""}`;
            elements.selectedModelAvatar.style.cssText = avatarStyle(model);
            elements.promptInput.placeholder = `Message ${model.name}...`;
            renderModels();
            closeModals();
            showToast(`${model.name} selected`);
        }
    }

    function updateUsage() {
        const limit = planLimit();
        const percent = Math.min(100, Math.round((state.used / limit) * 100));
        const usedMessagesStrong = document.querySelector(".usage-card strong");

        if (usedMessagesStrong) {
            usedMessagesStrong.innerHTML = `<span id="used-messages">${state.used}</span> of ${limit.toLocaleString()} messages`;
        }

        elements.usedMessages = document.getElementById("used-messages");
        elements.usagePercent.textContent = `${percent}%`;
        elements.usageProgress.style.width = `${percent}%`;
        localStorage.setItem("wondrilla_used", state.used);
    }

    function planLimit() {
        if (state.plan === "pro") return 2000;
        if (state.plan === "studio") return 10000;
        return 20;
    }

    function updatePlanUI() {
        const planCapitalized = state.plan.charAt(0).toUpperCase() + state.plan.slice(1);
        const usageCardKicker = document.querySelector(".usage-card .eyebrow");
        const upgradeSidebar = document.getElementById("upgrade-sidebar");
        const upgradeTop = document.getElementById("upgrade-top");

        if (usageCardKicker) {
            usageCardKicker.textContent = `${planCapitalized} plan`;
        }

        if (upgradeSidebar) {
            upgradeSidebar.textContent = state.plan === "free" ? "Unlock every model ->" : "Manage subscription";
        }

        if (upgradeTop) {
            if (state.plan === "free") {
                upgradeTop.textContent = "Upgrade";
                upgradeTop.className = "primary-btn compact";
                upgradeTop.style.cssText = "";
            } else {
                upgradeTop.textContent = `${planCapitalized} Active`;
                upgradeTop.className = "ghost-btn compact";
                upgradeTop.style.background = "var(--acid)";
                upgradeTop.style.color = "var(--ink)";
                upgradeTop.style.borderColor = "var(--acid-deep)";
            }
        }
    }

    async function loadRuntimeStatus() {
        try {
            const [health, modelsResponse] = await Promise.all([
                fetchJson("/api/health"),
                fetchJson("/api/models")
            ]);

            state.gatewayOnline = Boolean(health.ok);
            state.providerStatus = new Map((modelsResponse.models || []).map((provider) => [provider.id, provider]));
            updateRuntimePill(health);
            renderModels();
        } catch {
            state.gatewayOnline = false;
            state.providerStatus = new Map();
            updateRuntimePill({ mode: "browser-demo", configuredProviders: [] });
            renderModels();
        }
    }

    function updateRuntimePill(health) {
        const configuredCount = health.configuredProviders?.length || 0;
        const liveReady = configuredCount > 0;

        if (elements.runtimePill) {
            elements.runtimePill.classList.toggle("live", liveReady);
            elements.runtimePill.classList.toggle("demo", !liveReady);
            elements.runtimePill.innerHTML = `<span></span> ${liveReady ? "Live" : "Demo gateway"}`;
        }

        if (elements.liveIndicator) {
            elements.liveIndicator.classList.toggle("live", liveReady);
            elements.liveIndicator.classList.toggle("demo", !liveReady);
            elements.liveIndicator.innerHTML = `<i></i> ${liveReady ? "Live" : "Demo ready"}`;
        }
    }

    function updateModeButton(button, active) {
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    }

    function openModal(modal) {
        closeModals();
        elements.scrim.classList.remove("hidden");
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }

    function closeModals() {
        elements.scrim.classList.add("hidden");
        elements.modelModal.classList.add("hidden");
        elements.pricingModal.classList.add("hidden");
        elements.checkoutModal.classList.add("hidden");
        if (elements.authModal) elements.authModal.classList.add("hidden");
        if (elements.profileModal) elements.profileModal.classList.add("hidden");
        document.body.style.overflow = "";
    }

    function toggleSidebar(open) {
        elements.sidebar.classList.toggle("open", open);
        elements.scrim.classList.toggle("hidden", !open);
    }

    function setView(view) {
        if (view === "compare" && state.plan === "free") {
            showToast("Comparison mode requires a Pro or Studio subscription");
            openModal(elements.pricingModal);
            return;
        }

        document.querySelectorAll(".nav-item").forEach((item) => {
            item.classList.toggle("active", item.dataset.view === view || (view === "chat" && item.dataset.view === "chat"));
        });

        if (view === "library") {
            elements.chatView.classList.add("hidden");
            elements.libraryView.classList.remove("hidden");
        } else {
            elements.libraryView.classList.add("hidden");
            elements.chatView.classList.remove("hidden");
            state.compare = view === "compare";
            updateModeButton(elements.compareToggle, state.compare);
            renderModels();
            if (state.compare) {
                showToast("Compare mode: select up to 3 models in the dock to compare");
            }
        }
        toggleSidebar(false);
    }

    function resetConversation() {
        elements.messages.innerHTML = "";
        elements.welcomeState.classList.remove("hidden");
        elements.promptInput.value = "";
        autoResize();
        setView("chat");
        elements.promptInput.focus();
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function formatText(value) {
        let text = escapeHtml(value);
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
        return text.replace(/\n/g, "<br>");
    }
    function addUserMessage(text, file) {
        const wrapper = document.createElement("div");
        wrapper.className = "message user";
        let fileHtml = "";

        if (file) {
            if (file.type.startsWith("image/")) {
                fileHtml = `<img src="${file.dataUrl}" class="chat-attachment-image" alt="${escapeHtml(file.name)}">`;
            } else {
                fileHtml = `
                    <div class="chat-attachment-card">
                        <span class="chat-attachment-icon">File</span>
                        <div class="chat-attachment-info">
                            <span class="chat-attachment-name">${escapeHtml(file.name)}</span>
                            <span class="chat-attachment-size">${escapeHtml(file.size)}</span>
                        </div>
                    </div>
                `;
            }
        }

        wrapper.innerHTML = `
            <div class="message-bubble">
                <div>${formatText(text)}</div>
                ${fileHtml}
            </div>
        `;
        elements.messages.appendChild(wrapper);
    }

    function addTypingMessage(model) {
        const wrapper = document.createElement("div");
        wrapper.className = "message assistant";
        let thinkingLabel = "thinking";
        let searchStepsHtml = "";

        if (state.web) {
            thinkingLabel = "preparing search context";
            searchStepsHtml = `
                <div class="search-animation-step" id="search-step-1">Checking the web-research connector...</div>
                <div class="search-animation-step hidden" id="search-step-2">A server search API is required for live citations.</div>
            `;
        }

        wrapper.innerHTML = `
            <div class="message-bubble">
                <div class="message-meta">
                    <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="${avatarStyle(model)}">${model.svg || model.mark}</span>
                    <strong>${model.name}</strong>
                    <span>${thinkingLabel}</span>
                </div>
                <span class="typing-dots"><span></span><span></span><span></span></span>
                ${searchStepsHtml}
            </div>
        `;
        elements.messages.appendChild(wrapper);

        if (state.web) {
            setTimeout(() => {
                const step2 = wrapper.querySelector("#search-step-2");
                if (step2) step2.classList.remove("hidden");
            }, 550);
        }

        return wrapper;
    }

    function addAssistantMessage(model, text, typingNode, result) {
        const status = result?.mode === "live" ? "Live API" : (result?.provider ? "Demo gateway" : "Local demo");
        const statusClass = result?.mode === "live" ? "live" : "demo";
        let webCitationsHtml = "";

        if (state.web) {
            webCitationsHtml = `
                <div class="search-citations-header">Web mode</div>
                <div class="search-citations-grid">
                    <span class="citation-card">
                        <span class="citation-number">i</span>
                        <span>Connect Brave, Tavily, or Google Search on the backend for live citations.</span>
                    </span>
                </div>
            `;
        }

        typingNode.innerHTML = `
            <div class="message-bubble">
                <div class="message-meta">
                    <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="${avatarStyle(model)}">${model.svg || model.mark}</span>
                    <strong>${model.name}</strong>
                    <span class="response-status ${statusClass}">${status}</span>
                </div>
                <div>${formatText(text)}</div>
                ${webCitationsHtml}
            </div>
        `;
    }

    function addCompareAnswers(answers, file) {
        const selected = answers?.length
            ? answers
            : ["claude", "chatgpt", "deepseek"].map((id) => ({
                modelId: id,
                mode: "demo",
                provider: modelById(id).name,
                text: demoAnswers[id]
            }));

        const grid = document.createElement("div");
        grid.className = "compare-grid";
        grid.innerHTML = selected.map((answer) => {
            const model = modelById(answer.modelId);
            const statusClass = answer.mode === "live" ? "live" : "demo";
            const status = answer.mode === "live" ? "Live API" : "Demo gateway";
            const filePrefix = file ? `Reviewed file metadata: ${file.name}.\n\n` : "";

            return `
                <article class="compare-answer">
                    <div class="message-meta">
                        <span class="model-avatar" style="${avatarStyle(model)}">${model.svg || model.mark}</span>
                        <strong>${model.name}</strong>
                        <span class="response-status ${statusClass}">${status}</span>
                    </div>
                    <p>${formatText(`${filePrefix}${answer.text}`)}</p>
                </article>
            `;
        }).join("");
        elements.messages.appendChild(grid);
    }

    async function submitPrompt(text) {
        const cleanText = text.trim();
        if (!cleanText) return;

        const limit = planLimit();
        if (state.used >= limit) {
            showToast("Usage limit reached. Please upgrade your plan to continue.");
            openModal(elements.pricingModal);
            return;
        }

        const attachedFile = state.attachedFile;
        resetAttachedFile();

        elements.welcomeState.classList.add("hidden");
        addUserMessage(cleanText, attachedFile);
        elements.promptInput.value = "";
        autoResize();
        elements.sendBtn.disabled = true;

        if (!state.history.includes(cleanText)) {
            state.history.unshift(cleanText.length > 38 ? `${cleanText.slice(0, 38)}...` : cleanText);
            state.history = state.history.slice(0, 6);
            renderHistory();
        }

        state.used += state.compare ? 3 : 1;
        updateUsage();
        scrollToBottom();

        if (state.compare) {
            const typing = addTypingMessage(models[0]);

            try {
                const response = await gatewayChat({
                    userId: state.userId,
                    modelId: state.selectedModel,
                    prompt: cleanText,
                    compare: true,
                    compareModels: state.compareModels,
                    web: state.web,
                    file: publicFilePayload(attachedFile)
                });
                typing.remove();
                addCompareAnswers(response.answers, attachedFile);
                if (response.used !== undefined) {
                    state.used = response.used;
                    updateUsage();
                }
            } catch (error) {
                typing.remove();
                addCompareAnswers(localCompareAnswers(error), attachedFile);
            } finally {
                elements.sendBtn.disabled = false;
                scrollToBottom();
            }
            return;
        }

        const selectedModel = modelById(state.selectedModel);
        const typing = addTypingMessage(selectedModel);
        scrollToBottom();

        try {
            const response = await gatewayChat({
                userId: state.userId,
                modelId: state.selectedModel,
                prompt: cleanText,
                compare: false,
                web: state.web,
                file: publicFilePayload(attachedFile)
            });
            const responseModel = modelById(response.modelId || state.selectedModel);
            addAssistantMessage(responseModel, response.text, typing, response);
            if (response.used !== undefined) {
                state.used = response.used;
                updateUsage();
            }
        } catch (error) {
            const fallback = localSingleAnswer(state.selectedModel, attachedFile, error);
            addAssistantMessage(modelById(state.selectedModel), fallback.text, typing, fallback);
        } finally {
            elements.sendBtn.disabled = false;
            scrollToBottom();
        }
    }
    async function gatewayChat(payload) {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.ok) {
            throw new Error(data.error || "Gateway unavailable");
        }

        return data;
    }

    async function fetchJson(url) {
        const response = await fetch(url, { headers: { Accept: "application/json" } });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        return response.json();
    }

    function localSingleAnswer(modelId, file, error) {
        const model = modelById(modelId);
        const fileText = file
            ? `I received ${file.name} (${file.size}). True file analysis needs the backend file parser connected.\n\n`
            : "";

        return {
            mode: "demo",
            modelId: model.id,
            text: `${fileText}${demoAnswers[model.id] || demoAnswers.auto}\n\nLocal fallback note: ${error.message}`
        };
    }

    function localCompareAnswers(error) {
        return ["claude", "chatgpt", "deepseek"].map((id) => ({
            modelId: id,
            mode: "demo",
            provider: modelById(id).name,
            text: `${demoAnswers[id]}\n\nLocal fallback note: ${error.message}`
        }));
    }

    function publicFilePayload(file) {
        if (!file) return null;

        return {
            name: file.name,
            size: file.size,
            type: file.type
        };
    }

    function resetAttachedFile() {
        if (elements.fileInput) elements.fileInput.value = "";
        if (elements.filePreviewContainer) {
            elements.filePreviewContainer.innerHTML = "";
            elements.filePreviewContainer.classList.add("hidden");
        }
        state.attachedFile = null;
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            elements.conversation.scrollTop = elements.conversation.scrollHeight;
        });
    }

    function autoResize() {
        elements.promptInput.style.height = "auto";
        elements.promptInput.style.height = `${Math.min(elements.promptInput.scrollHeight, 140)}px`;
    }

    let toastTimer;
    function showToast(message) {
        clearTimeout(toastTimer);
        elements.toast.textContent = message;
        elements.toast.classList.add("show");
        toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2400);
    }

    function formatSize(bytes) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const index = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
        return `${Number.parseFloat((bytes / Math.pow(k, index)).toFixed(1))} ${sizes[index]}`;
    }

    function bindEvents() {
        elements.menuBtn.addEventListener("click", () => toggleSidebar(true));
        elements.sidebarClose.addEventListener("click", () => toggleSidebar(false));
        elements.scrim.addEventListener("click", () => {
            toggleSidebar(false);
            closeModals();
        });
        elements.modelPicker.addEventListener("click", () => openModal(elements.modelModal));
        document.getElementById("manage-models").addEventListener("click", () => openModal(elements.modelModal));

        document.querySelectorAll(".modal-close").forEach((button) => {
            button.addEventListener("click", closeModals);
        });

        ["upgrade-sidebar", "upgrade-top"].forEach((id) => {
            document.getElementById(id).addEventListener("click", () => openModal(elements.pricingModal));
        });

        document.querySelectorAll(".nav-item").forEach((item) => {
            item.addEventListener("click", () => setView(item.dataset.view));
        });

        document.getElementById("new-chat-btn").addEventListener("click", resetConversation);

        elements.compareToggle.addEventListener("click", () => {
            if (state.plan === "free") {
                showToast("Comparison mode requires a Pro or Studio subscription");
                openModal(elements.pricingModal);
                return;
            }
            state.compare = !state.compare;
            updateModeButton(elements.compareToggle, state.compare);
            renderModels();
            showToast(state.compare ? "Compare mode enabled" : "Compare mode disabled");
        });

        elements.webToggle.addEventListener("click", () => {
            if (state.plan === "free") {
                showToast("Web research requires a Pro or Studio subscription");
                openModal(elements.pricingModal);
                return;
            }
            state.web = !state.web;
            updateModeButton(elements.webToggle, state.web);
            showToast(state.web ? "Web research enabled" : "Web research disabled");
        });

        elements.composer.addEventListener("submit", (event) => {
            event.preventDefault();
            submitPrompt(elements.promptInput.value);
        });
        elements.promptInput.addEventListener("input", autoResize);
        elements.promptInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                elements.composer.requestSubmit();
            }
        });

        document.querySelectorAll(".prompt-card").forEach((card) => {
            card.addEventListener("click", () => submitPrompt(card.dataset.prompt));
        });

        elements.attachBtn.addEventListener("click", () => {
            if (state.plan === "free") {
                showToast("File uploads require a Pro or Studio subscription");
                openModal(elements.pricingModal);
                return;
            }
            elements.fileInput.click();
        });

        elements.fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                state.attachedFile = {
                    name: file.name,
                    size: formatSize(file.size),
                    type: file.type,
                    dataUrl: readerEvent.target.result
                };

                const isImage = file.type.startsWith("image/");
                const icon = isImage ? "Image" : "File";

                elements.filePreviewContainer.innerHTML = `
                    <div class="file-preview-token">
                        <span class="file-preview-icon">${icon}</span>
                        <div class="file-preview-details">
                            <span class="file-preview-name">${escapeHtml(file.name)}</span>
                            <span class="file-preview-size">${formatSize(file.size)}</span>
                        </div>
                        <button class="file-preview-remove" id="file-preview-remove-btn" type="button" aria-label="Remove file">&times;</button>
                    </div>
                `;
                elements.filePreviewContainer.classList.remove("hidden");

                document.getElementById("file-preview-remove-btn").addEventListener("click", resetAttachedFile);
            };
            reader.readAsDataURL(file);
        });

        document.getElementById("share-btn").addEventListener("click", () => {
            showToast("Private share links need authentication in production");
        });

        document.querySelectorAll("[data-billing]").forEach((button) => {
            button.addEventListener("click", () => {
                document.querySelectorAll("[data-billing]").forEach((item) => item.classList.remove("active"));
                button.classList.add("active");
                state.billing = button.dataset.billing;
                document.querySelectorAll(".price strong[data-monthly]").forEach((price) => {
                    price.textContent = price.dataset[state.billing];
                });
            });
        });

        let paypalLoaded = false;
        let paypalClientId = null;
        
        async function getPayPalClientId() {
            if (paypalClientId) return paypalClientId;
            try {
                const res = await fetch("/api/paypal/config");
                const data = await res.json();
                if (data.ok && data.clientId) {
                    paypalClientId = data.clientId;
                    return paypalClientId;
                }
            } catch (err) {
                console.error("Failed to fetch PayPal config:", err);
            }
            return null;
        }

        function loadPayPalSDK(clientId) {
            return new Promise((resolve, reject) => {
                if (window.paypal) {
                    resolve();
                    return;
                }
                const script = document.createElement("script");
                script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
                script.onload = () => {
                    paypalLoaded = true;
                    resolve();
                };
                script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
                document.head.appendChild(script);
            });
        }

        document.querySelectorAll(".choose-plan").forEach((button) => {
            button.addEventListener("click", async () => {
                const plan = button.dataset.plan;
                const price = state.billing === "monthly"
                    ? (plan === "Pro" ? "24.00" : "79.00")
                    : (plan === "Pro" ? "19.00" : "63.00");
 
                elements.checkoutPlanName.textContent = plan;
                elements.checkoutSummaryPlan.textContent = `${plan} plan ($${price} / month, billed ${state.billing})`;
                
                const container = document.getElementById("paypal-button-container");
                if (container) {
                    container.innerHTML = `<div style="text-align: center; color: var(--muted); font-size: 13px; padding: 20px;">Loading PayPal...</div>`;
                }
                
                elements.checkoutForm.classList.remove("hidden");
                elements.checkoutSuccessState.classList.add("hidden");
                openModal(elements.checkoutModal);
                
                try {
                    const clientId = await getPayPalClientId();
                    if (!clientId) {
                        if (container) {
                            container.innerHTML = `<div style="color: #ea5455; text-align: center; font-size: 13px; padding: 20px;">PayPal configuration missing on server.</div>`;
                        }
                        return;
                    }
                    
                    await loadPayPalSDK(clientId);
                    
                    if (container) {
                        container.innerHTML = "";
                    }
                    
                    window.paypal.Buttons({
                        createOrder: (data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        currency_code: "USD",
                                        value: price
                                    },
                                    description: `${plan} Plan (${state.billing})`
                                }]
                            });
                        },
                        onApprove: async (data, actions) => {
                            if (container) {
                                container.innerHTML = `<div style="text-align: center; color: var(--ink); font-size: 13px; padding: 20px;">Processing payment...</div>`;
                            }
                            try {
                                const details = await actions.order.capture();
                                
                                const response = await fetch("/api/upgrade", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        userId: state.userId,
                                        plan: plan.toLowerCase(),
                                        billing: state.billing,
                                        paypalOrderId: data.orderID
                                    })
                                });
                                
                                const resData = await response.json();
                                if (!response.ok || !resData.ok) {
                                    throw new Error(resData.error || "Upgrade activation failed.");
                                }
                                
                                state.plan = resData.user.plan;
                                state.used = resData.user.messages_used;
                                localStorage.setItem("wondrilla_plan", state.plan);
                                updateUsage();
                                updatePlanUI();
                                
                                elements.checkoutForm.classList.add("hidden");
                                elements.successPlanName.textContent = plan;
                                elements.checkoutSuccessState.classList.remove("hidden");
                                showToast(`Wondrilla ${plan} plan activated successfully!`);
                            } catch (err) {
                                showToast(`Upgrade failed: ${err.message}`);
                                button.click();
                            }
                        },
                        onError: (err) => {
                            console.error(err);
                            showToast("PayPal checkout failed or was cancelled.");
                            button.click();
                        }
                    }).render("#paypal-button-container");
                    
                } catch (err) {
                    console.error("PayPal init error:", err);
                    if (container) {
                        container.innerHTML = `<div style="color: #ea5455; text-align: center; font-size: 13px; padding: 20px;">Failed to initialize PayPal.</div>`;
                    }
                }
            });
        });

        elements.checkoutSuccessCloseBtn.addEventListener("click", closeModals);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeModals();
                toggleSidebar(false);
            }
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                resetConversation();
            }
        });

        if (elements.profileRow) {
            elements.profileRow.addEventListener("click", () => {
                if (loggedInUser) {
                    openProfileModal();
                } else {
                    openModal(elements.authModal);
                }
            });
        }

        if (elements.authClose) elements.authClose.addEventListener("click", closeModals);
        if (elements.profileClose) elements.profileClose.addEventListener("click", closeModals);

        if (elements.authToggleBtn) elements.authToggleBtn.addEventListener("click", toggleAuthMode);
        if (elements.authForm) elements.authForm.addEventListener("submit", handleAuthSubmit);

        if (elements.oauthGoogleBtn) elements.oauthGoogleBtn.addEventListener("click", () => handleOAuth("google"));
        if (elements.oauthGithubBtn) elements.oauthGithubBtn.addEventListener("click", () => handleOAuth("github"));
        if (elements.logoutBtn) elements.logoutBtn.addEventListener("click", handleLogout);

        if (elements.authPasswordToggle) {
            elements.authPasswordToggle.addEventListener("click", () => {
                const isPassword = elements.authPassword.getAttribute("type") === "password";
                elements.authPassword.setAttribute("type", isPassword ? "text" : "password");
                elements.authPasswordToggle.textContent = isPassword ? "Hide" : "Show";
            });
        }
    }

    function toggleAuthMode() {
        if (elements.authPassword) {
            elements.authPassword.setAttribute("type", "password");
        }
        if (elements.authPasswordToggle) {
            elements.authPasswordToggle.textContent = "Show";
        }

        if (authMode === "signin") {
            authMode = "signup";
            const overline = document.getElementById("auth-overline");
            if (overline) overline.textContent = "CREATE ACCOUNT";
            elements.authTitle.textContent = "Create Wondrilla Account";
            elements.authSubmitText.textContent = "Create Account";
            elements.authToggleText.textContent = "Already have an account?";
            elements.authToggleBtn.textContent = "Sign In";
            elements.authNameGroup.classList.remove("hidden");
            elements.authName.required = true;
        } else {
            authMode = "signin";
            const overline = document.getElementById("auth-overline");
            if (overline) overline.textContent = "ACCOUNT ACCESS";
            elements.authTitle.textContent = "Sign In to Wondrilla";
            elements.authSubmitText.textContent = "Sign In";
            elements.authToggleText.textContent = "Don't have an account?";
            elements.authToggleBtn.textContent = "Create Account";
            elements.authNameGroup.classList.add("hidden");
            elements.authName.required = false;
        }
    }

    async function handleAuthSubmit(event) {
        event.preventDefault();
        if (!supabaseClient) {
            showToast("Supabase Auth is not initialized. Check your config.");
            return;
        }

        const email = elements.authEmail.value.trim();
        const password = elements.authPassword.value;
        const displayName = elements.authName.value.trim();

        const submitBtn = elements.authSubmitBtn;
        const originalText = elements.authSubmitText.textContent;
        submitBtn.disabled = true;
        elements.authSubmitText.textContent = authMode === "signin" ? "Signing In..." : "Creating Account...";

        try {
            if (authMode === "signup") {
                const { data, error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            display_name: displayName || email.split("@")[0]
                        }
                    }
                });
                if (error) throw error;
                showToast("Account created! Check your email for verification link.");
                if (data?.session) {
                    closeModals();
                } else {
                    toggleAuthMode();
                }
            } else {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                showToast("Signed in successfully!");
                closeModals();
            }
        } catch (error) {
            console.error("Auth action failed:", error);
            showToast(`Auth error: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            elements.authSubmitText.textContent = originalText;
        }
    }

    async function handleOAuth(provider) {
        if (!supabaseClient) {
            showToast("Supabase Auth is not initialized.");
            return;
        }
        try {
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("OAuth sign-in failed:", error);
            showToast(`OAuth error: ${error.message}`);
        }
    }

    async function handleLogout() {
        if (!supabaseClient) return;
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            showToast("Signed out successfully!");
            closeModals();
            resetConversation();
        } catch (error) {
            console.error("Sign out failed:", error);
            showToast(`Error: ${error.message}`);
        }
    }

    function openProfileModal() {
        if (!loggedInUser) return;
        const displayName = loggedInUser.user_metadata?.display_name || loggedInUser.email;
        elements.profileEmail.textContent = loggedInUser.email;
        elements.profileName.textContent = displayName;
        elements.profilePlan.textContent = state.plan.charAt(0).toUpperCase() + state.plan.slice(1) + " Plan";
        const limit = planLimit();
        elements.profileUsed.textContent = `${state.used} / ${limit.toLocaleString()} messages`;
        openModal(elements.profileModal);
    }

    function handleUserLogin(user) {
        loggedInUser = user;
        state.userId = user.id;
        
        const displayName = user.user_metadata?.display_name || user.email;
        const initials = displayName.slice(0, 2).toUpperCase();
        
        const avatarEl = elements.profileRow.querySelector(".avatar");
        const strongEl = elements.profileRow.querySelector("strong");
        const smallEl = elements.profileRow.querySelector("small");
        
        if (avatarEl) avatarEl.textContent = initials;
        if (strongEl) strongEl.textContent = displayName;
        if (smallEl) smallEl.textContent = "Synced Account";
        
        syncUserAndHistory();
    }

    function handleUserLogoutState() {
        loggedInUser = null;
        initUserId();
        
        const avatarEl = elements.profileRow.querySelector(".avatar");
        const strongEl = elements.profileRow.querySelector("strong");
        const smallEl = elements.profileRow.querySelector("small");
        
        if (avatarEl) avatarEl.textContent = "?";
        if (strongEl) strongEl.textContent = "Sign In / Sign Up";
        if (smallEl) smallEl.textContent = "Create an account";
        
        syncUserAndHistory();
    }

    async function initSupabaseAuth() {
        try {
            const config = await fetchJson("/api/supabase/config");
            if (config.ok && config.url && config.publishableKey) {
                supabaseClient = createClient(config.url, config.publishableKey);
                console.log("Supabase Client SDK initialized!");
                
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (session && session.user) {
                    handleUserLogin(session.user);
                } else {
                    handleUserLogoutState();
                }
                
                supabaseClient.auth.onAuthStateChange((event, session) => {
                    if (session && session.user) {
                        handleUserLogin(session.user);
                    } else {
                        handleUserLogoutState();
                    }
                });
            } else {
                console.warn("Supabase url/key missing on backend.");
                handleUserLogoutState();
            }
        } catch (error) {
            console.error("Failed to init Supabase Auth:", error);
            handleUserLogoutState();
        }
    }

    function initUserId() {
        let id = localStorage.getItem("wondrilla_user_id");
        if (!id) {
            id = "user_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
            localStorage.setItem("wondrilla_user_id", id);
        }
        state.userId = id;
    }

    function addChatBubble(role, content, modelId = "auto") {
        const wrapper = document.createElement("div");
        wrapper.className = `message ${role === "user" ? "user" : "assistant"}`;

        if (role === "user") {
            wrapper.innerHTML = `
                <div class="message-bubble">
                    <div>${formatText(content)}</div>
                </div>
            `;
        } else {
            const model = modelById(modelId);
            wrapper.innerHTML = `
                <div class="message-bubble">
                    <div class="message-meta">
                        <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="${avatarStyle(model)}">${model.svg || model.mark}</span>
                        <strong>${model.name}</strong>
                    </div>
                    <div>${formatText(content)}</div>
                </div>
            `;
        }
        elements.messages.appendChild(wrapper);
    }

    async function syncUserAndHistory() {
        if (!loggedInUser) {
            initUserId();
        }
        try {
            const userData = await fetchJson(`/api/user?userId=${state.userId}`);
            if (userData.ok && userData.user) {
                state.plan = userData.user.plan || "free";
                state.used = userData.user.messages_used || 0;
                localStorage.setItem("wondrilla_plan", state.plan);
                updateUsage();
                updatePlanUI();
            }

            if (loggedInUser) {
                const messagesData = await fetchJson(`/api/messages?userId=${state.userId}`);
                if (messagesData.ok && Array.isArray(messagesData.messages) && messagesData.messages.length > 0) {
                    elements.welcomeState.classList.add("hidden");
                    elements.messages.innerHTML = "";
                    messagesData.messages.forEach((msg) => {
                        addChatBubble(msg.role, msg.content, msg.model_id);
                    });
                    scrollToBottom();
                } else {
                    elements.messages.innerHTML = "";
                    elements.welcomeState.classList.remove("hidden");
                }
            } else {
                elements.messages.innerHTML = "";
                elements.welcomeState.classList.remove("hidden");
            }
        } catch (error) {
            console.error("Failed to sync user and history with Supabase:", error);
        }
    }

    renderModels();
    renderHistory();
    updateUsage();
    updatePlanUI();
    bindEvents();
    autoResize();
    loadRuntimeStatus();
    initSupabaseAuth();
})();