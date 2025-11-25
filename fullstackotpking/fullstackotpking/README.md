# OTP King - Virtual SMS Numbers Platform

A comprehensive fullstack web application that provides virtual phone numbers for SMS verification and OTP reception. Deploy as a single unified service on Railway.

## Features

### User Features
- Browse virtual numbers by country
- Receive SMS on temporary numbers
- Track SMS history
- Manage credits and wallet
- Referral system for earning credits
- Redeem gift codes

### Admin Features
- Upload and manage phone number pools by country
- View system statistics and user activity
- Configure SMS API integrations
- Send notifications and announcements
- Create and manage gift codes
- Ban/unban user accounts
- Toggle maintenance mode

### Moderator Features
- Upload phone numbers by country
- View system statistics
- (Subset of admin functionality)

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** build tool with HMR
- **TanStack Query** for server state management
- **React Hook Form** + Zod for form validation
- **Wouter** for client-side routing
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Express.js** for HTTP server
- **Drizzle ORM** for database management
- **PostgreSQL** (Neon serverless)
- **Session-based authentication** with passport
- **bcrypt** for password hashing
- **JWT** for token generation (optional, session-based by default)

## Project Structure

```
fullstackotpking/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities (queryClient, hooks)
│   │   ├── App.tsx        # Main app component with routing
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   └── index.html         # HTML template
├── server/                # Express backend
│   ├── app.ts             # Express app setup
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   ├── db.ts              # Database connection
│   ├── index-dev.ts       # Development entry point
│   └── index-prod.ts      # Production entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Data models (Drizzle + Zod)
├── migrations/            # Database migrations
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
├── drizzle.config.ts      # Drizzle ORM config
└── .env.example           # Environment variables template
```

## Quick Start

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Push database schema**
   ```bash
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   - API: http://localhost:5000/api
   - Frontend: http://localhost:5000
   - Both served on same port (no CORS issues)

### Production Build & Deploy

1. **Build frontend**
   ```bash
   npm run build
   ```
   Frontend is bundled to `/dist`

2. **Start production server**
   ```bash
   npm start
   ```
   - Serves API from `/api` routes
   - Serves frontend static files from `/dist`
   - Both on single origin (e.g., https://your-app.railway.app)

## Deployment on Railway

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Railway Deploy

1. Push code to GitHub
2. Create Railway project with PostgreSQL
3. Set environment variables in Railway dashboard
4. Railway will automatically:
   - Install dependencies
   - Build frontend with `npm run build`
   - Start server with `npm start`

## API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Countries & Numbers
- `GET /api/countries` - List all countries
- `POST /api/countries/:id/number` - Get random number
- `POST /api/countries/:id/next-number` - Get another number

### SMS
- `GET /api/sms/:phoneNumber` - Check for new SMS
- `POST /api/sms/:phoneNumber/refresh` - Refresh SMS list

### User
- `GET /api/history` - Get user's number history
- `GET /api/profile` - Get user profile
- `POST /api/profile/update` - Update profile
- `GET /api/wallet` - Get wallet/credits info
- `GET /api/notifications` - Get user notifications

### Admin
- `GET /api/admin/users` - List all users
- `POST /api/admin/users/:id/ban` - Ban user
- `GET /api/admin/countries` - Manage countries
- `POST /api/admin/announcements` - Create announcement
- `GET /api/admin/statistics` - View stats
- `POST /api/admin/settings` - Update settings

## Database Schema

### Core Tables
- **users** - User accounts with credits, referral system
- **countries** - Country metadata and number pools
- **numberHistory** - Tracks number usage by users
- **smsMessages** - Received SMS messages
- **announcements** - Admin announcements
- **notifications** - User notifications
- **settings** - System configuration

## Environment Variables

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/dbname
PGHOST=host
PGPORT=5432
PGUSER=user
PGPASSWORD=password
PGDATABASE=dbname

# Authentication
SESSION_SECRET=your-session-secret-key

# Server
NODE_ENV=production
PORT=5000

# Optional
SMS_API_TOKEN=your-sms-api-token
```

## Authentication

### Session-Based (Default)
- Users authenticate with username/password
- Session stored in database
- Session cookie with secure, httpOnly flags
- No CORS issues since frontend and backend share origin

### How It Works in Production
1. Frontend and backend on same domain (e.g., railway.app)
2. User logs in → session created
3. Session stored in database (PostgreSQL)
4. Browser automatically includes session cookie
5. Express verifies session for protected routes

## Admin Credentials

**Default Admin Account**
- Username: `idledev`
- Password: `200715`

Change these in production!

## Rate Limiting

- **Number Fetching**: 10 requests per minute
- **SMS Checking**: 5 requests per minute

## Key Design Decisions

### Single Unified Deployment
- **Why**: Eliminates cross-domain authentication issues
- **Benefit**: Session cookies work perfectly, no CORS needed
- **Result**: Simpler, more reliable than separate deployments

### Session Authentication
- **Why**: Perfect for same-origin deployments
- **Benefit**: Secure, stateful, no JWT refresh token complexity
- **Trade-off**: Requires server-side session storage

### Monorepo Structure
- **Why**: Keep frontend and backend synchronized
- **Benefit**: Type-safe shared schemas, single deployment
- **Result**: Easier to maintain and debug

## Troubleshooting

### Development: "Cannot GET /"
Make sure you're hitting `http://localhost:5000`, not a different port.

### Production: "Cannot find module"
Run `npm install` and `npm run build` before `npm start`.

### Database Connection Error
Check `DATABASE_URL` and ensure PostgreSQL is accessible.

### Static Files Not Loading
Verify `npm run build` completed successfully and `/dist` exists.

## Performance Notes

- Frontend built once during `npm run build`
- Static files served directly by Express (fast)
- API responses cached with React Query
- Database queries optimized with proper indexes

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- Session cookies: secure, httpOnly, sameSite
- CSRF protection via session tokens
- Input validation with Zod schemas
- SQL injection prevented by Drizzle ORM
- Rate limiting on sensitive endpoints

## Support

For issues or questions:
- Check [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for deployment help
- Review [Railway Documentation](https://docs.railway.app/)
- Check server logs: `railway logs`

## License

MIT
