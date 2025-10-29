import bcrypt from "bcryptjs";
import { supabaseAdmin, isSupabaseAdminAvailable } from "./supabase";

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  console.log("[AUTH] Starting credential verification for username:", username);
  console.log("[AUTH] Supabase admin available:", isSupabaseAdminAvailable);
  
  if (!isSupabaseAdminAvailable || !supabaseAdmin) {
    // Fallback for development - check against environment variable
    console.log("[AUTH] Supabase admin client not available, using fallback env vars");
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    return username === adminUsername && password === adminPassword;
  }

  try {
    console.log("[AUTH] Querying admin_users table for username:", username);
    const { data: admin, error } = await supabaseAdmin
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

    console.log("[AUTH] Admin found, verifying password...");
    const result = await bcrypt.compare(password, admin.password_hash);
    console.log("[AUTH] Password verification result:", result);
    return result;
  } catch (error) {
    console.error("[AUTH] Error verifying admin credentials:", error);
    return false;
  }
}

export async function changeAdminPassword(username: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  // First verify current password
  const isValid = await verifyAdminCredentials(username, currentPassword);
  if (!isValid) {
    return { success: false, error: "Current password is incorrect" };
  }

  if (!isSupabaseAdminAvailable || !supabaseAdmin) {
    return { success: false, error: "Password change not available in fallback mode" };
  }

  try {
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password in database
    const { error } = await supabaseAdmin
      .from("admin_users")
      .update({ password_hash: passwordHash })
      .eq("username", username);

    if (error) {
      console.error("[AUTH] Error updating password:", error);
      return { success: false, error: "Failed to update password" };
    }

    console.log("[AUTH] Password changed successfully for user:", username);
    return { success: true };
  } catch (error) {
    console.error("[AUTH] Error changing password:", error);
    return { success: false, error: "Internal error" };
  }
}

export function requireAuth(req: any, res: any, next: any) {
  console.log("[AUTH] requireAuth middleware - session:", {
    sessionId: req.sessionID,
    hasSession: !!req.session,
    isAdmin: req.session?.isAdmin,
    cookie: req.session?.cookie,
    allSessionData: req.session
  });
  
  if (!req.session?.isAdmin) {
    console.log("[AUTH] Unauthorized - session.isAdmin is falsy");
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  console.log("[AUTH] Authorized - proceeding to route handler");
  next();
}
