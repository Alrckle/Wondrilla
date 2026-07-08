// Simple Stdio MCP Server that exposes a "generate_image" tool
// It uses pollination.ai free API to return an image URL

process.stdin.setEncoding("utf8");

let buffer = "";
process.stdin.on("data", (chunk) => {
    buffer += chunk;
    let lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
        if (line.trim()) {
            handleRequest(line.trim());
        }
    }
});

function sendResponse(id, result, error = null) {
    const response = {
        jsonrpc: "2.0",
        id
    };
    if (error) {
        response.error = error;
    } else {
        response.result = result;
    }
    process.stdout.write(JSON.stringify(response) + "\n");
}

function handleRequest(line) {
    try {
        const req = JSON.parse(line);
        if (req.method === "tools/list") {
            sendResponse(req.id, {
                tools: [
                    {
                        name: "generate_image",
                        description: "Generate an image using AI from a text prompt. Returns a markdown image syntax containing the generated image URL.",
                        inputSchema: {
                            type: "object",
                            properties: {
                                prompt: {
                                    type: "string",
                                    description: "Describe the image you want to generate in detail."
                                }
                            },
                            required: ["prompt"]
                        }
                    }
                ]
            });
        } else if (req.method === "tools/call") {
            const { name, arguments: args } = req.params || {};
            if (name === "generate_image") {
                const prompt = args.prompt || "a beautiful sunset";
                const encoded = encodeURIComponent(prompt);
                const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true`;
                
                // Return markdown image link so LLM can render it inline!
                sendResponse(req.id, {
                    content: [
                        {
                            type: "text",
                            text: `Generated image successfully:\n\n![${prompt}](${imageUrl})`
                        }
                    ]
                });
            } else {
                sendResponse(req.id, null, { code: -32601, message: `Tool '${name}' not found` });
            }
        } else {
            // Echo back for other methods if needed
            sendResponse(req.id, {});
        }
    } catch (e) {
        // Ignore parse errors
    }
}
