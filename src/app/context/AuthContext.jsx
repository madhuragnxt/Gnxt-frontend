import { createContext, useContext, useState, useEffect, useCallback } from "react";

const API = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("gnxt_token"));
  const [loading, setLoading] = useState(true);

  /* ── Verify token on mount ── */
  useEffect(() => {
    if (!token) { setLoading(false); return; }

    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setUser(res.data);
        else { localStorage.removeItem("gnxt_token"); setToken(null); }
      })
      .catch(() => { localStorage.removeItem("gnxt_token"); setToken(null); })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (username, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Login failed");
    localStorage.setItem("gnxt_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => { });
    }
    localStorage.removeItem("gnxt_token");
    setToken(null);
    setUser(null);
  }, [token]);

  // Check granular permission key directly (e.g. "cancel_invoice", "view_trips")
  const hasGranularPermission = useCallback((key) => {
    if (user?.role === "Super Admin") return true;
    if (!user?.granularPermissions) return false;
    return !!user.granularPermissions[key];
  }, [user]);

  const hasPermission = useCallback((moduleName, action) => {
    if (user?.role === "Super Admin") return true;
    if (!user?.permissions) return false;
    const perm = user.permissions.find(p => p.module?.toLowerCase() === moduleName?.toLowerCase());
    if (!perm) return false;
    return !!perm[action?.toLowerCase()];
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user, hasPermission, hasGranularPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
