import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read token from environment variable or fallback to local .env
let token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
    try {
        const envPath = path.join(__dirname, ".env");
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, "utf8");
            const match = content.match(/SUPABASE_ACCESS_TOKEN=(.*)/);
            if (match) token = match[1].trim();
        }
    } catch (e) {}
}

if (token) {
    process.argv.push(`--access-token=${token}`);
}
process.argv.push("--project-ref=xtkmpkxqkkqjdwuukifa");

const target = pathToFileURL(path.join(__dirname, "node_modules/@supabase/mcp-server-supabase/dist/cli.js")).href;
await import(target);
