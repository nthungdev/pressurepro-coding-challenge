import { and, eq, inArray, notInArray } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { withBodyValidator, withErrorHandling } from "@/lib/api-utils";
import { createTagsSchema } from "@/app/api/conference/schemas";
import { createSuccessResponse } from "@/lib/api-response";
import { conferenceTagsTable, tagsTable } from "@/db/schema";
import type { ConferenceTagsPutResponseData } from "@/app/api/conference/types";

export const PUT = withErrorHandling(
  withBodyValidator(
    createTagsSchema,
    async (data, _, ctx: RouteContext<"/api/conference/[id]/tags">) => {
      const { id: conferenceId } = await ctx.params;

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
);
