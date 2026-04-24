"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onClose,
  onConfirm,
  loading,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} title={title} description={description} onClose={onClose}>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={loading}>
          {loading ? "Working..." : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
