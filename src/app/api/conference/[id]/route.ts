import ApiError from "@/lib/api-error";
import { conferencesTable } from "@/db/schema";
import { CONFERENCE_NOT_EXIST, NO_PERMISSION } from "@/lib/error-messages";
import { createSuccessResponse } from "@/lib/api-response";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { getConferences } from "@/lib/query";
import type { NextRequest } from "next/server";
import {
  withAuthenticatedRequired,
  withBodyValidator,
  withErrorHandling,
} from "@/lib/api-utils";
import { updateConferenceSchema } from "@/app/api/conference/schemas";
import { serializeConference } from "@/lib/data";

// Get a conference by Id
export const GET = withErrorHandling(
  async (_: NextRequest, ctx: RouteContext<"/api/conference/[id]">) => {
    const { id } = await ctx.params;
    const conferences = await getConferences({ id, page: 1, pageSize: 1 });
    const conference = conferences?.[0];
    return createSuccessResponse({
      conference: serializeConference(conference),
    });
  },
);

// Delete a conference
export const DELETE = withErrorHandling(
  withAuthenticatedRequired(
    (session) =>
      async (_: NextRequest, ctx: RouteContext<"/api/conference/[id]">) => {
        const { id } = await ctx.params;

        const conferences = await getConferences({
          id,
          pageSize: 1,
          page: 1,
        });
        const conference = conferences?.[0];
        if (conference.ownerId !== session.userId) {
          throw new ApiError(NO_PERMISSION, 403);
        }

        const deleteResult = await db
          .delete(conferencesTable)
          .where(eq(conferencesTable.id, id));

        if (deleteResult.rowCount === 0) {
          throw new ApiError(CONFERENCE_NOT_EXIST, 404);
        }

        return createSuccessResponse(undefined);
      },
  ),
);

// Update a conference
export const PATCH = withErrorHandling(
  withAuthenticatedRequired((session) =>
    withBodyValidator(
      updateConferenceSchema,
      (data) => async (_, ctx: RouteContext<"/api/conference/[id]">) => {
        const { id } = await ctx.params;

        const conferences = await getConferences({
          id,
          pageSize: 1,
          page: 1,
        });
        const conference = conferences?.[0];
        if (conference.ownerId !== session.userId) {
          throw new ApiError(NO_PERMISSION, 403);
        }

        await db
          .update(conferencesTable)
          .set({
            name: data.name,
            location: data.location,
            description: data.description,
            maxAttendees: data.maxAttendees,
            price: data.price?.toString(),
            date: data.date ? new Date(data.date) : undefined,
            isFeatured: data.isFeatured,
          })
          .where(eq(conferencesTable.id, id));
        return createSuccessResponse(undefined);
      },
    ),
  ),
);
