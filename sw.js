self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  // You can cache files here
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated!");
});

self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
  // You can intercept requests and serve cached responses
});
