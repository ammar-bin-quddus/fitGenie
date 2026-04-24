"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { logProgress } from "@/actions/progress.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { progressSchema } from "@/lib/validations/progress";
import type { z } from "zod";

type ProgressValues = z.input<typeof progressSchema>;

export function ProgressLogForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProgressValues>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      weight: undefined,
      chest: undefined,
      waist: undefined,
      hips: undefined,
      arms: undefined,
      notes: "",
      photoUrl: "",
    },
  });

  const onSubmit = (values: ProgressValues) => {
    startTransition(async () => {
      const result = await logProgress(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Progress logged");
      form.reset({ ...values, notes: "" });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log progress</CardTitle>
        <CardDescription>Add a new check-in with measurements and notes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" {...form.register("date")} />
          </div>
          <div className="space-y-2">
            <Label>Weight</Label>
            <Input type="number" {...form.register("weight")} />
          </div>
          <div className="space-y-2">
            <Label>Chest</Label>
            <Input type="number" {...form.register("chest")} />
          </div>
          <div className="space-y-2">
            <Label>Waist</Label>
            <Input type="number" {...form.register("waist")} />
          </div>
          <div className="space-y-2">
            <Label>Hips</Label>
            <Input type="number" {...form.register("hips")} />
          </div>
          <div className="space-y-2">
            <Label>Arms</Label>
            <Input type="number" {...form.register("arms")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Notes</Label>
            <Textarea {...form.register("notes")} />
          </div>
          <Button type="submit" disabled={isPending} className="md:col-span-2">
            {isPending ? "Saving..." : "Save Progress Log"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
