import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { nanoidLowercase } from "@/lib/db/nanoid";
import { pendingPost } from "@/lib/db/schema";
import { s3, S3_BUCKET, S3_READ_ENDPOINT } from "@/lib/s3";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Check for existing pending content
    const post = await db.query.pendingPost.findFirst({
      columns: {
        publicId: true,
      },
      where: (row, { eq }) => eq(row.userId, session.user.userId),
    });

    // Read publicId or generate a new one
    const publicId = post?.publicId ?? nanoidLowercase();
    const url = `${S3_READ_ENDPOINT}/posts/${publicId}`;

    if (!post) {
      await db.insert(pendingPost).values({
        publicId,
        url,
        userId: session.user.userId,
      });
    }

    const command = new PutObjectCommand({
      ACL: "public-read",
      Bucket: S3_BUCKET,
      Key: `posts/${publicId}`,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300,
    });

    return NextResponse.json(
      {
        uploadUrl,
        url,
      },
      {
        status: 201,
      },
    );
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
