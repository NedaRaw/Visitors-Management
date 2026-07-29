import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Search,
  AlertCircle,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  Building2,
  MapPin,
  Wrench,
  CalendarDays,
} from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import { Input, Select } from "@/components/Input";
import { supabase } from "@/lib/supabaseClient";

interface Enquiry {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  service_required: string | null;
  message: string;
  status: string;
  created_at: string;
}

const STATUSES = ["new", "reviewed", "responded", "closed"] as const;

function statusColor(status: string): string {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "reviewed":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "responded":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case "closed":
      return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  }
}

export default function EnquiryManagement() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewing, setViewing] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState<Enquiry | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setEnquiries((data as Enquiry[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        e.full_name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.company_name || "").toLowerCase().includes(q) ||
        (e.service_required || "").toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

  const stats = useMemo(() => ({
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    reviewed: enquiries.filter((e) => e.status === "reviewed").length,
    responded: enquiries.filter((e) => e.status === "responded").length,
  }), [enquiries]);

  const handleStatusChange = async (enquiry: Enquiry, status: string) => {
    setActionLoading(true);
    const { error: err } = await supabase
      .from("enquiries")
      .update({ status })
      .eq("id", enquiry.id);
    if (err) {
      setError(err.message);
    } else {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiry.id ? { ...e, status } : e)),
      );
      if (viewing?.id === enquiry.id) {
        setViewing({ ...enquiry, status });
      }
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setActionLoading(true);
    const { error: err } = await supabase
      .from("enquiries")
      .delete()
      .eq("id", deleting.id);
    if (err) {
      setError(err.message);
    } else {
      setEnquiries((prev) => prev.filter((e) => e.id !== deleting.id));
      setDeleting(null);
    }
    setActionLoading(false);
  };

  return (
    <div>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            <Mail size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">{stats.total}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Enquiries</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
            <CalendarDays size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">{stats.new}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">New</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
            <Eye size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">{stats.reviewed}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Reviewed</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300">
            <Mail size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">{stats.responded}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Responded</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              name="search"
              placeholder="Search name, email, company, message..."
              icon={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Select
              name="statusFilter"
              placeholder="All statuses"
              options={STATUSES as unknown as string[]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <Button variant="outline" size="md" onClick={load} leftIcon={<RefreshCw size={15} />}>
            Refresh
          </Button>
        </div>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-medium">{filtered.length}</span> of {enquiries.length} enquiries
        </p>
      </Card>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400">
            <RefreshCw size={20} className="mr-2 animate-spin" /> Loading enquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <Mail size={32} className="mb-2" />
            <p>No enquiries yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filtered.map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 dark:text-white">{e.full_name}</div>
                      <div className="text-xs text-slate-400">{e.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {e.company_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {e.service_required || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {e.location || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        disabled={actionLoading}
                        onChange={(ev) => handleStatusChange(e, ev.target.value)}
                        className={`h-8 rounded-lg border-0 px-2 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/30 ${statusColor(e.status)}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View details"
                          onClick={() => setViewing(e)}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setDeleting(e)}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/30"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail modal */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Enquiry Details"
        size="lg"
        footer={<Button variant="primary" onClick={() => setViewing(null)} leftIcon={<X size={16} />}>Close</Button>}
      >
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailField icon={<Mail size={14} />} label="Date" value={new Date(viewing.created_at).toLocaleString()} />
              <DetailField icon={<Building2 size={14} />} label="Company" value={viewing.company_name || "—"} />
              <DetailField icon={<Mail size={14} />} label="Email" value={viewing.email} />
              <DetailField icon={<Phone size={14} />} label="Phone" value={viewing.phone || "—"} />
              <DetailField icon={<MapPin size={14} />} label="Location" value={viewing.location || "—"} />
              <DetailField icon={<Wrench size={14} />} label="Service Required" value={viewing.service_required || "—"} />
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Message</div>
              <div className="mt-1 rounded-xl bg-slate-50 p-4 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200">
                {viewing.message}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status:</span>
              <select
                value={viewing.status}
                disabled={actionLoading}
                onChange={(ev) => handleStatusChange(viewing, ev.target.value)}
                className={`h-9 rounded-lg border-0 px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30 ${statusColor(viewing.status)}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Enquiry"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={actionLoading}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete the enquiry from{" "}
          <span className="font-medium">{deleting?.full_name}</span>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function DetailField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-slate-700 dark:text-slate-200">{value}</div>
    </div>
  );
}
