import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabase, isSupabaseAvailable } from "./supabase";
import { insertNewsletterSubscriberSchema, insertContactLeadSchema, loginSchema, insertBlogPostSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { verifyAdminCredentials, requireAuth } from "./auth";

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

      res.json({ message: "Successfully subscribed!" });
    } catch (error) {
      console.error("Error in /api/newsletter/subscribe:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      const { username, password } = result.data;
      const isValid = await verifyAdminCredentials(username, password);

      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

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

  // Get all blog posts (admin only - includes drafts)
  app.get("/api/admin/posts", requireAuth, async (req, res) => {
    try {
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { data, error } = await supabase
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
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const result = insertBlogPostSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ error: validationError.toString() });
      }

      const postData = result.data;
      const publishedDate = postData.status === "published" ? new Date().toISOString() : null;

      const { data, error } = await supabase
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
      if (!isSupabaseAvailable || !supabase) {
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

      const { data, error } = await supabase
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
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { id } = req.params;

      const { error } = await supabase
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
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { data, error } = await supabase
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

  // Get all contact leads (admin only)
  app.get("/api/admin/leads", requireAuth, async (req, res) => {
    try {
      if (!isSupabaseAvailable || !supabase) {
        return res.status(503).json({ error: "Database service unavailable" });
      }

      const { data, error } = await supabase
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
