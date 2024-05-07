import { cache } from "react";

import { db } from "./db";
import { getAvatarUrl } from "./getAvatarUrl";

export type Profile = {
  username: string;
  twitterUsername: string | null;
  avatar: string | null;
  address: string;
};

export const fetchProfileFromAddress = cache(
  async (address: string): Promise<Profile | null> => {
    try {
      const data = await db.query.user.findFirst({
        columns: { avatarId: true, twitterUsername: true, username: true },
        where: (row, { eq }) => eq(row.address, address),
      });

      if (!data) {
        return null;
      }

      return {
        address,
        avatar: getAvatarUrl(data.avatarId),
        twitterUsername: data.twitterUsername,
        username: data.username,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);

export const fetchProfileFromUsername = cache(
  async (username: string): Promise<Profile | null> => {
    try {
      const data = await db.query.user.findFirst({
        columns: { address: true, avatarId: true, twitterUsername: true },
        where: (row, { eq }) => eq(row.username, username),
      });

      if (!data) {
        return null;
      }

      return {
        address: data.address,
        avatar: getAvatarUrl(data.avatarId),
        twitterUsername: data.twitterUsername,
        username,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);
