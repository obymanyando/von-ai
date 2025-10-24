# von AI - AI Automation Solutions Platform

A modern, conversion-optimized marketing website and lead generation platform for an AI automation consultancy. Built with React, TypeScript, Express, and Supabase.

![von AI](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-97%25-blue)

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
- Resend API

**Development:**
- Vite (build tool)
- ESBuild (server bundling)

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase account)
- Resend API key (for email functionality)

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

   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key

   # Admin Credentials (Fallback)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=your_bcrypt_hash
   ```

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

The platform uses [Resend](https://resend.com) for transactional emails:

1. Sign up for a Resend account
2. Verify your sending domain
3. Generate an API key
4. Add to `.env` as `RESEND_API_KEY`

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

### Using Replit (Recommended)

1. Import this repository into Replit
2. Configure Secrets for environment variables
3. Click "Publish" to deploy

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables on your hosting platform

3. Start the production server:
   ```bash
   npm start
   ```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Sync database schema
- `npm run db:studio` - Open Drizzle Studio

## 🔒 Security Notes

- Session cookies are HTTP-only and secure in production
- CORS is configured for your domain
- API keys and secrets must never be committed
- Admin passwords are bcrypt hashed
- Use environment variables for all sensitive data

## 📝 License

This project is proprietary software for von AI.

## 🤝 Contributing

This is a private repository. For questions or support, contact the development team.

---

**Built with ❤️ using Replit Agent**
