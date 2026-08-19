import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/contexts/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClientFlow AI — AI cold outreach for web design studios" },
      {
        name: "description",
        content:
          "ClientFlow AI finds businesses with weak or missing websites, writes personalised pitches and sends them from your Gmail.",
      },
      { property: "og:title", content: "ClientFlow AI" },
      {
        property: "og:description",
        content: "Analyse websites, generate AI pitches and run Gmail outreach from one workspace.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    navigate({ to: user ? "/dashboard" : "/login", replace: true });
  }, [ready, user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background" aria-busy="true">
      <p className="text-sm text-muted-foreground">Loading ClientFlow AI…</p>
    </div>
  );
}
