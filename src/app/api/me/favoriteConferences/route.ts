import type { NextRequest } from "next/server";
import type { FavoriteConferencesGetData } from "@/app/api/me/types";
import { createSuccessResponse } from "@/lib/api-response";
import { withAuthenticatedRequired, withErrorHandling } from "@/lib/api-utils";
import { getFavoriteConferences } from "@/lib/query";

/**
 * Get user's favorite conferences
 */
export const GET = withErrorHandling(
  withAuthenticatedRequired((session) => async (_: NextRequest) => {
    const favoriteConferences = await getFavoriteConferences(session.userId);
    return createSuccessResponse<FavoriteConferencesGetData>({
      favoriteConferences,
    });
  }),
);
