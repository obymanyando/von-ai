import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabase, isSupabaseAvailable, supabaseAdmin, isSupabaseAdminAvailable } from "./supabase";
import { insertNewsletterSubscriberSchema, insertContactLeadSchema, loginSchema, insertBlogPostSchema, changePasswordSchema, requestPasswordResetSchema, resetPasswordSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { verifyAdminCredentials, requireAuth, changeAdminPassword } from "./auth";
import { sendNewsletter, sendWelcomeEmail, isEmailServiceAvailable, sendPasswordResetEmail } from "./email";
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all published blog posts
  app.get("/api/blog/posts", async (req, res) => {
    try {
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_date", { ascending: false });

      if (error) {
        console.error("Error fetching blog posts:", error);
        return res.status(500).json({ error: "Failed to fetch blog posts" });
      }

      res.json(data || []);
    } catch (error) {
      console.error("Error in /api/blog/posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get individual blog post by slug
  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }
      
      const { slug } = req.params;

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ error: "Blog post not found" });
        }
        console.error("Error fetching blog post:", error);
        return res.status(500).json({ error: "Failed to fetch blog post" });
      }

      res.json(data);
    } catch (error) {
      console.error("Error in /api/blog/posts/:slug:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Subscribe to newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }
      
      const result = insertNewsletterSubscriberSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      const { email } = result.data;

      // Check if already subscribed
      const { data: existing } = await supabase
        .from("newsletter_subscribers")
        .select("id, status")
        .eq("email", email)
        .single();

      if (existing) {
        if (existing.status === "active") {
          return res.status(400).json({ error: "Email already subscribed" });
        }
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({ status: "active", subscribed_at: new Date().toISOString() })
          .eq("email", email);

        if (updateError) {
          console.error("Error reactivating subscription:", updateError);
          return res.status(500).json({ error: "Failed to subscribe" });
        }

        return res.json({ message: "Successfully resubscribed!" });
      }

      // New subscription
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email }]);

      if (insertError) {
        console.error("Error inserting newsletter subscriber:", insertError);
        return res.status(500).json({ error: "Failed to subscribe" });
      }

      // Send welcome email (async, don't wait)
      sendWelcomeEmail(email).catch(err => 
        console.error("Failed to send welcome email:", err)
      );

      res.json({ message: "Successfully subscribed!" });
    } catch (error) {
      console.error("Error in /api/newsletter/subscribe:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      console.log("[LOGIN] Received login request:", { username: req.body?.username });
      const result = loginSchema.safeParse(req.body);

      if (!result.success) {
        console.log("[LOGIN] Validation failed:", result.error);
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      const { username, password } = result.data;
      console.log("[LOGIN] Credentials validated, checking with verifyAdminCredentials...");
      const isValid = await verifyAdminCredentials(username, password);
      console.log("[LOGIN] verifyAdminCredentials returned:", isValid);

      if (!isValid) {
        console.log("[LOGIN] Invalid credentials, returning 401");
        return res.status(401).json({ error: "Invalid credentials" });
      }

      console.log("[LOGIN] Credentials valid, setting session");
      req.session!.isAdmin = true;
      res.json({ message: "Login successful" });
    } catch (error) {
      console.error("Error in /api/admin/login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    req.session!.isAdmin = false;
    res.json({ message: "Logged out successfully" });
  });

  // Check admin auth status
  app.get("/api/admin/auth", (req, res) => {
    res.json({ isAuthenticated: !!req.session?.isAdmin });
  });

  // Change admin password
  app.post("/api/admin/change-password", requireAuth, async (req, res) => {
    try {
      const result = changePasswordSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      const { currentPassword, newPassword } = result.data;
      
      // For now, hardcoded to 'admin' user. Could be extended to support multiple admins
      const username = "admin";
      
      const changeResult = await changeAdminPassword(username, currentPassword, newPassword);

      if (!changeResult.success) {
        return res.status(400).json({ error: changeResult.error });
      }

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error in /api/admin/change-password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Request password reset
  app.post("/api/admin/request-password-reset", async (req, res) => {
    try {
      if (!isSupabaseAdminAvailable || !supabaseAdmin) {
        return res.status(503).json({ error: "Service unavailable" });
      }

      const result = requestPasswordResetSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      const { username } = result.data;

      // Check if user exists and get email
      const { data: admin, error: adminError } = await supabaseAdmin
        .from("admin_users")
        .select("email")
        .eq("username", username)
        .single();

      if (adminError || !admin || !admin.email) {
        // Don't reveal if user exists for security
        return res.json({ message: "If the username exists, a password reset email will be sent." });
      }

      // Generate secure random token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Hash the token before storing
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const tokenHash = await bcrypt.hash(resetToken, salt);

      // Store hashed token in database
      const { error: tokenError } = await supabaseAdmin
        .from("password_reset_tokens")
        .insert({
          username,
          token: tokenHash,
          expires_at: expiresAt.toISOString(),
        });

      if (tokenError) {
        console.error("Error creating reset token:", tokenError);
        return res.status(500).json({ error: "Failed to create reset token" });
      }

      // Send reset email with the plaintext token (user will use this)
      try {
        await sendPasswordResetEmail(admin.email, resetToken);
      } catch (emailError) {
        console.error("Error sending reset email:", emailError);
        // Still return success to user for security
      }

      res.json({ message: "If the username exists, a password reset email will be sent." });
    } catch (error) {
      console.error("Error in /api/admin/request-password-reset:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reset password with token
  app.post("/api/admin/reset-password", async (req, res) => {
    try {
      if (!isSupabaseAdminAvailable || !supabaseAdmin) {
        return res.status(503).json({ error: "Service unavailable" });
      }

      const result = resetPasswordSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      const { token, newPassword } = result.data;

      // Get all unused, non-expired tokens for comparison
      const { data: resetTokens, error: tokenError } = await supabaseAdmin
        .from("password_reset_tokens")
        .select("*")
        .eq("used", "false")
        .gt("expires_at", new Date().toISOString());

      if (tokenError || !resetTokens || resetTokens.length === 0) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      // Find the matching token by comparing hashes
      const bcrypt = require("bcryptjs");
      let matchedToken = null;

      for (const dbToken of resetTokens) {
        const isMatch = await bcrypt.compare(token, dbToken.token);
        if (isMatch) {
          matchedToken = dbToken;
          break;
        }
      }

      if (!matchedToken) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      // Update password
      const { error: updateError } = await supabaseAdmin
        .from("admin_users")
        .update({ password_hash: passwordHash })
        .eq("username", matchedToken.username);

      if (updateError) {
        console.error("Error updating password:", updateError);
        return res.status(500).json({ error: "Failed to reset password" });
      }

      // Mark token as used
      await supabaseAdmin
        .from("password_reset_tokens")
        .update({ used: "true" })
        .eq("id", matchedToken.id);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error in /api/admin/reset-password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all blog posts (admin only - includes drafts)
  app.get("/api/admin/posts", requireAuth, async (req, res) => {
    try {
      if (!isSupabaseAdminAvailable || !supabaseAdmin) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { data, error } = await supabaseAdmin
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching admin posts:", error);
        return res.status(500).json({ error: "Failed to fetch posts" });
      }

      res.json(data || []);
    } catch (error) {
      console.error("Error in /api/admin/posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create blog post
  app.post("/api/admin/posts", requireAuth, async (req, res) => {
    try {
      if (!isSupabaseAdminAvailable || !supabaseAdmin) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const result = insertBlogPostSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      const postData = result.data;
      const publishedDate = postData.status === "published" ? new Date().toISOString() : null;

      const { data, error } = await supabaseAdmin
        .from("blog_posts")
        .insert([
          {
            title: postData.title,
            slug: postData.slug,
            content: postData.content,
            excerpt: postData.excerpt || null,
            author: postData.author,
            featured_image_url: postData.featuredImageUrl || null,
            status: postData.status,
            published_date: publishedDate,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating blog post:", error);
        return res.status(500).json({ error: "Failed to create post" });
      }

      res.json(data);
    } catch (error) {
      console.error("Error in /api/admin/posts POST:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update blog post
  app.put("/api/admin/posts/:id", requireAuth, async (req, res) => {
    try {
      if (!isSupabaseAdminAvailable || !supabaseAdmin) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { id } = req.params;
      const result = insertBlogPostSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      const postData = result.data;
      const publishedDate = postData.status === "published" ? new Date().toISOString() : null;

      const { data, error } = await supabaseAdmin
        .from("blog_posts")
        .update({
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt || null,
          author: postData.author,
          featured_image_url: postData.featuredImageUrl || null,
          status: postData.status,
          published_date: publishedDate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating blog post:", error);
        return res.status(500).json({ error: "Failed to update post" });
      }

      res.json(data);
    } catch (error) {
      console.error("Error in /api/admin/posts PUT:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete blog post
  app.delete("/api/admin/posts/:id", requireAuth, async (req, res) => {
    try {
      if (!isSupabaseAdminAvailable || !supabaseAdmin) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { id } = req.params;

      const { error } = await supabaseAdmin
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting blog post:", error);
        return res.status(500).json({ error: "Failed to delete post" });
      }

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error in /api/admin/posts DELETE:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all newsletter subscribers (admin only)
  app.get("/api/admin/subscribers", requireAuth, async (req, res) => {
    try {
      if (!isSupabaseAdminAvailable || !supabaseAdmin) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { data, error } = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) {
        console.error("Error fetching subscribers:", error);
        return res.status(500).json({ error: "Failed to fetch subscribers" });
      }

      res.json(data || []);
    } catch (error) {
      console.error("Error in /api/admin/subscribers:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Send newsletter (admin only)
  app.post("/api/admin/newsletter/send", requireAuth, async (req, res) => {
    try {
      if (!isSupabaseAdminAvailable || !supabaseAdmin) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const emailAvailable = await isEmailServiceAvailable();
      if (!emailAvailable) {
        return res.status(503).json({ 
          error: "Email service not configured. Please set up the Resend connection." 
        });
      }

      const newsletterSchema = z.object({
        subject: z.string().min(1, "Subject is required"),
        content: z.string().min(1, "Content is required"),
      });

      const result = newsletterSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      // Get active subscribers
      const { data: subscribers, error: fetchError } = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("email")
        .eq("status", "active");

      if (fetchError) {
        console.error("Error fetching subscribers:", fetchError);
        return res.status(500).json({ error: "Failed to fetch subscribers" });
      }

      if (!subscribers || subscribers.length === 0) {
        return res.status(400).json({ error: "No active subscribers found" });
      }

      const emails = subscribers.map(s => s.email);
      
      // Handle bounces by marking subscribers as bounced
      const handleBounce = async (email: string, error: string) => {
        if (!supabaseAdmin) return;
        try {
          await supabaseAdmin
            .from("newsletter_subscribers")
            .update({ status: "bounced" })
            .eq("email", email);
          console.log(`Marked ${email} as bounced: ${error}`);
        } catch (err) {
          console.error(`Failed to mark ${email} as bounced:`, err);
        }
      };
      
      const sendResult = await sendNewsletter(
        emails,
        {
          subject: result.data.subject,
          content: result.data.content,
        },
        handleBounce
      );

      res.json({
        message: "Newsletter sent successfully",
        ...sendResult,
      });
    } catch (error) {
      console.error("Error in /api/admin/newsletter/send:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  // Unsubscribe from newsletter
  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { email } = req.body;

      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email is required" });
      }

      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ status: "unsubscribed" })
        .eq("email", email);

      if (error) {
        console.error("Error unsubscribing:", error);
        return res.status(500).json({ error: "Failed to unsubscribe" });
      }

      res.json({ message: "Successfully unsubscribed" });
    } catch (error) {
      console.error("Error in /api/newsletter/unsubscribe:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all contact leads (admin only)
  app.get("/api/admin/leads", requireAuth, async (req, res) => {
    try {
      if (!isSupabaseAdminAvailable || !supabaseAdmin) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { data, error } = await supabaseAdmin
        .from("contact_leads")
        .select("*")
        .order("submitted_at", { ascending: false});

      if (error) {
        console.error("Error fetching leads:", error);
        return res.status(500).json({ error: "Failed to fetch leads" });
      }

      res.json(data || []);
    } catch (error) {
      console.error("Error in /api/admin/leads:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get case studies
  app.get("/api/case-studies", async (req, res) => {
    try {
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("status", "published")
        .order("published_date", { ascending: false });

      if (error) {
        console.error("Error fetching case studies:", error);
        return res.status(500).json({ error: "Failed to fetch case studies" });
      }

      res.json(data || []);
    } catch (error) {
      console.error("Error in /api/case-studies:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get individual case study by slug
  app.get("/api/case-studies/:slug", async (req, res) => {
    try {
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { slug } = req.params;

      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ error: "Case study not found" });
        }
        console.error("Error fetching case study:", error);
        return res.status(500).json({ error: "Failed to fetch case study" });
      }

      res.json(data);
    } catch (error) {
      console.error("Error in /api/case-studies/:slug:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching testimonials:", error);
        return res.status(500).json({ error: "Failed to fetch testimonials" });
      }

      res.json(data || []);
    } catch (error) {
      console.error("Error in /api/testimonials:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Submit contact form
  app.post("/api/contact/submit", async (req, res) => {
    try {
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }
      
      const result = insertContactLeadSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      const leadData = result.data;

      const { error } = await supabase
        .from("contact_leads")
        .insert([
          {
            name: leadData.name,
            email: leadData.email,
            company: leadData.company || null,
            phone: leadData.phone || null,
            message: leadData.message,
            service_interest: leadData.serviceInterest || null,
          },
        ]);

      if (error) {
        console.error("Error inserting contact lead:", error);
        return res.status(500).json({ error: "Failed to submit contact form" });
      }

      res.json({ message: "Message sent successfully!" });
    } catch (error) {
      console.error("Error in /api/contact/submit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
