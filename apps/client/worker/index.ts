export {};
declare let self: ServiceWorkerGlobalScope;

const version = "1.0.0";

//@ts-expect-error
self.__WB_DISABLE_DEV_LOGS = true;

// Install service worker
self.addEventListener("install", (event: any) => {
  console.log(`Service worker ${version} installed...`);
  event.waitUntil(
    caches.open("notification-assets").then((cache) => {
      return cache.addAll(["/images/android-chrome-192x192.png"]);
    }),
  );
});

self.addEventListener("activate", (event: any) => {
  console.log(`Service worker ${version} activated...`);
});

// Fetch event
self.addEventListener("push", (event: any) => {
  const data = event.data.json();
  console.log("Push received...");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/images/android-chrome-192x192.png",
  });
});
