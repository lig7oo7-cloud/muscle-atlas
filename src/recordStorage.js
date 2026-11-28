export const workoutKey='muscle-atlas-v1';
export const mobilityKey='muscle-atlas-mobility-v1';
const keys=[workoutKey,mobilityKey];
let database;

function getDatabase(){
  if(database)return database;
  database=new Promise(resolve=>{
    if(!globalThis.indexedDB){resolve(null);return}
    const open=indexedDB.open('muscle-atlas-records',1);
    open.onupgradeneeded=()=>open.result.createObjectStore('snapshots');
    open.onsuccess=()=>resolve(open.result);
    open.onerror=open.onblocked=()=>resolve(null);
  });
  return database;
}
function useStore(db,mode,key,job){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('snapshots',mode);
    const request=job(tx.objectStore('snapshots'),key);
    tx.oncomplete=()=>resolve(request.result);
    tx.onerror=tx.onabort=()=>reject(tx.error||new Error('저장 실패'));
  });
}
function mirror(key,raw){
  void getDatabase().then(db=>db&&useStore(db,'readwrite',key,(store,k)=>store.put(raw,k))).catch(()=>{});
}
function parse(raw){
  try{
    const value=JSON.parse(raw);
    return value&&typeof value==='object'&&!Array.isArray(value)?value:null;
  }catch{return null}
}
export function readSaved(key){
  try{return parse(localStorage.getItem(key))||{}}
  catch{return {}}
}
export function writeSaved(key,value){
  const raw=JSON.stringify(value);
  localStorage.setItem(key,raw);
  mirror(key,raw);
  globalThis.dispatchEvent?.(new Event('muscle-records-changed'));
}
export function writeRestored(data){
  const before=keys.map(key=>localStorage.getItem(key));
  const after=[JSON.stringify(data.workouts),JSON.stringify(data.mobility)];
  try{keys.forEach((key,i)=>localStorage.setItem(key,after[i]))}
  catch(e){
    keys.forEach((key,i)=>{
      if(before[i]===null)localStorage.removeItem(key);
      else localStorage.setItem(key,before[i]);
    });
    throw e;
  }
  keys.forEach((key,i)=>mirror(key,after[i]));
}
export async function recoverMissingRecords(){
  const db=await getDatabase();
  if(!db)return;
  await Promise.all(keys.map(async key=>{
    try{
      const copy=await useStore(db,'readonly',key,(store,k)=>store.get(k));
      const current=localStorage.getItem(key);
      if(!parse(current)&&parse(copy))localStorage.setItem(key,copy);
      else if(parse(current))mirror(key,current);
    }catch{}
  }));
}
