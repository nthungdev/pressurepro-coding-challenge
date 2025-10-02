"use client";

import { logout } from "@/app/actions/auth";
import { useAuth } from "@/app/providers/auth-provider";
import Link from "next/link";

export default function Home() {
  const { email } = useAuth();

  return (
    <div>
      <h1>Home page</h1>
      <div>Email {email}</div>
      <button type="button" onClick={logout}>
        Logout
      </button>
      <Link href="/auth/signin">Sign in</Link>
      <Link href="/auth/signup">Sign up</Link>
    </div>
  );
}
