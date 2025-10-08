import { createSpeakerSchema } from "@/app/api/conference/schemas";
import type { ConferenceSpeakerPostData } from "@/app/api/conference/types";
import { conferenceSpeakersTable } from "@/db/schema";
import ApiError from "@/lib/api-error";
import { createSuccessResponse } from "@/lib/api-response";
import {
  withAuthenticatedRequired,
  withBodyValidator,
  withErrorHandling,
} from "@/lib/api-utils";
import { db } from "@/lib/drizzle";
import { NO_PERMISSION } from "@/lib/error-messages";
import { getConferences } from "@/lib/query";

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

          const speakers = await db
            .insert(conferenceSpeakersTable)
            .values({ ...data, conferenceId })
            .returning();
          const speaker = speakers?.[0];

          return createSuccessResponse<ConferenceSpeakerPostData>({ speaker });
        },
    ),
  ),
);
