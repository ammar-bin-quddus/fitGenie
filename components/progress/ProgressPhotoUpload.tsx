"use client";

import { type ChangeEvent, useId, useState, useTransition } from "react";
import { Camera, ImagePlus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { logProgress } from "@/actions/progress.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PhotoLog = {
  id: string;
  date: Date;
  notes?: string | null;
  photoUrl?: string | null;
};

export function ProgressPhotoUpload({ logs }: { logs: PhotoLog[] }) {
  const inputId = useId();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [photoUrl, setPhotoUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Please choose an image smaller than 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        toast.error("Could not read the selected photo.");
        return;
      }

      setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = () => {
    if (!photoUrl) {
      toast.error("Choose a progress photo first.");
      return;
    }

    startTransition(async () => {
      const result = await logProgress({
        date,
        notes,
        photoUrl,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Progress photo uploaded");
      setPhotoUrl("");
      setNotes("");
      setDate(new Date().toISOString().slice(0, 10));
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress photo upload</CardTitle>
        <CardDescription>
          Upload a check-in photo directly from this page without extra cloud setup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor={inputId}>Photo</Label>
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-center transition hover:border-emerald-400/40 hover:bg-white/[0.05]"
          >
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt="Selected progress"
                className="max-h-64 w-full rounded-2xl object-cover"
              />
            ) : (
              <>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-200">
                  <ImagePlus className="size-6" />
                </div>
                <div>
                  <p className="font-medium text-white">Choose a progress photo</p>
                  <p className="mt-1 text-sm text-slate-400">PNG, JPG, or WEBP up to 4MB</p>
                </div>
              </>
            )}
          </label>
          <Input
            id={inputId}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="sr-only"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Front pose, lean bulk week 4..."
            />
          </div>
        </div>
        <Button type="button" disabled={isPending || !photoUrl} onClick={onSubmit} className="w-full">
          <Upload className="size-4" />
          {isPending ? "Uploading..." : "Upload photo"}
        </Button>
        {logs.length ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Camera className="size-4" />
              Recent uploads
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={log.photoUrl ?? ""}
                    alt="Progress log"
                    className="aspect-[4/5] w-full rounded-2xl object-cover"
                  />
                  <p className="mt-3 text-sm font-medium text-white">
                    {new Date(log.date).toLocaleDateString()}
                  </p>
                  {log.notes ? (
                    <p className="mt-1 text-sm text-slate-400">{log.notes}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
