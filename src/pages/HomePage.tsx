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
  Send,
  TestTube,
  Leaf,
  Waves,
  Beaker,
  BadgeCheck,
  Globe,
  Navigation as NavIcon,
} from "lucide-react";
import Button from "@/components/Button";
import { LAB_INFO } from "@/config/app.config";

interface HomePageProps {
  onRegister: () => void;
  onSurvey: () => void;
  onEnquiry: () => void;
}

export default function HomePage({ onRegister, onSurvey, onEnquiry }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,white_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-200 ring-1 ring-white/20 backdrop-blur-sm">
                <BadgeCheck size={14} />
                {LAB_INFO.accreditation}
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {LAB_INFO.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-blue-200">{LAB_INFO.tagline}</p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-100">
                A regional water and environmental laboratory offering accredited
                testing, sample collection, and quality assurance services —
                serving Najran and the surrounding region with precision and trust.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                  onClick={onEnquiry}
                  leftIcon={<Send size={18} />}
                  className="border border-white/30 text-white hover:bg-white/10"
                >
                  Send an Enquiry
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl bg-white/10 p-8 ring-1 ring-white/20 backdrop-blur-sm">
                <img
                  src="/flyer_labo-7-26.png"
                  alt="Laboratory flyer"
                  className="mx-auto max-h-[460px] w-auto rounded-2xl object-contain shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-px w-full bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />
      </section>

      {/* Stats strip */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4 dark:bg-slate-700">
          <Stat icon={<FlaskConical size={22} />} value="ISO/IEC" label="17025:2017" />
          <Stat icon={<Droplets size={22} />} value="24/7" label="Monitoring" />
          <Stat icon={<ShieldCheck size={22} />} value="Secure" label="Access" />
          <Stat icon={<Building2 size={22} />} value="Najran" label="Regional Hub" />
        </div>
      </section>

      {/* Services */}
      <section className="bg-slate-50 py-16 dark:bg-slate-900/50 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Our Services
            </p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white sm:text-4xl">
              Water & Environmental Testing Solutions
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {LAB_INFO.name} provides a comprehensive range of accredited
              laboratory services for water quality, wastewater, and environmental analysis.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              icon={<Droplets size={24} />}
              title="Water Quality Testing"
              description="Chemical, physical, and microbiological analysis of drinking, surface, and groundwater."
            />
            <ServiceCard
              icon={<TestTube size={24} />}
              title="Wastewater Testing"
              description="Comprehensive wastewater analysis to ensure compliance with environmental discharge standards."
            />
            <ServiceCard
              icon={<Beaker size={24} />}
              title="Sample Collection"
              description="Professional field sampling services following standardized protocols and chain-of-custody."
            />
            <ServiceCard
              icon={<Leaf size={24} />}
              title="Environmental Analysis"
              description="Soil, air, and environmental testing to support public health and regulatory compliance."
            />
            <ServiceCard
              icon={<FlaskConical size={24} />}
              title="Calibration & QA"
              description="Rigorous instrument calibration and quality assurance across every laboratory process."
            />
            <ServiceCard
              icon={<Users size={24} />}
              title="Customer Support"
              description="Dedicated technical support and consultation for all your testing and reporting needs."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 dark:bg-slate-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Visitor Access
            </p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white sm:text-4xl">
              How Visitor Access Works
            </h2>
            <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
              A simple, secure process from registration to check-in.
            </p>
          </div>
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
      <section className="bg-slate-50 py-16 dark:bg-slate-900/50 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Get in Touch
            </p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white sm:text-4xl">
              Contact {LAB_INFO.name}
            </h2>
            <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
              Reach out to us during business hours or send an enquiry and our team will respond within one business day.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ContactCard
              icon={<Phone size={22} />}
              title="Call Us"
              lines={[LAB_INFO.phone]}
              href={`tel:${LAB_INFO.phone}`}
            />
            <ContactCard
              icon={<Mail size={22} />}
              title="Email Us"
              lines={[LAB_INFO.email]}
              href={`mailto:${LAB_INFO.email}`}
            />
            <ContactCard
              icon={<MapPin size={22} />}
              title="Visit Us"
              lines={[LAB_INFO.addressEn]}
            />
            <ContactCard
              icon={<Clock size={22} />}
              title="Business Hours"
              lines={["Sun – Thu", "8:00 AM – 4:00 PM"]}
            />
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-blue-50 p-4 text-center text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            <Clock size={18} className="shrink-0" />
            <span>
              Visitor registration is available 24/7 online. On-site check-in is available Sunday–Thursday, 8:00 AM – 4:00 PM.
            </span>
          </div>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="bg-white py-16 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center shadow-lg sm:p-12">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
              <Send size={26} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Send Your Enquiry
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-blue-100">
              Need a specific service or solution? Complete the form and our team
              will review your requirement and respond within one business day.
            </p>
            <div className="mt-7 flex justify-center">
              <Button
                size="lg"
                variant="light"
                onClick={onEnquiry}
                rightIcon={<ArrowRight size={18} />}
              >
                Send Your Enquiry
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Survey CTA */}
      <section className="bg-slate-50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-8 text-center shadow-sm dark:border-blue-800/40 dark:from-slate-800 dark:to-slate-800 sm:p-12">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <MessageSquare size={26} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
              We Value Your Feedback
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500 dark:text-slate-400">
              Help us improve our services by taking a short customer satisfaction
              survey. Available in English and Arabic — it only takes 1–3 minutes.
            </p>
            <div className="mt-7 flex justify-center">
              <Button
                size="lg"
                variant="primary"
                onClick={onSurvey}
                rightIcon={<ArrowRight size={18} />}
              >
                Start the Survey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Register CTA */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to Register Your Visit?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Complete your visitor registration in just a few minutes and receive
            your QR badge instantly.
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
      <span className="text-xl font-bold text-slate-800 dark:text-white">{value}</span>
      <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

function ServiceCard({
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
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
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
      <div className="absolute left-1/2 top-0 flex h-6 w-6 -translate-x-1/2 -translate-y-2 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  lines,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  href?: string;
}) {
  const inner = (
    <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-800">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/30 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-white">{title}</h3>
      {lines.map((l, i) => (
        <p key={i} className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{l}</p>
      ))}
    </div>
  );
  return href ? <a href={href} className="block h-full">{inner}</a> : inner;
}
