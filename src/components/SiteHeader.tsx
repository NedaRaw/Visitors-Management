import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { ShieldCheck, Phone, Mail } from "lucide-react";
import { LAB_INFO } from "@/config/app.config";

interface SiteHeaderProps {
  onAdminClick?: () => void;
  onHomeClick?: () => void;
  onEnquiryClick?: () => void;
  onSurveyClick?: () => void;
}

export default function SiteHeader({
  onAdminClick,
  onHomeClick,
  onEnquiryClick,
  onSurveyClick,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40">
      {/* Top info bar */}
      <div className="hidden border-b border-blue-700 bg-blue-800 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6">
          <div className="flex items-center gap-6 text-xs text-blue-200">
            <a href={`tel:${LAB_INFO.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={12} />
              {LAB_INFO.phone}
            </a>
            <a href={`mailto:${LAB_INFO.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={12} />
              {LAB_INFO.email}
            </a>
          </div>
          <span className="text-xs text-blue-300">{LAB_INFO.accreditation}</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="border-b border-slate-200/70 bg-white/95 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={onHomeClick} className="flex items-center">
            <Logo size="md" />
          </button>
          <div className="flex items-center gap-2">
            {onSurveyClick && (
              <button
                onClick={onSurveyClick}
                className="hidden rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:inline-flex"
              >
                Survey
              </button>
            )}
            {onEnquiryClick && (
              <button
                onClick={onEnquiryClick}
                className="hidden rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:inline-flex"
              >
                Send Enquiry
              </button>
            )}
            <ThemeToggle />
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ShieldCheck size={16} />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
