import { nftPost, pendingPost, post, trade } from "db";
import { eq } from "drizzle-orm";
import { ethers } from "ethers";

import { db } from "./DB";
import { nanoidLowercase } from "./nanoid";

export async function insertShare(event: ethers.Event) {
  const args = event.args;
  if (!args) {
    throw new Error("No args found in event");
  }

  const owner = args[0].toLowerCase() as string;
  const shareId = args[1].toNumber() as number;

  const pending = await db.query.pendingPost.findFirst({
    where: (row, { like }) => like(row.owner, owner),
  });

  if (!pending) {
    console.log("No pending content found. Ignoring onchain event.");
    // TODO: Add share + uri to content table
    return;
  }

  const publicId = nanoidLowercase();

  await db.transaction(async (tx) => {
    // Insert post
    await tx.insert(post).values({
      owner,
      publicId,
      type: "post",
    });

    await tx.insert(nftPost).values({
      caption: pending.caption,
      postId: publicId,
      shareId,
      url: pending.url,
    });

    await tx.delete(pendingPost).where(eq(pendingPost.owner, owner));

    // Insert Trade
    const tradeEntry = {
      amount: 1,
      hash: event.transactionHash,
      owner: owner.toLowerCase(),
      price: BigInt(0),
      shareId: shareId,
      side: 0,
      supply: 1,
      trader: owner.toLowerCase(),
    };

    await tx.insert(trade).values(tradeEntry);
  });

  // Revalidate
  const user = await db.query.user.findFirst({
    columns: {
      username: true,
    },
    where: (row, { like }) => like(row.address, owner),
  });

  const paths = [`/post/${publicId}`, "/"];

  if (user) {
    paths.push(`/@${user.username}`);
  }

  await Promise.all(
    paths.map(async (path) => {
      const url = `${process.env.DEPLOYED_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=${path}`;
      console.log("Revalidating", url);
      await fetch(url, { method: "POST" });
    }),
  );
}
