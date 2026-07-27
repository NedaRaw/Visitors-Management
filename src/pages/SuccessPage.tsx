import { useRef } from "react";
import {
  CheckCircle2,
  Printer,
  Download,
  UserPlus,
  CalendarDays,
  Clock,
  Building2,
} from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import VisitorBadge from "@/components/VisitorBadge";
import { downloadBadgePdf } from "@/lib/pdf";
import type { Visitor } from "@/types/visitor";

interface SuccessPageProps {
  visitor: Visitor;
  qrDataUrl: string;
  onRegisterAnother: () => void;
}

export default function SuccessPage({
  visitor,
  qrDataUrl,
  onRegisterAnother,
}: SuccessPageProps) {
  const badgeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    await downloadBadgePdf(visitor, qrDataUrl);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 print:py-0">
      {/* Success banner — hidden when printing */}
      <div className="no-print mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 animate-[popIn_0.4s_ease] items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50 dark:bg-emerald-900/30 dark:ring-emerald-900/20">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
          Registration Completed Successfully
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Your visitor pass has been generated. Please print or download it and
          bring it with you on the day of your visit.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Visitor details card */}
        <Card className="no-print p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
            Visitor Details
          </h2>
          <dl className="space-y-3 text-sm">
            <Detail
              icon={<UserPlus size={15} />}
              label="Name"
              value={`${visitor.firstName} ${visitor.lastName}`}
            />
            <Detail
              icon={<CheckCircle2 size={15} />}
              label="Visitor ID"
              value={visitor.visitorId}
              mono
            />
            <Detail
              icon={<Building2 size={15} />}
              label="Department"
              value={visitor.department}
            />
            <Detail
              icon={<CalendarDays size={15} />}
              label="Visit Date"
              value={visitor.visitDate}
            />
            <Detail
              icon={<Clock size={15} />}
              label="Arrival Time"
              value={visitor.arrivalTime}
            />
            <Detail
              icon={<UserPlus size={15} />}
              label="Employee to Visit"
              value={visitor.employee}
            />
            <Detail
              icon={<CheckCircle2 size={15} />}
              label="Purpose"
              value={visitor.purpose}
            />
          </dl>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handlePrint}
              leftIcon={<Printer size={18} />}
              fullWidth
            >
              Print Badge
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPdf}
              leftIcon={<Download size={18} />}
              fullWidth
            >
              Download Badge PDF
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={onRegisterAnother}
            fullWidth
            className="mt-3"
          >
            Register Another Visitor
          </Button>
        </Card>

        {/* Badge */}
        <div className="flex justify-center py-2 print:py-0">
          <VisitorBadge ref={badgeRef} visitor={visitor} qrDataUrl={qrDataUrl} />
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-slate-400">{icon}</span>
      <span className="w-28 text-slate-500 dark:text-slate-400">{label}</span>
      <span
        className={`font-medium text-slate-800 dark:text-slate-100 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
