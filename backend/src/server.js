import "dotenv/config";
import dns from "node:dns";
import app from "./app.js";
import connectDB from "./config/db.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be set and at least 32 characters long");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();