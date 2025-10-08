"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASSWORDS_NOT_MATCH } from "@/lib/error-messages";

const signUpFormSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: PASSWORDS_NOT_MATCH,
  });

type SignUpFormData = z.infer<typeof signUpFormSchema>;

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  });

  async function onSubmit(data: SignUpFormData) {
    startTransition(async () => {
      await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      push("/auth/signin");
    });
  }

  return (
    <div className="bg-primary-foreground sm:bg-accent min-h-screen flex items-center justify-center">
      <div className="p-8 w-full max-w-full sm:max-w-sm mx-auto bg-primary-foreground space-y-8">
        <div className="text-4xl">Welcome!</div>
        <h1 className="sr-only">Sign up</h1>
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

          <div>
            <Label className="sr-only" htmlFor="confirmPassword">
              Confirm password
            </Label>
            <Input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
