/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi, walletApi } from "../api/api.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "aviator_token";
const USER_KEY = "aviator_user";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const decoded = JSON.parse(window.atob(padded));

    return {
      id: decoded.id,
      username: decoded.username || `Player ${String(decoded.id).slice(-4)}`,
      balance: 0,
    };
  } catch {
    return {
      id: "local",
      username: "Player",
      balance: 0,
    };
  }
}

function readStoredUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const storedUser = readStoredUser();
    const storedToken = localStorage.getItem(TOKEN_KEY);
    return storedUser || (storedToken ? decodeToken(storedToken) : null);
  });
  const [wallet, setWallet] = useState(() => {
    const storedUser = readStoredUser();
    return Number(storedUser?.balance || 0);
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const syncUser = useCallback((nextUser) => {
    if (!nextUser) return;

    const normalizedUser = {
      id: nextUser.id || nextUser._id,
      username: nextUser.username,
      balance: Number(nextUser.balance || 0),
    };

    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    setWallet(normalizedUser.balance);
  }, []);

  const updateWallet = useCallback((balance) => {
    const nextBalance = Number(balance || 0);

    setWallet(nextBalance);
    setUser((current) => {
      if (!current) return current;

      const nextUser = {
        ...current,
        balance: nextBalance,
      };

      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      return nextUser;
    });
  }, []);

  const persistSession = useCallback(
    (session) => {
      localStorage.setItem(TOKEN_KEY, session.token);
      setToken(session.token);
      syncUser(session.user || decodeToken(session.token));
    },
    [syncUser],
  );

  const refreshProfile = useCallback(async () => {
    if (!token) return;

    setProfileLoading(true);

    try {
      const profile = await authApi.me(token);
      syncUser(profile);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      setWallet(0);
    } finally {
      setProfileLoading(false);
    }
  }, [syncUser, token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshProfile();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refreshProfile]);

  const login = useCallback(
    async (username, password) => {
      const result = await authApi.login(username, password);
      persistSession(result);
    },
    [persistSession],
  );

  const register = useCallback(
    async (username, password) => {
      await authApi.register(username, password);
      await login(username, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setWallet(0);
  }, []);

  const deposit = useCallback(
    async (amount) => {
      const profile = await walletApi.deposit(token, amount);
      syncUser(profile);
      return profile;
    },
    [syncUser, token],
  );

  const withdraw = useCallback(
    async (amount) => {
      const profile = await walletApi.withdraw(token, amount);
      syncUser(profile);
      return profile;
    },
    [syncUser, token],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      wallet,
      profileLoading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      refreshProfile,
      syncUser,
      updateWallet,
      deposit,
      withdraw,
    }),
    [
      deposit,
      login,
      logout,
      profileLoading,
      refreshProfile,
      register,
      syncUser,
      token,
      updateWallet,
      user,
      wallet,
      withdraw,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
