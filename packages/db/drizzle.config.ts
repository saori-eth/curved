import type { Config } from "drizzle-kit";

const secureUrl =
  process.env.DATABASE_URL?.replace(
    "?sslaccept=strict",
    `?ssl={"rejectUnauthorized":true}`,
  ) ?? "";

if (!secureUrl) {
  throw new Error("DATABASE_URL is not defined");
}

export default {
  dbCredentials: {
    connectionString: secureUrl,
  },
  driver: "mysql2",
  schema: "../../packages/db/src/schema.ts",
} satisfies Config;
