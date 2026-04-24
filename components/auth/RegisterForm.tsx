"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { loginUser, registerUser } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/validations/auth";
import type { z } from "zod";

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterValues) => {
    startTransition(async () => {
      const created = await registerUser(values);
      if (!created.success) {
        toast.error(created.error);
        return;
      }

      const signedIn = await loginUser(values.email, values.password);
      if (signedIn?.success === false) {
        toast.error(signedIn.error);
        router.push("/login");
        return;
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} />
        <p className="text-sm text-red-300">{form.formState.errors.name?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        <p className="text-sm text-red-300">{form.formState.errors.email?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register("password")} />
        <p className="text-sm text-red-300">
          {form.formState.errors.password?.message}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...form.register("confirmPassword")}
        />
        <p className="text-sm text-red-300">
          {form.formState.errors.confirmPassword?.message}
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
