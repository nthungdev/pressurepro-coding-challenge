import { and, eq, inArray, notInArray } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import {
  withAuthenticatedRequired,
  withBodyValidator,
  withErrorHandling,
} from "@/lib/api-utils";
import { createTagsSchema } from "@/app/api/conference/schemas";
import { createSuccessResponse } from "@/lib/api-response";
import { conferenceTagsTable, tagsTable } from "@/db/schema";
import type { ConferenceTagsPutResponseData } from "@/app/api/conference/types";
import { getConferences } from "@/lib/query";
import { NO_PERMISSION } from "@/lib/error-messages";
import ApiError from "@/lib/api-error";

// Set tags of a conference
export const PUT = withErrorHandling(
  withAuthenticatedRequired((session) =>
    withBodyValidator(
      createTagsSchema,
      (data) => async (_, ctx: RouteContext<"/api/conference/[id]/tags">) => {
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

        // add new tags
        await db
          .insert(tagsTable)
          .values(data.tags.map((t) => ({ name: t })))
          .onConflictDoNothing();

        // get new tag id set for the conference
        const newTags = await db
          .select()
          .from(tagsTable)
          .where(inArray(tagsTable.name, data.tags));
        const newTagsIds = newTags.map((t) => t.id);

        // remove conference's tags not part of the tag set
        const deleteResult = await db
          .delete(conferenceTagsTable)
          .where(
            and(
              eq(conferenceTagsTable.conferenceId, conferenceId),
              notInArray(conferenceTagsTable.tagId, newTagsIds),
            ),
          );

        // insert new tags into the conference tags
        const insertResult = await db
          .insert(conferenceTagsTable)
          .values(newTagsIds.map((tagId) => ({ conferenceId, tagId })))
          .onConflictDoNothing();

        return createSuccessResponse<ConferenceTagsPutResponseData>({
          addCount: insertResult.rowCount,
          deleteCount: deleteResult.rowCount,
        });
      },
    ),
  ),
);
