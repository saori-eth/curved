export {};
declare let self: ServiceWorkerGlobalScope;

//@ts-ignore
self.__WB_DISABLE_DEV_LOGS = true;

// Install service worker
self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open("notification-assets").then((cache) => {
      return cache.addAll(["/images/android-chrome-192x192.png"]);
    }),
  );
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
