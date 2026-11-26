import dns from "node:dns";
import app from "./app.js";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import { validateEnvironment } from "./config/env.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
try {
  validateEnvironment();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing server gracefully.`);
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await mongoose.disconnect();
  process.exit(0);
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));