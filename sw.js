// Offline cache for PDF Rotate and OCR. The version changes automatically when any file changes.
const CACHE = "pdftool-0e89560a53";
const ASSETS = [
  "./",
  "icons/icon-192.png",
  "icons/icon-512-maskable.png",
  "icons/icon-512.png",
  "index.html",
  "lib/lang/eng.traineddata.gz",
  "lib/lang/hin.traineddata.gz",
  "lib/lang/mar.traineddata.gz",
  "lib/pdf-lib.min.js",
  "lib/pdf.min.js",
  "lib/pdf.worker.min.js",
  "lib/standard_fonts/FoxitDingbats.pfb",
  "lib/standard_fonts/FoxitFixed.pfb",
  "lib/standard_fonts/FoxitFixedBold.pfb",
  "lib/standard_fonts/FoxitFixedBoldItalic.pfb",
  "lib/standard_fonts/FoxitFixedItalic.pfb",
  "lib/standard_fonts/FoxitSerif.pfb",
  "lib/standard_fonts/FoxitSerifBold.pfb",
  "lib/standard_fonts/FoxitSerifBoldItalic.pfb",
  "lib/standard_fonts/FoxitSerifItalic.pfb",
  "lib/standard_fonts/FoxitSymbol.pfb",
  "lib/standard_fonts/LICENSE_FOXIT",
  "lib/standard_fonts/LICENSE_LIBERATION",
  "lib/standard_fonts/LiberationSans-Bold.ttf",
  "lib/standard_fonts/LiberationSans-BoldItalic.ttf",
  "lib/standard_fonts/LiberationSans-Italic.ttf",
  "lib/standard_fonts/LiberationSans-Regular.ttf",
  "lib/tesseract-core/tesseract-core-lstm.wasm.js",
  "lib/tesseract-core/tesseract-core-simd-lstm.wasm.js",
  "lib/tesseract-worker.min.js",
  "lib/tesseract.min.js",
  "manifest.webmanifest"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("pdftool-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" && req.method !== "HEAD") return;
  if (new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    let res = await cache.match(req, { ignoreSearch: true, ignoreMethod: true });
    if (res) return res;
    if (req.mode === "navigate") {
      res = await cache.match("index.html");
      if (res) return res;
    }
    return fetch(req);
  })());
});
