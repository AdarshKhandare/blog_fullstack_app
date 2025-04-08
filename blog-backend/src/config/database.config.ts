import { registerAs } from "@nestjs/config";

export default registerAs("database", () => {
  // Default to localhost for development
  let dbHost = "localhost";

  // Check if running in Docker environment
  if (process.env.NODE_ENV === "production") {
    // Use the service name defined in docker-compose
    dbHost = "mongodb";
  }

  const dbUrl = `mongodb://${dbHost}:27017/blog_db`;

  // Override with env var if explicitly provided
  return {
    url: process.env.DATABASE_URL || dbUrl,
  };
});
