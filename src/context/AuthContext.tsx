import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { ADMIN_CREDENTIALS } from "@/config/app.config";

interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);

  const login = (u: string, p: string) => {
    const found = ADMIN_CREDENTIALS.find(
      (c) => c.username === u && c.password === p,
    );
    if (found) {
      setUsername(u);
      return true;
    }
    return false;
  };

  const logout = () => setUsername(null);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: username !== null, username, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
