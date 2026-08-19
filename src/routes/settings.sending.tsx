import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings/sending")({
  head: () => ({
    meta: [
      { title: "Sending rules — ClientFlow AI" },
      { name: "description", content: "Daily limits, human-like delays, working hours and follow-up cadence." },
      { property: "og:title", content: "Sending rules — ClientFlow AI" },
      { property: "og:description", content: "Keep outreach safe and human-paced." },
    ],
  }),
  component: SendingSettingsPage,
});

function SendingSettingsPage() {
  const [dailyLimit, setDailyLimit] = useState(40);
  const [minDelay, setMinDelay] = useState(90);
  const [maxDelay, setMaxDelay] = useState(240);
  const [startHour, setStartHour] = useState("09:00");
  const [endHour, setEndHour] = useState("17:00");
  const [weekdaysOnly, setWeekdaysOnly] = useState(true);
  const [followUps, setFollowUps] = useState(true);

  return (
    <AppLayout title="Sending rules" crumbs={[{ label: "Settings", to: "/settings" }, { label: "Sending" }]}>
      <PageHeader
        title="Sending rules"
        subtitle="These limits are enforced by the backend scheduler once connected."
        backTo="/settings"
        actions={<Button onClick={() => toast.success("Sending rules saved")}>Save changes</Button>}
      />

      <section className="panel max-w-2xl space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Daily send limit" id="dailyLimit">
            <Input
              id="dailyLimit"
              type="number"
              min={1}
              max={200}
              value={dailyLimit}
              onChange={(event) => setDailyLimit(Number(event.target.value))}
            />
          </Field>
          <Field label="Follow-ups per lead" id="followUpCount">
            <Input id="followUpCount" type="number" min={0} max={5} defaultValue={2} />
          </Field>
          <Field label="Min delay between emails (s)" id="minDelay">
            <Input
              id="minDelay"
              type="number"
              value={minDelay}
              onChange={(event) => setMinDelay(Number(event.target.value))}
            />
          </Field>
          <Field label="Max delay between emails (s)" id="maxDelay">
            <Input
              id="maxDelay"
              type="number"
              value={maxDelay}
              onChange={(event) => setMaxDelay(Number(event.target.value))}
            />
          </Field>
          <Field label="Working hours start" id="startHour">
            <Input id="startHour" type="time" value={startHour} onChange={(e) => setStartHour(e.target.value)} />
          </Field>
          <Field label="Working hours end" id="endHour">
            <Input id="endHour" type="time" value={endHour} onChange={(e) => setEndHour(e.target.value)} />
          </Field>
        </div>

        <div className="space-y-3 border-t pt-5">
          <Toggle
            id="weekdaysOnly"
            label="Send on weekdays only"
            checked={weekdaysOnly}
            onChange={setWeekdaysOnly}
          />
          <Toggle
            id="followUps"
            label="Automatically queue follow-ups when there is no reply"
            checked={followUps}
            onChange={setFollowUps}
          />
        </div>
      </section>
    </AppLayout>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
