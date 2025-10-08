import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-4xl">404 - Page Not Found</h1>
      <Link className="text-secondary" href="/">
        Return Home
      </Link>
    </div>
  );
}
