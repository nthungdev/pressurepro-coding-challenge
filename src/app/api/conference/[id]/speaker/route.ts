import { conferenceSpeakersTable } from "@/db/schema";
import { createSuccessResponse } from "@/lib/api-response";
import { db } from "@/lib/drizzle";
import { withBodyValidator, withErrorHandling } from "@/lib/api-utils";
import { createSpeakerSchema } from "@/app/api/conference/schemas";

// Add a speaker to a conference
export const POST = withErrorHandling(
  withBodyValidator(
    createSpeakerSchema,
    async (data, _, ctx: RouteContext<"/api/conference/[id]/speaker">) => {
      const { id: conferenceId } = await ctx.params;
      await db
        .insert(conferenceSpeakersTable)
        .values({ ...data, conferenceId });
      return createSuccessResponse(undefined);
    },
  ),
);
