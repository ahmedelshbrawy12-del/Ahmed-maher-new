const V="custody-v8",SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
const SDK=[
 "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js",
 "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js",
 "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js",
 "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js"];
const NET_TIMEOUT=3500;
self.addEventListener("install",e=>{e.waitUntil(
 caches.open(V).then(c=>c.addAll(SHELL).then(()=>Promise.all(SDK.map(u=>c.add(u).catch(()=>{})))))
 .then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
function netFirst(r){
 return new Promise(resolve=>{
  let settled=false;
  const fromCache=()=>caches.match(r,{ignoreSearch:true}).then(h=>{if(!h)throw 0;return h});
  const upd=x=>{if(x&&x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x};
  const net=fetch(r).then(upd);
  const t=setTimeout(()=>{if(settled)return;settled=true;fromCache().then(resolve,()=>net.then(resolve,()=>resolve(Response.error())))},NET_TIMEOUT);
  net.then(x=>{
   if(settled)return;
   settled=true;clearTimeout(t);
   if(x&&x.ok)resolve(x);else fromCache().then(resolve,()=>resolve(x));
  }).catch(()=>{if(settled)return;settled=true;clearTimeout(t);fromCache().then(resolve,()=>resolve(Response.error()))});
 });
}
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET")return;
 if(u.origin===location.origin){e.respondWith(netFirst(r))}
 else if(u.hostname==="www.gstatic.com"||u.hostname==="cdnjs.cloudflare.com"){
  e.respondWith(caches.open(V).then(c=>c.match(r).then(h=>{const n=fetch(r).then(x=>{if(x&&x.ok)c.put(r,x.clone());return x}).catch(()=>h);return h||n})))}});

