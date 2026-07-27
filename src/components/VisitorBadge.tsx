import { forwardRef } from "react";
import { Microscope, CalendarClock, Building2, QrCode } from "lucide-react";
import { LAB_INFO } from "@/config/app.config";
import type { Visitor } from "@/types/visitor";

interface VisitorBadgeProps {
  visitor: Visitor;
  qrDataUrl: string;
}

// Printable visitor badge. Uses a fixed pixel size so it renders
// consistently in the browser print dialog and in the PDF export.
const VisitorBadge = forwardRef<HTMLDivElement, VisitorBadgeProps>(
  ({ visitor, qrDataUrl }, ref) => {
    return (
      <div
        ref={ref}
        id="visitor-badge"
        className="badge-print-area mx-auto w-[340px] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
      >
        {/* Header band */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <Microscope size={18} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{LAB_INFO.name}</div>
              <div className="text-[10px] text-blue-100">
                {LAB_INFO.tagline}
              </div>
            </div>
          </div>
        </div>

        {/* VISITOR label */}
        <div className="bg-blue-50 py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
          Visitor Pass
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <div className="mb-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Name
            </div>
            <div className="text-lg font-semibold text-slate-800">
              {visitor.firstName} {visitor.lastName}
            </div>
          </div>

          <div className="space-y-1.5 text-sm">
            <Row icon={<QrCode size={13} />} label="ID" value={visitor.visitorId} />
            <Row
              icon={<Building2 size={13} />}
              label="Dept"
              value={visitor.department}
            />
            <Row
              icon={<CalendarClock size={13} />}
              label="Date"
              value={visitor.visitDate}
            />
            <Row
              icon={<CalendarClock size={13} />}
              label="Time"
              value={visitor.arrivalTime}
            />
          </div>

          {/* QR */}
          <div className="mt-4 flex flex-col items-center">
            <img
              src={qrDataUrl}
              alt={`QR code for ${visitor.visitorId}`}
              className="h-28 w-28 rounded-lg ring-1 ring-slate-200"
            />
            <div className="mt-1 text-[10px] text-slate-400">
              Scan to verify visitor
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-2 text-center text-[9px] text-slate-400">
          This badge must be worn at all times while on laboratory premises.
        </div>
      </div>
    );
  },
);

VisitorBadge.displayName = "VisitorBadge";
export default VisitorBadge;

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{icon}</span>
      <span className="w-10 text-[11px] uppercase text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}
