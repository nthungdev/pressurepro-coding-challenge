"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { parse } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { conferenceSchema } from "@/app/api/conference/schemas";
import type { ConferencePostResponse } from "@/app/api/conference/types";
import AppPage from "@/components/app-page";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UNKNOWN_ERROR } from "@/lib/error-messages";

type CreateConferenceFormData = z.infer<typeof conferenceSchema>;

export default function () {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [submitError, setSubmitError] = useState("");
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<CreateConferenceFormData>({
    defaultValues: {
      date: "",
      isFeatured: false,
      maxAttendees: 0,
      price: 0,
    },
    resolver: zodResolver(conferenceSchema),
  });

  function onSubmit(data: CreateConferenceFormData) {
    startTransition(async () => {
      setSubmitError("");
      try {
        const response: ConferencePostResponse = await fetch(
          "/api/conference",
          {
            method: "POST",
            body: JSON.stringify(data),
          },
        ).then((r) => r.json());
        if (!response.success) {
          setSubmitError(response.error.message);
          return;
        }
        push("/admin");
      } catch (error) {
        console.error(error);
        setSubmitError(UNKNOWN_ERROR);
      }
    });
  }

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

  return (
    <AppPage className="pb-10" suppressHydrationWarning>
      <div className="space-y-8 pb-4">
        <h1 className="text-4xl font-semibold">Create conference</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="space-y-4" disabled={isPending}>
            <div>
              <Label htmlFor="name">Conference title</Label>
              <Input type="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input type="description" {...register("description")} />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-row gap-x-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="date-picker" className="px-1">
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

              <div className="flex flex-col gap-3">
                <Label htmlFor="time">Time</Label>
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

            <div>
              <Label htmlFor="location">Location</Label>
              <Input type="text" {...register("location")} />
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="maxAttendees">Max Attendees</Label>
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

            <div>
              <Label htmlFor="price">Price (USD)</Label>
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

            <div>
              <Label htmlFor="isFeatured">Featured Conference</Label>
              <Checkbox
                className="block"
                name="isFeatured"
                defaultValue="false"
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

            <Button variant="secondary" type="submit" disabled={isPending}>
              Submit
            </Button>
            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}
          </fieldset>
        </form>
      </div>
    </AppPage>
  );
}
