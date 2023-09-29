import { S3_READ_ENDPOINT } from "./s3";

export function getAvatarUrl(avatarId: string | null) {
  if (!avatarId) {
    return null;
  }

  return `${S3_READ_ENDPOINT}/avatars/${avatarId}`;
}
