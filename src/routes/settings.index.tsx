import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Mail, Send, User } from "lucide-react";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/settings/")({
  head: () => ({
    meta: [
      { title: "Settings — ClientFlow AI" },
      { name: "description", content: "Manage Gmail connection, AI writing style, sending rules and your profile." },
      { property: "og:title", content: "Settings — ClientFlow AI" },
      { property: "og:description", content: "Configure your ClientFlow AI workspace." },
    ],
  }),
  component: SettingsPage,
});

const sections = [
  {
    to: "/settings/gmail",
    icon: Mail,
    title: "Gmail connection",
    description: "Connect the inbox that sends your outreach and monitor daily quota.",
  },
  {
    to: "/settings/ai",
    icon: Brain,
    title: "AI settings",
    description: "Tone, length, personalisation depth and the signature used in every pitch.",
  },
  {
    to: "/settings/sending",
    icon: Send,
    title: "Sending rules",
    description: "Daily limits, human-like delays, working hours and follow-up sequence.",
  },
  {
    to: "/settings/profile",
    icon: User,
    title: "Profile",
    description: "Your name, studio details and portfolio link used in generated emails.",
  },
] as const;

function SettingsPage() {
  return (
    <AppLayout title="Settings" crumbs={[{ label: "Workspace", to: "/dashboard" }, { label: "Settings" }]}>
      <PageHeader title="Settings" subtitle="Everything that shapes how ClientFlow writes and sends." />

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 md:max-w-2xl md:gap-4">
        {sections.map(({ to, icon: Icon, title, description }) => (
          <Link key={to} to={to} className="panel flex items-center gap-4 p-4 transition-all hover:border-primary/40 hover:bg-muted/50 active:scale-[0.98]">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground shadow-sm">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold truncate">{title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-none">{description}</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 shrink-0 text-muted-foreground opacity-50"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
