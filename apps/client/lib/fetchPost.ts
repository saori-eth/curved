import { cache } from "react";

import { db } from "./db";

export type Post = {
  shareId: number;
  description: string;
  url: string;
  owner: {
    address: string;
    username: string;
    avatar: string;
  };
};

export const fetchPost = cache(
  async (id: string | number): Promise<Post | null> => {
    let shareId: number;

    if (typeof id === "string") {
      shareId = parseInt(id);
    } else {
      shareId = id;
    }

    if (isNaN(shareId)) {
      return null;
    }

    try {
      const data = await db.query.content.findFirst({
        columns: {
          description: true,
          owner: true,
          url: true,
        },
        where: (row, { eq }) => eq(row.shareId, shareId),
        with: {
          owner: {
            columns: {
              avatar: true,
              username: true,
            },
          },
        },
      });

      if (!data) {
        return null;
      }

      return {
        description: data.description ?? "",
        owner: {
          address: data.owner,
          avatar: data.owner.avatar ?? "",
          username: data.owner.username ?? "",
        },
        shareId,
        url: data.url,
      };
    } catch (error) {
      console.warn(error);
      return null;
    }
  },
);
