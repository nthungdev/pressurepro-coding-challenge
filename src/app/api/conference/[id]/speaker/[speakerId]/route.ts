import { and, eq } from "drizzle-orm";
import z from "zod";
import { updateSpeakerSchema } from "@/app/api/conference/schemas";
import type { ConferenceSpeakerPatchData } from "@/app/api/conference/types";
import { conferenceSpeakersTable } from "@/db/schema";
import ApiError from "@/lib/api-error";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import {
  withAuthenticatedRequired,
  withBodyValidator,
  withErrorHandling,
} from "@/lib/api-utils";
import { db } from "@/lib/drizzle";
import {
  CONFERENCE_SPEAKER_NOT_EXIST,
  INVALID_QUERY_PARAMS,
  NO_PERMISSION,
} from "@/lib/error-messages";
import { getConferences } from "@/lib/query";

// Remove a speaker from a conference
export const DELETE = withErrorHandling(
  withAuthenticatedRequired(
    (session) =>
      async (
        _,
        ctx: RouteContext<"/api/conference/[id]/speaker/[speakerId]">,
      ) => {
        const { id: conferenceId, speakerId } = await ctx.params;

        const validation = z
          .object({
            conferenceId: z.uuid(),
            speakerId: z.uuid(),
          })
          .safeParse({ conferenceId, speakerId });
        if (!validation.success) {
          return createErrorResponse(
            {
              message: INVALID_QUERY_PARAMS,
              detail: z.flattenError(validation.error),
            },
            400,
          );
        }

        const conferences = await getConferences({
          id: conferenceId,
          pageSize: 1,
          page: 1,
        });
        const conference = conferences?.[0];
        if (conference.ownerId !== session.userId) {
          throw new ApiError(NO_PERMISSION, 403);
        }

        const deleteResult = await db
          .delete(conferenceSpeakersTable)
          .where(
            and(
              eq(conferenceSpeakersTable.id, speakerId),
              eq(conferenceSpeakersTable.conferenceId, conferenceId),
            ),
          );

        if (deleteResult.rowCount === 0) {
          throw new ApiError(CONFERENCE_SPEAKER_NOT_EXIST, 404);
        }

        return createSuccessResponse(undefined);
      },
  ),
);

// Update a speaker info
export const PATCH = withErrorHandling(
  withAuthenticatedRequired((session) =>
    withBodyValidator(
      updateSpeakerSchema,
      (data) =>
        async (
          _,
          ctx: RouteContext<"/api/conference/[id]/speaker/[speakerId]">,
        ) => {
          const { id: conferenceId, speakerId } = await ctx.params;

          const validation = z
            .object({
              conferenceId: z.uuid(),
              speakerId: z.uuid(),
            })
            .safeParse({ conferenceId, speakerId });
          if (!validation.success) {
            return createErrorResponse(
              {
                message: INVALID_QUERY_PARAMS,
                detail: z.flattenError(validation.error),
              },
              400,
            );
          }

          const conferences = await getConferences({
            id: conferenceId,
            pageSize: 1,
            page: 1,
          });
          const conference = conferences?.[0];
          if (conference.ownerId !== session.userId) {
            throw new ApiError(NO_PERMISSION, 403);
          }

          const result = await db
            .update(conferenceSpeakersTable)
            .set(data)
            .where(
              and(
                eq(conferenceSpeakersTable.id, speakerId),
                eq(conferenceSpeakersTable.conferenceId, conferenceId),
              ),
            )
            .returning();
          const speaker = result?.[0];
          return createSuccessResponse<ConferenceSpeakerPatchData>({ speaker });
        },
    ),
  ),
);
