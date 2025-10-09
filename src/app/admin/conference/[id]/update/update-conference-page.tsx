"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { parse } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { updateConferenceSchema } from "@/app/api/conference/schemas";
import type { Conference } from "@/app/api/conference/types";
import AddSpeakerDialog, {
  type AddSpeakerDialogProps,
} from "@/components/add-speaker-dialog";
import AppPage from "@/components/app-page";
import EditTagsDialog from "@/components/edit-tags-dialog";
import SpeakerList, { type SpeakerListProps } from "@/components/speaker-list";
import TagChips from "@/components/tag-chips";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getTimeString, serializeConference } from "@/lib/data";
import { UNKNOWN_ERROR } from "@/lib/error-messages";
import { type UpdateConferenceFormData, updateConference } from "@/lib/fetches";

interface UpdateConferencePageProps {
  conference: Conference;
}

export default function UpdateConferencePage({
  conference: initialConference,
}: UpdateConferencePageProps) {
  const [conference, setConference] = useState(initialConference);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(conference.date);
  const [time, setTime] = useState(getTimeString(conference.date));
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<UpdateConferenceFormData>({
    defaultValues: serializeConference(conference),
    resolver: zodResolver(updateConferenceSchema),
  });

  function onSubmit(data: UpdateConferenceFormData) {
    startTransition(async () => {
      setSubmitError("");
      try {
        const response = await updateConference(conference.id, data);
        if (!response.success) {
          setSubmitError(response.error.message);
          return;
        }
      } catch (error) {
        console.error(error);
        setSubmitError(UNKNOWN_ERROR);
      }
    });
  }

  function handleTagSet(tags: string[]) {
    setConference({
      ...conference,
      tags,
    });
  }

  const handleSpeakerAdded: AddSpeakerDialogProps["onSuccess"] = (speaker) => {
    setConference({
      ...conference,
      speakers: [...conference.speakers, speaker],
    });
  };

  const handleSpeakerEdited: SpeakerListProps["onEdited"] = (speaker) => {
    setConference({
      ...conference,
      speakers: conference.speakers.map((s) =>
        s.id === speaker.id ? speaker : s,
      ),
    });
  };

  const handleSpeakerRemoved: SpeakerListProps["onRemoved"] = (speaker) => {
    setConference({
      ...conference,
      speakers: conference.speakers.filter((s) => s.id !== speaker.id),
    });
  };

  useEffect(() => {
    let dateString = "";
    if (date) {
      const datePart = date.toISOString().split("T")[0];
      const timePart = `${time || "00:00"}:00`;
      dateString = `${datePart} ${timePart}`;
      const parsedDate = parse(dateString, "yyyy-MM-dd HH:mm:00", new Date());
      setValue("date", parsedDate.toISOString());
    }
  }, [date, time, setValue]);

  const detailHref = `/conferences/${conference.id}`;

  return (
    <AppPage className="pb-10">
      <form className="space-y-8 pb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2 flex flex-col">
          <Link href={detailHref} replace>
            <span className="text-sm text-accent">Go to Details</span>
          </Link>
        </div>
        <div>
          <div className="flex justify-between items-end">
            <h1 className="text-2xl md:text-4xl font-semibold">
              Update conference
            </h1>
            <Button variant="secondary" type="submit" disabled={isPending}>
              Save
            </Button>
          </div>
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
        </div>
        <div>
          <fieldset className="space-y-8" disabled={isPending}>
            <div className="space-y-2">
              <Label className="block" htmlFor="name">
                Conference title
              </Label>
              <Input className="mt" type="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="block" htmlFor="description">
                Description
              </Label>
              <Input type="description" {...register("description")} />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-row gap-x-4">
              <div className="flex flex-col gap-3 space-y-2">
                <Label htmlFor="date-picker" className="block">
                  Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker"
                      className="w-32 justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <div className="hidden">
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <input type="hidden" readOnly {...field} />
                    )}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 space-y-2">
                <Label className="block" htmlFor="time">
                  Time
                </Label>
                <Input
                  type="time"
                  value={time}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(event) => {
                    setTime(event.target.value);
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="block" htmlFor="location">
                Location
              </Label>
              <Input type="text" {...register("location")} />
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="block" htmlFor="maxAttendees">
                Max Attendees
              </Label>
              <Input
                type="number"
                min={1}
                {...register("maxAttendees", { valueAsNumber: true })}
              />
              {errors.maxAttendees && (
                <p className="text-red-500 text-sm">
                  {errors.maxAttendees.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="block" htmlFor="price">
                Price (USD)
              </Label>
              <Input
                type="number"
                step={0.01}
                min={0}
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="block" htmlFor="isFeatured">
                Featured Conference
              </Label>
              <Checkbox
                className="block"
                name="isFeatured"
                defaultChecked={conference.isFeatured}
                onCheckedChange={(value: boolean) => {
                  setValue("isFeatured", value);
                }}
              />
              {errors.isFeatured && (
                <p className="text-red-500 text-sm">
                  {errors.isFeatured.message}
                </p>
              )}
              <input
                className="hidden"
                type="checkbox"
                {...register("isFeatured")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="block">Tags</Label>
                <EditTagsDialog
                  conferenceId={conference.id}
                  label={conference.tags.length ? "Edit Tags" : "Add Tags"}
                  initialTags={conference.tags}
                  onSuccess={handleTagSet}
                />
              </div>
              <TagChips tags={conference.tags} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="block">Speakers</Label>
                <AddSpeakerDialog
                  conferenceId={conference.id}
                  label="Add Speaker"
                  onSuccess={handleSpeakerAdded}
                />
              </div>
              <SpeakerList
                showEditButton
                speakers={conference.speakers}
                onEdited={handleSpeakerEdited}
                onRemoved={handleSpeakerRemoved}
              />
            </div>
          </fieldset>
        </div>
      </form>
    </AppPage>
  );
}
