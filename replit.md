# von AI - AI Automation Solutions Platform

## Overview

von AI is a marketing website and lead generation platform for an AI automation consultancy. The application showcases AI automation solutions across sales, service, and operations, featuring service descriptions, a blog system, contact forms, and newsletter subscriptions. Built with React, Express, and Supabase, it follows a modern full-stack architecture with a focus on conversion-optimized design inspired by Linear, Stripe, and Vercel.

## Phase 2 Complete ✅

All Phase 2 features have been implemented and tested:
1. **CMS Admin Panel** - Session-based authentication, blog post management with rich text editor, subscriber and lead tracking
2. **Testimonials & Social Proof** - Database schema, API endpoints, and display components integrated on homepage and solutions page
3. **Case Studies/Portfolio** - Filterable case studies page with individual detail pages and metrics visualization
4. **ROI Calculator** - Interactive calculator embedded on homepage and solutions page with results display
5. **Newsletter Email Integration** - Resend API integration, welcome emails, newsletter composer with live HTML preview, bounce handling, and unsubscribe functionality

Admin credentials: `admin` / `admin123` (session-based auth with fallback to environment variables)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React 18 with TypeScript for type-safe component development
- Wouter for lightweight client-side routing (alternative to React Router)
- Vite as the build tool and development server for fast HMR and optimized builds

**UI Component System**
- shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS with custom configuration following "New York" style variant
- Design system based on HSL color variables for flexible theming
- Typography system using Inter (primary) and JetBrains Mono (code/technical accents)
- Consistent spacing primitives (2, 4, 6, 8, 12, 16, 20, 24, 32) for layout harmony

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Custom query client with disabled refetching to minimize unnecessary network requests
- Form state managed by React Hook Form with Zod schema validation

**Key Design Principles**
- Minimalist, technology-forward aesthetic emphasizing precision over decoration
- Conversion-focused hierarchy guiding visitors to lead capture
- Mobile-first responsive design with breakpoint-aware components

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript for type safety across the entire stack
- Custom middleware for request logging and JSON response capture

**API Structure**
- RESTful endpoints under `/api` namespace
- Blog endpoints: `GET /api/blog/posts` and `GET /api/blog/posts/:slug`
- Lead capture endpoints: `POST /api/newsletter/subscribe` and `POST /api/contact`
- Error handling with structured error responses and appropriate HTTP status codes

**Development Setup**
- Vite middleware mode for seamless dev server integration during development
- Hot module replacement (HMR) via Vite for rapid frontend iteration
- Static file serving in production from built assets

### Data Storage Solutions

**Database**
- Supabase (PostgreSQL) as the primary database and backend-as-a-service
- Drizzle ORM for type-safe database queries and schema management
- Schema-driven approach with automatic TypeScript type generation via drizzle-zod

**Database Schema**
- `blog_posts`: Content management for blog articles with status workflow (draft/published)
- `newsletter_subscribers`: Email list management with subscription status tracking
- `contact_leads`: Lead capture form submissions with service interest categorization
- All tables use UUID primary keys via `gen_random_uuid()`
- Timestamp tracking for created/updated records

**Fallback Storage**
- In-memory storage implementation (`MemStorage`) for user management when database is unavailable
- Graceful degradation when Supabase credentials are missing

### Authentication & Authorization

**Current Implementation**
- No authentication system currently implemented
- Public access to all blog content and lead capture forms
- Session infrastructure prepared (connect-pg-simple) but not actively used

**Future Considerations**
- Session-based authentication ready to be implemented with PostgreSQL session store
- User schema defined in memory storage layer, prepared for database migration

### External Dependencies

**Third-Party Services**
- **Supabase**: PostgreSQL database, authentication infrastructure (not yet utilized), and real-time capabilities
- **Neon Database**: PostgreSQL serverless driver (@neondatabase/serverless) as database connection layer
- Environment variables required: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_URL`

**UI & Component Libraries**
- **Radix UI**: Comprehensive set of unstyled, accessible component primitives
- **shadcn/ui**: Curated component collection built on Radix with Tailwind styling
- **Lucide React**: Icon library for consistent iconography throughout the application

**Form & Validation**
- **React Hook Form**: Performant form state management with minimal re-renders
- **Zod**: Runtime type validation for forms and API requests
- **@hookform/resolvers**: Bridge between React Hook Form and Zod schemas

**Styling & Design**
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variant management
- **clsx & tailwind-merge**: Conditional class name composition

**Development Tools**
- **Replit-specific plugins**: Runtime error overlay, cartographer, dev banner for Replit environment
- **TypeScript**: Full-stack type safety
- **ESBuild**: Fast production bundling for server code

**Deployment Considerations**
- Application designed to run on Node.js servers
- Separate build steps for client (Vite) and server (ESBuild)
- Environment variables must be configured for Supabase and database connectivity
- Static assets served from `/dist/public` in production