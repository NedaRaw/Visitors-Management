import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { ShieldCheck } from "lucide-react";

interface SiteHeaderProps {
  onAdminClick?: () => void;
  onHomeClick?: () => void;
}

export default function SiteHeader({ onAdminClick, onHomeClick }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button onClick={onHomeClick} className="flex items-center">
          <Logo size="md" />
        </button>
        <div className="flex items-center gap-3">
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
    </header>
  );
}
