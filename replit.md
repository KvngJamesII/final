# OTP King - Virtual SMS Numbers Platform

## Overview

OTP King is a comprehensive fullstack web application that provides virtual phone numbers for SMS verification and OTP reception. The platform allows users to browse virtual numbers by country, receive SMS messages, manage credits through a wallet system, and earn rewards through referrals. Administrators and moderators can upload and manage phone number pools, configure API integrations, and monitor system activity.

The application is designed as a unified fullstack service that can be deployed as a single service on platforms like Railway, with both frontend and backend served from the same Express server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Fullstack Architecture Pattern

**Unified Service Design**: The application uses a single-service architecture where both frontend and backend are bundled and served together. This eliminates CORS issues and simplifies deployment.

- **Development Mode**: Vite dev server with HMR runs alongside Express API server
- **Production Mode**: Frontend is built as static files and served by Express from the `dist` folder
- **Rationale**: Simplifies deployment, reduces infrastructure complexity, and avoids cross-origin issues since everything runs on the same domain

### Frontend Architecture

**Technology Stack**:
- React 18 with TypeScript for type safety
- Vite as the build tool for fast HMR and optimized production builds
- TanStack Query (React Query) for server state management and caching
- Wouter for lightweight client-side routing
- React Hook Form with Zod for type-safe form validation

**UI Component System**:
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theming system supporting light/dark modes
- CSS variables for dynamic theming (`--primary`, `--background`, etc.)

**State Management Strategy**:
- Server state managed by TanStack Query with query keys matching API endpoints
- Local UI state managed with React hooks (useState, useEffect)
- No global state management library needed due to server-state-first approach
- Query client configured with credentials for session-based auth

### Backend Architecture

**Express Server Design**:
- Two server entry points: `index-dev.ts` (development) and `index-prod.ts` (production)
- Middleware stack: JSON parsing, URL encoding, CORS headers for credentials
- Custom logging middleware that captures request/response timing and status
- Session-based authentication with no JWT complexity

**API Route Organization**:
- All routes defined in `server/routes.ts`
- RESTful endpoint design (`/api/auth/*`, `/api/countries/*`, `/api/wallet/*`, etc.)
- Role-based middleware: `requireAuth`, `requireAdmin`, `requireModerator`
- Rate limiting on sensitive endpoints to prevent abuse

**Database Layer**:
- Drizzle ORM for type-safe database queries
- PostgreSQL as the database (Neon serverless in production)
- Schema-first design with migrations managed by Drizzle Kit
- Connection pooling via `node-postgres` for efficient connection management

**Data Storage Pattern**:
- Storage abstraction layer (`server/storage.ts`) provides interface for data operations
- All database queries go through the storage layer for consistency
- Phone numbers stored as newline-separated text in `numbersFile` field (not individual rows)
- Rationale: Simplifies bulk import/export and reduces database row count for large number pools

### Authentication & Authorization

**Session-Based Authentication**:
- Passport.js with LocalStrategy for username/password login
- express-session with connect-pg-simple for PostgreSQL-backed sessions
- Session cookies with HTTP-only flag for security
- IP tracking for user registration and fraud prevention

**Authorization Hierarchy**:
- Regular users: Access to numbers, wallet, referrals
- Moderators: Upload numbers, view statistics
- Admins: Full system control including user management and API settings

### Database Schema Design

**Core Tables**:
- `users`: User accounts with credits, referral codes, roles, and ban status
- `countries`: Phone number pools by country with total/used counts
- `numberHistory`: Tracks which users have used which numbers
- `smsMessages`: Stores received SMS messages per phone number
- `walletTransactions`: Credit purchases and usage tracking
- `giftCodes`: Redeemable codes for free credits
- `announcements`: Platform-wide announcements with active/inactive status
- `notifications`: Per-user and broadcast notifications

**Key Design Decisions**:
- UUIDs as primary keys for better scalability
- Soft deletes avoided; hard deletes with CASCADE for clean data
- Timestamps on all tables for audit trails
- Referential integrity enforced via foreign key constraints

### SMS Integration Architecture

**Number Assignment Strategy**:
- Numbers retrieved sequentially from newline-separated file stored in database
- Used numbers tracked in `numberHistory` table
- `usedNumbers` counter incremented when number is assigned
- Numbers can be reused after a period (not enforced at schema level)

**Message Reception**:
- External SMS API webhooks write to `smsMessages` table
- Messages filtered by phone number for user display
- Real-time updates via polling (not WebSockets for simplicity)
- Auto-refresh feature in UI for continuous polling

### Payment Integration

**Paystack Integration**:
- Client-side Paystack inline checkout
- Server-side payment verification via Paystack API
- Transaction recording in `walletTransactions` table
- Credit allocation only after successful verification
- Webhook support for payment status updates

### Admin & Moderator Features

**Number Management**:
- Bulk upload via CSV or text file
- Country-based organization
- Statistics dashboard showing usage patterns
- Delete functionality for cleaning up old pools

**User Management** (Admin only):
- Ban/unban user accounts
- View user activity and transaction history
- Promote users to moderator role
- Manage gift codes and pricing

**System Configuration**:
- Maintenance mode toggle
- API settings for external integrations
- Notification broadcasting
- Announcement management

## External Dependencies

### Database
- **PostgreSQL (Neon)**: Primary database for all persistent data
- **Connection**: Via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM for type-safe queries and migrations

### Payment Processing
- **Paystack**: Payment gateway for credit purchases
- **Integration**: Client-side inline checkout with server-side verification
- **Webhook**: `/api/wallet/paystack/webhook` for payment status updates

### Authentication
- **Passport.js**: Authentication middleware with LocalStrategy
- **Session Store**: PostgreSQL-backed sessions via connect-pg-simple
- **Security**: bcrypt for password hashing

### SMS Services
- No specific SMS provider hardcoded; designed for flexibility
- Admin configurable API settings in database
- Expected webhook integration for incoming messages

### Frontend Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation

### Build & Development Tools
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Type safety across frontend and backend
- **tsx**: TypeScript execution for Node.js
- **Drizzle Kit**: Database migration management