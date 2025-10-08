"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-4">
      <h1 className="text-2xl md:text-4xl font-bold">Error</h1>
      <h2 className="text-lg md:text-2xl">{error.message}</h2>
      <div className="mt-10 flex flex-col">
        <button
          type="button"
          className="text-secondary"
          onClick={() => reset()}
        >
          Try again
        </button>
        <Link className="text-secondary" href="/">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
