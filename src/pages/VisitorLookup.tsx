import { useEffect, useState } from "react";
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Printer,
  Download,
  Home,
} from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import VisitorBadge from "@/components/VisitorBadge";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { generateQrDataUrl } from "@/lib/qr";
import { downloadBadgePdf } from "@/lib/pdf";
import type { Visitor } from "@/types/visitor";

interface VisitorLookupProps {
  visitorId: string;
  onHome: () => void;
}

export default function VisitorLookup({ visitorId, onHome }: VisitorLookupProps) {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [qr, setQr] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get(visitorId);
      if (!active) return;
      if (res.success && res.data) {
        setVisitor(res.data);
        try {
          const qrUrl = await generateQrDataUrl(res.data.visitorId);
          if (active) setQr(qrUrl);
        } catch {
          /* qr optional */
        }
      } else {
        setError(res.error || "Visitor not found.");
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [visitorId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <RefreshCw size={20} className="mr-2 animate-spin" /> Looking up
        visitor...
      </div>
    );
  }

  if (error || !visitor) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-900/30">
          <AlertCircle size={28} />
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">
          Visitor Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {error || `No visitor with ID ${visitorId} was found.`}
        </p>
        <Button onClick={onHome} className="mt-6" leftIcon={<Home size={16} />}>
          Back to Registration
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 print:py-0">
      <div className="no-print mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-900/30 dark:ring-blue-800/40">
          <QrCode size={26} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Visitor Verified
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Showing details for{" "}
          <span className="font-mono font-medium">{visitor.visitorId}</span>
        </p>
        <div className="mt-3 flex justify-center">
          <StatusBadge status={visitor.status} />
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="no-print p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
            Visitor Information
          </h2>
          <dl className="space-y-3 text-sm">
            <Info label="Name" value={`${visitor.firstName} ${visitor.lastName}`} />
            <Info label="Visitor ID" value={visitor.visitorId} mono />
            <Info label="Department" value={visitor.department} />
            <Info label="Purpose" value={visitor.purpose} />
            <Info label="Visit Date" value={visitor.visitDate} />
            <Info label="Arrival Time" value={visitor.arrivalTime} />
            <Info label="Employee" value={visitor.employee} />
            <Info label="Email" value={visitor.email} />
            <Info label="Phone" value={visitor.phone} />
            <Info label="Company" value={visitor.company || "—"} />
          </dl>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => window.print()} leftIcon={<Printer size={16} />} fullWidth>
              Print Badge
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadBadgePdf(visitor, qr)}
              leftIcon={<Download size={16} />}
              fullWidth
              disabled={!qr}
            >
              Download PDF
            </Button>
          </div>
        </Card>

        <div className="flex justify-center py-2 print:py-0">
          {qr && <VisitorBadge visitor={visitor} qrDataUrl={qr} />}
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2 dark:border-slate-700/60">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd
        className={`text-right font-medium text-slate-800 dark:text-slate-100 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
