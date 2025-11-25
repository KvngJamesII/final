# OTP King - Railway Deployment Guide

This is a unified fullstack application that can be deployed as a single service on Railway.

## Architecture

- **Backend**: Express.js server handling API routes
- **Frontend**: React + Vite (built and served as static files)
- **Database**: PostgreSQL (Neon)
- **Authentication**: Session-based authentication (no CORS issues since same origin)

## Deployment Steps

### 1. Create Railway Project
- Go to [Railway.app](https://railway.app)
- Create a new project
- Add PostgreSQL plugin
- Add Node.js service

### 2. Configure Environment Variables
Set these in Railway dashboard:

```
DATABASE_URL=postgresql://...
PGHOST=your-host
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your-password
PGDATABASE=railway
SESSION_SECRET=your-secret-key-change-this
NODE_ENV=production
PORT=3000
```

### 3. Deploy

#### Option A: Git Push (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
git push
```

#### Option B: Manual Deploy
```bash
# Build frontend
npm run build

# Deploy
railway up
```

### 4. Build Process

Railway will:
1. Run `npm install`
2. Run `npm run build` (which builds the frontend to `/dist`)
3. Run `npm start` (which starts the server in production mode)

### 5. How It Works

**Development**: `npm run dev`
- Starts Express server with Vite dev middleware
- Frontend served with HMR
- API and frontend on same port (5000)

**Production**: `npm start`
- Builds frontend with `npm run build` first
- Starts Express server
- Serves static frontend from `/dist`
- API routes under `/api`
- No CORS issues since frontend and backend are same origin

## Troubleshooting

### Database Connection Issues
```bash
# Push database schema
npm run db:push
```

### Static Files Not Serving
Check that:
1. `npm run build` completes successfully
2. `/dist` folder exists
3. `server/app.ts` has static file middleware configured

### Port Issues
Railway assigns a random port via `PORT` environment variable.
The app respects this: `const port = parseInt(process.env.PORT || '5000', 10);`

## Key Files

- `server/app.ts` - Express setup + static file serving
- `server/routes.ts` - API routes
- `server/index-dev.ts` - Development entry point
- `server/index-prod.ts` - Production entry point
- `vite.config.ts` - Frontend build config
- `package.json` - Unified dependencies

## Unified Deployment Benefits

1. **No CORS Issues** - Frontend and backend on same origin
2. **Session Cookies Work** - No cross-domain restrictions
3. **Simpler Architecture** - Single service to manage
4. **Better Performance** - No separate deployments needed
5. **Easier Debugging** - Network requests are local

## Admin Credentials

Username: `idledev`
Password: `200715`

## Support

For Railway-specific issues, see [Railway Docs](https://docs.railway.app/)
