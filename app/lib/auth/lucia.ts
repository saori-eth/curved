import "lucia/polyfill/node";

import { planetscale } from "@lucia-auth/adapter-mysql";
import { lucia } from "lucia";
import { nextjs } from "lucia/middleware";

import { planetscaleConnection } from "../db/";
import {
  AUTH_KEY_TABLE_NAME,
  AUTH_SESSION_TABLE_NAME,
  AUTH_USER_TABLE_NAME,
} from "../db/constants";
import { SESSION_COOKIE_NAME } from "./constants";

const adapter = planetscale(planetscaleConnection, {
  key: AUTH_KEY_TABLE_NAME,
  session: AUTH_SESSION_TABLE_NAME,
  user: AUTH_USER_TABLE_NAME,
});

export const luciaEnv = process.env.NODE_ENV === "development" ? "DEV" : "PROD";

export const auth = lucia({
  adapter,
  env: luciaEnv,
  getUserAttributes: (data) => {
    return {
      address: data.address,
      avatar: data.avatar,
      username: data.username,
    };
  },
  middleware: nextjs(),
  sessionCookie: {
    expires: false,
    name: SESSION_COOKIE_NAME,
  },
});

export type Auth = typeof auth;
