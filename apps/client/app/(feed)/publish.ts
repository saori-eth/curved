"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { nanoidLowercase } from "@/lib/db/nanoid";
import { pendingContent } from "@/lib/db/schema";
import { s3, S3_BUCKET, S3_READ_ENDPOINT } from "@/lib/s3";

const PublishSchema = z.object({
  description: z.string(),
});

export type PublishData = z.infer<typeof PublishSchema>;

export async function publish(_data: PublishData) {
  const data = PublishSchema.parse(_data);

  const session = await getSession();
  if (!session) {
    console.error("No session");
    return;
  }

  try {
    // Check for existing pending content
    const post = await db.query.pendingContent.findFirst({
      columns: {
        publicId: true,
      },
      where: (row, { eq }) => eq(row.owner, session.user.address),
    });

    // Read publicId or generate a new one
    const publicId = post?.publicId ?? nanoidLowercase();
    const url = `${S3_READ_ENDPOINT}/posts/${publicId}`;

    // Create new or update pending content
    await db
      .insert(pendingContent)
      .values({
        description: data.description,
        owner: session.user.address,
        publicId,
        url,
      })
      .onDuplicateKeyUpdate({
        set: {
          description: data.description,
        },
      });

    const command = new PutObjectCommand({
      ACL: "public-read",
      Bucket: S3_BUCKET,
      Key: `posts/${publicId}`,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300,
    });

    console.log("Published", { description: data.description, url });

    return { contentUrl: url, uploadUrl };
  } catch (e) {
    console.error(e);
  }
}
