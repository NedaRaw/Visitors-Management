import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Search,
  AlertCircle,
  Star,
  Eye,
  Trash2,
  X,
  CalendarDays,
  Globe,
} from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import { Input } from "@/components/Input";
import { supabase } from "@/lib/supabaseClient";

interface SurveyResponse {
  id: string;
  language: string | null;
  service_used: string | null;
  satisfaction: number | null;
  rating_staff_professionalism: number | null;
  rating_speed_of_service: number | null;
  rating_ease_of_submitting_samples: number | null;
  rating_clarity_of_reports: number | null;
  rating_communication: number | null;
  rating_cleanliness: number | null;
  rating_overall_experience: number | null;
  results_on_time: string | null;
  reports_easy_to_understand: string | null;
  nps_score: number | null;
  liked_most: string | null;
  improvements: string | null;
  wants_contact: boolean;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  additional_comments: string | null;
  referral_source: string | null;
  created_at: string;
}

const RATING_FIELDS: { key: keyof SurveyResponse; label: string }[] = [
  { key: "rating_staff_professionalism", label: "Staff Professionalism" },
  { key: "rating_speed_of_service", label: "Speed of Service" },
  { key: "rating_ease_of_submitting_samples", label: "Ease of Submitting Samples" },
  { key: "rating_clarity_of_reports", label: "Clarity of Reports" },
  { key: "rating_communication", label: "Communication" },
  { key: "rating_cleanliness", label: "Laboratory Cleanliness" },
  { key: "rating_overall_experience", label: "Overall Experience" },
];

function npsCategory(score: number | null): string {
  if (score === null) return "—";
  if (score <= 6) return "Detractor";
  if (score <= 8) return "Passive";
  return "Promoter";
}

function npsColor(score: number | null): string {
  if (score === null) return "text-slate-400";
  if (score <= 6) return "text-red-600 dark:text-red-400";
  if (score <= 8) return "text-amber-600 dark:text-amber-400";
  return "text-green-600 dark:text-green-400";
}

export default function SurveyManagement() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<SurveyResponse | null>(null);
  const [deleting, setDeleting] = useState<SurveyResponse | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setResponses((data as SurveyResponse[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return responses;
    return responses.filter(
      (r) =>
        (r.contact_name || "").toLowerCase().includes(q) ||
        (r.contact_email || "").toLowerCase().includes(q) ||
        (r.service_used || "").toLowerCase().includes(q) ||
        (r.liked_most || "").toLowerCase().includes(q) ||
        (r.improvements || "").toLowerCase().includes(q),
    );
  }, [responses, search]);

  const avgNps = useMemo(() => {
    const scored = responses.filter((r) => r.nps_score !== null);
    if (scored.length === 0) return null;
    const sum = scored.reduce((acc, r) => acc + (r.nps_score || 0), 0);
    return (sum / scored.length).toFixed(1);
  }, [responses]);

  const avgSatisfaction = useMemo(() => {
    const rated = responses.filter((r) => r.satisfaction !== null);
    if (rated.length === 0) return null;
    const sum = rated.reduce((acc, r) => acc + (r.satisfaction || 0), 0);
    return (sum / rated.length).toFixed(1);
  }, [responses]);

  const handleDelete = async () => {
    if (!deleting) return;
    setActionLoading(true);
    const { error: err } = await supabase
      .from("survey_responses")
      .delete()
      .eq("id", deleting.id);
    if (err) {
      setError(err.message);
    } else {
      setResponses((prev) => prev.filter((r) => r.id !== deleting.id));
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
            <Star size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">{responses.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Responses</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
            <Star size={18} className="fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">{avgSatisfaction ?? "—"}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Avg Satisfaction</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300">
            <Globe size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">{avgNps ?? "—"}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Avg NPS Score</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
            <CalendarDays size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">
              {responses.filter((r) => {
                const d = new Date(r.created_at);
                const today = new Date();
                return d.toDateString() === today.toDateString();
              }).length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Today</div>
          </div>
        </Card>
      </div>

      {/* Search + refresh */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              name="search"
              placeholder="Search by name, email, service, comments..."
              icon={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="md" onClick={load} leftIcon={<RefreshCw size={15} />}>
            Refresh
          </Button>
        </div>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-medium">{filtered.length}</span> of {responses.length} responses
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
            <RefreshCw size={20} className="mr-2 animate-spin" /> Loading surveys...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <Star size={32} className="mb-2" />
            <p>No survey responses yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Satisfaction</th>
                  <th className="px-4 py-3 font-semibold">NPS</th>
                  <th className="px-4 py-3 font-semibold">Lang</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filtered.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {r.service_used || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.satisfaction ? (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{r.satisfaction}</span>
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                        </div>
                      ) : "—"}
                    </td>
                    <td className={`px-4 py-3 font-medium ${npsColor(r.nps_score)}`}>
                      {r.nps_score ?? "—"}
                      <span className="ml-1 text-xs text-slate-400">{npsCategory(r.nps_score)}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase dark:bg-slate-700">
                        {r.language || "en"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {r.wants_contact ? (
                        <div>
                          <div className="font-medium text-slate-700 dark:text-slate-200">{r.contact_name || "—"}</div>
                          <div className="text-xs text-slate-400">{r.contact_email || r.contact_phone || ""}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View details"
                          onClick={() => setViewing(r)}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setDeleting(r)}
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
        title="Survey Response Details"
        size="lg"
        footer={<Button variant="primary" onClick={() => setViewing(null)} leftIcon={<X size={16} />}>Close</Button>}
      >
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailField label="Date" value={new Date(viewing.created_at).toLocaleString()} />
              <DetailField label="Language" value={viewing.language || "—"} />
              <DetailField label="Service Used" value={viewing.service_used || "—"} />
              <DetailField label="Referral Source" value={viewing.referral_source || "—"} />
              <DetailField label="Satisfaction" value={viewing.satisfaction ? `${viewing.satisfaction} / 5` : "—"} />
              <DetailField label="NPS Score" value={viewing.nps_score !== null ? `${viewing.nps_score} (${npsCategory(viewing.nps_score)})` : "—"} />
              <DetailField label="Results on Time" value={viewing.results_on_time || "—"} />
              <DetailField label="Reports Easy to Understand" value={viewing.reports_easy_to_understand || "—"} />
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Detailed Ratings (1–5)</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {RATING_FIELDS.map((f) => (
                  <div key={f.key} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700/40">
                    <span className="text-slate-600 dark:text-slate-300">{f.label}</span>
                    <span className="font-medium text-slate-800 dark:text-white">{viewing[f.key] as number ?? "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            <DetailField label="What did you like most?" value={viewing.liked_most || "—"} full />
            <DetailField label="What can we improve?" value={viewing.improvements || "—"} full />
            <DetailField label="Additional Comments" value={viewing.additional_comments || "—"} full />

            {viewing.wants_contact && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/40 dark:bg-blue-900/20">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Contact Request</h4>
                <div className="grid gap-2 sm:grid-cols-3">
                  <DetailField label="Name" value={viewing.contact_name || "—"} />
                  <DetailField label="Email" value={viewing.contact_email || "—"} />
                  <DetailField label="Phone" value={viewing.contact_phone || "—"} />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Survey Response"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={actionLoading}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete this survey response? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function DetailField({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "" : ""}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-slate-700 dark:text-slate-200">{value}</div>
    </div>
  );
}
