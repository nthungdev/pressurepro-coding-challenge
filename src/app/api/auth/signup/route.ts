import bcrypt from "bcrypt";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";
import { z } from "zod";
import type { NextRequest } from "next/server";
import type { SignUpPostResponseData } from "@/app/api/auth/signup/types";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import {
  EMAIL_ALREADY_REGISTERED,
  INTERNAL,
  INVALID_PROPERTIES,
} from "@/lib/error-messages";

const SALT = 10;

const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = signUpSchema.safeParse(body);
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

    const queryExistingUserResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    const existingUser = queryExistingUserResult?.[0];

    if (existingUser) {
      createErrorResponse({ message: EMAIL_ALREADY_REGISTERED }, 400);
    }

    const passwordHash = await bcrypt.hash(password, SALT);

    const insertUserResult = await db
      .insert(usersTable)
      .values({
        email,
        passwordHash,
      })
      .returning();
    const user = insertUserResult?.[0];

    if (!user) {
      return createErrorResponse({ message: INTERNAL }, 400);
    }

    return createSuccessResponse<SignUpPostResponseData>({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return createErrorResponse({ message: INTERNAL }, 500);
  }
}
