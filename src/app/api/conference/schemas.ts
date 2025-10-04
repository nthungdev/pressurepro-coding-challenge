import z from "zod";

export const conferenceSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.iso.datetime(),
  location: z.string(),
  price: z.number(),
  maxAttendees: z.number(),
  isFeatured: z.boolean(),
});

export const createConferenceSchema = conferenceSchema.extend({
  isFeatured: z.boolean().default(false),
});

export const updateConferenceSchema = conferenceSchema
  .partial()
  // remove default value
  .extend({
    isFeatured: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one property must be provided",
    path: [], // attach the error to the root
  });

export const createTagsSchema = z.object({
  tags: z.array(z.string()).nonempty(),
});

export const createSpeakerSchema = z.object({
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
