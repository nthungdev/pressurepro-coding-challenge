"use client";

import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { useAuth } from "@/providers/auth-provider";

export default function Home() {
  const { email } = useAuth();

  return (
    <div>
      <h1>Home page</h1>
      <div>Email {email}</div>
      <div className="flex flex-col items-start">
        <button type="button" onClick={logout}>
          Logout
        </button>
        <Link href="/auth/signin">Sign in</Link>
        <Link href="/auth/signup">Sign up</Link>
        <Link href="/admin">Admin</Link>
      </div>
    </div>
  );
}
