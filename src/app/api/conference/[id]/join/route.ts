import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import z from "zod";
import { userJoinConferencesTable } from "@/db/schema";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { withAuthenticatedRequired, withErrorHandling } from "@/lib/api-utils";
import { db } from "@/lib/drizzle";
import { INVALID_QUERY_PARAMS } from "@/lib/error-messages";

/** Join a conference */
export const POST = withErrorHandling(
  withAuthenticatedRequired(
    (session) =>
      async (
        _: NextRequest,
        ctx: RouteContext<"/api/conference/[id]/join">,
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
          .insert(userJoinConferencesTable)
          .values({
            userId: session.userId,
            conferenceId: id,
          })
          .onConflictDoNothing();

        return createSuccessResponse(undefined);
      },
  ),
);

/** Unjoin a conference */
export const DELETE = withErrorHandling(
  withAuthenticatedRequired(
    (session) =>
      async (
        _: NextRequest,
        ctx: RouteContext<"/api/conference/[id]/join">,
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
          .delete(userJoinConferencesTable)
          .where(
            and(
              eq(userJoinConferencesTable.userId, session.userId),
              eq(userJoinConferencesTable.conferenceId, id),
            ),
          );

        return createSuccessResponse(undefined);
      },
  ),
);
