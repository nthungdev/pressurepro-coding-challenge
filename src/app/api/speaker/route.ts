import { conferenceSpeakersTable } from "@/db/schema";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { db } from "@/lib/drizzle";
import { INTERNAL } from "@/lib/error-messages";
import { withBodyValidator } from "@/lib/api-utils";
import { createSpeakerSchema } from "@/app/api/speaker/schema";

export const POST = withBodyValidator(createSpeakerSchema, async (data, _) => {
  try {
    await db.insert(conferenceSpeakersTable).values(data);
    return createSuccessResponse(undefined);
  } catch (error) {
    console.error(error);
    return createErrorResponse({ message: INTERNAL }, 500);
  }
});
