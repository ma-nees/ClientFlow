import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, RefreshCw, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { EmailStatusBadge, OpportunityBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import { queryKeys } from "@/services/api";
import { approveEmail, rejectEmail, saveEmail } from "@/services/emails";
import { generateEmail } from "@/services/ai";
import type { EmailMessage } from "@/types";

export function EmailReviewPanel({ email }: { email: EmailMessage }) {
  const [subject, setSubject] = useState(email.subject);
  const [body, setBody] = useState(email.body);
  const queryClient = useQueryClient();

  useEffect(() => {
    setSubject(email.subject);
    setBody(email.body);
  }, [email.id, email.subject, email.body]);

  const dirty = subject !== email.subject || body !== email.body;
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.emails });

  const save = useMutation({
    mutationFn: () => saveEmail(email.id, { subject, body }),
    onSuccess: () => {
      invalidate();
      toast.success("Draft saved");
    },
  });

  const approve = useMutation({
    mutationFn: () => approveEmail(email.id),
    onSuccess: () => {
      invalidate();
      toast.success("Email approved", { description: "It will be sent in the next scheduled window." });
    },
  });

  const reject = useMutation({
    mutationFn: () => rejectEmail(email.id),
    onSuccess: () => {
      invalidate();
      toast("Email rejected", { description: "The draft was removed from the send queue." });
    },
  });

  const regenerate = useMutation({
    mutationFn: () => generateEmail({ leadId: email.leadId }),
    onSuccess: () => toast.success("Regenerating", { description: "A new AI draft is being written." }),
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <EmailStatusBadge status={email.status} />
          <OpportunityBadge opportunity={email.opportunity} />
          <span className="text-xs text-muted-foreground">
            AI confidence {Math.round(email.aiConfidence * 100)}%
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold">{email.businessName}</h3>
        <p className="text-sm text-muted-foreground">
          To {email.recipientName} · {email.recipientEmail}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" aria-hidden />
          {email.scheduledFor
            ? `Scheduled for ${formatDate(email.scheduledFor)}`
            : `Drafted ${formatDate(email.createdAt)}`}
        </p>
      </div>

      <Tabs defaultValue="edit" className="flex-1 overflow-hidden">
        <div className="border-b px-4 pt-3 sm:px-5">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="space-y-4 overflow-y-auto p-4 sm:p-5">
          <div className="space-y-1.5">
            <Label htmlFor="email-subject">Subject</Label>
            <Input id="email-subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email-body">Body</Label>
            <Textarea
              id="email-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="min-h-[280px] font-mono text-[13px] leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">
              {body.trim().split(/\s+/).filter(Boolean).length} words · personalisation tokens are resolved on send.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="overflow-y-auto p-4 sm:p-5">
          <article className="panel p-5">
            <p className="text-eyebrow">Subject</p>
            <p className="mt-1 font-medium">{subject}</p>
            <hr className="my-4" />
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{body}</div>
          </article>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-2 border-t p-4 sm:p-5">
        <Button onClick={() => approve.mutate()} disabled={approve.isPending}>
          <Check className="size-4" aria-hidden /> Approve
        </Button>
        <Button variant="outline" onClick={() => save.mutate()} disabled={!dirty || save.isPending}>
          <Send className="size-4" aria-hidden /> Save draft
        </Button>
        <Button variant="outline" onClick={() => regenerate.mutate()} disabled={regenerate.isPending}>
          <RefreshCw className="size-4" aria-hidden /> Regenerate
        </Button>
        <Button variant="ghost" className="text-destructive" onClick={() => reject.mutate()}>
          <X className="size-4" aria-hidden /> Reject
        </Button>
      </div>
    </div>
  );
}
