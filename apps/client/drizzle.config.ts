import type { Config } from "drizzle-kit";
const { MODE, DEV_DATABASE_URL, DATABASE_URL } = process.env;
console.log(`
  MODE: ${MODE}
  DEV_DATABASE_URL: ${DEV_DATABASE_URL}
  DATABASE_URL: ${DATABASE_URL}
`);

const dbUrl = DEV_DATABASE_URL;
const secureUrl = dbUrl?.replace(
  "?sslaccept=strict",
  `?ssl={"rejectUnauthorized":true}`,
);

console.log("secureUrl", secureUrl);

export default {
  dbCredentials: {
    connectionString: secureUrl as string,
  },
  driver: "mysql2",
  schema: "./lib/db/schema.ts",
} satisfies Config;
