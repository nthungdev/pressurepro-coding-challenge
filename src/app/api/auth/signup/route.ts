import ApiError from "@/lib/api-error";
import bcrypt from "bcrypt";
import { createSuccessResponse } from "@/lib/api-response";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";
import {
  EMAIL_ALREADY_REGISTERED,
  INVALID_PROPERTIES,
} from "@/lib/error-messages";
import { z } from "zod";
import type { NextRequest } from "next/server";
import type { SignUpPostResponseData } from "@/app/api/auth/signup/types";

const SALT = 10;

const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = signUpSchema.safeParse(body);
  if (!validation.success) {
    throw new ApiError(
      INVALID_PROPERTIES,
      400,
      z.flattenError(validation.error),
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
    throw new ApiError(EMAIL_ALREADY_REGISTERED, 400);
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

  return createSuccessResponse<SignUpPostResponseData>({
    id: user.id,
    email: user.email,
  });
}
