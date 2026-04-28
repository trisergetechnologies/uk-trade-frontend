"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AUTH_CHANGE_EVENT,
  dashboardPathForRole,
  getToken,
} from "@/lib/session";
import { getRoleFromToken } from "@/lib/jwt-client";

export function useClientSession() {
  const [hydrated, setHydrated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/userdashboard");

  const refresh = useCallback(() => {
    const t = getToken();
    if (!t) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
    const role = getRoleFromToken(t);
    setDashboardPath(role ? dashboardPathForRole(role) : "/userdashboard");
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);
  }, [refresh]);

  useEffect(() => {
    const onStorage = () => refresh();
    const onAuthChange = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    };
  }, [refresh]);

  return { hydrated, isLoggedIn, dashboardPath, refresh };
}
