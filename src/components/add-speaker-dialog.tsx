"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { createSpeakerSchema } from "@/app/api/conference/schemas";
import type {
  ConferenceSpeaker,
  ConferenceSpeakerPostResponse,
} from "@/app/api/conference/types";
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
import { UNKNOWN_ERROR } from "@/lib/error-messages";

type AddSpeakerFormData = z.infer<typeof createSpeakerSchema>;

export interface AddSpeakerDialogProps {
  conferenceId: string;
  label: string;
  onSuccess?: (speaker: ConferenceSpeaker) => void;
}

export default function AddSpeakerDialog({
  conferenceId,
  label,
  onSuccess,
}: AddSpeakerDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddSpeakerFormData>({
    resolver: zodResolver(createSpeakerSchema),
  });

  function onSubmit(data: AddSpeakerFormData) {
    startTransition(async () => {
      setSubmitError("");
      try {
        const url = `/api/conference/${conferenceId}/speaker`;
        const response: ConferenceSpeakerPostResponse = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
        }).then((r) => r.json());
        if (!response.success) {
          setSubmitError(response.error.message);
          return;
        }
        onSuccess?.(response.data.speaker);
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        setSubmitError(UNKNOWN_ERROR);
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 flex items-center">
        <span className="text-sm">{label}</span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Speaker</DialogTitle>
          <DialogDescription>Enter the speaker information</DialogDescription>
        </DialogHeader>

        <div>
          <fieldset className="space-y-4" disabled={isPending}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input type="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input type="title" {...register("title")} />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input type="company" {...register("company")} />
              {errors.company && (
                <p className="text-red-500 text-sm">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input type="bio" {...register("bio")} />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio.message}</p>
              )}
            </div>
          </fieldset>
        </div>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button disabled={isPending} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Confirm
          </Button>
          {submitError && (
            <p className="text-red-500 text-sm mt-2">{submitError}</p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
