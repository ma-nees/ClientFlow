import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth";

export const Route = createFileRoute("/settings/profile")({
  head: () => ({
    meta: [
      { title: "Profile — ClientFlow AI" },
      { name: "description", content: "Your name, studio details and portfolio link used in generated emails." },
      { property: "og:title", content: "Profile — ClientFlow AI" },
      { property: "og:description", content: "Details that personalise every AI pitch." },
    ],
  }),
  component: ProfileSettingsPage,
});

function ProfileSettingsPage() {
  const { user } = useAuth();

  return (
    <AppLayout title="Profile" crumbs={[{ label: "Settings", to: "/settings" }, { label: "Profile" }]}>
      <PageHeader
        title="Profile"
        subtitle="Used by the AI when it introduces you to a prospect."
        backTo="/settings"
        actions={<Button onClick={() => toast.success("Profile saved")}>Save changes</Button>}
      />

      <section className="panel max-w-2xl space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" defaultValue={user?.name ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email ?? ""} readOnly />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="studio">Studio / company</Label>
            <Input id="studio" placeholder="Northlight Studio" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input id="portfolio" type="url" placeholder="https://your-portfolio.com" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio">Short bio</Label>
          <Textarea
            id="bio"
            className="min-h-[110px]"
            placeholder="One or two sentences about what you build and who you help."
          />
        </div>
      </section>
    </AppLayout>
  );
}
