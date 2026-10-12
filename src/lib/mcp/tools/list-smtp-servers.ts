import { defineTool } from "@lovable.dev/mcp-js";
import { smtpServers } from "../../mailforge-data";

export default defineTool({
  name: "list_smtp_servers",
  title: "List SMTP servers",
  description: "List the configured SMTP servers with host, port and status.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: smtpServers.map((s) => `${s.name} (${s.host}:${s.port}) — ${s.status}`).join("\n") }],
    structuredContent: { servers: smtpServers.map((s) => ({ ...s })) },
  }),
});
