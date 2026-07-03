import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

(function () {
    "use strict";

    const models = [
        { id: "auto", name: "Wondrilla Auto", maker: "Smart routing", mark: "W", color: "#1f211d", text: "#d9ff43" },
        { id: "chatgpt", name: "ChatGPT", maker: "OpenAI", mark: "O", color: "#dcebe3", text: "#275b45" },
        { id: "claude", name: "Claude", maker: "Anthropic", mark: "A", color: "#eadfd2", text: "#8a5436" },
        { id: "grok", name: "Grok", maker: "xAI", mark: "X", color: "#dedede", text: "#222222" },
        { id: "meta", name: "Meta AI", maker: "Meta via OpenRouter", mark: "M", color: "#dfe7f8", text: "#315da8" },
        { id: "kimi", name: "Kimi", maker: "Moonshot AI", mark: "K", color: "#e6e3f4", text: "#6553a0" },
        { id: "zai", name: "Z.ai", maker: "Zhipu AI", mark: "Z", color: "#dce8ef", text: "#32647c" },
        { id: "deepseek", name: "DeepSeek", maker: "DeepSeek", mark: "D", color: "#dce6f6", text: "#345b9d" },
        { id: "ollama", name: "Ollama Local", maker: "Local Llama/DeepSeek", mark: "🦙", color: "#ececec", text: "#1f211d" }
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
                        ${model.mark}
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
                        ${model.mark}
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
            elements.selectedModelAvatar.textContent = model.mark;
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
                    <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="${avatarStyle(model)}">${model.mark}</span>
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
                    <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="${avatarStyle(model)}">${model.mark}</span>
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
                        <span class="model-avatar" style="${avatarStyle(model)}">${model.mark}</span>
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
                        <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="${avatarStyle(model)}">${model.mark}</span>
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