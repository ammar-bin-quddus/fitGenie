"use client";

import { ActivityLevel, FitnessGoal } from "@prisma/client";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { updateProfile } from "@/actions/profile.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema } from "@/lib/validations/profile";
import type { z } from "zod";

type ProfileValues = z.input<typeof profileSchema>;
type InitialProfileValues = {
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
  fitnessGoal?: ProfileValues["fitnessGoal"] | null;
  activityLevel?: ProfileValues["activityLevel"] | null;
  dietaryPreference?: string | null;
  medicalNotes?: string | null;
  progressPhotoUrl?: string | null;
};

const steps = [
  "Personal Info",
  "Fitness Goal",
  "Activity Level",
  "Dietary Preferences",
  "Medical Notes",
];

export function OnboardingForm({
  initialValues,
}: {
  initialValues?: InitialProfileValues | null;
}) {
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: initialValues?.age ?? undefined,
      gender: initialValues?.gender ?? "",
      height: initialValues?.height ?? undefined,
      weight: initialValues?.weight ?? undefined,
      fitnessGoal: initialValues?.fitnessGoal ?? undefined,
      activityLevel: initialValues?.activityLevel ?? undefined,
      dietaryPreference: initialValues?.dietaryPreference ?? "",
      medicalNotes: initialValues?.medicalNotes ?? "",
      progressPhotoUrl: initialValues?.progressPhotoUrl ?? "",
    },
  });

  const percent = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const submit = (values: ProfileValues) => {
    startTransition(async () => {
      const result = await updateProfile(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Profile updated");
    });
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-card p-6">
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-slate-400">
            Step {step + 1} of {steps.length}
          </span>
          <span className="text-sm text-emerald-300">{steps[step]}</span>
        </div>
        <Progress value={percent} />
      </div>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
        {step === 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" {...form.register("age")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" {...form.register("gender")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" {...form.register("height")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" {...form.register("weight")} />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-2">
            <Label htmlFor="fitnessGoal">Fitness Goal</Label>
            <Select
              id="fitnessGoal"
              {...form.register("fitnessGoal")}
              options={Object.values(FitnessGoal).map((goal) => ({
                value: goal,
                label: goal.replaceAll("_", " "),
              }))}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Select
              id="activityLevel"
              {...form.register("activityLevel")}
              options={Object.values(ActivityLevel).map((level) => ({
                value: level,
                label: level.replaceAll("_", " "),
              }))}
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-2">
            <Label htmlFor="dietaryPreference">Dietary Preferences</Label>
            <Input id="dietaryPreference" {...form.register("dietaryPreference")} />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-2">
            <Label htmlFor="medicalNotes">Medical Notes</Label>
            <Textarea id="medicalNotes" {...form.register("medicalNotes")} />
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0 || isPending}
          >
            Back
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
              disabled={step === steps.length - 1 || isPending}
            >
              Skip for now
            </Button>
            {step === steps.length - 1 ? (
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save profile"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
