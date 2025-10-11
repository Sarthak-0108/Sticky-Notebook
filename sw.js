const cacheName = "PiNOte/v-1.1";
const CACHE_FILES = [
  "index.html",
  "style.css",
  "script.js",
  "png/notes.png",
  "png/android-icon-192x192.png",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  // You can cache files here
  // event.waitUntil(
  //   (async () => {
  //     const cache = await caches.open(cacheName);
  //     console.log("caching files");
  //     await cache.addAll(CACHE_FILES);
  //   })()
  // );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated!");
  // event.waitUntil(
  //   caches.keys().then((keyList) =>
  //     Promise.all(
  //       keyList.map((key) => {
  //         if (key === cacheName) {
  //           return undefined;
  //         }
  //         return caches.delete(key);
  //       })
  //     )
  //   )
  // );
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      if (cacheNames.length === 0) {
        console.log("No cache found, skipping deletion.");
        return; // nothing to delete
      }
      console.log("Deleting old caches...");
      return Promise.all(cacheNames.map((cache) => caches.delete(cache)));
    })
  );
});

// self.addEventListener("fetch", (event) => {
// You can intercept requests and serve cached responsesis
// const url = new URL(event.request.url);
// if (
//   url.hostname.includes("google-analytics.com") ||
//   url.hostname.includes("cohere.ai") ||
//   url.hostname.includes("gemini.googleapis.com")
// ) {
//   return;
// }
// event.respondWith(
//   (async () => {
//     try {
//       const r = await caches.match(event.request);
//       console.log("fetching request");
//       if (r) return r;
//       const response = await fetch(event.request);
//       console.log(response);
//       const cache = await caches.open(cacheName);
//       console.log("caching new resource");
//       await cache.put(event.request, response.clone());
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   })()
// );
// });
