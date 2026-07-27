// ============================================================
// APPLICATION CONFIGURATION
// ------------------------------------------------------------
// Edit these values before deploying to production.
// ============================================================

// Google Apps Script Web App endpoint.
// Deploy your Apps Script (see apps-script/Code.gs) as a Web App
// with access set to "Anyone", then paste the /exec URL here.
export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";

// Public domain used inside QR codes. The QR encodes a visitor
// lookup URL like: https://your-domain.com/visitor/LAB-2026-000001
export const PUBLIC_DOMAIN = "https://your-domain.com";

// Admin dashboard accounts. Change these before going live.
// Add as many accounts as you need — each has its own username and password.
export const ADMIN_CREDENTIALS = [
  { username: "admin", password: "najran2026" },
];

// Laboratory branding shown on the badge and across the app.
export const LAB_INFO = {
  name: "Najran Central Laboratory",
  tagline: "National Water Company",
  address: "Najran, Kingdom of Saudi Arabia",
  phone: "+966 17 000 0000",
  email: "visitors@nwc.com.sa",
};

// Department / Laboratory options presented in the registration form.
export const DEPARTMENTS = [
  "Microbiology",
  "Chemistry",
  "Water Quality",
  "Environmental Testing",
  "Sample Reception",
  "Quality Control",
  "Calibration",
  "Administration",
  "Health & Safety",
] as const;

// Purpose of Visit options.
export const PURPOSES = [
  "Business Meeting",
  "Equipment Service / Maintenance",
  "Sample Delivery",
  "Audit / Inspection",
  "Training",
  "Job Interview",
  "Vendor Presentation",
  "Research Collaboration",
  "Other",
] as const;

// Visit status values.
export const VISITOR_STATUSES = [
  "Pending",
  "Checked In",
  "Checked Out",
  "Expired",
] as const;

export type VisitorStatus = (typeof VISITOR_STATUSES)[number];
