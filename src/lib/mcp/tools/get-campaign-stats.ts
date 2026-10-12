import { defineTool } from "@lovable.dev/mcp-js";
import { campaignStats } from "../../mailforge-data";

export default defineTool({
  name: "get_campaign_stats",
  title: "Get campaign stats",
  description: "Get totals for the current campaign: recipients, sent, failed and remaining.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const s = campaignStats;
    return {
      content: [{ type: "text", text: `"${s.subject}": ${s.total} recipients, ${s.sent} sent, ${s.failed} failed, ${s.remaining} remaining.` }],
      structuredContent: { stats: { ...s } },
    };
  },
});
