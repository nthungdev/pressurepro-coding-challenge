"use client";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";
import AddConferenceButton from "@/components/add-conference-button";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/providers/auth-provider";

export default function Header() {
  const { isAuth, email } = useAuth();
  const { push } = useRouter();

  return (
    <header className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
      <Link href="/">Tech Conference Explorer</Link>

      {!isAuth && (
        <div className="flex flex-row items-center gap-4">
          <Link href="/auth/signin">Sign in</Link>
          <Link href="/auth/signup">Sign up</Link>
        </div>
      )}

      {isAuth && (
        <div className="flex flex-row items-center gap-4">
          <AddConferenceButton className="hidden md:inline-flex py-0" />
          <Link className="hidden md:block" href="/admin">
            Admin
          </Link>

          <Popover>
            <PopoverTrigger>
              <CircleUserRound className="cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2 flex flex-col">
                <div className="px-4 py-2 font-semibold">{email}</div>
                <AddConferenceButton className="py-0 md:hidden" />
                <Button
                  className="md:hidden w-full justify-start"
                  variant="ghost"
                  type="button"
                  onClick={() => push("/admin")}
                >
                  Admin Dashboard
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  type="button"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </header>
  );
}
