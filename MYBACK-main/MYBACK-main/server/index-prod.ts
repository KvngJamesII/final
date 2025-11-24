import dotenv from "dotenv";
import express from "express";
import runApp from "./app";

dotenv.config();

// Backend-only mode: No static file serving
// Frontend is deployed separately on Vercel
// CORS is handled in app.ts middleware
export async function serveStatic(app: express.Express, _server: any) {
  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "Backend is running!" });
  });
}

(async () => {
  await runApp(serveStatic);
})();
