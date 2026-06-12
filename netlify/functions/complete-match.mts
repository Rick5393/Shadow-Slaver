import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

export default async (request: Request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Metodo nao permitido." }, { status: 405 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return Response.json({ error: "Supabase nao configurado." }, { status: 500 });
  }

  if (!token) {
    return Response.json({ error: "Autenticacao obrigatoria." }, { status: 401 });
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(token);

  if (authError || !authData.user) {
    return Response.json({ error: "Sessao invalida." }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const enemies = Math.min(500, Math.max(0, Number(payload.enemies || 0)));
  const dungeons = Math.min(20, Math.max(0, Number(payload.dungeons || 0)));
  const coins = Math.min(1000, Math.max(0, Number(payload.coins || 0)));

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  const { data, error } = await admin.rpc("complete_match", {
    target_player_id: authData.user.id,
    enemies_gained: enemies,
    dungeons_gained: dungeons,
    coins_gained: coins,
  });

  if (error) {
    console.error(error);
    return Response.json({ error: "Falha ao salvar o progresso." }, { status: 500 });
  }

  return Response.json({ ok: true, progress: data });
};

export const config: Config = {
  path: "/api/complete-match",
};
