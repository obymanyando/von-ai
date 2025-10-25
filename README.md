# von AI - AI Automation Solutions Platform

A modern, conversion-optimized marketing website and lead generation platform for an AI automation consultancy. Built with React, TypeScript, Express, and Supabase.

🌐 **Live at:** [https://von-ai.com](https://von-ai.com)

![von AI](https://img.shields.io/badge/Status-Live%20in%20Production-success)
![TypeScript](https://img.shields.io/badge/TypeScript-97%25-blue)
![Deployment](https://img.shields.io/badge/Deployment-Replit%20Autoscale-blue)

## 🚀 Features

### Phase 2 Complete ✅

1. **CMS Admin Panel**
   - Session-based authentication
   - Rich text blog editor with live preview
   - Newsletter subscriber management
   - Contact lead tracking and management

2. **Testimonials & Social Proof**
   - Client testimonials display
   - Company logos and ratings
   - Integrated on homepage and solutions page

3. **Case Studies/Portfolio**
   - Filterable case studies by industry (Sales, Service, Operations)
   - Individual case study detail pages
   - Metrics visualization (ROI, time saved, accuracy)

4. **Interactive ROI Calculator**
   - Real-time cost savings calculation
   - Time savings and revenue impact projections
   - Embedded on homepage and solutions page

5. **Newsletter Email Integration**
   - Automated welcome emails via Resend API
   - Newsletter composer with live HTML preview
   - Bounce handling and unsubscribe management
   - Newsletter signup on contact form

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Wouter (routing)
- TanStack Query (data fetching)
- shadcn/ui + Radix UI (components)
- Tailwind CSS (styling)
- React Hook Form + Zod (form validation)

**Backend:**
- Express.js
- TypeScript
- Express Session (authentication)
- Drizzle ORM
- Supabase/PostgreSQL

**Email:**
- Resend (via Replit native integration)

**Development:**
- Vite (build tool)
- ESBuild (server bundling)

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase account)
- Resend account (for email functionality)
- Replit account (recommended for deployment)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/obymanyando/von-ai.git
   cd von-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key

   # Session
   SESSION_SECRET=your_random_session_secret

   # Admin Credentials (Fallback)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=your_bcrypt_hash

   # Production
   NODE_ENV=production
   ```

   **Note:** When deploying on Replit, use the native Resend integration instead of manually setting `RESEND_API_KEY`. See the Email Configuration section below.

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 🗄️ Database Schema

The application uses the following tables:
- `blog_posts` - Blog content management
- `newsletter_subscribers` - Email subscriber list
- `contact_leads` - Contact form submissions
- `testimonials` - Client testimonials
- `case_studies` - Portfolio case studies
- `admin_users` - Admin authentication

## 🔐 Admin Access

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

**Admin Panel Routes:**
- Login: `/admin/login`
- Dashboard: `/admin/dashboard`
- Newsletter Composer: `/admin/newsletter`

**Important:** Change the default credentials in production by updating the `admin_users` table.

## 📧 Email Configuration

The platform uses [Resend](https://resend.com) for transactional emails.

### Using Replit (Recommended)

1. Sign up for a Resend account at [resend.com](https://resend.com)
2. Verify your sending domain
3. In your Replit workspace, search for "Resend" in the integrations panel
4. Connect your Resend account via the native integration
5. The integration automatically handles API key management and authentication

### Manual Setup (Non-Replit)

1. Generate a Resend API key
2. Add to `.env` as `RESEND_API_KEY`
3. Configure the Resend client manually in `server/email.ts`

**Email Features:**
- Welcome emails on newsletter subscription
- Bounce tracking and status updates
- Newsletter campaigns with HTML preview
- Unsubscribe functionality

## 🎨 Design System

The design follows a minimalist, technology-forward aesthetic inspired by Linear, Stripe, and Vercel:

- **Primary Color:** Vibrant Orange `hsl(25, 95%, 53%)`
- **Background:** Dark `hsl(0, 0%, 3%)`
- **Typography:** Inter (primary), JetBrains Mono (code/technical)
- **Spacing:** Consistent 2/4/6/8/12/16/20/24/32 scale

## 📄 Project Structure

```
von-ai/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── lib/          # Utilities and configuration
│   │   └── hooks/        # Custom React hooks
├── server/               # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication logic
│   └── email.ts          # Email service
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema (Drizzle)
└── attached_assets/      # Static assets (images, etc.)
```

## 🚀 Deployment

### Production Deployment (Replit)

**Current Status:** ✅ Successfully deployed at [von-ai.com](https://von-ai.com)

The application is deployed on **Replit Autoscale** with the following configuration:

**Deployment Settings:**
- **Type:** Autoscale (optimal for Node.js/Express apps)
- **Custom Domain:** von-ai.com
- **HTTPS:** Automatic SSL certificates (free, auto-renewing)
- **Port:** 5000 (mapped to external port 80/443)

**Environment Variables (Production):**
Set these in your Replit Deployment Secrets:
- `SESSION_SECRET` - Random session key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to `production`

**Note:** `RESEND_API_KEY` is handled automatically via the Replit Resend integration.

### Deploying to Replit (First Time)

1. Fork or import this repository into Replit
2. Install dependencies: `npm install`
3. Set up the Resend integration via the Tools panel
4. Configure environment secrets (listed above)
5. Run `npm run db:push` to sync database schema
6. Click **"Publish"** button
7. Select **Autoscale** deployment type
8. Configure custom domain (optional)
9. Wait for build to complete

### Custom Domain Setup

1. After publishing, go to **Deployments → Settings → Domains**
2. Click **"Link a domain"** or **"Manually connect"**
3. Add your domain (e.g., `von-ai.com`)
4. Copy the provided A and TXT DNS records
5. Add these records to your domain registrar's DNS settings
6. Wait for DNS propagation (can take up to 48 hours)
7. HTTPS certificates are automatically provisioned once verified

### Manual Deployment (Non-Replit)

1. Build the application:
   ```bash
   npm run build
   ```

2. Set all environment variables on your hosting platform

3. Start the production server:
   ```bash
   npm start
   ```

The build process creates:
- `dist/public/` - Frontend static files
- `dist/index.js` - Bundled backend server

## 🧪 Available Scripts

- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build frontend and backend for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Sync database schema with Drizzle

## 🔒 Security Notes

- Session cookies are HTTP-only and secure in production (`secure: true` when `NODE_ENV=production`)
- HTTPS/SSL certificates automatically provided by Replit (free, auto-renewing)
- API keys and secrets managed via Replit integrations and secrets
- Admin passwords are bcrypt hashed in the database
- CORS is configured appropriately for production
- All sensitive data uses environment variables
- Database connections use SSL in production

## 📝 License

This project is proprietary software for von AI.

## 🤝 Contributing

This is a private repository. For questions or support, contact the development team.

## 📊 Sample Data

The production database includes sample data for testing:

**Testimonials (4):**
- TechFlow Solutions
- Global Manufacturing Co.
- CloudScale Inc.
- ShopEase Retail

**Case Studies (4):**
- Sales automation case study
- Customer service chatbot case study
- Operations copilot case study
- Industry-specific implementations

## 🐛 Troubleshooting

**Common Issues:**

1. **Database connection errors**
   - Verify `DATABASE_URL`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY` are set
   - Run `npm run db:push` to sync schema

2. **Email not sending**
   - Ensure Resend integration is connected (Replit)
   - Verify sending domain is verified in Resend dashboard
   - Check `RESEND_API_KEY` is set (non-Replit deployments)

3. **Admin login not working**
   - Default credentials: `admin` / `admin123`
   - Check `admin_users` table has entries
   - Verify `SESSION_SECRET` is set

4. **Build failures**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors: `npm run check`
   - Verify Node.js version is 18+

5. **HTTPS/SSL not working**
   - Wait for DNS propagation (up to 48 hours)
   - Verify domain shows "Verified" status in Replit
   - Check DNS A records point to correct IP

---

**Built with ❤️ using Replit Agent**

**Repository:** [github.com/obymanyando/von-ai](https://github.com/obymanyando/von-ai)
