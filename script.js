(function () {
    "use strict";

    const models = [
        { id: "auto", name: "Wondrilla Auto", maker: "Smart routing", mark: "W", color: "#1f211d", text: "#d9ff43" },
        { id: "chatgpt", name: "ChatGPT", maker: "OpenAI", mark: "O", color: "#dcebe3", text: "#275b45" },
        { id: "claude", name: "Claude", maker: "Anthropic", mark: "A", color: "#eadfd2", text: "#8a5436" },
        { id: "grok", name: "Grok", maker: "xAI", mark: "X", color: "#dedede", text: "#222222" },
        { id: "meta", name: "Meta AI", maker: "Meta", mark: "M", color: "#dfe7f8", text: "#315da8" },
        { id: "kimi", name: "Kimi", maker: "Moonshot AI", mark: "K", color: "#e6e3f4", text: "#6553a0" },
        { id: "zai", name: "Z.ai", maker: "Zhipu AI", mark: "Z", color: "#dce8ef", text: "#32647c" },
        { id: "deepseek", name: "DeepSeek", maker: "DeepSeek", mark: "D", color: "#dce6f6", text: "#345b9d" }
    ];

    const demoAnswers = {
        auto: "Here is a focused way forward: define the outcome first, reduce the work to three decisions, and build the smallest version that proves the idea. I can turn this into a concrete plan, draft, or checklist next.",
        chatgpt: "I would structure this as a practical sequence: clarify the goal, identify the audience, create a first version, then test it against measurable feedback. The key is making each step small enough to complete quickly.",
        claude: "A useful starting point is to separate what must be true from what would merely be nice. Once those are clear, we can shape an approach that is thoughtful, realistic, and easy for another person to understand.",
        grok: "Cut through the noise: pick the one result that matters, ship a rough but real version, and let actual users tell you what is wrong. Elegant theories are cheap. Evidence is the useful part.",
        meta: "We can approach this collaboratively by mapping the people involved, the experience you want them to have, and the content or tools needed at each moment. That creates a clear path from idea to useful product.",
        kimi: "I would begin with a broad context scan, then synthesize the strongest patterns into a concise framework. From there, we can expand any point with deeper research, examples, and a step-by-step execution plan.",
        zai: "The task can be decomposed into objective, constraints, resources, and validation. A strong solution optimizes across all four rather than maximizing only speed or quality in isolation.",
        deepseek: "A technically sound approach is to define interfaces before implementation, isolate the highest-risk assumption, and test that assumption first. This reduces rework and gives the rest of the build a stable foundation."
    };

    const state = {
        selectedModel: "auto",
        compare: false,
        web: false,
        used: 7,
        history: [
            "A launch plan for Wondrilla",
            "Rewrite the homepage headline",
            "Explain APIs simply",
            "Compare AI business models"
        ]
    };

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
        toast: document.getElementById("toast")
    };

    function modelById(id) {
        return models.find((model) => model.id === id) || models[0];
    }

    function avatarStyle(model) {
        return `background:${model.color};color:${model.text}`;
    }

    function renderModels() {
        elements.modelList.innerHTML = models.map((model) => `
            <button class="model-row ${model.id === state.selectedModel ? "active" : ""}" type="button" data-model="${model.id}">
                <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="${avatarStyle(model)}">${model.mark}</span>
                <span class="model-copy">
                    <strong>${model.name}</strong>
                    <small>${model.maker}</small>
                </span>
                <span class="model-status" title="Available"></span>
            </button>
        `).join("");

        elements.modalModelGrid.innerHTML = models.map((model) => `
            <button class="modal-model-option ${model.id === state.selectedModel ? "active" : ""}" type="button" data-model="${model.id}">
                <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="${avatarStyle(model)}">${model.mark}</span>
                <span>
                    <strong>${model.name}</strong>
                    <small>${model.id === "auto" ? "Automatically route every prompt" : `${model.maker} · Available on Pro`}</small>
                </span>
            </button>
        `).join("");

        document.querySelectorAll("[data-model]").forEach((button) => {
            button.addEventListener("click", () => selectModel(button.dataset.model));
        });
    }

    function renderHistory() {
        elements.historyList.innerHTML = state.history.map((item, index) => `
            <button class="history-item ${index === 0 ? "active" : ""}" type="button">${escapeHtml(item)}</button>
        `).join("");
    }

    function selectModel(id) {
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

    function updateUsage() {
        const percent = Math.min(100, Math.round((state.used / 20) * 100));
        elements.usedMessages.textContent = state.used;
        elements.usagePercent.textContent = `${percent}%`;
        elements.usageProgress.style.width = `${percent}%`;
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
        document.body.style.overflow = "";
    }

    function toggleSidebar(open) {
        elements.sidebar.classList.toggle("open", open);
        elements.scrim.classList.toggle("hidden", !open);
    }

    function setView(view) {
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
            if (state.compare) {
                showToast("Compare mode: three models will answer side by side");
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

    function addUserMessage(text) {
        const wrapper = document.createElement("div");
        wrapper.className = "message user";
        wrapper.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
        elements.messages.appendChild(wrapper);
    }

    function addTypingMessage(model) {
        const wrapper = document.createElement("div");
        wrapper.className = "message assistant";
        wrapper.innerHTML = `
            <div class="message-bubble">
                <div class="message-meta">
                    <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="${avatarStyle(model)}">${model.mark}</span>
                    <strong>${model.name}</strong>
                    <span>thinking</span>
                </div>
                <span class="typing-dots"><span></span><span></span><span></span></span>
            </div>
        `;
        elements.messages.appendChild(wrapper);
        return wrapper;
    }

    function addAssistantMessage(model, text, typingNode) {
        const safeText = escapeHtml(text);
        const webNote = state.web ? `<p><small>Web mode is visual-only in this prototype. Connect a search API in the secure backend to return live sources.</small></p>` : "";
        typingNode.innerHTML = `
            <div class="message-bubble">
                <div class="message-meta">
                    <span class="model-avatar ${model.id === "auto" ? "auto" : ""}" style="${avatarStyle(model)}">${model.mark}</span>
                    <strong>${model.name}</strong>
                    <span>Demo response</span>
                </div>
                <div>${safeText}</div>
                ${webNote}
            </div>
        `;
    }

    function addCompareAnswers() {
        const selected = ["claude", "chatgpt", "deepseek"].map(modelById);
        const grid = document.createElement("div");
        grid.className = "compare-grid";
        grid.innerHTML = selected.map((model) => `
            <article class="compare-answer">
                <div class="message-meta">
                    <span class="model-avatar" style="${avatarStyle(model)}">${model.mark}</span>
                    <strong>${model.name}</strong>
                </div>
                <p>${escapeHtml(demoAnswers[model.id])}</p>
            </article>
        `).join("");
        elements.messages.appendChild(grid);
    }

    function submitPrompt(text) {
        const cleanText = text.trim();
        if (!cleanText) return;

        elements.welcomeState.classList.add("hidden");
        addUserMessage(cleanText);
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
            setTimeout(() => {
                typing.remove();
                addCompareAnswers();
                elements.sendBtn.disabled = false;
                scrollToBottom();
            }, 900);
            return;
        }

        const model = modelById(state.selectedModel);
        const typing = addTypingMessage(model);
        scrollToBottom();
        setTimeout(() => {
            addAssistantMessage(model, demoAnswers[model.id], typing);
            elements.sendBtn.disabled = false;
            scrollToBottom();
        }, 850);
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
            state.compare = !state.compare;
            updateModeButton(elements.compareToggle, state.compare);
            showToast(state.compare ? "Compare mode enabled" : "Compare mode disabled");
        });

        elements.webToggle.addEventListener("click", () => {
            state.web = !state.web;
            updateModeButton(elements.webToggle, state.web);
            showToast(state.web ? "Web mode enabled for the prototype" : "Web mode disabled");
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

        document.getElementById("attach-btn").addEventListener("click", () => {
            showToast("File uploads will activate when storage is connected");
        });

        document.getElementById("share-btn").addEventListener("click", () => {
            showToast("Private share link copied in the production app");
        });

        document.querySelectorAll("[data-billing]").forEach((button) => {
            button.addEventListener("click", () => {
                document.querySelectorAll("[data-billing]").forEach((item) => item.classList.remove("active"));
                button.classList.add("active");
                const billing = button.dataset.billing;
                document.querySelectorAll(".price strong[data-monthly]").forEach((price) => {
                    price.textContent = price.dataset[billing];
                });
            });
        });

        document.querySelectorAll(".choose-plan").forEach((button) => {
            button.addEventListener("click", () => {
                closeModals();
                showToast(`${button.dataset.plan} checkout requires a payment provider`);
            });
        });

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
    }

    renderModels();
    renderHistory();
    updateUsage();
    bindEvents();
    autoResize();
})();
