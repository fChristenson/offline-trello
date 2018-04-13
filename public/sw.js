var CACHE_NAME = "my-site-cache-v1";
var urlsToCache = [
  "/",
  "/board",
  "/main.css",
  "/elements.js",
  "/store.js",
  "/main.js"
];

self.addEventListener("install", async event => {
  const cache = await caches.open(CACHE_NAME);
  console.log("Opened cache");
  await cache.addAll(urlsToCache);
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("message", async function(event) {
  console.log(event);
  console.log("--------------------------");
  if (event.boardState) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put("http://localhost:3000/board", event.data);
  }
});
