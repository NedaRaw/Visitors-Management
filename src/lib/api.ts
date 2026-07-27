import { supabase } from "@/lib/supabaseClient";
import {
  syncToSheets,
  sheetsSetStatus,
  sheetsUpdate,
  sheetsDelete,
  sheetsNextVisitorId,
  isSheetsConfigured,
} from "@/lib/sheets";
import {
  nextVisitorIdFromSupabase,
  fallbackVisitorId,
} from "@/lib/visitorId";
import type {
  RegistrationPayload,
  Visitor,
} from "@/types/visitor";
import type { VisitorStatus } from "@/config/app.config";

// ============================================================
// Visitor API — Supabase primary, Google Sheets mirror
// ------------------------------------------------------------
// Supabase is the source of truth. When GOOGLE_SCRIPT_URL is
// configured, writes are also mirrored to Google Sheets via the
// Apps Script Web App (best-effort).
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Map a Supabase row (snake_case) to a Visitor object.
interface VisitorRow {
  id: string;
  visitor_id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  phone: string;
  email: string;
  company: string | null;
  department: string;
  employee: string;
  purpose: string;
  visit_date: string;
  arrival_time: string;
  qr_url: string;
  status: string;
  timestamp: string;
}

function rowToVisitor(r: VisitorRow): Visitor {
  return {
    visitorId: r.visitor_id,
    firstName: r.first_name,
    lastName: r.last_name,
    nationalId: r.national_id,
    phone: r.phone,
    email: r.email,
    company: r.company ?? "",
    department: r.department,
    employee: r.employee,
    purpose: r.purpose,
    visitDate: r.visit_date,
    arrivalTime: r.arrival_time,
    qrUrl: r.qr_url,
    status: r.status as VisitorStatus,
    timestamp: r.timestamp,
  };
}

function visitorToRow(v: Partial<Visitor>) {
  const row: Record<string, unknown> = {};
  if (v.visitorId !== undefined) row.visitor_id = v.visitorId;
  if (v.firstName !== undefined) row.first_name = v.firstName;
  if (v.lastName !== undefined) row.last_name = v.lastName;
  if (v.nationalId !== undefined) row.national_id = v.nationalId;
  if (v.phone !== undefined) row.phone = v.phone;
  if (v.email !== undefined) row.email = v.email;
  if (v.company !== undefined) row.company = v.company;
  if (v.department !== undefined) row.department = v.department;
  if (v.employee !== undefined) row.employee = v.employee;
  if (v.purpose !== undefined) row.purpose = v.purpose;
  if (v.visitDate !== undefined) row.visit_date = v.visitDate;
  if (v.arrivalTime !== undefined) row.arrival_time = v.arrivalTime;
  if (v.qrUrl !== undefined) row.qr_url = v.qrUrl;
  if (v.status !== undefined) row.status = v.status;
  if (v.timestamp !== undefined) row.timestamp = v.timestamp;
  return row;
}

export const api = {
  async register(payload: RegistrationPayload): Promise<ApiResponse<Visitor>> {
    const row = {
      visitor_id: payload.visitorId,
      first_name: payload.firstName,
      last_name: payload.lastName,
      national_id: payload.nationalId,
      phone: payload.phone,
      email: payload.email,
      company: payload.company || null,
      department: payload.department,
      employee: payload.employee,
      purpose: payload.purpose,
      visit_date: payload.visitDate,
      arrival_time: payload.arrivalTime,
      qr_url: payload.qrUrl,
      status: "Pending",
      timestamp: payload.timestamp,
    };

    const { data, error } = await supabase
      .from("visitors")
      .insert(row)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Best-effort mirror to Google Sheets.
    void syncToSheets(payload);

    return { success: true, data: rowToVisitor(data as VisitorRow) };
  },

  async list(): Promise<ApiResponse<Visitor[]>> {
    const { data, error } = await supabase
      .from("visitors")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data as VisitorRow[]).map(rowToVisitor) };
  },

  async get(visitorId: string): Promise<ApiResponse<Visitor>> {
    const { data, error } = await supabase
      .from("visitors")
      .select("*")
      .eq("visitor_id", visitorId)
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    if (!data) return { success: false, error: "Visitor not found." };
    return { success: true, data: rowToVisitor(data as VisitorRow) };
  },

  async update(visitor: Partial<Visitor> & { visitorId: string }): Promise<ApiResponse<Visitor>> {
    const row = visitorToRow(visitor);
    const { data, error } = await supabase
      .from("visitors")
      .update(row)
      .eq("visitor_id", visitor.visitorId)
      .select()
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    if (!data) return { success: false, error: "Visitor not found." };

    void sheetsUpdate(visitor);

    return { success: true, data: rowToVisitor(data as VisitorRow) };
  },

  async remove(visitorId: string): Promise<ApiResponse<{ visitorId: string }>> {
    const { error } = await supabase
      .from("visitors")
      .delete()
      .eq("visitor_id", visitorId);

    if (error) return { success: false, error: error.message };

    void sheetsDelete(visitorId);

    return { success: true, data: { visitorId } };
  },

  async nextId(): Promise<ApiResponse<{ visitorId: string }>> {
    // Prefer the Apps Script sequence (authoritative when configured)
    // so IDs stay in sync with Google Sheets. Fall back to Supabase.
    if (isSheetsConfigured()) {
      const sheetsId = await sheetsNextVisitorId();
      if (sheetsId) return { success: true, data: { visitorId: sheetsId } };
    }
    const supaId = await nextVisitorIdFromSupabase();
    if (supaId) return { success: true, data: { visitorId: supaId } };
    return { success: true, data: { visitorId: fallbackVisitorId() } };
  },

  async setStatus(
    visitorId: string,
    status: VisitorStatus,
  ): Promise<ApiResponse<Visitor>> {
    const { data, error } = await supabase
      .from("visitors")
      .update({ status })
      .eq("visitor_id", visitorId)
      .select()
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    if (!data) return { success: false, error: "Visitor not found." };

    void sheetsSetStatus(visitorId, status);

    return { success: true, data: rowToVisitor(data as VisitorRow) };
  },
};
