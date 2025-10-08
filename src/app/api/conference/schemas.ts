import z from "zod";

export const conferenceSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  date: z.iso.datetime(),
  location: z.string().nonempty(),
  price: z.number().min(0),
  maxAttendees: z.number().gt(0),
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

export const setTagsSchema = z.object({
  tags: z.array(z.string()).nonempty(),
});

export const createSpeakerSchema = z.object({
  name: z.string().nonempty(),
  title: z.string().nonempty(),
  company: z.string().nonempty(),
  bio: z.string().nonempty(),
});

export const updateSpeakerSchema = createSpeakerSchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one property must be provided",
    path: [], // attach the error to the root
  });
