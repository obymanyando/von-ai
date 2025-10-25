import bcrypt from "bcryptjs";
import { supabase, isSupabaseAvailable } from "./supabase";

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  console.log("[AUTH] Starting credential verification for username:", username);
  console.log("[AUTH] Supabase available:", isSupabaseAvailable);
  
  if (!isSupabaseAvailable || !supabase) {
    // Fallback for development - check against environment variable
    console.log("[AUTH] Supabase not available, using fallback env vars");
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    return username === adminUsername && password === adminPassword;
  }

  try {
    console.log("[AUTH] Querying admin_users table for username:", username);
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("password_hash")
      .eq("username", username)
      .single();

    console.log("[AUTH] Query result - error:", error, "admin found:", !!admin);

    // If table doesn't exist in Supabase schema cache, fall back to env vars
    if (error && error.code === "PGRST205") {
      console.log("[AUTH] admin_users table not in Supabase schema cache, using fallback");
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      return username === adminUsername && password === adminPassword;
    }
    
    if (error) {
      console.log("[AUTH] Database error:", error);
      return false;
    }
    
    if (!admin) {
      console.log("[AUTH] No admin user found with username:", username);
      return false;
    }

    console.log("[AUTH] Admin found, password_hash:", admin.password_hash.substring(0, 20) + "...");
    console.log("[AUTH] Comparing password with bcrypt...");
    const result = await bcrypt.compare(password, admin.password_hash);
    console.log("[AUTH] Bcrypt compare result:", result);
    return result;
  } catch (error) {
    console.error("[AUTH] Error verifying admin credentials:", error);
    return false;
  }
}

export function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
