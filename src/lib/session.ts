import "server-only";
import type { JWTPayload } from "jose";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
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
  const defaultValue: SessionResult = {
    isAuth: false,
    email: null,
    userId: null,
  };

  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) {
    return defaultValue;
  }

  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return defaultValue;
  }

  return {
    isAuth: true,
    email: session.email,
    userId: session.userId,
  } as SessionResult;
});

export type UnauthenticatedSessionResult = {
  isAuth: false;
  email: null;
  userId: null;
};
export type AuthenticatedSessionResult = {
  isAuth: true;
  email: string;
  userId: string;
};
export type SessionResult =
  | UnauthenticatedSessionResult
  | AuthenticatedSessionResult;

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
