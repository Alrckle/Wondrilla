// Add the required arguments to process.argv for PayPal MCP server to start properly
process.argv.push("--tools=all");

// Require and run the original package entry point
require("./node_modules/@paypal/mcp/dist/index.js");
