const V="custody-v6",SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET")return;
 if(u.origin===location.origin){
  e.respondWith(fetch(r).then(x=>{if(x&&x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r,{ignoreSearch:true})))}
 else if(u.hostname==="www.gstatic.com"){
  e.respondWith(caches.open(V).then(c=>c.match(r).then(h=>{const n=fetch(r).then(x=>{if(x&&x.ok)c.put(r,x.clone());return x}).catch(()=>h);return h||n})))}});
