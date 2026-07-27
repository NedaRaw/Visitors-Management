import type { RegistrationFormValues } from "@/types/visitor";

// ============================================================
// Form validation
// ============================================================

export type FieldErrors = Partial<Record<keyof RegistrationFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;

export function validateRegistration(
  values: RegistrationFormValues,
): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";
  if (!values.nationalId.trim())
    errors.nationalId = "National ID / Passport is required.";
  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_RE.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  // company is optional
  if (!values.department.trim())
    errors.department = "Department / Laboratory is required.";
  if (!values.employee.trim())
    errors.employee = "Employee to visit is required.";
  if (!values.purpose.trim()) errors.purpose = "Purpose of visit is required.";

  if (!values.visitDate) {
    errors.visitDate = "Visit date is required.";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(values.visitDate + "T00:00:00");
    if (picked < today) errors.visitDate = "Visit date cannot be in the past.";
  }

  if (!values.arrivalTime)
    errors.arrivalTime = "Expected arrival time is required.";

  return errors;
}
