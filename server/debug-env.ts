// server/routes/debug-env.ts
import type { Express } from "express";

export function mountDebugEnv(app: Express) {
  app.get("/api/_envcheck", (_req, res) => {
    const dbUrl = process.env.DATABASE_URL
      ? new URL(process.env.DATABASE_URL)
      : null;
    res.json({
      nodeEnv: process.env.NODE_ENV,
      supabaseUrlHost: process.env.SUPABASE_URL
        ? new URL(process.env.SUPABASE_URL).host
        : null,
      dbHost: dbUrl?.host ?? null,
      dbPath: dbUrl?.pathname ?? null,
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasAnonKey: Boolean(process.env.SUPABASE_ANON_KEY),
    });
  });
}
