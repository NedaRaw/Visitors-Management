import type { Visitor } from "@/types/visitor";

// ============================================================
// Spreadsheet export helpers (CSV + Excel-compatible)
// ============================================================

const HEADERS = [
  "Visitor ID",
  "First Name",
  "Last Name",
  "National ID",
  "Phone",
  "Email",
  "Company",
  "Department",
  "Employee",
  "Purpose",
  "Visit Date",
  "Arrival Time",
  "Status",
  "QR URL",
  "Timestamp",
];

function visitorRow(v: Visitor): (string | number)[] {
  return [
    v.visitorId,
    v.firstName,
    v.lastName,
    v.nationalId,
    v.phone,
    v.email,
    v.company,
    v.department,
    v.employee,
    v.purpose,
    v.visitDate,
    v.arrivalTime,
    v.status,
    v.qrUrl,
    v.timestamp,
  ];
}

function escapeCsv(value: unknown): string {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportVisitorsCsv(visitors: Visitor[], filename = "visitors.csv") {
  const lines = [HEADERS.join(",")];
  for (const v of visitors) {
    lines.push(visitorRow(v).map(escapeCsv).join(","));
  }
  const blob = new Blob(["\uFEFF" + lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  triggerDownload(blob, filename);
}

// Excel-compatible export. We emit an HTML table with the .xls
// extension and an Excel XML namespace; Excel opens it natively.
// This avoids adding a heavy dependency like xlsx.
export function exportVisitorsExcel(
  visitors: Visitor[],
  filename = "visitors.xls",
) {
  const rows = visitors.map((v) => visitorRow(v));
  const table = `<table border="1">`;
  const headerRow = `<tr>${HEADERS.map(
    (h) => `<th style="background:#0f4c81;color:#fff;">${h}</th>`,
  ).join("")}</tr>`;
  const bodyRows = rows
    .map(
      (r) =>
        `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`,
    )
    .join("");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body>${table}${headerRow}${bodyRows}</table></body></html>`;
  const blob = new Blob(["\uFEFF" + html], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  triggerDownload(blob, filename);
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
