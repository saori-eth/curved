"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { nanoidLowercase } from "@/lib/db/nanoid";
import { pendingContent } from "@/lib/db/schema";
import { s3, S3_ENDPOINT } from "@/lib/s3";

const PublishSchema = z.object({
  description: z.string(),
  url: z.string(),
});

export type PublishData = z.infer<typeof PublishSchema>;

export async function publish(_data: PublishData) {
  const data = PublishSchema.parse(_data);

  const session = await getSession();
  if (!session) {
    return;
  }

  try {
    await db
      .insert(pendingContent)
      .values({
        description: data.description,
        owner: session.user.address,
        publicId: nanoidLowercase(),
        url: data.url,
      })
      .onDuplicateKeyUpdate({
        set: {
          description: data.description,
          url: data.url,
        },
      });

    const post = await db.query.pendingContent.findFirst({
      columns: {
        publicId: true,
      },
      where: (row, { eq }) => eq(row.owner, session.user.address),
    });

    if (!post) {
      return;
    }

    const command = new PutObjectCommand({
      ACL: "public-read",
      Bucket: "content",
      Key: `posts/${post.publicId}`,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300,
    });

    const contentUrl = `${S3_ENDPOINT}/content/posts/${post.publicId}`;

    console.log("Publishing to", contentUrl);

    return { contentUrl, uploadUrl };
  } catch (e) {
    console.error(e);
  }
}
