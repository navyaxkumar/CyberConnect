import "dotenv/config";

const requiredEnvironment = [
  ["JWT_SECRET", "JWT_SECRET must be set and at least 32 characters long"],
  ["MONGO_URI", "MONGO_URI or MONGODB_URI must be set"],
];

export const validateEnvironment = () => {
  const missing = [];

  for (const [key, message] of requiredEnvironment) {
    if (key === "MONGO_URI") {
      if (!process.env.MONGO_URI && !process.env.MONGODB_URI) missing.push(message);
      continue;
    }

    if (!process.env[key]) missing.push(`${key} must be set`);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    missing.push("JWT_SECRET must be set and at least 32 characters long");
  }

  if (!process.env.CLIENT_URL) {
    missing.push("CLIENT_URL must be set");
  }

  if (missing.length > 0) {
    throw new Error(`Invalid environment configuration: ${missing.join("; ")}`);
  }

  if (process.env.JWT_EXPIRES_DAYS) {
    const expiry = Number(process.env.JWT_EXPIRES_DAYS);
    if (!Number.isInteger(expiry) || expiry < 1) {
      throw new Error("JWT_EXPIRES_DAYS must be a positive integer");
    }
  }
};

