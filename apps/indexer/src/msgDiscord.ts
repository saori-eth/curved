import { config } from "dotenv";

config();

if (!process.env.DISCORD_WEBHOOK_URL) {
  console.warn("DISCORD_WEBHOOK_URL env variable is not set");
}

export async function msgDiscord(msg: string) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    return;
  }

  try {
    const res = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      body: JSON.stringify({ content: msg }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      console.error("Error sending discord message", res);
    }
  } catch (e) {
    console.error(e);
  }
}
