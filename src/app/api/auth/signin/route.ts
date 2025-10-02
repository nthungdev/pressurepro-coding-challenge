import bcrypt from "bcrypt";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";
import { z } from "zod";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import type { SignInPostResponseData } from "@/app/api/auth/signin/types";
import type { NextRequest } from "next/server";
import {
  INTERNAL,
  INVALID_CREDENTIAL,
  INVALID_PROPERTIES,
} from "@/lib/error-messages";
import { createSession } from "@/lib/session";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = signInSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        {
          message: INVALID_PROPERTIES,
          detail: z.flattenError(validation.error),
        },
        400,
      );
    }

    const { email, password } = validation.data;

    const queryUserResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    const user = queryUserResult?.[0];
    if (!user) {
      return createErrorResponse({ message: INVALID_CREDENTIAL }, 400);
    }

    const correctPassword = await bcrypt.compare(password, user.passwordHash);

    if (!correctPassword) {
      return createErrorResponse({ message: INVALID_CREDENTIAL }, 400);
    }

    await createSession({
      email,
      userId: user.id,
    });

    return createSuccessResponse<SignInPostResponseData>({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return createErrorResponse({ message: INTERNAL }, 500);
  }
}
