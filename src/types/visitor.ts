import type { VisitorStatus } from "@/config/app.config";

export interface Visitor {
  visitorId: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phone: string;
  email: string;
  company: string;
  department: string;
  employee: string;
  purpose: string;
  visitDate: string; // ISO date (yyyy-mm-dd)
  arrivalTime: string; // HH:mm
  qrUrl: string;
  status: VisitorStatus;
  timestamp: string; // ISO datetime
}

// Payload sent to Google Apps Script on registration.
export interface RegistrationPayload {
  visitorId: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phone: string;
  email: string;
  company: string;
  department: string;
  employee: string;
  purpose: string;
  visitDate: string;
  arrivalTime: string;
  qrUrl: string;
  timestamp: string;
}

// Form values before a Visitor ID / QR / timestamp is attached.
export interface RegistrationFormValues {
  firstName: string;
  lastName: string;
  nationalId: string;
  phone: string;
  email: string;
  company: string;
  department: string;
  employee: string;
  purpose: string;
  visitDate: string;
  arrivalTime: string;
}
