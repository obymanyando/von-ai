-- ========================================
-- von AI - Missing Tables Creation Script
-- ========================================
-- Run this in your Supabase SQL Editor to create missing tables

-- Create case_studies table
CREATE TABLE IF NOT EXISTS case_studies (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  company TEXT NOT NULL,
  industry TEXT NOT NULL,
  solution_type TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  results TEXT NOT NULL,
  time_to_implementation TEXT,
  cost_savings_percent TEXT,
  efficiency_gain_percent TEXT,
  revenue_impact_percent TEXT,
  featured_image_url TEXT,
  published_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  company_logo_url TEXT,
  featured TEXT NOT NULL DEFAULT 'false',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_solution_type ON case_studies(solution_type);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_published_date ON case_studies(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- ========================================
-- Sample Data - Case Studies (4 entries)
-- ========================================

INSERT INTO case_studies (title, slug, company, industry, solution_type, problem, solution, results, time_to_implementation, cost_savings_percent, efficiency_gain_percent, revenue_impact_percent, status, published_date)
VALUES 
(
  'Automating Lead Qualification at TechFlow Solutions',
  'techflow-lead-automation',
  'TechFlow Solutions',
  'Technology',
  'Sales',
  'Manual lead qualification was consuming 15+ hours per week of sales team time, resulting in slow response times and missed opportunities.',
  'Implemented an AI-powered lead qualification agent that automatically scores, categorizes, and routes leads based on fit and intent signals. The system integrates with their CRM and enriches lead data in real-time.',
  'Reduced lead response time from 4 hours to 5 minutes, increased qualified lead conversion by 45%, and freed up 15 hours per week for the sales team to focus on high-value activities.',
  '2 weeks',
  '40',
  '67',
  '28',
  'published',
  NOW()
),
(
  'Global Manufacturing 24/7 Support Chatbot',
  'global-manufacturing-support',
  'Global Manufacturing Co.',
  'Manufacturing',
  'Service',
  'Customer support team was overwhelmed with repetitive questions about order status, product specifications, and troubleshooting. Limited to business hours only.',
  'Deployed an intelligent customer support chatbot with access to their knowledge base, order management system, and product catalog. The bot handles common inquiries and escalates complex issues to human agents.',
  'Achieved 24/7 support availability, reduced support ticket volume by 60%, improved customer satisfaction scores by 35%, and decreased average resolution time from 24 hours to 2 hours.',
  '3 weeks',
  '55',
  '60',
  '18',
  'published',
  NOW()
),
(
  'CloudScale Operations Copilot',
  'cloudscale-operations-copilot',
  'CloudScale Inc.',
  'Cloud Services',
  'Operations',
  'DevOps team spent hours on manual infrastructure monitoring, log analysis, and routine operational tasks. Incidents were often detected late.',
  'Built an AI operations copilot that monitors infrastructure health, analyzes logs for anomalies, automates routine tasks, and provides real-time alerts with suggested remediation steps.',
  'Reduced mean time to detection (MTTD) by 75%, automated 80% of routine operational tasks, and decreased incident response time from 45 minutes to 8 minutes.',
  '4 weeks',
  '45',
  '75',
  '15',
  'published',
  NOW()
),
(
  'ShopEase Onboarding Automation',
  'shopease-onboarding',
  'ShopEase Retail',
  'E-commerce',
  'Sales',
  'New merchant onboarding required 3-5 days of manual setup, documentation review, and back-and-forth communication, limiting growth capacity.',
  'Created an AI onboarding agent that guides merchants through setup, automatically validates documentation, configures accounts, and answers questions in real-time via chat and email.',
  'Reduced onboarding time from 3-5 days to 4 hours, increased merchant satisfaction scores by 50%, and enabled the team to onboard 3x more merchants without additional headcount.',
  '3 weeks',
  '65',
  '85',
  '42',
  'published',
  NOW()
);

-- ========================================
-- Sample Data - Testimonials (4 entries)
-- ========================================

INSERT INTO testimonials (name, title, company, quote, featured)
VALUES 
(
  'Sarah Mitchell',
  'VP of Sales',
  'TechFlow Solutions',
  'The AI lead qualification system transformed our sales process. We''re responding to leads faster than ever and our conversion rates have skyrocketed. Best investment we''ve made this year.',
  'true'
),
(
  'James Rodriguez',
  'Head of Customer Success',
  'Global Manufacturing Co.',
  'Our customers love the 24/7 support availability. The chatbot handles routine questions perfectly, and our team can focus on complex issues. Customer satisfaction has never been higher.',
  'true'
),
(
  'Emily Chen',
  'CTO',
  'CloudScale Inc.',
  'The operations copilot is like having a senior DevOps engineer working around the clock. It catches issues before they become problems and automates tasks that used to take hours.',
  'true'
),
(
  'Michael Thompson',
  'Director of Merchant Operations',
  'ShopEase Retail',
  'We''ve tripled our onboarding capacity without hiring more staff. The AI agent makes the process smooth for merchants and our team. It''s been a game-changer for our growth.',
  'true'
);

-- ========================================
-- Sample Data - Admin User
-- ========================================
-- Default admin credentials: admin / admin123
-- Password hash generated using bcrypt with 10 rounds

INSERT INTO admin_users (username, password_hash)
VALUES (
  'admin',
  '$2b$10$/ti92XcvBD/IMIWL5.OH/eJBt5YIcQaQ2h8D.qR/mQ/bebRY6OSEO'
)
ON CONFLICT (username) DO NOTHING;

-- ========================================
-- Verification Queries
-- ========================================
-- Run these to verify the tables were created successfully

-- Check case_studies table
-- SELECT COUNT(*) as case_study_count FROM case_studies;

-- Check testimonials table
-- SELECT COUNT(*) as testimonial_count FROM testimonials;

-- Check admin_users table
-- SELECT COUNT(*) as admin_count FROM admin_users;

-- List all tables in public schema
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
