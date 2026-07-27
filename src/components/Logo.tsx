import { LAB_INFO } from "@/config/app.config";
import { Microscope } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

// Laboratory logo mark — a water-blue rounded badge with a
// microscope icon. Used in the header and on the visitor badge.
export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const dims = {
    sm: { box: "h-8 w-8", icon: 16, text: "text-sm", sub: "text-[10px]" },
    md: { box: "h-11 w-11", icon: 22, text: "text-base", sub: "text-xs" },
    lg: { box: "h-14 w-14", icon: 28, text: "text-xl", sub: "text-sm" },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${dims.box} flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-600/20 ring-1 ring-blue-700/20`}
      >
        <Microscope size={dims.icon} strokeWidth={2.2} />
      </div>
      {showText && (
        <div className="leading-tight">
          <div className={`font-semibold text-slate-800 dark:text-white ${dims.text}`}>
            {LAB_INFO.name}
          </div>
          <div className={`text-slate-500 dark:text-slate-400 ${dims.sub}`}>
            Visitor Management
          </div>
        </div>
      )}
    </div>
  );
}
