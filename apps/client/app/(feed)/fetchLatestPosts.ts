"use server";

import { z } from "zod";

import { db } from "@/lib/db";
import { Post } from "@/lib/fetchPost";

import { FEED_PAGE_SIZE } from "./constants";

const FetchLatestSchema = z.object({
  page: z.number().int().min(0),
  start: z.number().int().min(0).optional(),
});

type FetchLatestArgs = z.infer<typeof FetchLatestSchema>;

export async function fetchLatestPosts(
  _args: FetchLatestArgs,
): Promise<Post[]> {
  try {
    const args = FetchLatestSchema.parse(_args);

    let page = args.page;
    let offset = 0;

    if (args.start) {
      const latestShare = await db.query.content.findFirst({
        columns: {
          shareId: true,
        },
        orderBy: (row, { desc }) => [desc(row.shareId)],
      });

      if (!latestShare) {
        return [];
      }

      // latestShare is page 0, calculate what page we will find start on
      if (latestShare.shareId > args.start) {
        const diff = latestShare.shareId - args.start;
        page = Math.floor(diff / FEED_PAGE_SIZE);
        offset = diff % FEED_PAGE_SIZE;
      }
    }

    const data = await db.query.content.findMany({
      columns: {
        description: true,
        owner: true,
        shareId: true,
        url: true,
      },
      limit: FEED_PAGE_SIZE,
      offset: page * FEED_PAGE_SIZE + offset,
      orderBy: (row, { desc }) => [desc(row.shareId)],
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
      return [];
    }

    return data.map((row) => ({
      description: row.description ?? "",
      owner: {
        address: row.owner,
        avatar: row.owner.avatar,
        username: row.owner.username,
      },
      shareId: row.shareId,
      url: row.url,
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}
