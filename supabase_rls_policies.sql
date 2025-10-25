-- ========================================
-- von AI - Row Level Security (RLS) Policies
-- ========================================
-- Run this in your Supabase SQL Editor to enable RLS protection
-- 
-- IMPORTANT: Your Express backend uses the service role key which bypasses RLS.
-- These policies protect against direct access using the anon key.

-- ========================================
-- SENSITIVE TABLES - No Public Access
-- ========================================
-- These tables should only be accessed via your authenticated backend

-- Admin Users Table - Contains password hashes
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- No policies = No public access at all
-- Backend uses service role key which bypasses RLS
COMMENT ON TABLE admin_users IS 'RLS enabled - Backend access only via service role key';

-- Newsletter Subscribers - Contains email addresses (PII)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- No policies = No public access at all
COMMENT ON TABLE newsletter_subscribers IS 'RLS enabled - Backend access only via service role key';

-- Contact Leads - Contains personal information
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

-- No policies = No public access at all
COMMENT ON TABLE contact_leads IS 'RLS enabled - Backend access only via service role key';


-- ========================================
-- PUBLIC DATA TABLES - Read-Only Access
-- ========================================
-- These tables contain public information but should only be modified via backend

-- Blog Posts Table
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts only
CREATE POLICY "Public can view published blog posts"
ON blog_posts
FOR SELECT
USING (status = 'published');

-- No insert/update/delete policies = Backend only via service role key
COMMENT ON TABLE blog_posts IS 'RLS enabled - Public read (published only), backend writes via service role key';


-- Case Studies Table
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published case studies only
CREATE POLICY "Public can view published case studies"
ON case_studies
FOR SELECT
USING (status = 'published');

-- No insert/update/delete policies = Backend only via service role key
COMMENT ON TABLE case_studies IS 'RLS enabled - Public read (published only), backend writes via service role key';


-- Testimonials Table
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all testimonials
CREATE POLICY "Public can view all testimonials"
ON testimonials
FOR SELECT
USING (true);

-- No insert/update/delete policies = Backend only via service role key
COMMENT ON TABLE testimonials IS 'RLS enabled - Public read access, backend writes via service role key';


-- ========================================
-- Verification
-- ========================================
-- Run these queries to verify RLS is properly configured

-- Check which tables have RLS enabled
-- SELECT 
--   schemaname, 
--   tablename, 
--   rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename;

-- View all RLS policies
-- SELECT 
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   cmd,
--   qual,
--   with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- Test public access (should only see published content)
-- SELECT COUNT(*) FROM blog_posts;  -- Should see only published
-- SELECT COUNT(*) FROM case_studies;  -- Should see only published
-- SELECT COUNT(*) FROM testimonials;  -- Should see all

-- These should fail with RLS enabled:
-- SELECT COUNT(*) FROM admin_users;  -- Should fail
-- SELECT COUNT(*) FROM newsletter_subscribers;  -- Should fail
-- SELECT COUNT(*) FROM contact_leads;  -- Should fail

-- ========================================
-- Summary
-- ========================================
-- ✅ admin_users: Fully protected, backend-only access
-- ✅ newsletter_subscribers: Fully protected, backend-only access
-- ✅ contact_leads: Fully protected, backend-only access
-- ✅ blog_posts: Public can read published posts only
-- ✅ case_studies: Public can read published case studies only
-- ✅ testimonials: Public can read all testimonials
--
-- All INSERT/UPDATE/DELETE operations require service role key (backend only)
-- Your Express backend uses service role key and will continue to work normally
