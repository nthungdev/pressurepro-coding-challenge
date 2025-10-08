"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SignInPostResponse } from "@/app/api/auth/signin/types";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type SignInFormData = z.infer<typeof signInFormSchema>;

export default function SignInPage() {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
  });

  async function onSubmit(data: SignInFormData) {
    startTransition(async () => {
      const result: SignInPostResponse = await fetch("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      }).then((r) => r.json());

      if (!result.success) {
        setSubmitError(result.error.message);
        return;
      }

      // reload to make sure updated cookie is fetched on the client
      window.location.href = "/";
    });
  }

  return (
    <div className="bg-primary-foreground sm:bg-accent min-h-screen flex items-center justify-center">
      <div className="p-8 w-full max-w-full sm:max-w-sm  mx-auto bg-primary-foreground space-y-8">
        <div className="text-4xl">Welcome!</div>
        <h1 className="sr-only">Sign in</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button disabled={isPending} type="submit">
              Sign In
            </Button>
          </div>
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
        </form>
      </div>
    </div>
  );
}
