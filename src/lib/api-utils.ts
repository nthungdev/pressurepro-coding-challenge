import "server-only";
import { createErrorResponse } from "@/lib/api-response";
import { INVALID_PROPERTIES } from "@/lib/error-messages";
import type { NextRequest } from "next/server";
import z from "zod";
import type { AppRouteHandlerRoutes } from "../../.next/types/routes";
import type { PgSelect } from "drizzle-orm/pg-core";

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
    request: NextRequest,
    ctx: RouteContext<R>,
  ) => Promise<unknown>,
) {
  return async (request: NextRequest, ctx: RouteContext<R>) => {
    const body = await request.json();
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

    return requestHandler(validation.data, request, ctx);
  };
}

/**
 * Add pagination to select queries. Need to convert the query to dynamic.
 * ```
 * const query = db.select().from(conferencesTable)
 * withPagination(query.$dynamic(), page, pageSize);
 * ```
 */
export function withPagination<T extends PgSelect>(
  qb: T,
  page: number,
  pageSize: number,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}
