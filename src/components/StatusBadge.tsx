import type { VisitorStatus } from "@/config/app.config";

const STYLES: Record<VisitorStatus, string> = {
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 ring-amber-600/20",
  "Checked In":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-emerald-600/20",
  "Checked Out":
    "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 ring-slate-500/20",
  Expired:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 ring-red-600/20",
};

export default function StatusBadge({ status }: { status: VisitorStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
