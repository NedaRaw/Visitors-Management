import { useEffect, useState, useCallback } from "react";

// ============================================================
// Minimal hash-based router
// ------------------------------------------------------------
// Routes:
//   #/            -> registration
//   #/success      -> success / badge (state carried via history state)
//   #/visitor/:id  -> visitor lookup (from QR scan)
//   #/admin        -> admin dashboard (login + table)
// ============================================================

export type Route =
  | { name: "home" }
  | { name: "register" }
  | { name: "success" }
  | { name: "visitor"; visitorId: string }
  | { name: "survey" }
  | { name: "enquiry" }
  | { name: "admin" };

export function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  if (hash === "/" || hash === "/home" || hash === "") return { name: "home" };
  if (hash === "/register") return { name: "register" };
  if (hash === "/survey") return { name: "survey" };
  if (hash === "/enquiry") return { name: "enquiry" };
  if (hash === "/success") return { name: "success" };
  const visitorMatch = hash.match(/^\/visitor\/(.+)$/);
  if (visitorMatch) return { name: "visitor", visitorId: visitorMatch[1] };
  if (hash.startsWith("/admin")) return { name: "admin" };
  return { name: "home" };
}

export function navigate(path: string, state?: unknown) {
  if (state !== undefined) {
    window.history.replaceState(state, "", `#${path}`);
  } else {
    window.history.replaceState(null, "", `#${path}`);
  }
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const go = useCallback((path: string, state?: unknown) => {
    navigate(path, state);
  }, []);

  return { route, go };
}
