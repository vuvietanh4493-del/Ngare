/* Ngã rẽ: Thành phố — bộ nhớ đệm để chơi offline */
var V='ngare-14b64abcfb',FONTS='ngare-fonts';
var CORE=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('ngare-')===0&&k!==V&&k!==FONTS}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function timeout(p,ms){return new Promise(function(res,rej){var t=setTimeout(function(){rej(new Error('timeout'))},ms);p.then(function(v){clearTimeout(t);res(v)},function(er){clearTimeout(t);rej(er)})})}
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(function(c){return c.match(r).then(function(hit){var net=fetch(r).then(function(res){c.put(r,res.clone());return res}).catch(function(){return hit||new Response('',{status:504})});return hit||net})}));return;
  }
  if(u.origin!==self.location.origin)return;
  if(r.mode==='navigate'){
    e.respondWith(timeout(fetch(r),4000).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put('./index.html',cp)})}return res}).catch(function(){return caches.match('./index.html').then(function(h){return h||caches.match('./')})}));return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(h){return h||fetch(r)}));
});
