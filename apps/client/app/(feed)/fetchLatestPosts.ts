"use server";

import { z } from "zod";

import { db } from "@/lib/db";
import { Post } from "@/lib/fetchPost";

const PAGE_SIZE = 3;

const FetchLatestSchema = z.object({
  page: z.number().int().min(0),
  start: z.number().int().min(0).optional(),
});

type FetchLatestArgs = z.infer<typeof FetchLatestSchema>;

export async function fetchLatestPosts(
  _args: FetchLatestArgs
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
        page = Math.floor(diff / PAGE_SIZE);
        offset = diff % PAGE_SIZE;
      }
    }

    const data = await db.query.content.findMany({
      columns: {
        description: true,
        owner: true,
        shareId: true,
        url: true,
      },
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE + offset,
      orderBy: (row, { desc }) => [desc(row.shareId)],
    });

    if (!data) {
      return [];
    }

    return data.map((row) => ({
      description: row.description ?? "",
      owner: row.owner,
      shareId: row.shareId,
      url: row.url,
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}
