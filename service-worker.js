const CACHE='ffz-gestao-v9-sync-promote';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.svg','./icon-512.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  // Nunca cacheia chamadas do backend; deixa o app decidir quando usar o cache local.
  if(url.searchParams.has('action')) return;
  e.respondWith(
    caches.match(req).then(cached=>cached || fetch(req).then(res=>{
      const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return res;
    }).catch(()=>caches.match('./index.html')))
  );
});
