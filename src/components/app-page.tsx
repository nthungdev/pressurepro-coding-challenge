import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Header from "@/components/header";

interface AppPageProps extends HTMLAttributes<HTMLDivElement> {
  hideHeader?: boolean;
}

export default function AppPage({
  hideHeader = false,
  children,
  className,
}: AppPageProps) {
  return (
    <div>
      {!hideHeader && <Header />}
      <div className={twMerge("mt-8 px-4 max-w-6xl mx-auto", className)}>
        {children}
      </div>
    </div>
  );
}
