import { cache } from "react";

import { db } from "./db";
import { getAvatarUrl } from "./getAvatarUrl";

export type Post = {
  shareId: number;
  createdAt: string;
  description: string;
  url: string;
  owner: {
    address: string;
    username: string | null;
    avatar: string | null;
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
          createdAt: true,
          description: true,
          owner: true,
          url: true,
        },
        where: (row, { eq }) => eq(row.shareId, shareId),
        with: {
          owner: {
            columns: {
              avatarId: true,
              username: true,
            },
          },
        },
      });

      if (!data) {
        return null;
      }

      return {
        createdAt: data.createdAt.toISOString(),
        description: data.description ?? "",
        owner: {
          address: data.owner,
          avatar: getAvatarUrl(data.owner.avatarId),
          username: data.owner.username,
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
