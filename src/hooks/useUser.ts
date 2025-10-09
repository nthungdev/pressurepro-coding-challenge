import { useAuth } from "@/providers/auth-provider";

/**
 * I planned to make a call to /api/me endpoint to get personal profile
 * for now, it's effectively the same as useAuth
 */
export default function useUser() {
  const session = useAuth();
  if (!session.isAuth) return null;
  return {
    id: session.userId,
    email: session.email,
  };
}
