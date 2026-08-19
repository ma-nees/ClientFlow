import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { queryKeys } from "@/services/api";
import { beginGmailConnect, disconnectGmail, getGmailStatus } from "@/services/gmail";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/settings/gmail")({
  head: () => ({
    meta: [
      { title: "Gmail connection — ClientFlow AI" },
      { name: "description", content: "Connect the Gmail account ClientFlow uses to send outreach emails." },
      { property: "og:title", content: "Gmail connection — ClientFlow AI" },
      { property: "og:description", content: "Manage the sending inbox and daily quota." },
    ],
  }),
  component: GmailSettingsPage,
});

function GmailSettingsPage() {
  const gmail = useQuery({ queryKey: queryKeys.gmail, queryFn: getGmailStatus });
  const queryClient = useQueryClient();

  const connect = useMutation({
    mutationFn: beginGmailConnect,
    onSuccess: (result) => {
      if (result.available && result.url) {
        window.location.href = result.url;
      } else {
        toast.error("Gmail OAuth not available yet", { description: result.reason });
      }
    },
  });

  const disconnect = useMutation({
    mutationFn: disconnectGmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gmail });
      toast("Gmail disconnected");
    },
  });

  const connected = gmail.data?.connected ?? false;

  return (
    <AppLayout title="Gmail connection" crumbs={[{ label: "Settings", to: "/settings" }, { label: "Gmail" }]}>
      <PageHeader
        title="Gmail connection"
        subtitle="Emails are sent from your own inbox for better deliverability."
        backTo="/settings"
      />

      <section className="panel max-w-2xl p-5">
        <div className="flex items-start gap-4">
          <span className="flex size-10 items-center justify-center rounded-md border bg-muted text-muted-foreground">
            <Mail className="size-4" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="font-medium">{connected ? gmail.data?.account : "No Gmail account connected"}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {connected && gmail.data?.connectedAt
                ? `Connected ${formatDate(gmail.data.connectedAt)}`
                : "Connect Gmail to enable sending, reply detection and follow-ups."}
            </p>
            <div className="mt-4 flex gap-2">
              {connected ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Disconnect</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will disconnect your Gmail account. ClientFlow AI will no longer be able to send emails or read replies on your behalf.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => disconnect.mutate()}>Disconnect</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button onClick={() => connect.mutate()} disabled={connect.isPending}>
                  Connect Gmail
                </Button>
              )}
            </div>
          </div>
        </div>

        <hr className="my-5" />

        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>ClientFlow requests only the permission needed to send and read replies.</li>
          <li>Tokens are stored on the backend and never exposed to the browser.</li>
          <li>You can revoke access at any time from your Google account.</li>
        </ul>
      </section>
    </AppLayout>
  );
}
