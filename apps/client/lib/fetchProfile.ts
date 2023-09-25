import { cache } from "react";

import { db } from "./db";

export type Profile = {
  username: string;
  avatar: string | null;
  address: string;
};

export const fetchProfileFromAddress = cache(
  async (address: string): Promise<Profile | null> => {
    try {
      const data = await db.query.user.findFirst({
        columns: { avatar: true, username: true },
        where: (row, { eq }) => eq(row.address, address),
      });

      if (!data) {
        return null;
      }

      return {
        address,
        avatar: data.avatar,
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
        columns: { address: true, avatar: true },
        where: (row, { eq }) => eq(row.username, username),
      });

      if (!data) {
        return null;
      }

      return {
        address: data.address,
        avatar: data.avatar,
        username,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);
