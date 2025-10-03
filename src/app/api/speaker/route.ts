import { conferenceSpeakersTable } from "@/db/schema";
import { createSuccessResponse } from "@/lib/api-response";
import { db } from "@/lib/drizzle";
import { withBodyValidator, withErrorHandling } from "@/lib/api-utils";
import { createSpeakerSchema } from "@/app/api/speaker/schema";

export const POST = withErrorHandling(
  withBodyValidator(createSpeakerSchema, async (data, _) => {
    await db.insert(conferenceSpeakersTable).values(data);
    return createSuccessResponse(undefined);
  }),
);
