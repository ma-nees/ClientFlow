import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryKeys } from "@/services/api";
import { createLead } from "@/services/leads";

const emptyForm = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  city: "",
  country: "",
  industry: "",
};

export function AddLeadDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createLead,
    onSuccess: (lead) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      setOpen(false);
      setForm(emptyForm);
      toast.success("Lead added", { description: `${lead.businessName} is queued for website analysis.` });
    },
    onError: () => toast.error("Could not add lead", { description: "Please try again." }),
  });

  const set = (key: keyof typeof emptyForm) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const valid = form.businessName.trim() !== "" && /.+@.+\..+/.test(form.email);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden /> Add lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a lead</DialogTitle>
          <DialogDescription>
            ClientFlow analyses the website and drafts a personalised pitch automatically.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) mutation.mutate(form);
          }}
        >
          <Field label="Business name" required value={form.businessName} onChange={set("businessName")} />
          <Field label="Contact name" value={form.contactName} onChange={set("contactName")} />
          <Field label="Email" type="email" required value={form.email} onChange={set("email")} />
          <Field label="Phone" value={form.phone} onChange={set("phone")} />
          <Field label="Website" placeholder="https://" value={form.website} onChange={set("website")} />
          <Field label="Industry" value={form.industry} onChange={set("industry")} />
          <Field label="City" value={form.city} onChange={set("city")} />
          <Field label="Country" value={form.country} onChange={set("country")} />

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!valid || mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </div>
  );
}
