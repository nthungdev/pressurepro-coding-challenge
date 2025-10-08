import "server-only";

import { createErrorResponse } from "@/lib/api-response";
import {
  INTERNAL,
  INVALID_BODY,
  INVALID_PROPERTIES,
  NO_PERMISSION,
} from "@/lib/error-messages";
import type { NextRequest, NextResponse } from "next/server";
import z from "zod";
import type { AppRouteHandlerRoutes } from "../../.next/types/routes";
import ApiError from "@/lib/api-error";
import { type AuthenticatedSessionResult, verifySession } from "@/lib/session";

/**
 * Higher order function to validate the request's body
 */
export function withBodyValidator<
  T extends z.ZodObject,
  R extends AppRouteHandlerRoutes,
>(
  schema: T,
  requestHandler: (
    data: z.infer<T>,
  ) => (request: NextRequest, ctx: RouteContext<R>) => Promise<NextResponse>,
) {
  return async (request: NextRequest, ctx: RouteContext<R>) => {
    const body = await request.json().catch((error) => {
      if (error instanceof SyntaxError) {
        throw new ApiError(INVALID_BODY, 400);
      }
      throw error;
    });

    const validation = schema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        {
          message: INVALID_PROPERTIES,
          detail: z.flattenError(validation.error),
        },
        400,
      );
    }

    return requestHandler(validation.data)(request, ctx);
  };
}

/**
 * Handle uncaught errors and API errors that we want to include in the API response.
 * Any non ApiError are exposed as internal server error to the consumers.
 */
export function withErrorHandling<R extends AppRouteHandlerRoutes>(
  handler: (req: NextRequest, ctx: RouteContext<R>) => Promise<NextResponse>,
) {
  return async (req: NextRequest, ctx: RouteContext<R>) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      if (error instanceof ApiError) {
        return createErrorResponse(
          { message: error.message },
          error.statusCode,
        );
      }
      // unexpected errors
      console.error(error);
      return createErrorResponse({ message: INTERNAL }, 500);
    }
  };
}

export function withAuthenticatedRequired<R extends AppRouteHandlerRoutes>(
  handler: (
    session: AuthenticatedSessionResult,
  ) => (req: NextRequest, ctx: RouteContext<R>) => Promise<NextResponse>,
) {
  return async (req: NextRequest, ctx: RouteContext<R>) => {
    const session = await verifySession();
    if (!session.isAuth) {
      return createErrorResponse({ message: NO_PERMISSION }, 401);
    }

    return handler(session)(req, ctx);
  };
}
