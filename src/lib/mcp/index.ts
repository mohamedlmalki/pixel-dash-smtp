import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listSmtpServers from "./tools/list-smtp-servers";
import getCampaignStats from "./tools/get-campaign-stats";
import listSendingLogs from "./tools/list-sending-logs";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "pixel-dash-smtp",
  title: "Pixel Dash Smtp",
  version: "0.1.0",
  instructions: "Read-only tools for the MailForge SMTP dashboard: SMTP servers, campaign totals and delivery logs.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listSmtpServers, getCampaignStats, listSendingLogs],
});
