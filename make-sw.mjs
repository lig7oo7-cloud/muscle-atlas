import {createHash} from 'node:crypto';
import {readdirSync,readFileSync,writeFileSync} from 'node:fs';

const home='/';
const files=['/manifest.webmanifest','/icon.svg','/icon192.png','/icon512.png',
  ...readdirSync('dist/assets').map(name=>'/assets/'+name)];
const hash=createHash('sha256');
for(const path of ['/index.html',...files])hash.update(readFileSync('dist'+path));
const name='muscle-atlas-'+hash.digest('hex').slice(0,20);

writeFileSync('dist/sw.js',`const cacheName=${JSON.stringify(name)};
const home=${JSON.stringify(home)};
const paths=${JSON.stringify(files)};
async function installApp(){
  const cache=await caches.open(cacheName);
  const response=await fetch(home,{cache:'reload',redirect:'error'});
  if(!response.ok||response.redirected||!response.headers.get('content-type')?.includes('text/html')){
    throw new Error('Could not cache the application home');
  }
  await cache.addAll(paths);
  await cache.put(home,response);
  await self.skipWaiting();
}
self.addEventListener('install',event=>{
  event.waitUntil(installApp());
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(name=>name.startsWith('muscle-atlas-')&&name!==cacheName).map(name=>caches.delete(name)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const {request}=event;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  const path=url.pathname;
  if(request.mode==='navigate'&&path===home){
    event.respondWith(caches.open(cacheName).then(cache=>cache.match(home)).catch(()=>null)
      .then(response=>response?.ok&&!response.redirected?response:fetch(request)));
    return;
  }
  if(paths.includes(path)){
    event.respondWith(caches.open(cacheName).then(cache=>cache.match(path)).catch(()=>null)
      .then(response=>response||fetch(request)));
  }
});
`);
