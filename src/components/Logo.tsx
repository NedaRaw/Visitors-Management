import { LAB_INFO } from "@/config/app.config";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const dims = {
    sm: { img: "h-9 w-9", text: "text-sm", sub: "text-[10px]" },
    md: { img: "h-12 w-12", text: "text-base", sub: "text-xs" },
    lg: { img: "h-16 w-16", text: "text-xl", sub: "text-sm" },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logo-lab.png"
        alt={LAB_INFO.name}
        className={`${dims.img} shrink-0 object-contain`}
      />
      {showText && (
        <div className="leading-tight">
          <div className={`font-bold text-slate-800 dark:text-white ${dims.text}`}>
            {LAB_INFO.name}
          </div>
          <div className={`text-slate-500 dark:text-slate-400 ${dims.sub}`}>
            {LAB_INFO.tagline}
          </div>
        </div>
      )}
    </div>
  );
}
