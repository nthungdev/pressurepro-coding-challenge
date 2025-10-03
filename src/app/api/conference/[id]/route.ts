import { CONFERENCE_NOT_EXIST, INTERNAL } from "@/lib/error-messages";
import { conferencesTable } from "@/db/schema";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { withBodyValidator } from "@/lib/api-utils";
import { updateConferenceSchema } from "@/app/api/conference/schemas";

export const DELETE = async (
  _: NextRequest,
  ctx: RouteContext<"/api/conference/[id]">,
) => {
  const { id } = await ctx.params;

  try {
    const deleteResult = await db
      .delete(conferencesTable)
      .where(eq(conferencesTable.id, id));

    if (deleteResult.rowCount === 0) {
      return createErrorResponse({ message: CONFERENCE_NOT_EXIST }, 404);
    }

    return createSuccessResponse(undefined);
  } catch (error) {
    console.error(error);
    return createErrorResponse({ message: INTERNAL }, 500);
  }
};

export const PATCH = withBodyValidator(
  updateConferenceSchema,
  async (data, _, ctx: RouteContext<"/api/conference/[id]">) => {
    const { id } = await ctx.params;
    try {
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
    } catch (error) {
      console.error(error);
      return createErrorResponse({ message: INTERNAL }, 500);
    }
  },
);
