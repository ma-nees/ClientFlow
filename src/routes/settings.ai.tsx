import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { buildPromptPreview, getAISettings, saveAISettings } from "@/services/ai";
import { queryKeys } from "@/services/api";
import type { AISettings } from "@/types";

export const Route = createFileRoute("/settings/ai")({
  head: () => ({
    meta: [
      { title: "AI settings — ClientFlow AI" },
      { name: "description", content: "Control tone, length, personalisation depth and signature for AI pitches." },
      { property: "og:title", content: "AI settings — ClientFlow AI" },
      { property: "og:description", content: "Shape how ClientFlow writes your outreach emails." },
    ],
  }),
  component: AISettingsPage,
});

function AISettingsPage() {
  const query = useQuery({ queryKey: queryKeys.settings("ai"), queryFn: getAISettings });
  const [settings, setSettings] = useState<AISettings | null>(null);

  useEffect(() => {
    if (query.data) setSettings(query.data);
  }, [query.data]);

  const save = useMutation({
    mutationFn: (next: AISettings) => saveAISettings(next),
    onSuccess: () => toast.success("AI settings saved"),
  });

  if (!settings) {
    return (
      <AppLayout title="AI settings">
        <p className="text-sm text-muted-foreground">Loading settings…</p>
      </AppLayout>
    );
  }

  const update = <K extends keyof AISettings>(key: K, value: AISettings[K]) =>
    setSettings({ ...settings, [key]: value });

  return (
    <AppLayout title="AI settings" crumbs={[{ label: "Settings", to: "/settings" }, { label: "AI" }]}>
      <PageHeader
        title="AI Personalization"
        subtitle="Manage tone, instructions, and default prompts."
        backTo="/settings"
        actions={<Button onClick={() => save.mutate(settings)}>Save changes</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel space-y-5 p-5">
          <div className="space-y-1.5">
            <Label htmlFor="tone">Tone</Label>
            <Select value={settings.tone} onValueChange={(value) => update("tone", value as AISettings["tone"])}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["professional", "friendly", "direct", "consultative"].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="length">Length</Label>
            <Select value={settings.length} onValueChange={(value) => update("length", value as AISettings["length"])}>
              <SelectTrigger id="length">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["short", "medium", "detailed"].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="personalization">Personalisation</Label>
            <Select
              value={settings.personalization}
              onValueChange={(value) => update("personalization", value as AISettings["personalization"])}
            >
              <SelectTrigger id="personalization">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["low", "medium", "high"].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {[
              ["includeWebsiteObservation", "Mention a specific website observation"],
              ["includeBusinessDetail", "Reference a detail about the business"],
              ["includePortfolioLink", "Include a portfolio link"],
              ["includeCallToAction", "End with a clear call to action"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <Label htmlFor={key} className="font-normal">
                  {label}
                </Label>
                <Switch
                  id={key}
                  checked={settings[key as keyof AISettings] as boolean}
                  onCheckedChange={(checked) => update(key as keyof AISettings, checked as never)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signature">Signature</Label>
            <Textarea
              id="signature"
              value={settings.signature}
              onChange={(event) => update("signature", event.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </section>

        <section className="panel p-5">
          <h3 className="text-sm font-semibold">Prompt preview</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            This is the instruction set the backend sends alongside each lead's analysis.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md border bg-muted/40 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {buildPromptPreview(settings)}
          </pre>
          <p className="mt-4 text-xs text-muted-foreground">
            Model: {settings.model} · provider {settings.provider} ·{" "}
            {settings.apiConnected ? "API connected" : "API not connected"}
          </p>
        </section>
      </div>
    </AppLayout>
  );
}
