import type { NextRequest } from "next/server";
import type { JoinedConferencesGetData } from "@/app/api/me/types";
import { createSuccessResponse } from "@/lib/api-response";
import { withAuthenticatedRequired, withErrorHandling } from "@/lib/api-utils";
import { getJoinedConferences } from "@/lib/query";

/**
 * Get user's joined conferences
 */
export const GET = withErrorHandling(
  withAuthenticatedRequired((session) => async (_: NextRequest) => {
    const joinedConferences = await getJoinedConferences(session.userId);
    return createSuccessResponse<JoinedConferencesGetData>({
      joinedConferences,
    });
  }),
);
