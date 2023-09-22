import { S3Client } from "@aws-sdk/client-s3";

const {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_ACCESS_KEY_ID,
  CLOUDFLARE_SECRET_ACCESS_KEY,
} = process.env;

if (!CLOUDFLARE_ACCOUNT_ID) {
  console.warn("Missing CLOUDFLARE_ACCOUNT_ID");
}

const accessKeyId = CLOUDFLARE_ACCESS_KEY_ID || "";
const secretAccessKey = CLOUDFLARE_SECRET_ACCESS_KEY || "";

export const S3_ENDPOINT = `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
export const S3_BUCKET = "curved";

export const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  endpoint: S3_ENDPOINT,
  region: "auto",
});
