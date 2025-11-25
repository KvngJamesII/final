# OTP King - Virtual SMS Numbers Platform

## Overview

OTP King is a fullstack web application that provides virtual phone numbers for SMS verification and OTP reception. The platform operates as a unified service where users can browse virtual numbers by country, receive SMS messages on temporary numbers, manage credits, and use a referral system. The application includes separate interfaces for regular users, moderators, and administrators, with comprehensive wallet and payment integration through Paystack.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Structure

**Monolithic Fullstack Architecture**: The application is built as a single unified service combining frontend and backend, deployed together rather than as separate services. This eliminates CORS issues and simplifies deployment on platforms like Railway.

- **Development Mode**: Vite dev server with HMR for the React frontend, Express API server with hot reload
- **Production Mode**: Express serves both the built static React files and API endpoints from a single process

### Frontend Architecture

**React SPA with TypeScript**: The client is a single-page application using modern React patterns.

- **Build Tool**: Vite with React plugin for fast HMR and optimized production builds
- **Routing**: Wouter for lightweight client-side routing (alternative to React Router)
- **State Management**: 
  - TanStack Query (React Query) for server state management, caching, and data synchronization
  - React Hook Form for form state with Zod validation schemas
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for theming
- **Icons**: Lucide React icon library

**Design System**: Custom CSS variables in `index.css` define a complete design system with light/dark mode support, including color tokens, spacing, shadows, and typography scales.

### Backend Architecture

**Express.js API Server**: RESTful API built with Node.js and TypeScript.

- **Authentication**: Session-based authentication using JWT tokens stored in HTTP-only cookies (no localStorage)
- **Password Security**: bcrypt for password hashing with salt rounds
- **Rate Limiting**: Express rate limiter to prevent abuse on sensitive endpoints
- **Request Validation**: Zod schemas for runtime type checking and validation

**Storage Layer**: In-memory storage interface (`storage.ts`) abstracts database operations, making it easy to swap implementations.

- Current implementation uses Drizzle ORM with PostgreSQL
- All database queries go through the storage interface methods
- Supports transactions, relations, and complex queries

### Database Architecture

**PostgreSQL with Drizzle ORM**: Type-safe SQL query builder and schema management.

- **Schema Definition**: Single source of truth in `shared/schema.ts` using Drizzle's schema builder
- **Migrations**: Managed through drizzle-kit with migration files in `migrations/` directory
- **Database Provider**: Neon serverless PostgreSQL for production (connection pooling built-in)
- **Connection**: Node.js pg driver with connection pooling

**Key Tables**:
- `users`: User accounts with credits, referral codes, roles (admin/moderator), ban status
- `countries`: Available countries with phone number pools stored as newline-separated text
- `number_history`: Tracks which users have used which phone numbers
- `sms_messages`: Stores received SMS messages linked to phone numbers
- `announcements`: System-wide announcements shown in a banner
- `notifications`: User notifications and broadcast messages
- `settings`: Key-value store for application configuration
- `wallet_transactions`: Payment and credit transaction history
- `gift_codes`: Redeemable codes for credits

### Role-Based Access Control

**Three User Levels**:
- **Regular Users**: Browse numbers, receive SMS, manage wallet, use referral system
- **Moderators**: Upload phone numbers by country, view system statistics (subset of admin features)
- **Administrators**: Full system control including user management, API configuration, maintenance mode, gift codes

**Implementation**: Role checks implemented at both route level (middleware) and UI level (conditional rendering).

### Payment Integration

**Paystack Gateway**: Credit purchases through Paystack's inline payment widget.

- Frontend loads Paystack SDK via CDN script tag in `index.html`
- Backend verifies payment webhooks and transaction references
- Wallet transactions table records all credit movements (purchases, usage, referrals)

### File Upload & Number Management

**Phone Number Storage**: Numbers stored as newline-separated text files within the database (text column).

- Admin/moderator uploads CSV/text files of phone numbers
- Numbers parsed and stored in `countries.numbersFile` field
- System tracks total vs. used numbers per country
- Used numbers marked in `number_history` to prevent reuse

### Maintenance Mode

**System-Wide Toggle**: Administrators can enable maintenance mode through settings.

- When enabled, shows maintenance page to all non-admin users
- Implemented via `settings` table with key-value lookup
- Frontend checks maintenance status and redirects accordingly

### API Design Patterns

**RESTful Endpoints**: Standard REST conventions with clear resource naming.

- `/api/auth/*` - Authentication (login, signup, logout, session)
- `/api/countries/*` - Country and number management
- `/api/history` - User's number usage history
- `/api/sms/*` - SMS message retrieval
- `/api/wallet/*` - Credit purchases and transactions
- `/api/notifications/*` - User notifications
- `/api/admin/*` - Administrative functions

**Error Handling**: Consistent error responses with appropriate HTTP status codes and descriptive messages.

## External Dependencies

### Third-Party Services

**Neon PostgreSQL**: Serverless PostgreSQL database with automatic scaling and connection pooling. Connection configured via `DATABASE_URL` environment variable.

**Paystack**: Payment gateway for credit purchases. Requires Paystack public and secret keys configured in environment variables.

### Key NPM Packages

**Backend**:
- `express` - HTTP server framework
- `drizzle-orm` - Type-safe ORM for PostgreSQL
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT token generation
- `express-rate-limit` - API rate limiting
- `axios` - HTTP client for external API calls
- `zod` - Schema validation

**Frontend**:
- `react` - UI framework
- `@tanstack/react-query` - Server state management
- `wouter` - Client-side routing
- `react-hook-form` - Form state management
- `@radix-ui/*` - Unstyled accessible UI primitives
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant styling
- `lucide-react` - Icon library

**Build Tools**:
- `vite` - Frontend build tool and dev server
- `typescript` - Type safety
- `tsx` - TypeScript execution for Node.js
- `drizzle-kit` - Database migration tool

### Environment Configuration

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - JWT signing secret
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default 3000)
- Paystack credentials for payment processing