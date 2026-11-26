/* Service worker của trang khởi động KQCT-ANHK_CM.
 * Giúp Android (Chrome, Cốc Cốc, Edge, Samsung Internet) cài được như một ứng dụng:
 * có biểu tượng, tên KQCT-ANHK_CM, mở toàn màn hình.
 * Chỉ lưu sẵn trang khởi động và biểu tượng; KHÔNG lưu dữ liệu cán bộ (dữ liệu vẫn ở Google). */
var CACHE = 'kqct-khoidong-v1';
var FILES = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './favicon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;   // ứng dụng Google: không can thiệp
  // Mạng trước (luôn lấy bản mới), mất mạng thì dùng bản đã lưu
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
    return r;
  }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('./index.html'); }); }));
});
