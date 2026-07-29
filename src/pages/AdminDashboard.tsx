import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  CalendarDays,
  Building2,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Pencil,
  Trash2,
  Printer,
  LogOut,
  Users,
  AlertCircle,
  QrCode,
  CreditCard,
  CheckSquare,
  Square,
  ShieldCheck,
  Check,
  X,
  Star,
  Mail,
} from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import VisitorBadge from "@/components/VisitorBadge";
import { Input, Select } from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { exportVisitorsCsv, exportVisitorsExcel } from "@/lib/exporters";
import { generateQrDataUrl } from "@/lib/qr";
import { downloadBadgePdf, downloadVisitorsPdf } from "@/lib/pdf";
import {
  DEPARTMENTS,
  VISITOR_STATUSES,
  type VisitorStatus,
} from "@/config/app.config";
import type { Visitor } from "@/types/visitor";
import UserManagement from "@/pages/UserManagement";
import SurveyManagement from "@/pages/SurveyManagement";
import EnquiryManagement from "@/pages/EnquiryManagement";

type Tab = "visitors" | "users" | "surveys" | "enquiries";

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [tab, setTab] = useState<Tab>("visitors");
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const [editing, setEditing] = useState<Visitor | null>(null);
  const [deleting, setDeleting] = useState<Visitor | null>(null);
  const [badgeVisitor, setBadgeVisitor] = useState<Visitor | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [qrForBadge, setQrForBadge] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadVisitors = async () => {
    setLoading(true);
    setError(null);
    const res = await api.list();
    if (res.success && res.data) {
      setVisitors(res.data);
    } else {
      setError(res.error || "Could not load visitors.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const filtered = useMemo(() => {
    return visitors.filter((v) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        `${v.firstName} ${v.lastName}`.toLowerCase().includes(q) ||
        v.visitorId.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q);
      const matchesDate = !dateFilter || v.visitDate === dateFilter;
      const matchesDept = !deptFilter || v.department === deptFilter;
      return matchesSearch && matchesDate && matchesDept;
    });
  }, [visitors, search, dateFilter, deptFilter]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      total: visitors.length,
      today: visitors.filter((v) => v.visitDate === today).length,
      pending: visitors.filter((v) => v.status === "Pending").length,
      approved: visitors.filter((v) => v.status === "Approved").length,
      checkedIn: visitors.filter((v) => v.status === "Checked In").length,
    };
  }, [visitors]);

  const handleStatusChange = async (visitor: Visitor, status: VisitorStatus) => {
    setActionLoading(true);
    const res = await api.setStatus(visitor.visitorId, status);
    if (res.success && res.data) {
      setVisitors((prev) =>
        prev.map((v) =>
          v.visitorId === visitor.visitorId ? { ...v, status } : v,
        ),
      );
    } else {
      setError(res.error || "Could not update status.");
    }
    setActionLoading(false);
  };

  const handleSaveEdit = async (updated: Visitor) => {
    setActionLoading(true);
    const res = await api.update(updated);
    if (res.success) {
      setVisitors((prev) =>
        prev.map((v) =>
          v.visitorId === updated.visitorId ? updated : v,
        ),
      );
      setEditing(null);
    } else {
      setError(res.error || "Could not save changes.");
    }
    setActionLoading(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    setActionLoading(true);
    const res = await api.remove(deleting.visitorId);
    if (res.success) {
      setVisitors((prev) =>
        prev.filter((v) => v.visitorId !== deleting.visitorId),
      );
      setDeleting(null);
    } else {
      setError(res.error || "Could not delete visitor.");
    }
    setActionLoading(false);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map((v) => v.visitorId)),
    );
  };

  const selectedVisitors = useMemo(
    () => filtered.filter((v) => selected.has(v.visitorId)),
    [filtered, selected],
  );

  const openBadge = async (v: Visitor) => {
    setBadgeVisitor(v);
    setQrForBadge("");
    try {
      const qr = await generateQrDataUrl(v.visitorId);
      setQrForBadge(qr);
    } catch {
      setQrForBadge("");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {tab === "visitors" && "Visitor Dashboard"}
            {tab === "users" && "User Management"}
            {tab === "surveys" && "Survey Responses"}
            {tab === "enquiries" && "Enquiries"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tab === "visitors" && "Manage and track all laboratory visitors."}
            {tab === "users" && "Create accounts and assign admin or user access."}
            {tab === "surveys" && "Review customer satisfaction survey responses."}
            {tab === "enquiries" && "Review and manage customer service enquiries."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tab === "visitors" && (
            <Button
n              variant="outline"
              size="sm"
              onClick={loadVisitors}
              leftIcon={<RefreshCw size={15} />}
            >
              Refresh
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            leftIcon={<LogOut size={15} />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs (admin only) */}
      {user?.role === "admin" && (
        <div className="mb-6 flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-700">
          <TabButton active={tab === "visitors"} onClick={() => setTab("visitors")} icon={<Users size={16} />}>
            Visitors
          </TabButton>
          <TabButton active={tab === "surveys"} onClick={() => setTab("surveys")} icon={<Star size={16} />}>
            Surveys
          </TabButton>
          <TabButton active={tab === "enquiries"} onClick={() => setTab("enquiries")} icon={<Mail size={16} />}>
            Enquiries
          </TabButton>
          <TabButton active={tab === "users"} onClick={() => setTab("users")} icon={<ShieldCheck size={16} />}>
            User Accounts
          </TabButton>
        </div>
      )}

      {/* User management tab */}
      {tab === "users" && user?.role === "admin" && <UserManagement />}

      {/* Surveys tab */}
      {tab === "surveys" && user?.role === "admin" && <SurveyManagement />}

      {/* Enquiries tab */}
      {tab === "enquiries" && user?.role === "admin" && <EnquiryManagement />}

      {/* Visitors tab */}
      {tab === "visitors" && (
        <>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <StatCard label="Total Visitors" value={stats.total} icon={<Users size={18} />} tone="blue" />
        <StatCard label="Today" value={stats.today} icon={<CalendarDays size={18} />} tone="emerald" />
        <StatCard label="Pending" value={stats.pending} icon={<Filter size={18} />} tone="amber" />
        <StatCard label="Approved" value={stats.approved} icon={<Check size={18} />} tone="sky" />
        <StatCard label="Checked In" value={stats.checkedIn} icon={<Users size={18} />} tone="emerald" />
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Input
              name="search"
              placeholder="Search name, ID, email..."
              icon={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Input
            name="dateFilter"
            type="date"
            icon={<CalendarDays size={16} />}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <Select
            name="deptFilter"
            placeholder="All departments"
            options={DEPARTMENTS}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => {
                setSearch("");
                setDateFilter("");
                setDeptFilter("");
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium">{filtered.length}</span> of{" "}
            {visitors.length} visitors
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadVisitorsPdf(selectedVisitors.length > 0 ? selectedVisitors : filtered)}
              leftIcon={<FileText size={15} />}
              disabled={filtered.length === 0}
            >
              {selected.size > 0 ? `Export PDF (${selected.size})` : "Export PDF"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportVisitorsExcel(selectedVisitors.length > 0 ? selectedVisitors : filtered)}
              leftIcon={<FileSpreadsheet size={15} />}
              disabled={filtered.length === 0}
            >
              {selected.size > 0 ? `Export Excel (${selected.size})` : "Export Excel"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportVisitorsCsv(selectedVisitors.length > 0 ? selectedVisitors : filtered)}
              leftIcon={<FileText size={15} />}
              disabled={filtered.length === 0}
            >
              {selected.size > 0 ? `Export CSV (${selected.size})` : "Export CSV"}
            </Button>
          </div>
        </div>
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
            <RefreshCw size={20} className="mr-2 animate-spin" /> Loading
            visitors...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <Users size={32} className="mb-2" />
            <p>No visitors found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <Th className="w-10">
                    <button
                      title={selected.size === filtered.length && filtered.length > 0 ? "Deselect all" : "Select all"}
                      onClick={toggleSelectAll}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>
                  </Th>
                  <Th>Visitor ID</Th>
                  <Th>Name</Th>
                  <Th>Department</Th>
                  <Th>Purpose</Th>
                  <Th>Visit Date</Th>
                  <Th>Arrival</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filtered.map((v) => (
                  <tr
                    key={v.visitorId}
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${selected.has(v.visitorId) ? "bg-blue-50/60 dark:bg-blue-900/15" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <button
                        title={selected.has(v.visitorId) ? "Deselect" : "Select"}
                        onClick={() => toggleSelect(v.visitorId)}
                        className={selected.has(v.visitorId) ? "text-blue-600" : "text-slate-400 hover:text-blue-600 transition-colors"}
                      >
                        {selected.has(v.visitorId) ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {v.visitorId}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">
                      {v.firstName} {v.lastName}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {v.department}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {v.purpose}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {v.visitDate}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {v.arrivalTime}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusSelect
                          status={v.status}
                          onChange={(s) => handleStatusChange(v, s)}
                          disabled={actionLoading}
                        />
                        {v.status === "Pending" && (
                          <>
                            <button
                              title="Approve visit"
                              onClick={() => handleStatusChange(v, "Approved")}
                              disabled={actionLoading}
                              className="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-50"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              title="Reject visit"
                              onClick={() => handleStatusChange(v, "Rejected")}
                              disabled={actionLoading}
                              className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconButton
                          title="View / print badge"
                          onClick={() => openBadge(v)}
                        >
                          <CreditCard size={16} />
                        </IconButton>
                        <IconButton
                          title="Edit"
                          onClick={() => setEditing(v)}
                        >
                          <Pencil size={16} />
                        </IconButton>
                        <IconButton
                          title="Delete"
                          danger
                          onClick={() => setDeleting(v)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit modal */}
      {editing && (
        <EditVisitorModal
          visitor={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
          saving={actionLoading}
        />
      )}

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Visitor"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={actionLoading}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to permanently delete{" "}
          <span className="font-medium">
            {deleting?.firstName} {deleting?.lastName}
          </span>{" "}
          ({deleting?.visitorId})? This cannot be undone.
        </p>
      </Modal>

      {/* Badge modal */}
      <Modal
        open={!!badgeVisitor}
        onClose={() => setBadgeVisitor(null)}
        title="Visitor Badge"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setBadgeVisitor(null)}>
              Close
            </Button>
            <Button
              leftIcon={<Printer size={16} />}
              onClick={() => window.print()}
              disabled={!qrForBadge}
            >
              Print
            </Button>
            <Button
              variant="outline"
              leftIcon={<FileText size={16} />}
              onClick={() =>
                badgeVisitor && qrForBadge && downloadBadgePdf(badgeVisitor, qrForBadge)
              }
              disabled={!qrForBadge}
            >
              Download PDF
            </Button>
          </>
        }
      >
        {badgeVisitor && qrForBadge ? (
          <div className="flex justify-center py-2">
            <VisitorBadge visitor={badgeVisitor} qrDataUrl={qrForBadge} />
          </div>
        ) : (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <QrCode size={20} className="mr-2 animate-pulse" /> Generating
            badge...
          </div>
        )}
      </Modal>
        </>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-blue-600 text-blue-600 dark:text-blue-400"
          : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function IconButton({
  children,
  title,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 ${
        danger ? "hover:text-red-600" : "hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

function StatusSelect({
  status,
  onChange,
  disabled,
}: {
  status: VisitorStatus;
  onChange: (s: VisitorStatus) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as VisitorStatus)}
      className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
    >
      {VISITOR_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "blue" | "emerald" | "amber" | "sky";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300",
  }[tone];
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones}`}>
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-slate-800 dark:text-white">
          {value}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      </div>
    </Card>
  );
}

// ---------- Edit modal ----------
function EditVisitorModal({
  visitor,
  onClose,
  onSave,
  saving,
}: {
  visitor: Visitor;
  onClose: () => void;
  onSave: (v: Visitor) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Visitor>(visitor);

  const set =
    (field: keyof Visitor) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit Visitor"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(form)} loading={saving}>
            Save Changes
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="firstName" label="First Name" value={form.firstName} onChange={set("firstName")} />
        <Input name="lastName" label="Last Name" value={form.lastName} onChange={set("lastName")} />
        <Input name="nationalId" label="National ID" value={form.nationalId} onChange={set("nationalId")} />
        <Input name="phone" label="Phone" value={form.phone} onChange={set("phone")} />
        <Input name="email" label="Email" value={form.email} onChange={set("email")} />
        <Input name="company" label="Company" value={form.company} onChange={set("company")} />
        <Select name="department" label="Department" options={DEPARTMENTS} value={form.department} onChange={set("department")} />
        <Input name="employee" label="Employee to Visit" value={form.employee} onChange={set("employee")} />
        <Select
          name="purpose"
          label="Purpose"
          options={VISITOR_STATUSES.length ? Array.from(new Set([form.purpose, ...["Business Meeting", "Equipment Service / Maintenance", "Sample Delivery", "Audit / Inspection", "Training", "Job Interview", "Vendor Presentation", "Research Collaboration", "Other"]])) : [form.purpose]}
          value={form.purpose}
          onChange={set("purpose")}
        />
        <Input name="visitDate" type="date" label="Visit Date" value={form.visitDate} onChange={set("visitDate")} />
        <Input name="arrivalTime" type="time" label="Arrival Time" value={form.arrivalTime} onChange={set("arrivalTime")} />
        <Select
          name="status"
          label="Status"
          options={VISITOR_STATUSES}
          value={form.status}
          onChange={set("status")}
        />
      </div>
    </Modal>
  );
}
