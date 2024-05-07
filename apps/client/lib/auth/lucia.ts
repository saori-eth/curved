import "lucia/polyfill/node";

import { planetscale } from "@lucia-auth/adapter-mysql";
import { twitter } from "@lucia-auth/oauth/providers";
import {
  AUTH_KEY_TABLE_NAME,
  AUTH_SESSION_TABLE_NAME,
  AUTH_USER_TABLE_NAME,
} from "db";
import { lucia } from "lucia";
import { nextjs } from "lucia/middleware";

import { planetscaleConnection } from "../db/";
import { env } from "../env.mjs";
import { getAvatarUrl } from "../getAvatarUrl";
import { SESSION_COOKIE_NAME } from "./constants";

const adapter = planetscale(planetscaleConnection, {
  key: AUTH_KEY_TABLE_NAME,
  session: AUTH_SESSION_TABLE_NAME,
  user: AUTH_USER_TABLE_NAME,
});

export const luciaEnv =
  env.NEXT_PUBLIC_NODE_ENV === "development" ? "DEV" : "PROD";

export const auth = lucia({
  adapter,
  env: luciaEnv,
  getUserAttributes: (data) => {
    return {
      address: data.address as `0x${string}`,
      avatar: getAvatarUrl(data.avatarId),
      avatarId: data.avatarId,
      twitterUsername: data.twitterUsername,
      username: data.username,
    };
  },
  middleware: nextjs(),
  sessionCookie: {
    expires: false,
    name: SESSION_COOKIE_NAME,
  },
});

export const twitterAuth = twitter(auth, {
  clientId: env.TWITTER_CLIENT_ID,
  clientSecret: env.TWITTER_CLIENT_SECRET,
  redirectUri: "https://yuyu.social/api/auth/methods/twitter/callback",
  scope: ["users.read"],
});

export type Auth = typeof auth;
