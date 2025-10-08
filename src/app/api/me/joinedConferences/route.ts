import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import type { JoinedConferencesGetData } from "@/app/api/me/types";
import { userJoinConferencesTable } from "@/db/schema";
import { createSuccessResponse } from "@/lib/api-response";
import { withAuthenticatedRequired, withErrorHandling } from "@/lib/api-utils";
import { db } from "@/lib/drizzle";

/**
 * Get user's joined conferences
 */
export const GET = withErrorHandling(
  withAuthenticatedRequired((session) => async (_: NextRequest) => {
    console.log({ session });
    const result = await db
      .select()
      .from(userJoinConferencesTable)
      .where(eq(userJoinConferencesTable.userId, session.userId));

    const joinedConferences = result.map((r) => ({
      id: r.conferenceId,
    }));

    return createSuccessResponse<JoinedConferencesGetData>({
      joinedConferences,
    });
  }),
);
