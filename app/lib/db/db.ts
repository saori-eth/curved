import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "./schema";

const { MODE, DEV_DATABASE_URL, DATABASE_URL } = process.env;

const dbUrl = MODE === "dev" ? DEV_DATABASE_URL : DATABASE_URL;

const secureUrl = dbUrl?.replace(
  "?sslaccept=strict",
  `?ssl={"rejectUnauthorized":true}`,
);

export const planetscaleConnection = connect({ url: secureUrl });
export const db = drizzle(planetscaleConnection, { schema });
