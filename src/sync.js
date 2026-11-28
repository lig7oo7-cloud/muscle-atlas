// VPS 자동 저장: 기록이 바뀔 때마다 전체 기록을 서버에 올리고, 앱을 켤 때 서버 기록을 받아온다.
import {combineBackup,currentBackup,validatedBackup} from './recordBackup.js';
import {writeRestored,workoutKey} from './recordStorage.js';

const CONFIG='muscle-atlas-sync';
export const DEFAULT_SYNC_URL='https://muscle.187-52-122-30.sslip.io';
const events=new EventTarget();
let timer=null, running=null, again=false, status={state:'idle',message:''};

export function syncConfig(){
  try{const c=JSON.parse(localStorage.getItem(CONFIG));return c&&typeof c==='object'?c:{}}catch{return {}}
}
function saveConfig(patch){
  const next={...syncConfig(),...patch};
  localStorage.setItem(CONFIG,JSON.stringify(next));
  events.dispatchEvent(new Event('change'));
  return next;
}
function setStatus(state,message=''){status={state,message};events.dispatchEvent(new Event('change'))}
export const syncStatus=()=>status;
export function onSyncChange(fn){events.addEventListener('change',fn);return ()=>events.removeEventListener('change',fn)}
export const syncEnabled=()=>{const c=syncConfig();return !!(c.url&&c.key)};

const isEmpty=b=>!(b.workouts.logs||[]).length&&!(b.workouts.custom||[]).length&&!Object.values(b.mobility||{}).flat().length;

async function api(method,route,body,config=syncConfig()){
  const response=await fetch(config.url.replace(/\/+$/,'')+route,{method,
    headers:{'Content-Type':'application/json','X-Sync-Key':config.key},
    body:body===undefined?undefined:JSON.stringify(body)});
  let json={};try{json=await response.json()}catch{}
  if(response.status===409)throw Object.assign(new Error('다른 기기에서 먼저 저장했어요.'),{conflict:json});
  if(response.status===401)throw new Error('인증키가 맞지 않아요.');
  if(!response.ok)throw new Error(json.error||('서버 응답 '+response.status));
  return json;
}
// 앱 화면에 새 기록을 알린다(app.jsx가 storage 이벤트로 다시 읽음).
function replaceLocal(data){
  writeRestored(data);
  window.dispatchEvent(new StorageEvent('storage',{key:workoutKey,newValue:'sync'}));
}

async function push(reason='sync'){
  const config=syncConfig();
  const data=currentBackup();
  try{
    const saved=await api('PUT','/api/records',{baseRev:config.rev||0,data,reason},config);
    saveConfig({rev:saved.rev,dirty:false,lastSync:Date.now()});
  }catch(e){
    if(!e.conflict)throw e;
    // 다른 기기에서 바뀐 기록: 서버에만 있는 기록을 더하고 이 기기의 수정 내용을 유지한 뒤 다시 저장
    const server=e.conflict;
    const merged=server.data?combineBackup(currentBackup(),validatedBackup(server.data),false):data;
    replaceLocal(merged);
    const saved=await api('PUT','/api/records',{baseRev:server.rev||0,data:currentBackup(),reason:'merge'},config);
    saveConfig({rev:saved.rev,dirty:false,lastSync:Date.now()});
  }
}
export function syncNow(reason){
  if(!syncEnabled())return Promise.resolve();
  if(running){again=true;return running}
  setStatus('saving','서버에 저장하는 중…');
  running=push(reason).then(()=>setStatus('ok','서버에 저장했어요.'),
    e=>{setStatus('error','서버 저장 실패: '+e.message+' 인터넷이 연결되면 다시 저장합니다.')})
    .finally(()=>{running=null;if(again){again=false;syncNow()}});
  return running;
}
export function scheduleSync(){
  if(!syncEnabled())return;
  saveConfig({dirty:true});
  clearTimeout(timer);timer=setTimeout(()=>syncNow(),1500);
}
window.addEventListener('muscle-records-changed',scheduleSync);
window.addEventListener('online',()=>{if(syncConfig().dirty)syncNow()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&syncConfig().dirty){clearTimeout(timer);syncNow()}});

// 앱을 켤 때: 이 기기가 비어 있으면 서버 기록을 받아오고, 다른 기기에서 바뀌었으면 최신으로 맞춘다.
export async function pullOnStart(){
  if(!syncEnabled())return;
  const config=syncConfig();
  const server=await api('GET','/api/records',undefined,config);
  const local=currentBackup();
  if(!server.data){if(!isEmpty(local))await syncNow('first');return}
  const remote=validatedBackup(server.data);
  if(isEmpty(local)){replaceLocal(remote);saveConfig({rev:server.rev,dirty:false,lastSync:Date.now()});return}
  if(server.rev===config.rev){if(config.dirty)syncNow();return}
  if(!config.dirty){replaceLocal(remote);saveConfig({rev:server.rev,lastSync:Date.now()});return}
  await syncNow();
}

// 처음 연결: 서버와 이 기기 기록을 합쳐서 저장
export async function connectSync(url,key){
  const config={url:url.trim(),key:key.trim()};
  const server=await api('GET','/api/records',undefined,config);
  saveConfig({...config,rev:server.rev||0,dirty:false});
  const local=currentBackup();
  if(server.data){
    const remote=validatedBackup(server.data);
    replaceLocal(isEmpty(local)?remote:combineBackup(local,remote,false));
  }
  await push('connect');
  setStatus('ok','서버와 연결했어요. 이제 기록이 바뀔 때마다 자동으로 저장합니다.');
  return server;
}
export function disconnectSync(){localStorage.removeItem(CONFIG);setStatus('idle','');events.dispatchEvent(new Event('change'))}
export const serverHistory=()=>api('GET','/api/history');
export const deleteServerHistory=rev=>api('DELETE','/api/history/'+rev);
// 예전 저장 시점으로 되돌리기: 그 시점 기록으로 바꾼 뒤 새 저장으로 올린다(되돌리기도 기록에 남음).
export async function restoreServerHistory(rev){
  const snap=await api('GET','/api/history/'+rev);
  const data=validatedBackup(snap.data);
  replaceLocal(data);
  saveConfig({dirty:true});
  await syncNow('restore '+rev);
  return data;
}
