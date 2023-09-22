import { cache } from "react";

import { db } from "./db";

export type Profile = {
  username: string;
  avatar: string | null;
  address: string;
};

export const fetchProfile = cache(
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
