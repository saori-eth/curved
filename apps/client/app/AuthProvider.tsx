import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { User } from "lucia";
import { useRouter } from "next/navigation";
import {
  Context,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useAccount, useDisconnect } from "wagmi";

import { LoginResponse } from "@/app/api/auth/login/types";
import { getAuthStatus } from "@/app/api/auth/status/helper";
import { AuthData } from "@/lib/auth/types";

export type AuthContextValue = {
  status: AuthenticationStatus;
  loading: boolean; // Separate loading state for transitions
  user: User | null;
  login: (args: AuthData) => Promise<void>;
  logout: () => Promise<boolean>;
};

export const AuthContext: Context<AuthContextValue> =
  createContext<AuthContextValue>({
    loading: false,
    login: async () => {},
    logout: async () => false,
    status: "loading",
    user: null,
  });

interface Props {
  children: React.ReactNode;
}

/**
 * A context provider for authentication
 */
export default function AuthProvider({ children }: Props) {
  const [status, setStatus] = useState<AuthenticationStatus>("loading");
  const [user, setUser] = useState<User | null>(null);

  const [loading, startTransition] = useTransition();

  const router = useRouter();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const login = useCallback(
    async (args: AuthData) => {
      if (status === "authenticated" || status === "loading") return;

      setStatus("loading");

      try {
        const res = await fetch("/api/auth/login", {
          body: JSON.stringify(args),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        if (!res.ok) throw new Error("Login failed");

        const { user } = (await res.json()) as LoginResponse;

        // Refresh the page
        startTransition(() => router.refresh());

        setStatus("authenticated");
        setUser(user);
      } catch (err) {
        setStatus("unauthenticated");
        setUser(null);
        throw err;
      }
    },
    [status, setStatus, setUser, router],
  );

  const logout = useCallback(async () => {
    if (status === "unauthenticated" || status === "loading") return false;

    setStatus("loading");

    try {
      // Disconnect wallet
      disconnect();

      // Logout of session
      const res = await fetch("/api/auth/logout", { method: "GET" });
      if (!res.ok) throw new Error("Logout failed");

      // Refresh the page
      startTransition(() => router.refresh());

      setStatus("unauthenticated");
      setUser(null);

      return true;
    } catch (err) {
      setStatus("authenticated");
      return false;
    }
  }, [status, disconnect, setStatus, setUser, router]);

  // Get the initial authentication status
  useEffect(() => {
    getAuthStatus()
      .then((res) => {
        if (res.status === "authenticated") {
          setStatus("authenticated");
          setUser(res.user);
        } else {
          setStatus("unauthenticated");
        }
      })
      .catch(() => {
        setStatus("unauthenticated");
        setUser(null);
      });
  }, [setStatus, setUser]);

  // Logout on wallet change
  useEffect(() => {
    if (user?.address !== address) {
      logout();
    }
  }, [user, address, logout]);

  return (
    <AuthContext.Provider value={{ loading, login, logout, status, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
