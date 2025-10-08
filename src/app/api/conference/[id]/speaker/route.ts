import { conferenceSpeakersTable } from "@/db/schema";
import { createSpeakerSchema } from "@/app/api/conference/schemas";
import { createSuccessResponse } from "@/lib/api-response";
import { db } from "@/lib/drizzle";
import {
  withAuthenticatedRequired,
  withBodyValidator,
  withErrorHandling,
} from "@/lib/api-utils";
import { getConferences } from "@/lib/query";
import ApiError from "@/lib/api-error";
import { NO_PERMISSION } from "@/lib/error-messages";

// Add a speaker to a conference
export const POST = withErrorHandling(
  withAuthenticatedRequired((session) =>
    withBodyValidator(
      createSpeakerSchema,
      (data) =>
        async (_, ctx: RouteContext<"/api/conference/[id]/speaker">) => {
          const { id: conferenceId } = await ctx.params;

          const conferences = await getConferences({
            id: conferenceId,
            pageSize: 1,
            page: 1,
          });
          const conference = conferences?.[0];
          if (conference.ownerId !== session.userId) {
            throw new ApiError(NO_PERMISSION, 403);
          }

          await db
            .insert(conferenceSpeakersTable)
            .values({ ...data, conferenceId });
          return createSuccessResponse(undefined);
        },
    ),
  ),
);
