import { GOOGLE_SCRIPT_URL } from "@/config/app.config";
import type { RegistrationPayload, Visitor } from "@/types/visitor";

// ============================================================
// Google Sheets sync (optional mirror)
// ------------------------------------------------------------
// When GOOGLE_SCRIPT_URL is configured, every registration is
// also POSTed to the Apps Script Web App so it lands in Google
// Sheets. This is best-effort: if the endpoint is unreachable the
// Supabase record is still saved and the user still succeeds.
// ============================================================

export function isSheetsConfigured(): boolean {
  return Boolean(GOOGLE_SCRIPT_URL) && !GOOGLE_SCRIPT_URL.includes("XXXXXXXXXXXX");
}

export async function syncToSheets(
  payload: RegistrationPayload,
): Promise<void> {
  if (!isSheetsConfigured()) return;
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "register", payload }),
      redirect: "follow",
    });
  } catch {
    // Best-effort sync — Supabase is the source of truth.
  }
}

// Request the next sequential Visitor ID from the Apps Script.
// Returns null if unavailable (Supabase will generate one instead).
export async function sheetsNextVisitorId(): Promise<string | null> {
  if (!isSheetsConfigured()) return null;
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "nextId" }),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data?: { visitorId: string } };
    if (json.success && json.data?.visitorId) return json.data.visitorId;
  } catch {
    /* fall through */
  }
  return null;
}

export async function sheetsSetStatus(
  visitorId: string,
  status: Visitor["status"],
): Promise<void> {
  if (!isSheetsConfigured()) return;
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "setStatus", visitorId, status }),
      redirect: "follow",
    });
  } catch {
    /* best-effort */
  }
}

export async function sheetsUpdate(visitor: Partial<Visitor> & { visitorId: string }): Promise<void> {
  if (!isSheetsConfigured()) return;
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "update", visitor }),
      redirect: "follow",
    });
  } catch {
    /* best-effort */
  }
}

export async function sheetsDelete(visitorId: string): Promise<void> {
  if (!isSheetsConfigured()) return;
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "delete", visitorId }),
      redirect: "follow",
    });
  } catch {
    /* best-effort */
  }
}
