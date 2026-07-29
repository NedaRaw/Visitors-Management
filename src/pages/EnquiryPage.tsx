import { useState } from "react";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Mail,
  Phone,
  User,
  Building2,
  MapPin,
  Wrench,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/Button";
import { Input, Select } from "@/components/Input";
import { supabase } from "@/lib/supabaseClient";

interface EnquiryPageProps {
  onHome: () => void;
}

const LOCATIONS = [
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Other UAE",
  "Oman",
  "India",
  "Qatar",
  "Saudi Arabia",
  "Other GCC",
  "International",
];

const SERVICES = [
  "Water Treatment Equipment",
  "Wastewater Treatment Equipment",
  "Water Treatment Chemicals",
  "Specialty Chemicals",
  "Dosing System",
  "Pumps & Pumping Solution",
  "Water Treatment Services",
];

export default function EnquiryPage({ onHome }: EnquiryPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [serviceRequired, setServiceRequired] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!email.trim()) e.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address";
    if (!message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    const payload = {
      full_name: fullName.trim(),
      company_name: companyName.trim() || null,
      email: email.trim(),
      phone: phone.trim() || null,
      location: location || null,
      service_required: serviceRequired || null,
      message: message.trim(),
    };

    const { error: insertError } = await supabase
      .from("enquiries")
      .insert([payload]);

    setSubmitting(false);

    if (insertError) {
      setError("Failed to submit your enquiry. Please try again.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Enquiry Sent
          </h1>
          <p className="mt-3 max-w-md text-base text-slate-600 dark:text-slate-300">
            Thank you for your enquiry. Our team will review your requirement
            and respond within one business day.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mt-8"
            onClick={onHome}
            leftIcon={<ArrowLeft size={18} />}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-600/20">
            <Send size={26} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Send Your Enquiry
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500 dark:text-slate-400">
            Complete the form below and our team will review your requirement
            and respond within one business day.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Full Name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              icon={<User size={16} />}
              error={errors.fullName}
            />
            <Input
              label="Company Name"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your company name"
              icon={<Building2 size={16} />}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              icon={<Mail size={16} />}
              error={errors.email}
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966..."
              icon={<Phone size={16} />}
            />
            <Select
              label="Location / Market"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Select Your Location"
              options={LOCATIONS}
            />
            <Select
              label="Service Required"
              name="serviceRequired"
              value={serviceRequired}
              onChange={(e) => setServiceRequired(e.target.value)}
              placeholder="Select Service Required"
              options={SERVICES}
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-2 dark:bg-slate-900 dark:text-white ${
                errors.message
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/30 dark:border-slate-600"
              }`}
              placeholder="Describe your requirement or enquiry..."
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">{errors.message}</p>
            )}
          </div>

          <div className="mt-7 flex items-center justify-between">
            <Button variant="ghost" onClick={onHome} leftIcon={<ArrowLeft size={16} />}>
              Home
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              loading={submitting}
              rightIcon={!submitting ? <Send size={18} /> : undefined}
            >
              Send Enquiry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
