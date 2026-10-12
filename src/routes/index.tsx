import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Mail, Plus, ChevronDown, Send, Users, CheckCircle2, XCircle, Clock, Server, Plug, Save, Activity,
} from "lucide-react";
import { smtpServers, sendingLogs, type LogStatus } from "@/lib/mailforge-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MailForge — SMTP Bulk Email Manager" },
      { name: "description", content: "Configure SMTP servers, compose campaigns and monitor bulk email delivery in real time." },
      { property: "og:title", content: "MailForge — SMTP Bulk Email Manager" },
      { property: "og:description", content: "Configure SMTP servers, compose campaigns and monitor delivery in real time." },
    ],
  }),
  component: Dashboard,
});

const tones: Record<string, string> = { Ready: "bg-success", "Rate limited": "bg-warning" };
const servers = smtpServers.map((s) => ({ name: s.name, status: s.status, tone: tones[s.status] ?? "bg-muted" }));

const recipients = `sarah.mitchell@northwind.io
david.chen@acmecorp.com
lena.fischer@brightlabs.de
marcus.oliver@vertex.co
priya.nair@helixhealth.com
tom.becker@oldmail.net`;

const html = `<h1>Q4 Product Updates</h1>
<p>Hi {{first_name}},</p>
<p>We've shipped three major features this quarter:
real-time analytics, SSO for teams, and a redesigned API.</p>
<a href="https://example.com/q4">Read the full changelog</a>
<p>— John Doe, Product Team</p>`;

type Status = LogStatus;
const logs = sendingLogs;

const statusStyle: Record<Status, string> = {
  Success: "border-success/30 bg-success/10 text-success",
  Failed: "border-danger/30 bg-danger/10 text-danger",
  Queued: "border-warning/30 bg-warning/10 text-warning",
};

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(servers[0]!);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <Mail className="size-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">MailForge</span>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span className={`size-2 rounded-full ${active.tone}`} />
                  {active.name} - {active.status}
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>SMTP servers</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {servers.map((s) => (
                  <DropdownMenuItem key={s.name} onClick={() => setActive(s)} className="gap-2">
                    <span className={`size-2 rounded-full ${s.tone}`} />
                    <span className="flex-1">{s.name}</span>
                    <span className="text-xs text-muted-foreground">{s.status}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setOpen(true)} className="gap-2">
              <Plus className="size-4" /> Add SMTP Server
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-6 p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Setup</CardTitle>
            <CardDescription>Compose your message and paste your recipient list.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="from">From Name</Label>
                <Input id="from" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" defaultValue="Q4 Product Updates" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="rcpt">Recipients</Label>
                <Badge variant="outline" className="border-success/30 bg-success/10 text-success">1,250 valid emails</Badge>
              </div>
              <Textarea id="rcpt" rows={5} defaultValue={recipients} className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Tabs defaultValue="editor">
                <TabsList>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                  <Textarea rows={12} defaultValue={html} className="font-mono text-xs" />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="rounded-md border border-border bg-muted/40 p-5">
                    <div className="mb-4 border-b border-border pb-3 text-xs text-muted-foreground">
                      <div><span className="text-foreground">From:</span> John Doe &lt;john@mailforge.io&gt;</div>
                      <div><span className="text-foreground">Subject:</span> Q4 Product Updates</div>
                    </div>
                    <h2 className="text-xl font-semibold">Q4 Product Updates</h2>
                    <p className="mt-3 text-sm">Hi Sarah,</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We've shipped three major features this quarter: real-time analytics, SSO for teams, and a redesigned API.
                    </p>
                    <Button size="sm" className="mt-4">Read the full changelog</Button>
                    <p className="mt-4 text-sm text-muted-foreground">— John Doe, Product Team</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <Button size="lg" className="h-12 w-full gap-2 text-base" onClick={() => toast.success("Campaign started — sending to 1,250 recipients")}>
              <Send className="size-5" /> Start Sending Campaign
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <Kpi label="Total Recipients" value="1,250" icon={Users} accent="text-info" bar="bg-info" />
            <Kpi label="Sent / Success" value="800" icon={CheckCircle2} accent="text-success" bar="bg-success" />
            <Kpi label="Failed" value="12" icon={XCircle} accent="text-danger" bar="bg-danger" />
            <Kpi label="Remaining" value="438" icon={Clock} accent="text-warning" bar="bg-warning" />
          </div>
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-4 text-success" /> Live Sending Logs
                </CardTitle>
                <CardDescription className="mt-1">Streaming via {active.name}</CardDescription>
              </div>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 animate-pulse rounded-full bg-success" /> Live
              </span>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((l) => (
                    <TableRow key={l.email}>
                      <TableCell className="font-medium">{l.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyle[l.status]}>{l.status}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{l.time}</TableCell>
                      <TableCell className={`font-mono text-xs ${l.status === "Failed" ? "text-danger" : "text-muted-foreground"}`}>{l.detail}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Server className="size-4" /> Add SMTP Server</DialogTitle>
            <DialogDescription>Credentials are used to authenticate outgoing mail.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Field id="cfg" label="Configuration Name" placeholder="Marketing - SendGrid" />
            <div className="grid grid-cols-[1fr_120px] gap-3">
              <Field id="host" label="Host" placeholder="smtp.example.com" />
              <div className="space-y-2">
                <Label>Port</Label>
                <Select defaultValue="587">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="587">587</SelectItem>
                    <SelectItem value="465">465</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field id="user" label="Username" placeholder="apikey" />
              <Field id="pass" label="Password" type="password" placeholder="••••••••" />
            </div>
            <Field id="fromEmail" label="From Email" type="email" placeholder="news@yourcompany.com" />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="secondary" className="gap-2" onClick={() => toast.success("Connection successful — 220 ready")}>
              <Plug className="size-4" /> Test Connection
            </Button>
            <Button className="gap-2" onClick={() => { setOpen(false); toast.success("SMTP configuration saved"); }}>
              <Save className="size-4" /> Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ id, label, ...p }: { id: string; label: string } & React.ComponentProps<"input">) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...p} />
    </div>
  );
}

function Kpi({ label, value, icon: Icon, accent, bar }: { label: string; value: string; icon: typeof Users; accent: string; bar: string }) {
  return (
    <Card className="relative overflow-hidden">
      <span className={`absolute inset-x-0 top-0 h-0.5 ${bar}`} />
      <CardContent className="p-5">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          {label}
          <Icon className={`size-4 ${accent}`} />
        </div>
        <div className={`mt-3 text-3xl font-semibold tracking-tight ${accent}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
