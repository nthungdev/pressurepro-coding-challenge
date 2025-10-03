import { updateSpeakerSchema } from "@/app/api/speaker/schema";
import { conferenceSpeakersTable } from "@/db/schema";
import ApiError from "@/lib/api-error";
import { createSuccessResponse } from "@/lib/api-response";
import { withBodyValidator, withErrorHandling } from "@/lib/api-utils";
import { db } from "@/lib/drizzle";
import { CONFERENCE_SPEAKER_NOT_EXIST } from "@/lib/error-messages";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

export const DELETE = withErrorHandling(
  async (_: NextRequest, ctx: RouteContext<"/api/speaker/[id]">) => {
    const { id } = await ctx.params;

    const deleteResult = await db
      .delete(conferenceSpeakersTable)
      .where(eq(conferenceSpeakersTable.id, id));

    if (deleteResult.rowCount === 0) {
      throw new ApiError(CONFERENCE_SPEAKER_NOT_EXIST, 404);
    }

    return createSuccessResponse(undefined);
  },
);

export const PATCH = withErrorHandling(
  withBodyValidator(
    updateSpeakerSchema,
    async (data, _, ctx: RouteContext<"/api/speaker/[id]">) => {
      const { id } = await ctx.params;
      await db
        .update(conferenceSpeakersTable)
        .set(data)
        .where(eq(conferenceSpeakersTable.id, id));
      return createSuccessResponse(undefined);
    },
  ),
);
