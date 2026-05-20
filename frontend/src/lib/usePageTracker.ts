import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "./api";

function getSessionId(): string {
  try {
    let id = localStorage.getItem("bsm_sid");
    if (!id) {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem("bsm_sid", id);
    }
    return id;
  } catch {
    return `tmp-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function usePageTracker() {
  const location = useLocation();
  useEffect(() => {
    // Skip admin/login to keep public analytics clean
    if (location.pathname.startsWith("/admin") || location.pathname === "/login") return;
    const sessionId = getSessionId();
    const path = location.pathname + (location.search || "");
    const referrer = document.referrer || "";
    api.post("/site/track", { path, sessionId, referrer }).catch(() => {});
  }, [location.pathname, location.search]);
}
