import bcrypt from "bcryptjs";
import { supabase, isSupabaseAvailable } from "./supabase";

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (!isSupabaseAvailable || !supabase) {
    // Fallback for development - check against environment variable
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    return username === adminUsername && password === adminPassword;
  }

  try {
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("password_hash")
      .eq("username", username)
      .single();

    // If table doesn't exist in Supabase schema cache, fall back to env vars
    if (error && error.code === "PGRST205") {
      console.log("[AUTH] admin_users table not in Supabase schema cache, using fallback");
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      return username === adminUsername && password === adminPassword;
    }
    
    if (error || !admin) {
      return false;
    }

    return await bcrypt.compare(password, admin.password_hash);
  } catch (error) {
    console.error("Error verifying admin credentials:", error);
    return false;
  }
}

export function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
