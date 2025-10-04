import { CONFERENCE_NOT_EXIST } from "@/lib/error-messages";
import { conferencesTable } from "@/db/schema";
import { createSuccessResponse } from "@/lib/api-response";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { withBodyValidator, withErrorHandling } from "@/lib/api-utils";
import {
  createConferenceSchema,
  updateConferenceSchema,
} from "@/app/api/conference/schemas";
import type { ConferencePostResponseData } from "@/app/api/conference/types";
import { formatConference, getConferences } from "@/lib/query";
import ApiError from "@/lib/api-error";

// Get a conference by Id
export const GET = withErrorHandling(
  async (_: NextRequest, ctx: RouteContext<"/api/conference/[id]">) => {
    const { id } = await ctx.params;
    const conferences = await getConferences({ id, page: 1, pageSize: 1 });
    const conference = conferences?.[0];
    return createSuccessResponse({ conference });
  },
);

// Create a new conference
export const POST = withErrorHandling(
  withBodyValidator(createConferenceSchema, async (data, _) => {
    const insertConferenceResult = await db
      .insert(conferencesTable)
      .values({
        name: data.name,
        location: data.location,
        description: data.description,
        maxAttendees: data.maxAttendees,
        price: data.price.toString(),
        date: new Date(data.date),
        isFeatured: data.isFeatured,
      })
      .returning();

    const conferenceRecord = insertConferenceResult?.[0];
    const conference = formatConference({
      ...conferenceRecord,
      speakers: [],
      tags: [],
    });

    return createSuccessResponse<ConferencePostResponseData>(conference);
  }),
);

// Delete a conference
export const DELETE = withErrorHandling(
  async (_: NextRequest, ctx: RouteContext<"/api/conference/[id]">) => {
    const { id } = await ctx.params;
    const deleteResult = await db
      .delete(conferencesTable)
      .where(eq(conferencesTable.id, id));

    if (deleteResult.rowCount === 0) {
      throw new ApiError(CONFERENCE_NOT_EXIST, 404);
    }

    return createSuccessResponse(undefined);
  },
);

// Update a conference
export const PATCH = withErrorHandling(
  withBodyValidator(
    updateConferenceSchema,
    async (data, _, ctx: RouteContext<"/api/conference/[id]">) => {
      const { id } = await ctx.params;
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
);
