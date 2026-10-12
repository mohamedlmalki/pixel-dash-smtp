export const smtpServers = [
  { name: "Office 365", host: "smtp.office365.com", port: 587, status: "Ready" },
  { name: "Amazon SES", host: "email-smtp.eu-west-1.amazonaws.com", port: 587, status: "Ready" },
  { name: "Mailgun EU", host: "smtp.eu.mailgun.org", port: 465, status: "Rate limited" },
];
export const campaignStats = { subject: "Q4 Product Updates", fromName: "John Doe", total: 1250, sent: 800, failed: 12, remaining: 438 };
export type LogStatus = "Success" | "Failed" | "Queued";
export const sendingLogs: { email: string; status: LogStatus; time: string; detail: string }[] = [
  { email: "sarah.mitchell@northwind.io", status: "Success", time: "15:04:12", detail: "250 OK — queued as 8F2A1C" },
  { email: "david.chen@acmecorp.com", status: "Success", time: "15:04:13", detail: "250 OK — queued as 8F2A1D" },
  { email: "tom.becker@oldmail.net", status: "Failed", time: "15:04:14", detail: "550 Mailbox unavailable" },
  { email: "lena.fischer@brightlabs.de", status: "Success", time: "15:04:15", detail: "250 OK — queued as 8F2A20" },
  { email: "marcus.oliver@vertex.co", status: "Queued", time: "—", detail: "Waiting for slot" },
  { email: "priya.nair@helixhealth.com", status: "Queued", time: "—", detail: "Waiting for slot" },
];
