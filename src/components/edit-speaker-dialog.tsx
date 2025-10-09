"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { updateSpeakerSchema } from "@/app/api/conference/schemas";
import type { ConferenceSpeaker } from "@/app/api/conference/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UNKNOWN_ERROR } from "@/lib/error-messages";
import {
  removeConferenceSpeaker,
  updateConferenceSpeaker,
} from "@/lib/fetches";

type UpdateSpeakerFormData = z.infer<typeof updateSpeakerSchema>;

export interface EditSpeakerDialogProps {
  speaker: ConferenceSpeaker;
  label: string;
  onEdited?: (speaker: ConferenceSpeaker) => void;
  onRemoved?: (speaker: ConferenceSpeaker) => void;
}

export default function EditSpeakerDialog({
  speaker,
  label,
  onEdited,
  onRemoved,
}: EditSpeakerDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSpeakerFormData>({
    defaultValues: speaker,
    resolver: zodResolver(updateSpeakerSchema),
  });

  function onRemoveSpeaker() {
    startTransition(async () => {
      setSubmitError("");
      try {
        const response = await removeConferenceSpeaker(
          speaker.conferenceId,
          speaker.id,
        );
        if (!response.success) {
          setSubmitError(response.error.message);
          return;
        }
        onRemoved?.(speaker);
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        setSubmitError(UNKNOWN_ERROR);
      }
    });
  }

  function onSubmit(data: UpdateSpeakerFormData) {
    startTransition(async () => {
      setSubmitError("");
      try {
        const response = await updateConferenceSpeaker(
          speaker.conferenceId,
          speaker.id,
          data,
        );
        if (!response.success) {
          setSubmitError(response.error.message);
          return;
        }
        onEdited?.(response.data.speaker);
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        setSubmitError(UNKNOWN_ERROR);
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80 flex items-center">
        <span className="text-sm">{label}</span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Speaker</DialogTitle>
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
          <div>
            {submitError && (
              <p className="text-red-500 text-sm mt-2">{submitError}</p>
            )}
          </div>
        </div>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button disabled={isPending} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            type="button"
            onClick={onRemoveSpeaker}
          >
            Remove
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
