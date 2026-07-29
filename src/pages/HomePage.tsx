import {
  Microscope,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Clock,
  FlaskConical,
  Droplets,
  FileCheck,
  Users,
  QrCode,
  Building2,
  Star,
  MessageSquare,
} from "lucide-react";
import Button from "@/components/Button";
import { LAB_INFO } from "@/config/app.config";

interface HomePageProps {
  onRegister: () => void;
  onSurvey: () => void;
}

export default function HomePage({ onRegister, onSurvey }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,white_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
              <Microscope size={32} className="text-white" />
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-200">
              {LAB_INFO.tagline}
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {LAB_INFO.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-blue-100">
              A modern digital visitor management system for secure,
              efficient, and traceable access to our laboratory facilities.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="light"
                onClick={onRegister}
                rightIcon={<ArrowRight size={18} />}
              >
                Register as a Visitor
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={onSurvey}
                leftIcon={<Star size={18} />}
                className="border border-white/30 text-white hover:bg-white/10"
              >
                Take Our Survey
              </Button>
            </div>
          </div>
        </div>
        <div className="relative h-px w-full bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />
      </section>

      {/* Stats strip */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4 dark:bg-slate-700">
          <Stat icon={<FlaskConical size={22} />} value="9" label="Departments" />
          <Stat icon={<FileCheck size={22} />} value="ISO" label="Certified" />
          <Stat icon={<Droplets size={22} />} value="24/7" label="Monitoring" />
          <Stat icon={<ShieldCheck size={22} />} value="Secure" label="Access" />
        </div>
      </section>

      {/* About */}
      <section className="bg-slate-50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              About the Laboratory
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {LAB_INFO.name} is a regional facility operated by the National
              Water Company, dedicated to water quality analysis,
              environmental testing, and scientific research. Our accredited
              departments serve Najran and the surrounding region with
              precision testing, calibration, and quality assurance services.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Microscope size={24} />}
              title="Accredited Testing"
              description="Certified microbiology, chemistry, and water quality analysis delivered to international standards."
            />
            <FeatureCard
              icon={<Droplets size={24} />}
              title="Water Quality"
              description="Continuous monitoring of drinking and environmental water sources to ensure public safety."
            />
            <FeatureCard
              icon={<FileCheck size={24} />}
              title="Quality Control"
              description="Rigorous calibration and quality assurance protocols across every laboratory process."
            />
            <FeatureCard
              icon={<ShieldCheck size={24} />}
              title="Secure Access"
              description="Every visitor is registered, QR-coded, and approved by an administrator before entry."
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Expert Team"
              description="A multidisciplinary team of scientists, technicians, and quality specialists at your service."
            />
            <FeatureCard
              icon={<Building2 size={24} />}
              title="Regional Hub"
              description="Serving Najran and surrounding communities with reliable, timely laboratory services."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-800 dark:text-white">
            How Visitor Access Works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-slate-500 dark:text-slate-400">
            A simple, secure process from registration to check-in.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step
              number="1"
              icon={<Users size={24} />}
              title="Register Online"
              description="Fill out the visitor registration form with your details and the purpose of your visit."
            />
            <Step
              number="2"
              icon={<ShieldCheck size={24} />}
              title="Admin Approval"
              description="A laboratory administrator reviews and approves your visit request before your arrival."
            />
            <Step
              number="3"
              icon={<QrCode size={24} />}
              title="Check In with QR"
              description="Receive a unique QR badge, scan it at the entrance, and proceed to your approved department."
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-slate-50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-10">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Contact & Location
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Visit us during business hours or reach out for any inquiry.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <ContactItem
                icon={<MapPin size={20} />}
                label="Address"
                value={LAB_INFO.address}
              />
              <ContactItem
                icon={<Phone size={20} />}
                label="Phone"
                value={LAB_INFO.phone}
              />
              <ContactItem
                icon={<Mail size={20} />}
                label="Email"
                value={LAB_INFO.email}
              />
            </div>
            <div className="mt-8 flex items-center gap-2 rounded-xl bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
              <Clock size={18} className="shrink-0" />
              <span>
                Visitor registration is available 24/7 online. On-site
                check-in is available Sunday–Thursday, 8:00 AM – 4:00 PM.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Survey CTA */}
      <section className="bg-white py-16 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center shadow-lg sm:p-12">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
              <MessageSquare size={26} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              We Value Your Feedback
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-blue-100">
              Help us improve our services by taking a short customer
              satisfaction survey. It only takes 1–3 minutes.
            </p>
            <div className="mt-7 flex justify-center">
              <Button
                size="lg"
                variant="light"
                onClick={onSurvey}
                rightIcon={<ArrowRight size={18} />}
              >
                Start the Survey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to Register Your Visit?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Complete your visitor registration in just a few minutes and
            receive your QR badge instantly.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              variant="light"
              onClick={onRegister}
              rightIcon={<ArrowRight size={18} />}
            >
              Start Registration
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white px-4 py-6 dark:bg-slate-900">
      <span className="text-blue-600 dark:text-blue-400">{icon}</span>
      <span className="text-xl font-bold text-slate-800 dark:text-white">
        {value}
      </span>
      <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-800">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/30 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-900/30 dark:ring-blue-800/40 dark:text-blue-400">
        {icon}
      </div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}
