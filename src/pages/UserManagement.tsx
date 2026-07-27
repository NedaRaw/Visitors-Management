import { useCallback, useEffect, useState } from "react";
import {
  UserPlus,
  Trash2,
  Pencil,
  ShieldCheck,
  User as UserIcon,
  AlertCircle,
  Loader2,
  Power,
  Key,
} from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import { Input, Select } from "@/components/Input";
import { useAuth, type AuthUser } from "@/context/AuthContext";

interface ManagedUser {
  id: string;
  username: string;
  role: "admin" | "user";
  is_primary: boolean;
  active: boolean;
  created_at: string;
}

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-users`;
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
};

async function callFn(action: string, body: Record<string, unknown> = {}) {
  const res = await fetch(`${FN_URL}?action=${action}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [deleting, setDeleting] = useState<ManagedUser | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await callFn("list");
      setUsers(data.users as ManagedUser[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (username: string, password: string, role: "admin" | "user") => {
    setSaving(true);
    setError(null);
    try {
      await callFn("create", { username, password, role });
      setCreating(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create user.");
    }
    setSaving(false);
  };

  const handleUpdate = async (
    id: string,
    updates: { password?: string; role?: "admin" | "user"; active?: boolean },
  ) => {
    setSaving(true);
    setError(null);
    try {
      await callFn("update", { id, ...updates });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update user.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await callFn("delete", { id });
      setDeleting(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete user.");
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            User Accounts
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create accounts and assign admin or user access.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setCreating(true)}
          leftIcon={<UserPlus size={15} />}
        >
          Add User
        </Button>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-10 text-slate-400">
            <Loader2 size={20} className="mr-2 animate-spin" /> Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Username</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800 dark:text-white">
                          {u.username}
                        </span>
                        {u.is_primary && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            Primary
                          </span>
                        )}
                        {u.id === currentUser?.id && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill active={u.active} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconBtn
                          title="Change password / role"
                          onClick={() => setEditing(u)}
                        >
                          <Pencil size={16} />
                        </IconBtn>
                        <IconBtn
                          title={u.active ? "Deactivate" : "Activate"}
                          onClick={() =>
                            handleUpdate(u.id, { active: !u.active })
                          }
                        >
                          <Power size={16} />
                        </IconBtn>
                        {!u.is_primary && (
                          <IconBtn
                            title="Delete"
                            danger
                            onClick={() => setDeleting(u)}
                          >
                            <Trash2 size={16} />
                          </IconBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {creating && (
        <UserFormModal
          title="Add New User"
          onClose={() => setCreating(false)}
          onSave={handleCreate}
          saving={saving}
        />
      )}

      {editing && (
        <UserFormModal
          title={`Edit ${editing.username}`}
          existing={editing}
          onClose={() => setEditing(null)}
          onSave={(username, password, role) =>
            handleUpdate(editing.id, {
              ...(password ? { password } : {}),
              role,
            })
          }
          saving={saving}
        />
      )}

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete User"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={saving}
              onClick={() => deleting && handleDelete(deleting.id)}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Delete user <span className="font-medium">{deleting?.username}</span>?
          They will no longer be able to sign in. This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function RoleBadge({ role }: { role: "admin" | "user" }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
        <ShieldCheck size={12} /> Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
      <UserIcon size={12} /> User
    </span>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
      Inactive
    </span>
  );
}

function IconBtn({
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

function UserFormModal({
  title,
  existing,
  onClose,
  onSave,
  saving,
}: {
  title: string;
  existing?: ManagedUser;
  onClose: () => void;
  onSave: (
    username: string,
    password: string,
    role: "admin" | "user",
  ) => Promise<void>;
  saving: boolean;
}) {
  const [username, setUsername] = useState(existing?.username || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">(existing?.role || "user");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSave = () => {
    setLocalError(null);
    if (!username.trim()) {
      setLocalError("Username is required.");
      return;
    }
    if (!existing && !password) {
      setLocalError("Password is required for new users.");
      return;
    }
    if (password && password.length < 4) {
      setLocalError("Password must be at least 4 characters.");
      return;
    }
    onSave(username.trim(), password, role);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          name="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!!existing}
          placeholder="e.g. reception, supervisor"
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {existing ? "New Password (leave blank to keep current)" : "Password"}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Key size={16} />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              placeholder={existing ? "••••••••" : "Enter password"}
            />
          </div>
        </div>
        <Select
          name="role"
          label="Role"
          options={["admin", "user"] as const}
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "user")}
        />
        {localError && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{localError}</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
