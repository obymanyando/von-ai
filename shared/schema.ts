import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  author: text("author").notNull().default("von AI Team"),
  publishedDate: timestamp("published_date", { withTimezone: true }),
  featuredImageUrl: text("featured_image_url"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true }).defaultNow(),
  status: text("status").notNull().default("active"),
});

export const contactLeads = pgTable("contact_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  message: text("message").notNull(),
  serviceInterest: text("service_interest"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow(),
  status: text("status").notNull().default("new"),
});

export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  quote: text("quote").notNull(),
  avatarUrl: text("avatar_url"),
  companyLogoUrl: text("company_logo_url"),
  featured: text("featured").notNull().default("false"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const caseStudies = pgTable("case_studies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  company: text("company").notNull(),
  industry: text("industry").notNull(),
  solutionType: text("solution_type").notNull(),
  problem: text("problem").notNull(),
  solution: text("solution").notNull(),
  results: text("results").notNull(),
  timeToImplementation: text("time_to_implementation"),
  costSavingsPercent: text("cost_savings_percent"),
  efficiencyGainPercent: text("efficiency_gain_percent"),
  revenueImpactPercent: text("revenue_impact_percent"),
  featuredImageUrl: text("featured_image_url"),
  publishedDate: timestamp("published_date", { withTimezone: true }),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export const insertContactLeadSchema = createInsertSchema(contactLeads).pick({
  name: true,
  email: true,
  company: true,
  phone: true,
  message: true,
  serviceInterest: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z.string().min(10, "Please provide more details (at least 10 characters)"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  author: true,
  featuredImageUrl: true,
  status: true,
}).extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().optional(),
  author: z.string().default("von AI Team"),
  featuredImageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type ContactLead = typeof contactLeads.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type InsertContactLead = z.infer<typeof insertContactLeadSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type CaseStudy = typeof caseStudies.$inferSelect;
