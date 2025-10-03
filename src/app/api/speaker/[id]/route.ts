import { updateSpeakerSchema } from "@/app/api/speaker/schema";
import { conferenceSpeakersTable } from "@/db/schema";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { withBodyValidator } from "@/lib/api-utils";
import { db } from "@/lib/drizzle";
import { CONFERENCE_SPEAKER_NOT_EXIST, INTERNAL } from "@/lib/error-messages";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

export const DELETE = async (
  _: NextRequest,
  ctx: RouteContext<"/api/speaker/[id]">,
) => {
  const { id } = await ctx.params;

  try {
    const deleteResult = await db
      .delete(conferenceSpeakersTable)
      .where(eq(conferenceSpeakersTable.id, id));

    if (deleteResult.rowCount === 0) {
      return createErrorResponse(
        { message: CONFERENCE_SPEAKER_NOT_EXIST },
        404,
      );
    }

    return createSuccessResponse(undefined);
  } catch (error) {
    console.error(error);
    return createErrorResponse({ message: INTERNAL }, 500);
  }
};

export const PATCH = withBodyValidator(
  updateSpeakerSchema,
  async (data, _, ctx: RouteContext<"/api/speaker/[id]">) => {
    const { id } = await ctx.params;

    try {
      await db
        .update(conferenceSpeakersTable)
        .set(data)
        .where(eq(conferenceSpeakersTable.id, id));
      return createSuccessResponse(undefined);
    } catch (error) {
      console.error(error);
      return createErrorResponse({ message: INTERNAL }, 500);
    }
  },
);
