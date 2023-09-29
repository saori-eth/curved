"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq } from "drizzle-orm";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { nanoidLowercase } from "@/lib/db/nanoid";
import { user } from "@/lib/db/schema";
import { s3, S3_BUCKET } from "@/lib/s3";

export async function getAvatarUpload() {
  const session = await getSession();

  if (!session) {
    return { uploadUrl: null };
  }

  let avatarId = session.user.avatarId;

  // Create avatarId if it doesn't exist
  if (!avatarId) {
    avatarId = nanoidLowercase();

    await db
      .update(user)
      .set({
        avatarId,
      })
      .where(eq(user.id, session.user.userId));
  }

  const command = new PutObjectCommand({
    ACL: "public-read",
    Bucket: S3_BUCKET,
    Key: `avatars/${avatarId}`,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 300,
  });

  return {
    uploadUrl,
  };
}
