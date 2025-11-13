const cacheName = "v1";

async function impl(e) {
    const req = e.request;

    // Only handle http(s) requests — skip chrome-extension, data, etc.
    if (!req.url.startsWith("http")) {
        return fetch(req);
    }

    const cache = await caches.open(cacheName);
    const cacheResponse = await cache.match(req);

    if (cacheResponse) {
        return cacheResponse;
    } else {
        const networkResponse = await fetch(req);
        cache.put(req, networkResponse.clone());
        return networkResponse;
    }
}

self.addEventListener("fetch", e => e.respondWith(impl(e)));


// ✅ 3.2 PUSH NOTIFICATION HANDLING
self.addEventListener("push", (e) => {
    // Get message text (may be null if no payload)
    const message = e.data?.text() || "Üres üzenet érkezett.";

    // Show the notification
    const promise = self.registration.showNotification("Chat Notification", {
        body: message
    });

    // Wait until the notification is displayed before finishing event
    e.waitUntil(promise);
});
