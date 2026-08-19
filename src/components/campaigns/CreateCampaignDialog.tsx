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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { queryKeys } from "@/services/api";
import { createCampaign } from "@/services/campaigns";

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("NO_WEBSITE");
  const [dailyLimit, setDailyLimit] = useState(40);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createCampaign({ name, target, dailyLimit }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns });
      setOpen(false);
      setName("");
      toast.success("Campaign created", { description: "Drafts will be generated for matching leads." });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden /> New campaign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New campaign</DialogTitle>
          <DialogDescription>Group leads by opportunity and control the daily sending pace.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="campaign-name">Campaign name</Label>
            <Input
              id="campaign-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nordic cafés without a website"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="campaign-target">Target segment</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger id="campaign-target">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NO_WEBSITE">No website</SelectItem>
                <SelectItem value="REDESIGN">Outdated website (redesign)</SelectItem>
                <SelectItem value="MOBILE_OPTIMIZATION">Poor mobile experience</SelectItem>
                <SelectItem value="PERFORMANCE">Slow website</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="campaign-limit">Daily send limit</Label>
              <span className="font-mono text-sm tabular-nums">{dailyLimit}</span>
            </div>
            <Slider
              id="campaign-limit"
              min={5}
              max={120}
              step={5}
              value={[dailyLimit]}
              onValueChange={([value]) => setDailyLimit(value ?? 40)}
            />
            <p className="text-xs text-muted-foreground">
              Keeping volume moderate protects your Gmail sending reputation.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={!name.trim() || mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending ? "Creating…" : "Create campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
