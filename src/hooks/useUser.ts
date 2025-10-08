import { useAuth } from "@/providers/auth-provider";

export default function useUser() {
  const session = useAuth();
  if (!session.isAuth) return null;
  return {
    id: session.userId,
    email: session.email,
  };
}
