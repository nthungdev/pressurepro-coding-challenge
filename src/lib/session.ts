import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cache } from "react";

const SESSION_COOKIE_NAME = "session";

type SessionPayload = {
  userId: string;
  email: string;
};

type SessionJWTPayload = JWTPayload & SessionPayload;

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET env var not set");
}

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(encodedKey);
}

async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify<SessionJWTPayload>(
      session,
      encodedKey,
      { algorithms: ["HS256"] },
    );
    return payload;
  } catch (error) {
    console.error("Failed to verify session");
    console.error(error);
  }
}

export async function createSession(payload: SessionPayload) {
  const session = await encrypt(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
}

export const verifySession = cache(async () => {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) {
    return { isAuth: false };
  }

  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { isAuth: false };
  }

  return {
    isAuth: true,
    email: session.email,
    userId: session.userId,
  };
});

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
