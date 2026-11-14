/* 每日记事本 · 今日启程 · 离线缓存（网络优先，断网回退）
 * 页面是单文件 HTML，缓存首页即可完整离线使用；天气接口不缓存，断网自动降级。 */
const CACHE = 'diaryToday-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) =>
    Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (u.hostname.includes('open-meteo.com') || u.hostname !== location.hostname) return;
  e.respondWith(fetch(e.request).catch(() => {
    if (e.request.mode === 'navigate') return caches.match('./');
    return caches.match(e.request).then((r) => r || Response.error());
  }));
});
