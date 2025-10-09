"use client";
import { SquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";

export default function AddConferenceButton({
  className,
}: HTMLAttributes<HTMLButtonElement>) {
  const { push } = useRouter();
  return (
    <Button
      className={twMerge("cursor-pointer", className)}
      onClick={() => push("/admin/conference/create")}
    >
      <SquarePlus />
      <span>Create New Conference</span>
    </Button>
  );
}
