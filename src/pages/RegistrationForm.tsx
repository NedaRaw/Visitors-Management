import { useState, type FormEvent } from "react";
import {
  User,
  CreditCard,
  Phone,
  Mail,
  Building2,
  Stethoscope,
  Users,
  ClipboardList,
  CalendarDays,
  Clock,
  Send,
  AlertCircle,
} from "lucide-react";
import { Input, Select } from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { DEPARTMENTS, PURPOSES } from "@/config/app.config";
import { validateRegistration, type FieldErrors } from "@/lib/validation";
import { api } from "@/lib/api";
import { fallbackVisitorId, currentYear, buildVisitorId } from "@/lib/visitorId";
import { generateQrDataUrl } from "@/lib/qr";
import type {
  RegistrationFormValues,
  RegistrationPayload,
  Visitor,
} from "@/types/visitor";

interface RegistrationFormProps {
  onRegistered: (visitor: Visitor, qrDataUrl: string) => void;
}

const EMPTY: RegistrationFormValues = {
  firstName: "",
  lastName: "",
  nationalId: "",
  phone: "",
  email: "",
  company: "",
  department: "",
  employee: "",
  purpose: "",
  visitDate: "",
  arrivalTime: "",
};

export default function RegistrationForm({ onRegistered }: RegistrationFormProps) {
  const [values, setValues] = useState<RegistrationFormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update =
    (field: keyof RegistrationFormValues) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const fieldErrors = validateRegistration(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      // Focus first error field
      const firstKey = Object.keys(fieldErrors)[0];
      const el = document.getElementById(firstKey);
      el?.focus();
      return;
    }

    setSubmitting(true);

    // 1. Ask the Apps Script for the next Visitor ID. Fall back to a
    //    locally generated ID if the endpoint is unreachable.
    let visitorId = "";
    try {
      const next = await api.nextId();
      if (next.success && next.data?.visitorId) {
        visitorId = next.data.visitorId;
      } else {
        visitorId = fallbackVisitorId();
      }
    } catch {
      visitorId = fallbackVisitorId();
    }

    // 2. Build the QR URL and render the QR image.
    const qrUrl = `${window.location.origin.replace(/\/$/, "")}/visitor/${visitorId}`;
    let qrDataUrl = "";
    try {
      qrDataUrl = await generateQrDataUrl(visitorId);
    } catch {
      setSubmitError("Could not generate QR code. Please try again.");
      setSubmitting(false);
      return;
    }

    // 3. Assemble the payload exactly as specified.
    const timestamp = new Date().toISOString();
    const payload: RegistrationPayload = {
      visitorId,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      nationalId: values.nationalId.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      department: values.department,
      employee: values.employee.trim(),
      purpose: values.purpose,
      visitDate: values.visitDate,
      arrivalTime: values.arrivalTime,
      qrUrl,
      timestamp,
    };

    // 4. POST to Google Sheets via the Apps Script endpoint.
    const res = await api.register(payload);

    setSubmitting(false);

    if (!res.success) {
      setSubmitError(
        res.error ||
          "Could not save your registration. Please try again.",
      );
      return;
    }

    // 5. Build a full Visitor object for the success page / badge.
    const visitor: Visitor = {
      ...payload,
      status: "Pending",
    };

    onRegistered(visitor, qrDataUrl);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-900/30 dark:ring-blue-800/40">
          <ClipboardList size={26} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
          Visitor Registration
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Complete the form below to register your visit to our laboratory.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              name="firstName"
              label="First Name"
              placeholder="Mohamed / محمد"
              required
              icon={<User size={16} />}
              value={values.firstName}
              onChange={update("firstName")}
              error={errors.firstName}
              autoComplete="given-name"
            />
            <Input
              name="lastName"
              label="Last Name"
              placeholder="Atibi / العتيبي"
              required
              icon={<User size={16} />}
              value={values.lastName}
              onChange={update("lastName")}
              error={errors.lastName}
              autoComplete="family-name"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              name="nationalId"
              label="National ID / Passport"
              placeholder="ID or passport number"
              required
              icon={<CreditCard size={16} />}
              value={values.nationalId}
              onChange={update("nationalId")}
              error={errors.nationalId}
            />
            <Input
              name="phone"
              label="Phone Number"
              placeholder="+966 5X XXX XXXX"
              required
              type="tel"
              icon={<Phone size={16} />}
              value={values.phone}
              onChange={update("phone")}
              error={errors.phone}
              autoComplete="tel"
            />
          </div>

          <Input
            name="email"
            label="Email"
            placeholder="you@example.com"
            required
            type="email"
            icon={<Mail size={16} />}
            value={values.email}
            onChange={update("email")}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            name="company"
            label="Company (Optional)"
            placeholder="Your organization"
            icon={<Building2 size={16} />}
            value={values.company}
            onChange={update("company")}
            error={errors.company}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              name="department"
              label="Department / Laboratory"
              placeholder="Select department"
              required
              options={DEPARTMENTS}
              value={values.department}
              onChange={update("department")}
              error={errors.department}
            />
            <Input
              name="employee"
              label="Employee to Visit"
              placeholder="Dr. Abdullah / د. عبدالله"
              required
              icon={<Users size={16} />}
              value={values.employee}
              onChange={update("employee")}
              error={errors.employee}
            />
          </div>

          <Select
            name="purpose"
            label="Purpose of Visit"
            placeholder="Select purpose"
            required
            options={PURPOSES}
            value={values.purpose}
            onChange={update("purpose")}
            error={errors.purpose}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              name="visitDate"
              label="Visit Date"
              type="date"
              required
              icon={<CalendarDays size={16} />}
              value={values.visitDate}
              onChange={update("visitDate")}
              error={errors.visitDate}
              min={`${currentYear()}-01-01`}
            />
            <Input
              name="arrivalTime"
              label="Expected Arrival Time"
              type="time"
              required
              icon={<Clock size={16} />}
              value={values.arrivalTime}
              onChange={update("arrivalTime")}
              error={errors.arrivalTime}
            />
          </div>

          {submitError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={submitting}
              leftIcon={!submitting ? <Send size={18} /> : undefined}
            >
              {submitting ? "Registering..." : "Submit Registration"}
            </Button>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
            <Stethoscope size={13} />
            Your information is securely stored and used only for visitor
            management.
          </p>
        </form>
      </Card>
    </div>
  );
}
