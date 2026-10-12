import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { sendingLogs } from "../../mailforge-data";

export default defineTool({
  name: "list_sending_logs",
  title: "List sending logs",
  description: "List recent delivery log entries, optionally filtered by status.",
  inputSchema: { status: z.enum(["Success", "Failed", "Queued"]).optional().describe("Only return entries with this status.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status }) => {
    const rows = sendingLogs.filter((l) => !status || l.status === status).map((l) => ({ ...l }));
    return {
      content: [{ type: "text", text: rows.map((l) => `${l.email} — ${l.status} ${l.time} — ${l.detail}`).join("\n") || "No entries." }],
      structuredContent: { logs: rows },
    };
  },
});
