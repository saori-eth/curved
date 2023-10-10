import { sendNotification } from "@/lib/push/webpush";
export function GET() {
  sendNotification("0x7789818791c12a2633e88d46457230bC1D9cd110", {
    title: "Hello",
    body: "Hello, world!",
    icon: "/images/android-chrome-192x192.png",
    url: "/",
  });

  return new Response("OK");
}
