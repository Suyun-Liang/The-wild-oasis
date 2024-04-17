import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export default function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return {
    user: user ?? {},
    isLoading,
    isAuthenticated: user?.role === "authenticated",
    isAdmin: user?.user_metadata?.role === "admin",
  };
}
