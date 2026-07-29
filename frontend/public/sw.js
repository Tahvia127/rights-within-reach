/* Rights Within Reach service worker — offline support for the static app.
 *
 * Strategy:
 *  - /api/* and cross-origin requests: pass straight to the network (never cached;
 *    the chat needs the live backend and fails gracefully offline).
 *  - navigations: network-first, fall back to the cached app shell so the SPA still
 *    boots offline (all topic/resource content is bundled client-side, so it works).
 *  - other same-origin GETs (JS/CSS/fonts/icons): stale-while-revalidate.
 */
const CACHE = 'rwr-v1'
const SHELL = '/'

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE).then((c) => c.add(SHELL)).catch(() => {}))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return   // let cross-origin (fonts, API) hit network
  if (url.pathname.startsWith('/api/')) return        // never cache API responses

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match(SHELL)))
    return
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
