import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import z from "zod";
import { userFavoriteConferencesTable } from "@/db/schema";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { withAuthenticatedRequired, withErrorHandling } from "@/lib/api-utils";
import { db } from "@/lib/drizzle";
import { INVALID_QUERY_PARAMS } from "@/lib/error-messages";

/** Add a conference to favorite */
export const POST = withErrorHandling(
  withAuthenticatedRequired(
    (session) =>
      async (
        _: NextRequest,
        ctx: RouteContext<"/api/conference/[id]/favorite">,
      ) => {
        const { id } = await ctx.params;

        const validation = z.uuid().safeParse(id);
        if (!validation.success) {
          return createErrorResponse(
            {
              message: INVALID_QUERY_PARAMS,
              detail: z.flattenError(validation.error),
            },
            400,
          );
        }

        await db
          .insert(userFavoriteConferencesTable)
          .values({
            userId: session.userId,
            conferenceId: id,
          })
          .onConflictDoNothing();

        return createSuccessResponse(undefined);
      },
  ),
);

/** Remove a conference from favorite */
export const DELETE = withErrorHandling(
  withAuthenticatedRequired(
    (session) =>
      async (
        _: NextRequest,
        ctx: RouteContext<"/api/conference/[id]/favorite">,
      ) => {
        const { id } = await ctx.params;

        const validation = z.uuid().safeParse(id);
        if (!validation.success) {
          return createErrorResponse(
            {
              message: INVALID_QUERY_PARAMS,
              detail: z.flattenError(validation.error),
            },
            400,
          );
        }

        await db
          .delete(userFavoriteConferencesTable)
          .where(
            and(
              eq(userFavoriteConferencesTable.userId, session.userId),
              eq(userFavoriteConferencesTable.conferenceId, id),
            ),
          );

        return createSuccessResponse(undefined);
      },
  ),
);
