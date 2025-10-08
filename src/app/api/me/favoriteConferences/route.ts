import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import type { FavoriteConferencesGetData } from "@/app/api/me/types";
import { userFavoriteConferencesTable } from "@/db/schema";
import { createSuccessResponse } from "@/lib/api-response";
import { withAuthenticatedRequired, withErrorHandling } from "@/lib/api-utils";
import { db } from "@/lib/drizzle";

/**
 * Get ids of user's favorite conferences
 */
export const GET = withErrorHandling(
  withAuthenticatedRequired((session) => async (_: NextRequest) => {
    console.log({ session });
    const result = await db
      .select()
      .from(userFavoriteConferencesTable)
      .where(eq(userFavoriteConferencesTable.userId, session.userId));

    const favoriteConferences = result.map((r) => ({
      id: r.conferenceId,
    }));

    return createSuccessResponse<FavoriteConferencesGetData>({
      favoriteConferences,
    });
  }),
);
