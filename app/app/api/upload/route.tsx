import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
const {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_ACCESS_KEY_ID,
  CLOUDFLARE_SECRET_ACCESS_KEY,
} = process.env;

const endpoint: string = `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const accessKeyId: string = CLOUDFLARE_ACCESS_KEY_ID || "";
const secretAccessKey: string = CLOUDFLARE_SECRET_ACCESS_KEY || "";

const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  endpoint,
  region: "auto",
});

export async function GET() {
  const command = new PutObjectCommand({
    Body: "Hello World!",
    Bucket: "content",
    Key: "hello.txt",
  });

  try {
    const { ETag } = await s3.send(command);
    console.log(`File uploaded successfully. ${ETag}`);
    return new Response("File uploaded successfully.");
  } catch (err) {
    console.log("Error", err);
    return new Response("File upload failed.");
  }
}
