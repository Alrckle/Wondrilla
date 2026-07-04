import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

(function () {
    "use strict";

    const models = [
        { id: "auto", name: "Wondrilla Auto", maker: "Smart routing", mark: "W", color: "#1f211d", text: "#d9ff43", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="m12 3-1.912 5.886L4.2 9l5.886 1.912L12 16.8l1.912-5.886L19.8 9l-5.886-1.912z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/></svg>` },
        { id: "chatgpt", name: "ChatGPT", maker: "OpenAI", mark: "O", color: "#1c1e19", text: "#10a37f", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>OpenAI</title><path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"></path></svg>` },
        { id: "claude", name: "Claude", maker: "Anthropic", mark: "A", color: "#1c1e19", text: "#cc785c", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Claude</title><path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"></path></svg>` },
        { id: "grok", name: "Grok", maker: "xAI", mark: "X", color: "#1c1e19", text: "#ffffff", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Grok</title><path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"></path></svg>` },
        { id: "meta", name: "Meta AI", maker: "Meta via OpenRouter", mark: "M", color: "#1c1e19", text: "#0081fb", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Meta</title><path d="M6.897 4c1.915 0 3.516.932 5.43 3.376l.282-.373c.19-.246.383-.484.58-.71l.313-.35C14.588 4.788 15.792 4 17.225 4c1.273 0 2.469.557 3.491 1.516l.218.213c1.73 1.765 2.917 4.71 3.053 8.026l.011.392.002.25c0 1.501-.28 2.759-.818 3.7l-.14.23-.108.153c-.301.42-.664.758-1.086 1.009l-.265.142-.087.04a3.493 3.493 0 01-.302.118 4.117 4.117 0 01-1.33.208c-.524 0-.996-.067-1.438-.215-.614-.204-1.163-.56-1.726-1.116l-.227-.235c-.753-.812-1.534-1.976-2.493-3.586l-1.43-2.41-.544-.895-1.766 3.13-.343.592C7.597 19.156 6.227 20 4.356 20c-1.21 0-2.205-.42-2.936-1.182l-.168-.184c-.484-.573-.837-1.311-1.043-2.189l-.067-.32a8.69 8.69 0 01-.136-1.288L0 14.468c.002-.745.06-1.49.174-2.23l.1-.573c.298-1.53.828-2.958 1.536-4.157l.209-.34c1.177-1.83 2.789-3.053 4.615-3.16L6.897 4zm-.033 2.615l-.201.01c-.83.083-1.606.673-2.252 1.577l-.138.199-.01.018c-.67 1.017-1.185 2.378-1.456 3.845l-.004.022a12.591 12.591 0 00-.207 2.254l.002.188c.004.18.017.36.04.54l.043.291c.092.503.257.908.486 1.208l.117.137c.303.323.698.492 1.17.492 1.1 0 1.796-.676 3.696-3.641l2.175-3.4.454-.701-.139-.198C9.11 7.3 8.084 6.616 6.864 6.616zm10.196-.552l-.176.007c-.635.048-1.223.359-1.82.933l-.196.198c-.439.462-.887 1.064-1.367 1.807l.266.398c.18.274.362.56.55.858l.293.475 1.396 2.335.695 1.114c.583.926 1.03 1.6 1.408 2.082l.213.262c.282.326.529.54.777.673l.102.05c.227.1.457.138.718.138.176.002.35-.023.518-.073.338-.104.61-.32.813-.637l.095-.163.077-.162c.194-.459.29-1.06.29-1.785l-.006-.449c-.08-2.871-.938-5.372-2.2-6.798l-.176-.189c-.67-.683-1.444-1.074-2.27-1.074z"></path></svg>` },
        { id: "kimi", name: "Kimi", maker: "Moonshot AI", mark: "K", color: "#1c1e19", text: "#e63e32", svg: `<svg fill="currentColor" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 25" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Kimi</title><path d="M21.7202 0.939941C22.9502 0.939941 23.9502 1.93994 23.9502 3.16994C23.9502 4.39994 22.9502 5.39994 21.7202 5.39994H19.7502C19.6002 5.39994 19.4902 5.27994 19.4902 5.13994V3.16994C19.4902 1.93994 20.4902 0.939941 21.7202 0.939941Z" fill="#e63e32"/><path d="M9.39 13.9501L17.82 5.59012C17.98 5.43012 17.89 5.12012 17.68 5.12012H13.14C13.14 5.12012 13.04 5.14012 13 5.18012L3.92 14.1901C3.78 14.3301 3.57 14.2101 3.57 13.9801V5.39012C3.57 5.24012 3.47 5.12012 3.35 5.12012H0.219999C0.0999993 5.12012 0 5.24012 0 5.39012V23.9201C0 24.0701 0.0999993 24.1901 0.219999 24.1901H3.35C3.47 24.1901 3.57 24.0701 3.57 23.9201V20.1401C3.57 20.0601 3.6 19.9801 3.65 19.9301L6.47 17.1401C6.54 17.0701 6.63 17.0601 6.71 17.1101L14.24 22.6501C15.47 23.4801 16.85 23.9901 18.25 24.1401C18.37 24.1501 18.48 24.0301 18.48 23.8701V20.3101C18.48 20.1701 18.4 20.0601 18.29 20.0501C17.47 19.9201 16.66 19.6001 15.94 19.1101L9.42 14.3901C9.28 14.3001 9.27 14.0701 9.39 13.9501Z" fill="#ffffff"/></svg>` },
        { id: "zai", name: "Z.ai", maker: "Zhipu AI", mark: "Z", color: "#1c1e19", text: "#3a8bfd", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Z.ai</title><path d="M12.105 2L9.927 4.953H.653L2.83 2h9.276zM23.254 19.048L21.078 22h-9.242l2.174-2.952h9.244zM24 2L9.264 22H0L14.736 2H24z"></path></svg>` },
        { id: "deepseek", name: "DeepSeek", maker: "DeepSeek", mark: "D", color: "#1c1e19", text: "#0050fe", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>DeepSeek</title><path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"></path></svg>` },
        { id: "ollama", name: "Ollama Local", maker: "Local Llama/DeepSeek", mark: "🦙", color: "#1c1e19", text: "#ffffff", svg: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Ollama</title><path d="M7.905 1.09c.216.085.411.225.588.41.295.306.544.744.734 1.263.191.522.315 1.1.362 1.68a5.054 5.054 0 012.049-.636l.051-.004c.87-.07 1.73.087 2.48.474.101.053.2.11.297.17.05-.569.172-1.134.36-1.644.19-.52.439-.957.733-1.264a1.67 1.67 0 01.589-.41c.257-.1.53-.118.796-.042.401.114.745.368 1.016.737.248.337.434.769.561 1.287.23.934.27 2.163.115 3.645l.053.04.026.019c.757.576 1.284 1.397 1.563 2.35.435 1.487.216 3.155-.534 4.088l-.018.021.002.003c.417.762.67 1.567.724 2.4l.002.03c.064 1.065-.2 2.137-.814 3.19l-.007.01.01.024c.472 1.157.62 2.322.438 3.486l-.006.039a.651.651 0 01-.747.536.648.648 0 01-.54-.742c.167-1.033.01-2.069-.48-3.123a.643.643 0 01.04-.617l.004-.006c.604-.924.854-1.83.8-2.72-.046-.779-.325-1.544-.8-2.273a.644.644 0 01.18-.886l.009-.006c.243-.159.467-.565.58-1.12a4.229 4.229 0 00-.095-1.974c-.205-.7-.58-1.284-1.105-1.683-.595-.454-1.383-.673-2.38-.61a.653.653 0 01-.632-.371c-.314-.665-.772-1.141-1.343-1.436a3.288 3.288 0 00-1.772-.332c-1.245.099-2.343.801-2.67 1.686a.652.652 0 01-.61.425c-1.067.002-1.893.252-2.497.703-.522.39-.878.935-1.066 1.588a4.07 4.07 0 00-.068 1.886c.112.558.331 1.02.582 1.269l.008.007c.212.207.257.53.109.785-.36.622-.629 1.549-.673 2.44-.05 1.018.186 1.902.719 2.536l.016.019a.643.643 0 01.095.69c-.576 1.236-.753 2.252-.562 3.052a.652.652 0 01-1.269.298c-.243-1.018-.078-2.184.473-3.498l.014-.035-.008-.012a4.339 4.339 0 01-.598-1.309l-.005-.019a5.764 5.764 0 01-.177-1.785c.044-.91.278-1.842.622-2.59l.012-.026-.002-.002c-.293-.418-.51-.953-.63-1.545l-.005-.024a5.352 5.352 0 01.093-2.49c.262-.915.777-1.701 1.536-2.269.06-.045.123-.09.186-.132-.159-1.493-.119-2.73.112-3.67.127-.518.314-.95.562-1.287.27-.368.614-.622 1.015-.737.266-.076.54-.059.797.042zm4.116 9.09c.936 0 1.8.313 2.446.855.63.527 1.005 1.235 1.005 1.94 0 .888-.406 1.58-1.133 2.022-.62.375-1.451.557-2.403.557-1.009 0-1.871-.259-2.493-.734-.617-.47-.963-1.13-.963-1.845 0-.707.398-1.417 1.056-1.946.668-.537 1.55-.849 2.485-.849zm0 .896a3.07 3.07 0 00-1.916.65c-.461.37-.722.835-.722 1.25 0 .428.21.829.61 1.134.455.347 1.124.548 1.943.548.799 0 1.473-.147 1.932-.426.463-.28.7-.686.7-1.257 0-.423-.246-.89-.683-1.256-.484-.405-1.14-.643-1.864-.643zm.662 1.21l.004.004c.12.151.095.37-.056.49l-.292.23v.446a.375.375 0 01-.376.373.375.375 0 01-.376-.373v-.46l-.271-.218a.347.347 0 01-.052-.49.353.353 0 01.494-.051l.215.172.22-.174a.353.353 0 01.49.051zm-5.04-1.919c.478 0 .867.39.867.871a.87.87 0 01-.868.871.87.87 0 01-.867-.87.87.87 0 01.867-.872zm8.706 0c.48 0 .868.39.868.871a.87.87 0 01-.868.871.87.87 0 01-.867-.87.87.87 0 01.867-.872zM7.44 2.3l-.003.002a.659.659 0 00-.285.238l-.005.006c-.138.189-.258.467-.348.832-.17.692-.216 1.631-.124 2.782.43-.128.899-.208 1.404-.237l.01-.001.019-.034c.046-.082.095-.161.148-.239.123-.771.022-1.692-.253-2.444-.134-.364-.297-.65-.453-.813a.628.628 0 00-.107-.09L7.44 2.3zm9.174.04l-.002.001a.628.628 0 00-.107.09c-.156.163-.32.45-.453.814-.29.794-.387 1.776-.23 2.572l.058.097.008.014h.03a5.184 5.184 0 011.466.212c.086-1.124.038-2.043-.128-2.722-.09-.365-.21-.643-.349-.832l-.004-.006a.659.659 0 00-.285-.239h-.004z"></path></svg>` }
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