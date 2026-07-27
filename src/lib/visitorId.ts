import { supabase } from "@/lib/supabaseClient";

// ============================================================
// Visitor ID generator
// ------------------------------------------------------------
// Format: LAB-YYYY-NNNNNN  (e.g. LAB-2026-000001)
// The sequence resets at the start of each calendar year.
// ============================================================

export function buildVisitorId(year: number, sequence: number): string {
  return `LAB-${year}-${String(sequence).padStart(6, "0")}`;
}

export function currentYear(): number {
  return new Date().getFullYear();
}

// Local fallback generator using a random sequence so that
// registration never blocks if the network is unreachable.
export function fallbackVisitorId(): string {
  const year = currentYear();
  const seq = Math.floor(Math.random() * 900000) + 100000;
  return buildVisitorId(year, seq);
}

// Generate the next sequential Visitor ID from Supabase by finding
// the highest existing sequence for the current year and adding 1.
// Returns null if the table can't be reached (caller falls back).
export async function nextVisitorIdFromSupabase(): Promise<string | null> {
  const year = currentYear();
  const prefix = `LAB-${year}-`;
  try {
    const { data, error } = await supabase
      .from("visitors")
      .select("visitor_id")
      .like("visitor_id", `${prefix}%`);

    if (error) return null;
    let maxSeq = 0;
    for (const row of data ?? []) {
      const seq = parseInt(String(row.visitor_id).substring(prefix.length), 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
    return buildVisitorId(year, maxSeq + 1);
  } catch {
    return null;
  }
}
