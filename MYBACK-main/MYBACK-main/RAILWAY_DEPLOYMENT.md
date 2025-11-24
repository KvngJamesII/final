# OTP King Backend - Railway Deployment Guide

## Prerequisites
- Railway account (https://railway.app)
- GitHub account with this repo
- Supabase PostgreSQL connection string

## Step 1: Connect GitHub to Railway

1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Connect your GitHub account
4. Select this repository
5. Click **"Deploy Now"**

## Step 2: Configure Environment Variables

Once the project is created in Railway:

1. Go to your Railway project
2. Click **"Variables"** tab
3. Add these environment variables:

```
DATABASE_URL=postgresql://postgres.wmexjnwdfwegodysvzog:isr828u2@aws-1-eu-north-1.pooler.supabase.com:6543/postgres
SESSION_SECRET=f7648ae3e403cc9fafe3a6521f8c4664a69c6e51423ab501c978d31a675fbf48
VITE_PAYSTACK_KEY=pk_live_efa6b01e6086e21bda6762026dcaec02dd4f669a
PAYSTACK_KEY=pk_live_efa6b01e6086e21bda6762026dcaec02dd4f669a
```

## Step 3: Create a Procfile

Create a file named `Procfile` in the root with:

```
web: node --require dotenv/config server/index-prod.js
```

(Railway will automatically build and transpile your TypeScript)

## Step 4: Update package.json Scripts

Railway needs a build script. Add to `package.json`:

```json
"scripts": {
  "build": "tsc server/index-prod.ts --outDir dist --skipLibCheck",
  "start": "node dist/server/index-prod.js"
}
```

## Step 5: Deploy

1. Railway automatically deploys on push to your GitHub main branch
2. Wait for the build to complete
3. Once deployed, Railway will give you a public URL
4. Your backend is live! 🎉

## Testing the Backend

Once deployed, test with:

```bash
curl https://your-railway-url/api/maintenance
```

You should get: `{"enabled":false}`

## Getting Your Railway Backend URL

1. In Railway dashboard, click your service
2. Click **"Settings"**
3. Copy your **Public URL** (looks like: `https://your-app-xyzabc.railway.app`)
4. **Save this URL** - you'll need it for Vercel frontend deployment

## Troubleshooting

- **Build fails**: Check "Deployments" tab for logs
- **Connection error**: Verify DATABASE_URL is correct
- **Port issues**: Railway automatically assigns PORT env var (we use 5000)

## Next Steps

Once your backend is deployed:
1. Get the public URL from Railway
2. Deploy frontend to Vercel
3. Configure frontend to use Railway backend URL as API base
