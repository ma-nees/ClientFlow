import { Upload } from "lucide-react";
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
import { Label } from "@/components/ui/label";

export function ImportLeadsDialog() {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="size-4" aria-hidden /> Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import leads from CSV</DialogTitle>
          <DialogDescription>
            Expected columns: business_name, contact_name, email, phone, website, city, country, industry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="csv-file">CSV file</Label>
          <input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
            className="w-full rounded-md border bg-card px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs"
          />
          <p className="text-xs text-muted-foreground">
            {fileName ? `Ready to import: ${fileName}` : "Rows are validated before import."}
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!fileName}
            onClick={() => {
              // TODO(backend): POST /api/leads/import with multipart CSV payload.
              setOpen(false);
              toast.success("Import queued", { description: "Leads will appear once processing finishes." });
            }}
          >
            Import leads
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
