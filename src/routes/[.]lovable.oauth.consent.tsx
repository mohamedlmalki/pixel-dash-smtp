import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Details = {
  client?: { name?: string; redirect_uri?: string; uri?: string } | null;
  scope?: string;
  user?: { email?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
};
type Result = { data: Details | null; error: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails(id: string): Promise<Result>;
  approveAuthorization(id: string): Promise<Result>;
  denyAuthorization(id: string): Promise<Result>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

const scopeLabels: Record<string, string> = {
  openid: "Confirm your identity",
  email: "Share your email address",
  profile: "Share your basic profile",
};

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s["authorization_id"] === "string" ? s["authorization_id"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Connect an app — MailForge" },
      { name: "description", content: "Approve an assistant's access to your MailForge dashboard." },
      { property: "og:title", content: "Connect an app — MailForge" },
      { property: "og:description", content: "Approve an assistant's access to MailForge." },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("This link is missing its authorization request. Start the connection again from your assistant.");
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login", search: { next: location.pathname + location.searchStr } });
  },
  loader: async ({ location }) => {
    const id = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(id);
    if (error) throw new Error(error.message || "This request has expired or is invalid.");
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    const { data: u } = await supabase.auth.getUser();
    return { details: data, email: u.user?.email ?? "" };
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <Shell>
      <CardHeader><CardTitle>Couldn't load this request</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground">{error instanceof Error ? error.message : String(error)}</CardContent>
    </Shell>
  ),
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">{children}</Card>
    </div>
  );
}

function Consent() {
  const { details, email } = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const client = details?.client?.name ?? "An app";
  const scopes = (details?.scope ?? "").split(" ").filter(Boolean);
  const redirectUri = details?.client?.redirect_uri ?? details?.client?.uri;

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) { setBusy(false); return setError(error.message); }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); return setError("No redirect was returned. Please try again."); }
    window.location.href = target;
  }

  async function switchAccount() {
    await supabase.auth.signOut();
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
  }

  return (
    <Shell>
      <CardHeader>
        <div className="mb-2 grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </div>
        <CardTitle>Connect {client} to MailForge</CardTitle>
        <CardDescription>This lets {client} use this app as you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="rounded-md border border-border p-3">
          <div className="text-muted-foreground">Signed in as</div>
          <div className="flex items-center justify-between">
            <span className="font-medium">{email}</span>
            <button className="text-xs text-muted-foreground hover:text-foreground" onClick={switchAccount}>Switch</button>
          </div>
          {redirectUri && <div className="mt-2 break-all text-xs text-muted-foreground">Returns to {redirectUri}</div>}
        </div>
        <div>
          <div className="mb-1 font-medium">{client} will be able to:</div>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>View your SMTP servers, campaign totals and sending logs</li>
            {scopes.map((s) => <li key={s}>{scopeLabels[s] ?? `Additional permission requested: ${s}`}</li>)}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">This does not bypass this app's permissions.</p>
        {error && <p role="alert" className="text-danger">{error}</p>}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" disabled={busy} onClick={() => decide(false)}>Cancel connection</Button>
          <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>Approve</Button>
        </div>
      </CardContent>
    </Shell>
  );
}
