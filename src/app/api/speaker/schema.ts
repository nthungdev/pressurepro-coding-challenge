import z from "zod";

export const createSpeakerSchema = z.object({
  conferenceId: z.string(),
  name: z.string(),
  title: z.string(),
  company: z.string(),
  bio: z.string(),
});

export const updateSpeakerSchema = createSpeakerSchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one property must be provided",
    path: [], // attach the error to the root
  });
