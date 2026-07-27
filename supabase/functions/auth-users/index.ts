import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AppUser {
  id: string;
  username: string;
  role: string;
  is_primary: boolean;
  active: boolean;
  created_at: string;
}

interface StoredUser extends AppUser {
  password_hash: string;
  password_salt: string;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function hashPassword(password: string, salt: string): string {
  const combined = `${salt}:${password}`;
  return Array.from(
    new Deno.AlgorithmIdentifier({ name: "SHA-256" }) as unknown as Iterable<number>,
  ).join("");
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashWithSalt(password: string, salt: string): Promise<string> {
  return await sha256(`${salt}:${password}`);
}

async function ensureSeedAdmin() {
  const { count } = await admin
    .from("app_users")
    .select("*", { count: "exact", head: true });

  if (count === 0) {
    const salt = generateSalt();
    const hash = await hashWithSalt("najran2026", salt);
    await admin.from("app_users").insert({
      username: "admin",
      password_hash: hash,
      password_salt: salt,
      role: "admin",
      is_primary: true,
      active: true,
    });
  }
}

function toPublic(u: StoredUser): AppUser {
  return {
    id: u.id,
    username: u.username,
    role: u.role,
    is_primary: u.is_primary,
    active: u.active,
    created_at: u.created_at,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    await ensureSeedAdmin();

    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const body = await req.json().catch(() => ({}));

    // ---- LOGIN ----
    if (action === "login") {
      const { username, password } = body;
      if (!username || !password) {
        return jsonError(400, "Username and password are required.");
      }
      const { data: user } = await admin
        .from("app_users")
        .select("*")
        .eq("username", username.toLowerCase().trim())
        .maybeSingle();

      if (!user || !user.active) {
        return jsonError(401, "Invalid credentials.");
      }
      const hash = await hashWithSalt(password, user.password_salt);
      if (hash !== user.password_hash) {
        return jsonError(401, "Invalid credentials.");
      }
      return jsonResponse({ user: toPublic(user) });
    }

    // ---- LIST USERS ----
    if (action === "list") {
      const { data, error } = await admin
        .from("app_users")
        .select("id, username, role, is_primary, active, created_at")
        .order("created_at", { ascending: true });
      if (error) return jsonError(500, "Failed to fetch users.");
      return jsonResponse({ users: data });
    }

    // ---- CREATE USER ----
    if (action === "create") {
      const { username, password, role } = body;
      if (!username || !password) {
        return jsonError(400, "Username and password are required.");
      }
      if (role && !["admin", "user"].includes(role)) {
        return jsonError(400, "Role must be 'admin' or 'user'.");
      }
      const cleanUsername = username.toLowerCase().trim();
      const { data: existing } = await admin
        .from("app_users")
        .select("id")
        .eq("username", cleanUsername)
        .maybeSingle();
      if (existing) {
        return jsonError(409, "This username already exists.");
      }
      const salt = generateSalt();
      const hash = await hashWithSalt(password, salt);
      const { data, error } = await admin
        .from("app_users")
        .insert({
          username: cleanUsername,
          password_hash: hash,
          password_salt: salt,
          role: role || "user",
          is_primary: false,
          active: true,
        })
        .select("id, username, role, is_primary, active, created_at")
        .single();
      if (error) return jsonError(500, "Failed to create user.");
      return jsonResponse({ user: data });
    }

    // ---- UPDATE USER (password / role / active) ----
    if (action === "update") {
      const { id, password, role, active } = body;
      if (!id) return jsonError(400, "User id is required.");
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (password) {
        const salt = generateSalt();
        updates.password_salt = salt;
        updates.password_hash = await hashWithSalt(password, salt);
      }
      if (role !== undefined) {
        if (!["admin", "user"].includes(role)) {
          return jsonError(400, "Role must be 'admin' or 'user'.");
        }
        updates.role = role;
      }
      if (active !== undefined) updates.active = active;
      const { data, error } = await admin
        .from("app_users")
        .update(updates)
        .eq("id", id)
        .select("id, username, role, is_primary, active, created_at")
        .single();
      if (error) return jsonError(500, "Failed to update user.");
      return jsonResponse({ user: data });
    }

    // ---- DELETE USER ----
    if (action === "delete") {
      const { id } = body;
      if (!id) return jsonError(400, "User id is required.");
      const { data: target } = await admin
        .from("app_users")
        .select("is_primary")
        .eq("id", id)
        .maybeSingle();
      if (target?.is_primary) {
        return jsonError(403, "The primary admin cannot be deleted.");
      }
      const { error } = await admin.from("app_users").delete().eq("id", id);
      if (error) return jsonError(500, "Failed to delete user.");
      return jsonResponse({ success: true });
    }

    return jsonError(404, "Unknown action.");
  } catch (err) {
    return jsonError(500, err.message || "Internal server error.");
  }
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function jsonError(status: number, message: string) {
  return jsonResponse({ error: message }, status);
}
