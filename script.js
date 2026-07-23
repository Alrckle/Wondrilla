import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

(function () {
    "use strict";

    const models = [
        { id: "auto", name: "Wondrilla Auto", maker: "Smart routing", mark: "W", color: "#2563eb", bgGradient: "linear-gradient(135deg, #2563eb, #1d4ed8)", text: "#ffffff", borderColor: "rgba(37, 99, 235, 0.5)", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="m12 3-1.912 5.886L4.2 9l5.886 1.912L12 16.8l1.912-5.886L19.8 9l-5.886-1.912z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/></svg>` },
        { id: "chatgpt", name: "ChatGPT", maker: "OpenAI", mark: "O", color: "#10a37f", text: "#ffffff", borderColor: "rgba(16, 163, 127, 0.4)", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>OpenAI</title><path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.946-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"></path></svg>` },
        { id: "claude", name: "Claude", maker: "Anthropic", mark: "A", color: "#d97757", text: "#ffffff", borderColor: "rgba(217, 119, 87, 0.4)", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Claude</title><path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"></path></svg>` },
        { id: "grok", name: "Grok", maker: "xAI", mark: "G", color: "#111111", text: "#ffffff", borderColor: "rgba(255, 255, 255, 0.2)", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Grok</title><path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"></path></svg>` },
        { id: "meta", name: "Meta AI", maker: "Meta via OpenRouter", mark: "M", color: "#0081fb", bgGradient: "linear-gradient(135deg, #0081fb, #0064e0)", text: "#ffffff", borderColor: "rgba(0, 129, 251, 0.4)", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Meta</title><path d="M6.897 4c1.915 0 3.516.932 5.43 3.376l.282-.373c.19-.246.383-.484.58-.71l.313-.35C14.588 4.788 15.792 4 17.225 4c1.273 0 2.469.557 3.491 1.516l.218.213c1.73 1.765 2.917 4.71 3.053 8.026l.011.392.002.25c0 1.501-.28 2.759-.818 3.7l-.14.23-.108.153c-.301.42-.664.758-1.086 1.009l-.265.142-.087.04a3.493 3.493 0 01-.302.118 4.117 4.117 0 01-1.33.208c-.524 0-.996-.067-1.438-.215-.614-.204-1.163-.56-1.726-1.116l-.227-.235c-.753-.812-1.534-1.976-2.493-3.586l-1.43-2.41-.544-.895-1.766 3.13-.343.592C7.597 19.156 6.227 20 4.356 20c-1.21 0-2.205-.42-2.936-1.182l-.168-.184c-.484-.573-.837-1.311-1.043-2.189l-.067-.32a8.69 8.69 0 01-.136-1.288L0 14.468c.002-.745.06-1.49.174-2.23l.1-.573c.298-1.53.828-2.958 1.536-4.157l.209-.34c1.177-1.83 2.789-3.053 4.615-3.16L6.897 4zm-.033 2.615l-.201.01c-.83.083-1.606.673-2.252 1.577l-.138.199-.01.018c-.67 1.017-1.185 2.378-1.456 3.845l-.004.022a12.591 12.591 0 00-.207 2.254l.002.188c.004.18.017.36.04.54l.043.291c.092.503.257.908.486 1.208l.117.137c.303.323.698.492 1.17.492 1.1 0 1.796-.676 3.696-3.641l2.175-3.4.454-.701-.139-.198C9.11 7.3 8.084 6.616 6.864 6.616zm10.196-.552l-.176.007c-.635.048-1.223.359-1.82.933l-.196.198c-.439.462-.887 1.064-1.367 1.807l.266.398c.18.274.362.56.55.858l.293.475 1.396 2.335.695 1.114c.583.926 1.03 1.6 1.408 2.082l.213.262c.282.326.529.54.777.673l.102.05c.227.1.457.138.718.138.176.002.35-.023.518-.073.338-.104.61-.32.813-.637l.095-.163.077-.162c.194-.459.29-1.06.29-1.785l-.006-.449c-.08-2.871-.938-5.372-2.2-6.798l-.176-.189c-.67-.683-1.444-1.074-2.27-1.074z"></path></svg>` },
        { id: "kimi", name: "Kimi", maker: "Moonshot AI", mark: "K", color: "#18181b", text: "#ffffff", borderColor: "rgba(255, 255, 255, 0.2)", svg: `<svg fill="currentColor" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 25" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Kimi</title><path d="M21.7202 0.939941C22.9502 0.939941 23.9502 1.93994 23.9502 3.16994C23.9502 4.39994 22.9502 5.39994 21.7202 5.39994H19.7502C19.6002 5.39994 19.4902 5.27994 19.4902 5.13994V3.16994C19.4902 1.93994 20.4902 0.939941 21.7202 0.939941Z" fill="#ffffff"/><path d="M9.39 13.9501L17.82 5.59012C17.98 5.43012 17.89 5.12012 17.68 5.12012H13.14C13.14 5.12012 13.04 5.14012 13 5.18012L3.92 14.1901C3.78 14.3301 3.57 14.2101 3.57 13.9801V5.39012C3.57 5.24012 3.47 5.12012 3.35 5.12012H0.219999C0.0999993 5.12012 0 5.24012 0 5.39012V23.9201C0 24.0701 0.0999993 24.1901 0.219999 24.1901H3.35C3.47 24.1901 3.57 24.0701 3.57 23.9201V20.1401C3.57 20.0601 3.6 19.9801 3.65 19.9301L6.47 17.1401C6.54 17.0701 6.63 17.0601 6.71 17.1101L14.24 22.6501C15.47 23.4801 16.85 23.9901 18.25 24.1401C18.37 24.1501 18.48 24.0301 18.48 23.8701V20.3101C18.48 20.1701 18.4 20.0601 18.29 20.0501C17.47 19.9201 16.66 19.6001 15.94 19.1101L9.42 14.3901C9.28 14.3001 9.27 14.0701 9.39 13.9501Z" fill="#ffffff"/></svg>` },
        { id: "zai", name: "Z.ai", maker: "Zhipu AI", mark: "Z", color: "#3458fe", text: "#ffffff", borderColor: "rgba(52, 88, 254, 0.4)", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Z.ai</title><path d="M12.105 2L9.927 4.953H.653L2.83 2h9.276zM23.254 19.048L21.078 22h-9.242l2.174-2.952h9.244zM24 2L9.264 22H0L14.736 2H24z"></path></svg>` },
        { id: "deepseek", name: "DeepSeek", maker: "DeepSeek", mark: "D", color: "#4d6bfe", text: "#ffffff", borderColor: "rgba(77, 107, 254, 0.4)", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>DeepSeek</title><path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.140c1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"></path></svg>` },
        { id: "gemini", name: "Gemini", maker: "Google", mark: "G", color: "#1a73e8", bgGradient: "linear-gradient(135deg, #1a73e8, #8ab4f8, #c58af9)", text: "#ffffff", borderColor: "rgba(26, 115, 232, 0.4)", svg: `<svg fill="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="flex:none;line-height:1" xmlns="http://www.w3.org/2000/svg"><title>Gemini</title><path d="M12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24Z"/></svg>` }
    ];

    function avatarStyle(model) {
        if (model.bgGradient) {
            return `background:${model.bgGradient};color:${model.text};border:1px solid ${model.borderColor || 'transparent'}`;
        }
        return `background:${model.color};color:${model.text};border:1px solid ${model.borderColor || 'transparent'}`;
    }


    const demoAnswers = {
        auto: "Here is a focused way forward: define the outcome first, reduce the work to three decisions, and build the smallest version that proves the idea. I can turn this into a concrete plan, draft, or checklist next.",
        chatgpt: "I would structure this as a practical sequence: clarify the goal, identify the audience, create a first version, then test it against measurable feedback. The key is making each step small enough to complete quickly.",
        claude: "A useful starting point is to separate what must be true from what would merely be nice. Once those are clear, we can shape an approach that is thoughtful, realistic, and easy for another person to understand.",
        grok: "Cut through the noise: pick the one result that matters, ship a rough but real version, and let actual users tell you what is wrong. Elegant theories are cheap. Evidence is the useful part.",
        meta: "We can approach this collaboratively by mapping the people involved, the experience you want them to have, and the content or tools needed at each moment. That creates a clear path from idea to useful product.",
        kimi: "I would begin with a broad context scan, then synthesize the strongest patterns into a concise framework. From there, we can expand any point with deeper research, examples, and a step-by-step execution plan.",
        zai: "The task can be decomposed into objective, constraints, resources, and validation. A strong solution optimizes across all four rather than maximizing only speed or quality in isolation.",
        deepseek: "A technically sound approach is to define interfaces before implementation, isolate the highest-risk assumption, and test that assumption first. This reduces rework and gives the rest of the build a stable foundation.",
        gemini: "Focus on synthesis: collect all inputs, outline the connections and patterns between them, and frame a solution that builds on those shared strengths. I can guide you through analyzing these relationships step-by-step."
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
        compareModels: ["claude", "chatgpt", "deepseek"],
        customInstructions: {
            about: "",
            response: "",
            enabled: true
        }
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
        marketingView: document.getElementById("marketing-view"),
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
        authPasswordGroup: document.getElementById("auth-password-group"),
        authName: document.getElementById("auth-name"),
        authEmail: document.getElementById("auth-email"),
        authPassword: document.getElementById("auth-password"),
        authSubmitBtn: document.getElementById("auth-submit-btn"),
        authSubmitText: document.getElementById("auth-submit-text"),
        authToggleBtn: document.getElementById("auth-toggle-btn"),
        authToggleText: document.getElementById("auth-toggle-text"),
        authTitle: document.getElementById("auth-title"),
        authClose: document.getElementById("auth-modal-close"),
        authForgotBtn: document.getElementById("auth-forgot-btn"),
        resetModal: document.getElementById("reset-modal"),
        resetForm: document.getElementById("reset-form"),
        resetPassword: document.getElementById("reset-password"),
        resetPasswordToggle: document.getElementById("reset-password-toggle"),
        resetSubmitBtn: document.getElementById("reset-submit-btn"),
        resetSubmitText: document.getElementById("reset-submit-text"),
        resetClose: document.getElementById("reset-modal-close"),
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
        authPasswordToggle: document.getElementById("auth-password-toggle"),
        settingsProfileBtn: document.getElementById("settings-profile-btn"),
        settingsGeneralBtn: document.getElementById("settings-general-btn"),
        settingsPersonalizationBtn: document.getElementById("settings-personalization-btn"),
        settingsMcpBtn: document.getElementById("settings-mcp-btn"),
        tabProfile: document.getElementById("tab-profile"),
        tabGeneral: document.getElementById("tab-general"),
        tabPersonalization: document.getElementById("tab-personalization"),
        tabMcp: document.getElementById("tab-mcp"),
        themeDarkBtn: document.getElementById("theme-dark-btn"),
        themeLightBtn: document.getElementById("theme-light-btn"),
        themeSystemBtn: document.getElementById("theme-system-btn"),
        clearChatsBtn: document.getElementById("clear-chats-btn"),
        deleteAccountBtn: document.getElementById("delete-account-btn"),
        personalizationForm: document.getElementById("personalization-form"),
        personalizationAbout: document.getElementById("personalization-about"),
        personalizationResponse: document.getElementById("personalization-response"),
        personalizationEnabled: document.getElementById("personalization-enabled"),
        tabServersBtn: document.getElementById("tab-servers-btn"),
        tabAddBtn: document.getElementById("tab-add-btn"),
        tabTesterBtn: document.getElementById("tab-tester-btn"),
        mcpTabServers: document.getElementById("mcp-tab-servers"),
        mcpTabAdd: document.getElementById("mcp-tab-add"),
        mcpTabTester: document.getElementById("mcp-tab-tester"),
        mcpServersList: document.getElementById("mcp-servers-list"),
        mcpAddForm: document.getElementById("mcp-add-form"),
        mcpName: document.getElementById("mcp-name"),
        mcpType: document.getElementById("mcp-type"),
        mcpCommandFields: document.getElementById("mcp-command-fields"),
        mcpSseFields: document.getElementById("mcp-sse-fields"),
        mcpCommand: document.getElementById("mcp-command"),
        mcpArgs: document.getElementById("mcp-args"),
        mcpEnv: document.getElementById("mcp-env"),
        mcpUrl: document.getElementById("mcp-url"),
        testerServer: document.getElementById("tester-server"),
        testerTool: document.getElementById("tester-tool"),
        testerArgs: document.getElementById("tester-args"),
        runToolBtn: document.getElementById("run-tool-btn"),
        testerOutputContainer: document.getElementById("tester-output-container"),
        testerOutput: document.getElementById("tester-output"),
        mcpConnectModal: document.getElementById("mcp-connect-modal"),
        mcpConnectForm: document.getElementById("mcp-connect-form"),
        mcpConnectClose: document.getElementById("mcp-connect-close"),
        mcpConnectFields: document.getElementById("mcp-connect-fields"),
        mcpConnectTitle: document.getElementById("mcp-connect-title"),
        mcpConnectLead: document.getElementById("mcp-connect-lead"),
        mcpConnectSubmitBtn: document.getElementById("mcp-connect-submit-btn")
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
            const statusLabel = configured ? "Live" : "Demo";
            const detail = model.id === "auto"
                ? (configured ? "Routes to configured APIs" : "Routes to demo answers")
                : `${model.maker} • ${statusLabel}`;

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
                : `${model.maker} • ${configured ? provider?.model || "configured" : "add API key for live mode"}`;

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
            elements.runtimePill.innerHTML = `<span></span> ${liveReady ? "Live" : "Demo"}`;
        }

        if (elements.liveIndicator) {
            elements.liveIndicator.classList.toggle("live", liveReady);
            elements.liveIndicator.classList.toggle("demo", !liveReady);
            elements.liveIndicator.innerHTML = `<i></i> ${liveReady ? "Live" : "Demo"}`;
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
        if (modal === elements.authModal) {
            setAuthMode("signin");
        }
    }

    function closeModals() {
        elements.scrim.classList.add("hidden");
        elements.modelModal.classList.add("hidden");
        elements.pricingModal.classList.add("hidden");
        elements.checkoutModal.classList.add("hidden");
        if (elements.authModal) elements.authModal.classList.add("hidden");
        if (elements.profileModal) elements.profileModal.classList.add("hidden");
        if (elements.resetModal) elements.resetModal.classList.add("hidden");
        if (elements.mcpConnectModal) elements.mcpConnectModal.classList.add("hidden");
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
            item.classList.toggle("active", item.dataset.view === view);
        });

        if (view === "library") {
            elements.chatView.classList.add("hidden");
            elements.libraryView.classList.remove("hidden");
            if (elements.marketingView) elements.marketingView.classList.add("hidden");
        } else if (view === "marketing") {
            elements.chatView.classList.add("hidden");
            elements.libraryView.classList.add("hidden");
            if (elements.marketingView) elements.marketingView.classList.remove("hidden");
        } else {
            elements.libraryView.classList.add("hidden");
            if (elements.marketingView) elements.marketingView.classList.add("hidden");
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
        
        // Match Markdown images first: ![alt](url)
        text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 12px; margin-top: 10px; border: 1px solid var(--line-soft); display: block;">');
        
        // Match Markdown links: [text](url)
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--acid); text-decoration: underline;">$1</a>');
        
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
        const status = result?.mode === "live" ? "Live" : "Demo";
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
            const status = answer.mode === "live" ? "Live" : "Demo";
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

    function getActiveConversationHistory(maxTurns = 10) {
        const history = [];
        const msgNodes = elements.messages.querySelectorAll(".message");
        msgNodes.forEach((node) => {
            const isUser = node.classList.contains("user");
            const bubble = node.querySelector(".message-bubble");
            if (!bubble) return;
            
            const clone = bubble.cloneNode(true);
            const meta = clone.querySelector(".message-meta");
            if (meta) meta.remove();
            const citationsHeader = clone.querySelector(".search-citations-header");
            if (citationsHeader) citationsHeader.remove();
            const citationGrid = clone.querySelector(".search-citations-grid");
            if (citationGrid) citationGrid.remove();

            const text = clone.textContent.trim();
            if (text) {
                history.push({
                    role: isUser ? "user" : "assistant",
                    content: text
                });
            }
        });
        
        return history.slice(-maxTurns * 2);
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

        const conversationHistory = getActiveConversationHistory(10);
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
                    file: publicFilePayload(attachedFile),
                    customInstructions: state.customInstructions,
                    conversationHistory
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
                file: publicFilePayload(attachedFile),
                customInstructions: state.customInstructions,
                conversationHistory
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

    async function postJson(url, payload) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
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
        if (!elements.promptInput) return;
        elements.promptInput.style.height = "auto";
        const newHeight = Math.min(elements.promptInput.scrollHeight, 180);
        elements.promptInput.style.height = `${newHeight}px`;
        elements.promptInput.style.overflowY = elements.promptInput.scrollHeight > 180 ? "auto" : "hidden";
    }

    let toastTimer;
    function showToast(message) {
        clearTimeout(toastTimer);
        elements.toast.textContent = message;
        elements.toast.classList.add("show");
        toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2400);
    }

    function requireAuth(message = "Please sign in or create an account to proceed") {
        if (!loggedInUser) {
            showToast(message);
            openModal(elements.authModal);
            return false;
        }
        return true;
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
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener("click", () => {
                    if (!requireAuth("Please sign in or create an account to upgrade")) return;
                    openModal(elements.pricingModal);
                });
            }
        });

        document.querySelectorAll(".nav-item").forEach((item) => {
            item.addEventListener("click", () => setView(item.dataset.view));
        });

        document.getElementById("new-chat-btn").addEventListener("click", resetConversation);

        const brandLogo = document.querySelector(".brand");
        if (brandLogo) {
            brandLogo.addEventListener("click", (e) => {
                e.preventDefault();
                resetConversation();
            });
        }

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
        let paypalConfigData = null;
        
        async function getPayPalConfig() {
            if (paypalConfigData) return paypalConfigData;
            try {
                const res = await fetch("/api/paypal/config");
                const data = await res.json();
                if (data.ok && data.clientId) {
                    paypalConfigData = data;
                    return paypalConfigData;
                }
            } catch (err) {
                console.error("Failed to fetch PayPal config:", err);
            }
            return null;
        }

        async function getPayPalClientId() {
            const cfg = await getPayPalConfig();
            return cfg ? cfg.clientId : null;
        }

        function loadPayPalSDK(clientId) {
            return new Promise((resolve, reject) => {
                if (window.paypal) {
                    resolve();
                    return;
                }
                const script = document.createElement("script");
                script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&vault=true&intent=subscription`;
                script.onload = () => {
                    paypalLoaded = true;
                    resolve();
                };
                script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
                document.head.appendChild(script);
            });
        }

        let activeSelectedPlan = "Pro";

        document.querySelectorAll(".choose-plan").forEach((button) => {
            button.addEventListener("click", async () => {
                if (!requireAuth("Please sign in or create an account to upgrade")) return;

                const plan = button.dataset.plan || "Pro";
                activeSelectedPlan = plan;

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
                    const cfg = await getPayPalConfig();
                    if (!cfg || !cfg.clientId) {
                        if (container) {
                            container.innerHTML = `<div style="color: #ea5455; text-align: center; font-size: 13px; padding: 20px;">PayPal configuration missing on server.</div>`;
                        }
                        return;
                    }
                    
                    await loadPayPalSDK(cfg.clientId);
                    
                    if (container) {
                        container.innerHTML = "";
                    }
                    
                    const plans = cfg.plans || {};
                    let paypalPlanId = "";
                    if (plan.toLowerCase() === "pro") {
                        paypalPlanId = state.billing === "yearly" ? plans.pro_yearly : plans.pro;
                    } else if (plan.toLowerCase() === "studio") {
                        paypalPlanId = state.billing === "yearly" ? plans.studio_yearly : plans.studio;
                    }

                    const buttonConfig = {};
                    if (paypalPlanId && window.paypal.Buttons) {
                        buttonConfig.createSubscription = (data, actions) => {
                            return actions.subscription.create({
                                plan_id: paypalPlanId
                            });
                        };
                        buttonConfig.onApprove = async (data, actions) => {
                            if (container) {
                                container.innerHTML = `<div style="text-align: center; color: var(--ink); font-size: 13px; padding: 20px;">Activating subscription...</div>`;
                            }
                            try {
                                const response = await fetch("/api/upgrade", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        userId: state.userId,
                                        plan: plan.toLowerCase(),
                                        billing: state.billing,
                                        paypalOrderId: data.subscriptionID || data.orderID
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
                                showToast(`Wondrilla ${plan} subscription activated successfully!`);
                            } catch (err) {
                                showToast(`Upgrade failed: ${err.message}`);
                            }
                        };
                    } else {
                        buttonConfig.createOrder = (data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        currency_code: "USD",
                                        value: price
                                    },
                                    description: `${plan} Plan (${state.billing})`
                                }]
                            });
                        };
                        buttonConfig.onApprove = async (data, actions) => {
                            if (container) {
                                container.innerHTML = `<div style="text-align: center; color: var(--ink); font-size: 13px; padding: 20px;">Processing payment...</div>`;
                            }
                            try {
                                await actions.order.capture();
                                
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
                            }
                        };
                    }

                    buttonConfig.onError = (err) => {
                        console.error(err);
                        showToast("PayPal checkout failed or was cancelled.");
                    };

                    window.paypal.Buttons(buttonConfig).render("#paypal-button-container");
                    
                } catch (err) {
                    console.error("PayPal init error:", err);
                    if (container) {
                        container.innerHTML = `<div style="color: #ea5455; text-align: center; font-size: 13px; padding: 20px;">Failed to initialize PayPal.</div>`;
                    }
                }
            });
        });

        const razorpayBtn = document.getElementById("razorpay-checkout-btn");
        if (razorpayBtn) {
            razorpayBtn.addEventListener("click", async () => {
                if (!requireAuth("Please sign in or create an account to upgrade")) return;

                const plan = activeSelectedPlan || "Pro";
                try {
                    razorpayBtn.disabled = true;
                    razorpayBtn.style.opacity = "0.7";

                    let subRes = await fetch("/api/razorpay/create-subscription", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: state.userId,
                            plan: plan.toLowerCase(),
                            billing: state.billing
                        })
                    });

                    let subData = await subRes.json();
                    razorpayBtn.disabled = false;
                    razorpayBtn.style.opacity = "1";

                    if (!window.Razorpay) {
                        showToast("Razorpay Checkout SDK is still loading. Please try again.");
                        return;
                    }

                    let options = {};

                    if (subRes.ok && subData.ok && subData.subscriptionId) {
                        options = {
                            key: subData.keyId,
                            subscription_id: subData.subscriptionId,
                            name: "Wondrilla AI",
                            description: `Wondrilla ${plan} Subscription`,
                            prefill: {
                                email: loggedInUser?.email || ""
                            },
                            theme: {
                                color: "#072654"
                            },
                            handler: async function (paymentRes) {
                                showToast("Verifying Razorpay subscription...");
                                try {
                                    const verifyRes = await fetch("/api/razorpay/verify-subscription", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            userId: state.userId,
                                            plan: plan.toLowerCase(),
                                            razorpay_payment_id: paymentRes.razorpay_payment_id,
                                            razorpay_subscription_id: paymentRes.razorpay_subscription_id,
                                            razorpay_signature: paymentRes.razorpay_signature
                                        })
                                    });

                                    const verifyData = await verifyRes.json();
                                    if (!verifyRes.ok || !verifyData.ok) {
                                        throw new Error(verifyData.error || "Verification failed");
                                    }

                                    state.plan = verifyData.user.plan;
                                    state.used = verifyData.user.messages_used || 0;
                                    localStorage.setItem("wondrilla_plan", state.plan);
                                    updateUsage();
                                    updatePlanUI();

                                    elements.checkoutForm.classList.add("hidden");
                                    elements.successPlanName.textContent = plan;
                                    elements.checkoutSuccessState.classList.remove("hidden");
                                    showToast(`Wondrilla ${plan} subscription activated!`);
                                } catch (vErr) {
                                    showToast(`Subscription activation error: ${vErr.message}`);
                                }
                            },
                            modal: {
                                ondismiss: function () {
                                    showToast("Razorpay checkout cancelled.");
                                }
                            }
                        };
                    } else {
                        const response = await fetch("/api/razorpay/create-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId: state.userId,
                                plan: plan.toLowerCase(),
                                billing: state.billing
                            })
                        });
                        const data = await response.json();
                        if (!response.ok || !data.ok) {
                            showToast(`Razorpay error: ${data.error || "Order creation failed"}`);
                            return;
                        }

                        options = {
                            key: data.keyId,
                            amount: data.amount,
                            currency: data.currency || "INR",
                            name: "Wondrilla AI",
                            description: `${plan} Plan (${state.billing})`,
                            order_id: data.orderId,
                            prefill: { email: loggedInUser?.email || "" },
                            theme: { color: "#072654" },
                            handler: async function (paymentRes) {
                                showToast("Verifying Razorpay payment...");
                                try {
                                    const verifyRes = await fetch("/api/razorpay/verify-payment", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            userId: state.userId,
                                            plan: plan.toLowerCase(),
                                            billing: state.billing,
                                            razorpay_order_id: paymentRes.razorpay_order_id,
                                            razorpay_payment_id: paymentRes.razorpay_payment_id,
                                            razorpay_signature: paymentRes.razorpay_signature
                                        })
                                    });

                                    const verifyData = await verifyRes.json();
                                    if (!verifyRes.ok || !verifyData.ok) {
                                        throw new Error(verifyData.error || "Verification failed");
                                    }

                                    state.plan = verifyData.user.plan;
                                    state.used = verifyData.user.messages_used || 0;
                                    localStorage.setItem("wondrilla_plan", state.plan);
                                    updateUsage();
                                    updatePlanUI();

                                    elements.checkoutForm.classList.add("hidden");
                                    elements.successPlanName.textContent = plan;
                                    elements.checkoutSuccessState.classList.remove("hidden");
                                    showToast(`Wondrilla ${plan} plan activated!`);
                                } catch (vErr) {
                                    showToast(`Payment activation error: ${vErr.message}`);
                                }
                            },
                            modal: {
                                ondismiss: function () {
                                    showToast("Razorpay checkout cancelled.");
                                }
                            }
                        };
                    }

                    const rzp = new window.Razorpay(options);
                    rzp.open();
                } catch (err) {
                    razorpayBtn.disabled = false;
                    razorpayBtn.style.opacity = "1";
                    showToast(`Razorpay checkout error: ${err.message}`);
                }
            });
        }

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
        if (elements.resetClose) elements.resetClose.addEventListener("click", closeModals);

        if (elements.authToggleBtn) elements.authToggleBtn.addEventListener("click", toggleAuthMode);
        if (elements.authForgotBtn) elements.authForgotBtn.addEventListener("click", () => setAuthMode("forgot"));
        if (elements.authForm) elements.authForm.addEventListener("submit", handleAuthSubmit);
        if (elements.resetForm) elements.resetForm.addEventListener("submit", handleResetSubmit);

        if (elements.resetPasswordToggle) {
            elements.resetPasswordToggle.addEventListener("click", () => {
                const isPassword = elements.resetPassword.getAttribute("type") === "password";
                elements.resetPassword.setAttribute("type", isPassword ? "text" : "password");
                elements.resetPasswordToggle.textContent = isPassword ? "Hide" : "Show";
            });
        }

        if (elements.oauthGoogleBtn) elements.oauthGoogleBtn.addEventListener("click", () => handleOAuth("google"));
        if (elements.oauthGithubBtn) elements.oauthGithubBtn.addEventListener("click", () => handleOAuth("github"));
        if (elements.logoutBtn) elements.logoutBtn.addEventListener("click", handleLogout);

        // Settings Tabs switching
        const settingsTabs = [
            { btn: elements.settingsProfileBtn, panel: elements.tabProfile },
            { btn: elements.settingsGeneralBtn, panel: elements.tabGeneral },
            { btn: elements.settingsPersonalizationBtn, panel: elements.tabPersonalization },
            { btn: elements.settingsMcpBtn, panel: elements.tabMcp }
        ];
        settingsTabs.forEach(({ btn, panel }) => {
            if (btn && panel) {
                btn.addEventListener("click", () => {
                    settingsTabs.forEach(t => {
                        if (t.btn) t.btn.classList.remove("active");
                        if (t.panel) t.panel.classList.add("hidden");
                    });
                    btn.classList.add("active");
                    panel.classList.remove("hidden");
                });
            }
        });

        // Personalization Custom Instructions Form Submit
        if (elements.personalizationForm) {
            elements.personalizationForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const aboutVal = elements.personalizationAbout.value.trim();
                const responseVal = elements.personalizationResponse.value.trim();
                const enabledVal = elements.personalizationEnabled ? elements.personalizationEnabled.checked : true;
                
                showToast("Saving custom instructions...");
                try {
                    const res = await postJson("/api/user/personalization", {
                        userId: state.userId,
                        about: aboutVal,
                        response: responseVal,
                        enabled: enabledVal
                    });
                    if (res.ok) {
                        state.customInstructions = {
                            about: aboutVal,
                            response: responseVal,
                            enabled: enabledVal
                        };
                        showToast("Custom instructions saved successfully!");
                    } else {
                        showToast(`Save failed: ${res.error}`);
                    }
                } catch (err) {
                    showToast(`Error saving: ${err.message}`);
                }
            });
        }

        if (elements.authPasswordToggle) {
            elements.authPasswordToggle.addEventListener("click", () => {
                const isPassword = elements.authPassword.getAttribute("type") === "password";
                elements.authPassword.setAttribute("type", isPassword ? "text" : "password");
                elements.authPasswordToggle.textContent = isPassword ? "Hide" : "Show";
            });
        }

        // Theme selection event listeners
        if (elements.themeDarkBtn) elements.themeDarkBtn.addEventListener("click", () => applyTheme("dark"));
        if (elements.themeLightBtn) elements.themeLightBtn.addEventListener("click", () => applyTheme("light"));
        if (elements.themeSystemBtn) elements.themeSystemBtn.addEventListener("click", () => applyTheme("system"));

        const themeToggleBtn = document.getElementById("theme-toggle-btn");
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener("click", () => {
                const currentTheme = localStorage.getItem("wondrilla_theme") || (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
                const nextTheme = currentTheme === "light" ? "dark" : "light";
                applyTheme(nextTheme);
            });
        }

        // Accent color selection event listeners
        const accentPicker = document.querySelector(".accent-picker");
        if (accentPicker) {
            accentPicker.addEventListener("click", (e) => {
                const btn = e.target.closest(".accent-btn");
                if (btn) {
                    const color = btn.getAttribute("data-color");
                    applyAccent(color);
                }
            });
        }

        // Clear Chats event listener
        if (elements.clearChatsBtn) {
            elements.clearChatsBtn.addEventListener("click", async () => {
                if (confirm("Are you sure you want to permanently clear all your chat history? This action cannot be undone.")) {
                    showToast("Clearing chat history...");
                    try {
                        const res = await postJson("/api/messages/clear", { userId: state.userId });
                        if (res.ok) {
                            elements.messages.innerHTML = "";
                            elements.welcomeState.classList.remove("hidden");
                            showToast("All conversations cleared successfully!");
                            closeModals();
                        } else {
                            showToast(`Failed to clear chats: ${res.error}`);
                        }
                    } catch (err) {
                        showToast(`Error: ${err.message}`);
                    }
                }
            });
        }

        // Delete Account event listener
        if (elements.deleteAccountBtn) {
            elements.deleteAccountBtn.addEventListener("click", async () => {
                if (confirm("WARNING: Are you sure you want to delete your Wondrilla account? All profile details, settings, and chat history will be permanently deleted. This action cannot be undone.")) {
                    showToast("Deleting account...");
                    try {
                        const res = await postJson("/api/user/delete", { userId: state.userId });
                        if (res.ok) {
                            showToast("Account deleted successfully.");
                            handleLogout();
                            closeModals();
                        } else {
                            showToast(`Failed to delete account: ${res.error}`);
                        }
                    } catch (err) {
                        showToast(`Error: ${err.message}`);
                    }
                }
            });
        }

        // Claude-style Add Connector Dropdown Handlers
        const addConnectorBtn = document.getElementById("add-connector-btn");
        const addConnectorMenu = document.getElementById("add-connector-menu");
        const browseConnectorsItem = document.getElementById("browse-connectors-item");
        const addCustomConnectorItem = document.getElementById("add-custom-connector-item");

        if (addConnectorBtn && addConnectorMenu) {
            addConnectorBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                addConnectorMenu.classList.toggle("hidden");
            });

            document.addEventListener("click", (e) => {
                if (addConnectorMenu && !addConnectorMenu.contains(e.target) && e.target !== addConnectorBtn) {
                    addConnectorMenu.classList.add("hidden");
                }
            });
        }

        if (browseConnectorsItem) {
            browseConnectorsItem.addEventListener("click", () => {
                if (addConnectorMenu) addConnectorMenu.classList.add("hidden");
                const grid = document.querySelector(".featured-connectors-section");
                if (grid) grid.scrollIntoView({ behavior: "smooth" });
            });
        }

        if (addCustomConnectorItem) {
            addCustomConnectorItem.addEventListener("click", () => {
                if (addConnectorMenu) addConnectorMenu.classList.add("hidden");
                const customConnectorModal = document.getElementById("custom-connector-modal");
                if (customConnectorModal) {
                    customConnectorModal.classList.remove("hidden");
                    const nameInput = document.getElementById("modal-mcp-name");
                    if (nameInput) setTimeout(() => nameInput.focus(), 100);
                }
            });
        }

        const customConnectorModal = document.getElementById("custom-connector-modal");
        const customConnectorClose = document.getElementById("custom-connector-close");
        const customConnectorCancelBtn = document.getElementById("custom-connector-cancel-btn");
        const customConnectorModalForm = document.getElementById("custom-connector-modal-form");
        const modalMcpType = document.getElementById("modal-mcp-type");
        const modalMcpCmdFields = document.getElementById("modal-mcp-command-fields");
        const modalMcpSseFields = document.getElementById("modal-mcp-sse-fields");

        if (modalMcpType) {
            modalMcpType.addEventListener("change", () => {
                const isSse = modalMcpType.value === "sse";
                if (modalMcpCmdFields) modalMcpCmdFields.classList.toggle("hidden", isSse);
                if (modalMcpSseFields) modalMcpSseFields.classList.toggle("hidden", !isSse);
            });
        }

        const closeCustomConnectorModal = () => {
            if (customConnectorModal) customConnectorModal.classList.add("hidden");
        };

        if (customConnectorClose) customConnectorClose.addEventListener("click", closeCustomConnectorModal);
        if (customConnectorCancelBtn) customConnectorCancelBtn.addEventListener("click", closeCustomConnectorModal);
        if (customConnectorModal) {
            customConnectorModal.addEventListener("click", (e) => {
                if (e.target === customConnectorModal) closeCustomConnectorModal();
            });
        }

        if (customConnectorModalForm) {
            customConnectorModalForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const name = document.getElementById("modal-mcp-name").value.trim();
                const type = document.getElementById("modal-mcp-type").value;
                const command = document.getElementById("modal-mcp-command").value.trim();
                const argsStr = document.getElementById("modal-mcp-args").value.trim();
                const envStr = document.getElementById("modal-mcp-env").value.trim();
                const url = document.getElementById("modal-mcp-url").value.trim();

                let args = [];
                if (argsStr) args = argsStr.split(",").map(a => a.trim()).filter(Boolean);

                let env = {};
                if (envStr) {
                    try {
                        env = JSON.parse(envStr);
                    } catch (err) {
                        showToast("Invalid Environment Variables JSON format");
                        return;
                    }
                }

                showToast(`Connecting custom connector '${name}'...`);

                try {
                    const payload = { name, type, command, args, env, url, userId: state.userId };
                    const res = await postJson("/api/mcp/add", payload);
                    if (res.ok) {
                        showToast(`Custom Connector '${name}' connected successfully!`);
                        closeCustomConnectorModal();
                        customConnectorModalForm.reset();
                        fetchMcpServers();
                    } else {
                        showToast(`Failed to connect server: ${res.error}`);
                    }
                } catch (err) {
                    showToast(`Error: ${err.message}`);
                }
            });
        }
    }

    function setAuthMode(mode) {
        authMode = mode;
        if (elements.authPassword) {
            elements.authPassword.setAttribute("type", "password");
            elements.authPassword.value = "";
        }
        if (elements.authPasswordToggle) {
            elements.authPasswordToggle.textContent = "Show";
        }
        if (elements.authEmail) {
            elements.authEmail.value = "";
        }
        if (elements.authName) {
            elements.authName.value = "";
        }

        const overline = document.getElementById("auth-overline");

        if (mode === "signin") {
            if (overline) overline.textContent = "ACCOUNT ACCESS";
            elements.authTitle.textContent = "Sign In to Wondrilla";
            elements.authSubmitText.textContent = "Sign In";
            elements.authToggleText.textContent = "Don't have an account?";
            elements.authToggleBtn.textContent = "Create Account";
            
            elements.authNameGroup.classList.add("hidden");
            elements.authName.required = false;
            elements.authPasswordGroup.classList.remove("hidden");
            elements.authPassword.required = true;
        } else if (mode === "signup") {
            if (overline) overline.textContent = "CREATE ACCOUNT";
            elements.authTitle.textContent = "Create Wondrilla Account";
            elements.authSubmitText.textContent = "Create Account";
            elements.authToggleText.textContent = "Already have an account?";
            elements.authToggleBtn.textContent = "Sign In";
            
            elements.authNameGroup.classList.remove("hidden");
            elements.authName.required = true;
            elements.authPasswordGroup.classList.remove("hidden");
            elements.authPassword.required = true;
        } else if (mode === "forgot") {
            if (overline) overline.textContent = "PASSWORD RECOVERY";
            elements.authTitle.textContent = "Recover Password";
            elements.authSubmitText.textContent = "Send Reset Link";
            elements.authToggleText.textContent = "Remembered your password?";
            elements.authToggleBtn.textContent = "Sign In";
            
            elements.authNameGroup.classList.add("hidden");
            elements.authName.required = false;
            elements.authPasswordGroup.classList.add("hidden");
            elements.authPassword.required = false;
        }
    }

    function toggleAuthMode() {
        if (authMode === "signin" || authMode === "forgot") {
            setAuthMode("signup");
        } else {
            setAuthMode("signin");
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

        if (authMode === "signin") {
            elements.authSubmitText.textContent = "Signing In...";
        } else if (authMode === "signup") {
            elements.authSubmitText.textContent = "Creating Account...";
        } else if (authMode === "forgot") {
            elements.authSubmitText.textContent = "Sending Link...";
        }

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
                if (data?.session) {
                    showToast("Account created successfully!");
                    closeModals();
                } else {
                    showToast("Account created! Check your email for verification link.");
                    setAuthMode("signin");
                }
            } else if (authMode === "signin") {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                showToast("Signed in successfully!");
                closeModals();
            } else if (authMode === "forgot") {
                const res = await fetch("/api/auth/reset-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                if (!res.ok || !data.ok) {
                    throw new Error(data.error || "Failed to send reset email");
                }
                showToast("Password reset link sent to your email!");
                setAuthMode("signin");
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

    async function handleResetSubmit(event) {
        event.preventDefault();
        if (!supabaseClient) {
            showToast("Supabase client not initialized.");
            return;
        }
        const newPassword = elements.resetPassword.value;
        const submitBtn = elements.resetSubmitBtn;
        const submitText = elements.resetSubmitText;

        submitBtn.disabled = true;
        submitText.textContent = "Updating...";

        try {
            const { error } = await supabaseClient.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;
            showToast("Password updated successfully!");
            closeModals();
        } catch (error) {
            console.error("Failed to update password:", error);
            showToast(`Error: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitText.textContent = "Update Password";
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

    function getUserName(user) {
        if (!user) return "Guest";
        return user.user_metadata?.display_name || 
               user.user_metadata?.full_name || 
               user.user_metadata?.name || 
               user.user_metadata?.user_name || 
               user.email.split("@")[0];
    }

    function openProfileModal() {
        if (!loggedInUser) return;
        const displayName = getUserName(loggedInUser);
        elements.profileEmail.textContent = loggedInUser.email;
        elements.profileName.textContent = displayName;
        
        // Large Avatar Initials
        const initials = displayName.slice(0, 2).toUpperCase();
        const avatarLarge = document.getElementById("profile-avatar-large");
        if (avatarLarge) avatarLarge.textContent = initials;
        
        // Plan & Badge
        const planName = state.plan.charAt(0).toUpperCase() + state.plan.slice(1);
        elements.profilePlan.textContent = planName + " Plan";
        
        const badgePro = document.getElementById("profile-badge-pro");
        if (badgePro) {
            if (state.plan === "studio") {
                badgePro.className = "profile-badge studio";
                badgePro.innerHTML = '<i class="dot" style="background:#c084fc; box-shadow: 0 0 8px #c084fc;"></i>Studio Member';
            } else if (state.plan === "pro") {
                badgePro.className = "profile-badge pro";
                badgePro.innerHTML = '<i class="dot"></i>Pro Member';
            } else {
                badgePro.className = "profile-badge free";
                badgePro.innerHTML = "Free Plan";
            }
        }
        
        // Usage progress bar
        const limit = planLimit();
        elements.profileUsed.textContent = `${state.used} / ${limit.toLocaleString()} messages`;
        
        const progressFill = document.getElementById("profile-progress-fill");
        if (progressFill) {
            const percentage = Math.min(100, Math.max(0, (state.used / limit) * 100));
            progressFill.style.width = `${percentage}%`;
        }

        // Custom Instructions
        if (elements.personalizationAbout) elements.personalizationAbout.value = state.customInstructions.about || "";
        if (elements.personalizationResponse) elements.personalizationResponse.value = state.customInstructions.response || "";
        if (elements.personalizationEnabled) elements.personalizationEnabled.checked = state.customInstructions.enabled !== false;

        // Reset Settings tab to Profile
        if (elements.settingsProfileBtn) elements.settingsProfileBtn.click();
        
        openModal(elements.profileModal);
    }

    function applyTheme(theme) {
        localStorage.setItem("wondrilla_theme", theme);
        
        // Remove active class from all theme buttons
        if (typeof elements !== "undefined" && elements) {
            [elements.themeDarkBtn, elements.themeLightBtn, elements.themeSystemBtn].forEach(btn => {
                if (btn) btn.classList.remove("active");
            });

            // Set active button
            if (theme === "dark" && elements.themeDarkBtn) elements.themeDarkBtn.classList.add("active");
            if (theme === "light" && elements.themeLightBtn) elements.themeLightBtn.classList.add("active");
            if (theme === "system" && elements.themeSystemBtn) elements.themeSystemBtn.classList.add("active");
        }

        const useLight = theme === "light" || (theme === "system" && window.matchMedia("(prefers-color-scheme: light)").matches);
        if (useLight) {
            document.documentElement.setAttribute("data-theme", "light");
            document.body.classList.add("light-mode");
            document.body.classList.add("light-theme");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            document.body.classList.remove("light-mode");
            document.body.classList.remove("light-theme");
        }

        const themeText = document.getElementById("theme-toggle-text");
        if (themeText) {
            themeText.textContent = useLight ? "Appearance: Light ☀️" : "Appearance: Dark 🌙";
        }
    }

    // Set up auto listener for system theme changes
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
        const storedTheme = localStorage.getItem("wondrilla_theme") || "dark";
        if (storedTheme === "system") {
            applyTheme("system");
        }
    });

    const accentColors = {
        blue: { acid: "#2563eb", acidDeep: "#1d4ed8" },
        coral: { acid: "#f26b4a", acidDeep: "#dd5a3b" },
        green: { acid: "#4f8f75", acidDeep: "#3f7861" },
        gold: { acid: "#d49a2a", acidDeep: "#b28020" }
    };

    function applyAccent(color) {
        if (!accentColors[color]) color = "blue";
        localStorage.setItem("wondrilla_accent", color);

        // Update active class on accent color buttons
        const accentPicker = document.querySelector(".accent-picker");
        if (accentPicker) {
            const btns = accentPicker.querySelectorAll(".accent-btn");
            btns.forEach(btn => {
                if (btn.getAttribute("data-color") === color) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
        }

        // Apply css variable overrides on document root
        const root = document.documentElement;
        root.style.setProperty("--acid", accentColors[color].acid);
        root.style.setProperty("--acid-deep", accentColors[color].acidDeep);
    }

    // Initialize Theme & Accent color on startup
    setTimeout(() => {
        const initialTheme = localStorage.getItem("wondrilla_theme") || "dark";
        const initialAccent = localStorage.getItem("wondrilla_accent") || "blue";
        applyTheme(initialTheme);
        applyAccent(initialAccent);
    }, 50);

    function handleUserLogin(user) {
        loggedInUser = user;
        state.userId = user.id;
        
        const displayName = getUserName(user);
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

    function hideAppLoadingScreen() {
        const loader = document.getElementById("app-loading-screen");
        if (loader && !loader.classList.contains("fade-out")) {
            loader.classList.add("fade-out");
            setTimeout(() => {
                loader.remove();
            }, 400);
        }
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
                    if (event === "PASSWORD_RECOVERY") {
                        console.log("PASSWORD_RECOVERY event received");
                        openModal(elements.resetModal);
                    } else if (session && session.user) {
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
            const emailParam = loggedInUser && loggedInUser.email ? `&email=${encodeURIComponent(loggedInUser.email)}` : "";
            const userData = await fetchJson(`/api/user?userId=${state.userId}${emailParam}`);
            if (userData.ok && userData.user) {
                state.plan = userData.user.plan || "free";
                state.used = userData.user.messages_used || 0;
                state.customInstructions = {
                    about: userData.user.custom_instructions_about || "",
                    response: userData.user.custom_instructions_response || "",
                    enabled: userData.user.custom_instructions_enabled !== false
                };
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
        } finally {
            hideAppLoadingScreen();
        }
    }

    let mcpServers = [];

    async function initMcpUi() {
        if (!elements.settingsMcpBtn) return;

        elements.mcpType.addEventListener("change", (e) => {
            const isCommand = e.target.value === "command";
            elements.mcpCommandFields.classList.toggle("hidden", !isCommand);
            elements.mcpSseFields.classList.toggle("hidden", isCommand);
        });

        const tabs = [
            { btn: elements.tabServersBtn, tab: elements.mcpTabServers },
            { btn: elements.tabAddBtn, tab: elements.mcpTabAdd },
            { btn: elements.tabTesterBtn, tab: elements.mcpTabTester }
        ];

        tabs.forEach(({ btn, tab }) => {
            btn.addEventListener("click", () => {
                tabs.forEach(t => {
                    t.btn.classList.remove("active");
                    t.tab.classList.add("hidden");
                });
                btn.classList.add("active");
                tab.classList.remove("hidden");
                
                if (tab === elements.mcpTabServers) {
                    refreshMcpServersList();
                } else if (tab === elements.mcpTabTester) {
                    populateTesterDropdowns();
                }
            });
        });

        // Handle Category Pills Filtering
        document.querySelectorAll(".category-pill").forEach(pill => {
            pill.addEventListener("click", () => {
                document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");

                const cat = pill.getAttribute("data-category");
                document.querySelectorAll(".connector-card").forEach(card => {
                    if (cat === "all" || card.getAttribute("data-category") === cat) {
                        card.classList.remove("hidden");
                    } else {
                        card.classList.add("hidden");
                    }
                });
            });
        });

        let activeApp = null;
        
        // Handle click on Featured App Connectors
        document.querySelectorAll(".connector-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const app = btn.getAttribute("data-app");
                
                // If already connected, do nothing or show toast
                const isConnected = btn.textContent.includes("Connected");
                if (isConnected) {
                    showToast("This integration is already connected!");
                    return;
                }
                
                activeApp = app;

                const templates = ["canva", "airtable", "figma", "spotify", "calendar", "slack", "discord", "googledrive", "notion", "stripe"];
                if (templates.includes(app)) {
                    // Custom formatting for display names
                    let formattedName = app.charAt(0).toUpperCase() + app.slice(1);
                    if (app === "googledrive") formattedName = "Google Drive";
                    showToast(`${formattedName} connector integration is coming soon in Wondrilla Plus! ✨`);
                    return;
                }
                
                // Handle 1-click install for Image Generator!
                if (app === "image") {
                    showToast("Connecting Wondrilla Image AI...");
                    try {
                        const res = await postJson("/api/mcp", {
                            name: "wondrilla-image-generator",
                            config: {
                                command: "node",
                                args: ["d:/Wondrilla/mcp-image-server.js"]
                            }
                        });
                        if (res.ok) {
                            showToast("Image AI successfully connected!");
                            refreshMcpServersList();
                        } else {
                            showToast(`Connection failed: ${res.error || 'Unknown error'}`);
                        }
                    } catch (e) {
                        showToast(`Connection error: ${e.message}`);
                    }
                    return;
                }
                
                // Otherwise show popup/modal for credential input
                let fieldsHtml = "";
                let title = "";
                let lead = "";
                
                if (app === "github") {
                    title = "Connect GitHub";
                    lead = "Generate a Personal Access Token on GitHub with 'repo' scope to enable search and commit management.";
                    fieldsHtml = `
                        <div class="form-group">
                            <label for="mcp-connect-github-pat">Personal Access Token</label>
                            <input type="password" id="mcp-connect-github-pat" placeholder="github_pat_..." required style="width: 100%;">
                        </div>
                    `;
                } else if (app === "supabase") {
                    title = "Connect Supabase";
                    lead = "Provide your Supabase URL or project reference to query database and retrieve logs.";
                    fieldsHtml = `
                        <div class="form-group">
                            <label for="mcp-connect-supabase-url">Project Reference or URL</label>
                            <input type="text" id="mcp-connect-supabase-url" placeholder="e.g. axiedgydeegbtoeprubt or https://mcp.supabase.com/mcp?project_ref=..." required style="width: 100%;">
                        </div>
                    `;
                } else if (app === "paypal") {
                    title = "Connect PayPal";
                    lead = "Enter your PayPal Sandbox/Production Rest API Access Token to query plan details.";
                    fieldsHtml = `
                        <div class="form-group">
                            <label for="mcp-connect-paypal-token">PayPal Access Token</label>
                            <input type="password" id="mcp-connect-paypal-token" placeholder="A21AAPAD..." required style="width: 100%;">
                        </div>
                    `;
                }
                
                elements.mcpConnectTitle.textContent = title;
                elements.mcpConnectLead.textContent = lead;
                elements.mcpConnectFields.innerHTML = fieldsHtml;
                openModal(elements.mcpConnectModal);
            });
        });
        
        // Handle connect modal form submit
        elements.mcpConnectForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!activeApp) return;
            
            let name = "";
            let config = {};
            
            try {
                if (activeApp === "github") {
                    name = "github-mcp-server";
                    const token = document.getElementById("mcp-connect-github-pat").value.trim();
                    config = {
                        command: "npx",
                        args: ["-y", "@modelcontextprotocol/server-github"],
                        env: { GITHUB_PERSONAL_ACCESS_TOKEN: token }
                    };
                } else if (activeApp === "supabase") {
                    name = "supabase";
                    let urlVal = document.getElementById("mcp-connect-supabase-url").value.trim();
                    if (!urlVal.startsWith("http")) {
                        urlVal = `https://mcp.supabase.com/mcp?project_ref=${urlVal}`;
                    }
                    config = { serverUrl: urlVal };
                } else if (activeApp === "paypal") {
                    name = "paypal-mcp-server";
                    const token = document.getElementById("mcp-connect-paypal-token").value.trim();
                    config = {
                        command: "node",
                        args: ["d:/Wondrilla/run-paypal-mcp.js"],
                        env: {
                            PAYPAL_ACCESS_TOKEN: token,
                            PAYPAL_ENVIRONMENT: "PRODUCTION"
                        }
                    };
                }
                
                showToast(`Connecting '${name}'...`);
                const res = await postJson("/api/mcp", { name, config });
                
                if (res.ok) {
                    showToast(`Successfully connected to ${activeApp}!`);
                    closeModals();
                    refreshMcpServersList();
                } else {
                    showToast(`Connection failed: ${res.error || 'Unknown error'}`);
                }
            } catch (err) {
                showToast(`Error: ${err.message}`);
            }
        });

        elements.mcpAddForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = elements.mcpName.value.trim();
            const type = elements.mcpType.value;
            
            let config = {};
            if (type === "command") {
                const command = elements.mcpCommand.value.trim();
                const argsStr = elements.mcpArgs.value.trim();
                const envStr = elements.mcpEnv.value.trim();
                
                let args = [];
                if (argsStr) {
                    args = argsStr.split(",").map(a => a.trim()).filter(Boolean);
                }
                
                let env = {};
                if (envStr) {
                    try {
                        env = JSON.parse(envStr);
                    } catch (err) {
                        showToast("Invalid JSON in Environment Variables.");
                        return;
                    }
                }
                
                config = { command, args, env };
            } else {
                const serverUrl = elements.mcpUrl.value.trim();
                config = { serverUrl };
            }

            try {
                showToast("Connecting to MCP server...");
                const res = await postJson("/api/mcp", { name, config });
                if (res.ok) {
                    showToast(`MCP Server '${name}' connected successfully!`);
                    elements.mcpAddForm.reset();
                    elements.tabServersBtn.click();
                } else {
                    showToast(`Connection failed: ${res.error}`);
                }
            } catch (err) {
                showToast(`Error adding server: ${err.message}`);
            }
        });

        elements.testerServer.addEventListener("change", (e) => {
            const serverName = e.target.value;
            const srv = mcpServers.find(s => s.name === serverName);
            
            elements.testerTool.innerHTML = '<option value="">-- Choose Tool --</option>';
            if (srv && srv.status === "Connected" && srv.tools.length > 0) {
                elements.testerTool.disabled = false;
                srv.tools.forEach(tool => {
                    const opt = document.createElement("option");
                    opt.value = tool.name;
                    opt.textContent = `${tool.name} (${tool.description || 'No description'})`;
                    elements.testerTool.appendChild(opt);
                });
            } else {
                elements.testerTool.disabled = true;
                elements.runToolBtn.disabled = true;
            }
        });

        elements.testerTool.addEventListener("change", (e) => {
            const toolName = e.target.value;
            elements.runToolBtn.disabled = !toolName;
            
            const serverName = elements.testerServer.value;
            const srv = mcpServers.find(s => s.name === serverName);
            if (srv) {
                const tool = srv.tools.find(t => t.name === toolName);
                if (tool && tool.inputSchema) {
                    const template = {};
                    if (tool.inputSchema.properties) {
                        for (const [propName, prop] of Object.entries(tool.inputSchema.properties)) {
                            template[propName] = prop.type === "string" ? "" : prop.type === "number" ? 0 : prop.type === "boolean" ? false : null;
                        }
                    }
                    elements.testerArgs.value = JSON.stringify(template, null, 2);
                } else {
                    elements.testerArgs.value = "{}";
                }
            }
        });

        elements.runToolBtn.addEventListener("click", async () => {
            const serverName = elements.testerServer.value;
            const toolName = elements.testerTool.value;
            const argsStr = elements.testerArgs.value.trim();
            
            let args = {};
            if (argsStr) {
                try {
                    args = JSON.parse(argsStr);
                } catch (err) {
                    showToast("Invalid JSON arguments.");
                    return;
                }
            }

            elements.testerOutputContainer.classList.remove("hidden");
            elements.testerOutput.textContent = "Executing tool...";

            try {
                const res = await postJson("/api/mcp/run", { serverName, toolName, arguments: args });
                if (res.ok) {
                    elements.testerOutput.textContent = JSON.stringify(res.result, null, 2);
                } else {
                    elements.testerOutput.textContent = `Error: ${res.error}`;
                }
            } catch (err) {
                elements.testerOutput.textContent = `Error: ${err.message}`;
            }
        });
    }

    function updateFeaturedConnectors(servers) {
        const buttons = document.querySelectorAll(".connector-btn");
        buttons.forEach(btn => {
            const app = btn.getAttribute("data-app");
            let isConnected = false;
            
            if (app === "github") {
                isConnected = servers.some(s => s.name === "github-mcp-server");
            } else if (app === "supabase") {
                isConnected = servers.some(s => s.name === "supabase");
            } else if (app === "image") {
                isConnected = servers.some(s => s.name === "wondrilla-image-generator");
            } else if (app === "paypal") {
                isConnected = servers.some(s => s.name === "paypal-mcp-server" || s.name === "paypal" || s.name === "PayPal");
            }
            
            const card = btn.closest(".connector-card");
            if (isConnected) {
                btn.textContent = "✓ Connected";
                btn.style.background = "rgba(46, 125, 50, 0.15)";
                btn.style.color = "#4caf50";
                btn.style.borderColor = "#2e7d32";
                if (card) card.style.borderColor = "#2e7d32";
            } else {
                btn.textContent = "Connect";
                btn.style.background = "transparent";
                btn.style.color = "var(--ink)";
                btn.style.borderColor = "var(--line)";
                if (card) card.style.borderColor = "var(--line)";
            }
        });
    }

    async function refreshMcpServersList() {
        if (!elements.mcpServersList) return;
        elements.mcpServersList.innerHTML = "<div style='color:var(--ink-soft); font-size:13px;'>Loading servers status...</div>";

        try {
            const res = await fetchJson("/api/mcp");
            if (res.ok && Array.isArray(res.servers)) {
                mcpServers = res.servers;
                elements.mcpServersList.innerHTML = "";
                updateFeaturedConnectors(mcpServers);
                
                if (mcpServers.length === 0) {
                    elements.mcpServersList.innerHTML = "<div style='color:var(--muted); font-size:13px; text-align:center; padding: 20px;'>No MCP servers configured yet.</div>";
                    return;
                }

                mcpServers.forEach(srv => {
                    const card = document.createElement("div");
                    card.className = "mcp-server-card";
                    
                    const statusClass = srv.status.toLowerCase();
                    const srvInfo = srv.config.serverUrl ? srv.config.serverUrl : `${srv.config.command} ${srv.config.args ? srv.config.args.join(' ') : ''}`;
                    const toolsHtml = srv.status === "Connected" && srv.tools.length > 0
                        ? srv.tools.map(t => `<span class="mcp-tool-pill" title="${t.description || ''}">${t.name}</span>`).join('')
                        : "<span style='color:var(--muted); font-size:11px;'>No active tools</span>";

                    card.innerHTML = `
                        <div class="mcp-server-header">
                            <span class="mcp-server-name">
                                <span class="mcp-status-dot ${statusClass}"></span>
                                ${srv.name}
                            </span>
                            <div class="mcp-server-actions">
                                <span class="mcp-server-type">${srv.config.serverUrl ? 'sse' : 'stdio'}</span>
                                <button class="mcp-delete-btn" data-name="${srv.name}">Delete</button>
                            </div>
                        </div>
                        <div class="mcp-server-info">${srvInfo}</div>
                        ${srv.error ? `<div style="color:#d04848; font-size:11px; margin-bottom:8px;">Error: ${srv.error}</div>` : ''}
                        <div class="mcp-server-tools">
                            <div class="mcp-server-tools-title">Exposed Tools (${srv.tools.length})</div>
                            <div style="margin-top: 4px;">${toolsHtml}</div>
                        </div>
                    `;

                    card.querySelector(".mcp-delete-btn").addEventListener("click", async () => {
                        if (confirm(`Are you sure you want to delete and disconnect server '${srv.name}'?`)) {
                            try {
                                showToast(`Disconnecting '${srv.name}'...`);
                                const delRes = await fetchJson(`/api/mcp?name=${encodeURIComponent(srv.name)}`, { method: "DELETE" });
                                if (delRes.ok) {
                                    showToast(`Server '${srv.name}' deleted.`);
                                    refreshMcpServersList();
                                }
                            } catch (err) {
                                showToast(`Failed to delete: ${err.message}`);
                            }
                        }
                    });

                    elements.mcpServersList.appendChild(card);
                });
            } else {
                updateFeaturedConnectors([]);
            }
        } catch (err) {
            elements.mcpServersList.innerHTML = `<div style='color:#d04848; font-size:13px;'>Failed to load servers: ${err.message}</div>`;
        }
    }

    function populateTesterDropdowns() {
        elements.testerServer.innerHTML = '<option value="">-- Choose Server --</option>';
        elements.testerTool.innerHTML = '<option value="">-- Choose Tool --</option>';
        elements.testerTool.disabled = true;
        elements.runToolBtn.disabled = true;
        elements.testerOutputContainer.classList.add("hidden");

        mcpServers.forEach(srv => {
            const opt = document.createElement("option");
            opt.value = srv.name;
            opt.textContent = `${srv.name} (${srv.status})`;
            elements.testerServer.appendChild(opt);
        });
    }

    function initMarketingHub() {
        const topicInput = document.getElementById("marketing-topic-input");
        const generateBtn = document.getElementById("generate-campaign-btn");
        const resultsDiv = document.getElementById("campaign-results");
        
        const twitterContent = document.getElementById("mkt-twitter-content");
        const igCaption = document.getElementById("mkt-ig-caption");
        const igImage = document.getElementById("mkt-ig-image");
        const igLoader = document.getElementById("mkt-ig-loader");
        const facebookContent = document.getElementById("mkt-facebook-content");
        const youtubeContent = document.getElementById("mkt-youtube-content");
        
        const copyTwitterBtn = document.getElementById("copy-twitter-btn");
        const copyIgBtn = document.getElementById("copy-ig-btn");
        const copyFacebookBtn = document.getElementById("copy-facebook-btn");
        const copyYoutubeBtn = document.getElementById("copy-youtube-btn");
        
        const regenerateImgBtn = document.getElementById("regenerate-ig-img-btn");
        const webhookUrlInput = document.getElementById("mkt-webhook-url");
        const publishBtn = document.getElementById("mkt-publish-btn");

        let currentCampaign = null;

        if (webhookUrlInput) {
            webhookUrlInput.value = localStorage.getItem("wondrilla_marketing_webhook") || "";
            webhookUrlInput.addEventListener("input", () => {
                localStorage.setItem("wondrilla_marketing_webhook", webhookUrlInput.value.trim());
            });
        }

        if (copyTwitterBtn) {
            copyTwitterBtn.addEventListener("click", () => {
                if (twitterContent) {
                    navigator.clipboard.writeText(twitterContent.innerText);
                    showToast("Copied X Post!");
                }
            });
        }
        if (copyIgBtn) {
            copyIgBtn.addEventListener("click", () => {
                if (igCaption) {
                    navigator.clipboard.writeText(igCaption.innerText);
                    showToast("Copied Instagram Caption!");
                }
            });
        }
        if (copyFacebookBtn) {
            copyFacebookBtn.addEventListener("click", () => {
                if (facebookContent) {
                    navigator.clipboard.writeText(facebookContent.innerText);
                    showToast("Copied Facebook Post!");
                }
            });
        }
        if (copyYoutubeBtn) {
            copyYoutubeBtn.addEventListener("click", () => {
                if (youtubeContent) {
                    navigator.clipboard.writeText(youtubeContent.innerText);
                    showToast("Copied YouTube Script!");
                }
            });
        }

        async function triggerImageGeneration(promptText) {
            if (!igImage || !igLoader) return;
            igImage.style.opacity = "0";
            igLoader.classList.remove("hidden");
            
            const seed = Math.floor(Math.random() * 1000000);
            const fullUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=512&height=512&nologo=true&private=true&seed=${seed}`;
            
            const img = new Image();
            img.onload = () => {
                igImage.src = fullUrl;
                igImage.style.opacity = "1";
                igLoader.classList.add("hidden");
            };
            img.onerror = () => {
                igLoader.classList.add("hidden");
                showToast("Failed to generate campaign image");
            };
            img.src = fullUrl;
        }

        if (regenerateImgBtn) {
            regenerateImgBtn.addEventListener("click", () => {
                if (!currentCampaign || !currentCampaign.instagram_image_prompt) {
                    showToast("Please generate a campaign first.");
                    return;
                }
                const newPrompt = prompt("Modify image generation prompt if desired:", currentCampaign.instagram_image_prompt);
                if (newPrompt !== null && newPrompt.trim() !== "") {
                    currentCampaign.instagram_image_prompt = newPrompt;
                    triggerImageGeneration(newPrompt);
                }
            });
        }

        if (generateBtn) {
            generateBtn.addEventListener("click", async () => {
                const topic = topicInput.value.trim();
                if (!topic) {
                    showToast("Please enter what you are promoting.");
                    return;
                }

                generateBtn.disabled = true;
                generateBtn.textContent = "Generating package...";
                showToast("AI is writing your marketing posts...");

                const promptText = `You are a professional social media marketing manager.
Generate a marketing package for a new campaign about this topic: "${topic}".
Generate for these platforms:
1. X/Twitter (Max 280 chars, highly engaging, hashtags).
2. Instagram (An emoji-rich caption with call to action, and a short 10-word description of the image concept we should generate).
3. Facebook (A longer, professional, and detailed post outlining the benefits).
4. YouTube (A script for a 30-second Short, including visual cues and voiceover lines).

Return your response in a clean, structured JSON format with EXACTLY these keys:
{
  "twitter": "...",
  "instagram_caption": "...",
  "instagram_image_prompt": "A prompt describing a beautiful, modern, minimalist 3D render, dark background, vibrant neon accents representing the topic, for Pollinations image generation",
  "facebook": "...",
  "youtube_script": "..."
}
Do NOT wrap the response in markdown code blocks. Return only raw JSON.`;

                try {
                    const response = await gatewayChat({
                        userId: state.userId,
                        modelId: state.selectedModel,
                        prompt: promptText,
                        compare: false,
                        web: false,
                        customInstructions: ""
                    });

                    let text = response.text || "";
                    // Clean up markdown wrapper blocks
                    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
                    
                    let data;
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                        data = {
                            twitter: text.match(/twitter\x22?\s*:\s*\x22([\s\S]*?)\x22\s*,?\s*\x22?instagram/i)?.[1] || text,
                            instagram_caption: text.match(/instagram_caption\x22?\s*:\s*\x22([\s\S]*?)\x22\s*,?/i)?.[1] || "Checkout Wondrilla!",
                            instagram_image_prompt: text.match(/instagram_image_prompt\x22?\s*:\s*\x22([\s\S]*?)\x22\s*,?/i)?.[1] || topic,
                            facebook: text.match(/facebook\x22?\s*:\s*\x22([\s\S]*?)\x22\s*,?/i)?.[1] || text,
                            youtube_script: text.match(/youtube_script\x22?\s*:\s*\x22([\s\S]*?)\x22\s*/i)?.[1] || text
                        };
                    }

                    currentCampaign = data;

                    if (twitterContent) twitterContent.textContent = data.twitter;
                    if (igCaption) igCaption.textContent = data.instagram_caption;
                    if (facebookContent) facebookContent.textContent = data.facebook;
                    if (youtubeContent) youtubeContent.textContent = data.youtube_script;

                    if (resultsDiv) resultsDiv.classList.remove("hidden");
                    showToast("Marketing campaign generated!");

                    triggerImageGeneration(data.instagram_image_prompt);

                } catch (error) {
                    showToast("Generation failed: " + error.message);
                } finally {
                    generateBtn.disabled = false;
                    generateBtn.textContent = "Generate Marketing Campaign";
                }
            });
        }

        if (publishBtn) {
            publishBtn.addEventListener("click", async () => {
                const webhookUrl = webhookUrlInput.value.trim();
                if (!webhookUrl) {
                    showToast("Please enter a webhook URL first.");
                    return;
                }
                if (!currentCampaign) {
                    showToast("Please generate a campaign first.");
                    return;
                }

                publishBtn.disabled = true;
                publishBtn.textContent = "Publishing...";

                try {
                    const payload = {
                        app: "Wondrilla",
                        campaign: currentCampaign,
                        imageUrl: igImage ? igImage.src : "",
                        timestamp: new Date().toISOString()
                    };

                    await fetch(webhookUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                        mode: "no-cors"
                    });

                    showToast("Campaign published to webhook successfully!");
                } catch (error) {
                    showToast("Publishing failed: " + error.message);
                } finally {
                    publishBtn.disabled = false;
                    publishBtn.textContent = "Publish to Channels";
                }
            });
        }
    }

    function hideLoadingScreen() {
        const loadingScreen = document.getElementById("app-loading-screen");
        if (loadingScreen) {
            loadingScreen.classList.add("fade-out");
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 400);
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
    initMcpUi();
    initMarketingHub();
    hideLoadingScreen();
})();