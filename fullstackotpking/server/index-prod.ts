import dotenv from "dotenv";
import express from "express";
import runApp from "./app";

dotenv.config();

// Production mode: Serve static frontend + API
// Both frontend and backend are served from the same Express server
export async function serveStatic(app: express.Express, _server: any) {
  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "Backend is running!" });
  });
}

(async () => {
  await runApp(serveStatic);
})();
