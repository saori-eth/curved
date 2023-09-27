import type { Config } from "drizzle-kit";

import { env } from "./lib/env.mjs";

const secureUrl = env.DATABASE_URL.replace(
  "?sslaccept=strict",
  `?ssl={"rejectUnauthorized":true}`,
);

export default {
  dbCredentials: {
    connectionString: secureUrl as string,
  },
  driver: "mysql2",
  schema: "./lib/db/schema.ts",
} satisfies Config;
