import {exercises,groups} from './data.js';
import {readSaved,mobilityKey,workoutKey} from './recordStorage.js';

const signature='muscle-atlas-records';
const isObject=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const optionalNumber=value=>value==null||finite(value);
const optionalString=value=>value==null||typeof value==='string';
const isString=value=>typeof value==='string'&&value.length>0;

export function currentBackup(){
  return {format:signature,version:1,exportedAt:new Date().toISOString(),workouts:readSaved(workoutKey),mobility:readSaved(mobilityKey)};
}
export function validatedBackup(bundle){
  if(!isObject(bundle)||bundle.format!==signature||bundle.version!==1||!isObject(bundle.workouts)||!isObject(bundle.mobility))throw new Error('근육지도 백업 파일 형식이 아니에요.');
  const custom=bundle.workouts.custom??[], logs=bundle.workouts.logs??[], prefs=bundle.workouts.prefs??{};
  if(!Array.isArray(custom)||!Array.isArray(logs)||!isObject(prefs))throw new Error('백업 기록 형식을 확인해 주세요.');
  for(const name of ['big','small'])if(prefs[name]!==undefined&&(!finite(prefs[name])||prefs[name]<1||prefs[name]>336))throw new Error('백업의 휴식시간 설정이 유효하지 않아요.');
  if(prefs.dark!==undefined&&typeof prefs.dark!=='boolean')throw new Error('백업의 화면 설정이 유효하지 않아요.');
  const validIds=new Set(exercises.map(e=>e.id));
  for(const item of custom){
    if(!isObject(item)||!isString(item.id)||validIds.has(item.id)||!isString(item.name)||!isString(item.gear)||item.custom!==true||
      ![item.en,item.notes,item.videoUrl,item.aliases].every(optionalString)||
      (item.photo&&!(typeof item.photo==='string'&&/^data:image\/(jpeg|png|webp);base64,/.test(item.photo)))||
      !Array.isArray(item.p)||!Array.isArray(item.s)||![...item.p,...item.s].every(k=>Object.hasOwn(groups,k)))throw new Error('백업에 확인할 수 없는 사용자 운동이 있어요.');
    validIds.add(item.id);
  }
  const logIds=new Set();
  for(const log of logs){
    if(!isObject(log)||!isString(log.id)||logIds.has(log.id)||!validIds.has(log.ex)||!finite(log.time)||!Number.isFinite(new Date(log.time).getTime()))throw new Error('백업에 확인할 수 없는 운동 기록이 있어요.');
    const isWalk=log.ex==='treadmill';
    if(isWalk?(!isObject(log.walk)||!finite(log.walk.minutes)||log.walk.minutes<=0||!optionalNumber(log.walk.speed)||!optionalNumber(log.walk.incline))
      :(!Array.isArray(log.sets)||!log.sets.length||!log.sets.every(set=>isObject(set)&&finite(set.kg)&&set.kg>=0&&Number.isInteger(set.reps)&&set.reps>0)))throw new Error('운동 시간 또는 세트 형식이 맞지 않아요.');
    logIds.add(log.id);
  }
  for(const [day,items] of Object.entries(bundle.mobility)){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Array.isArray(items)||!items.every(isString))throw new Error('동작 관찰 기록 형식이 맞지 않아요.');
  }
  return {...bundle,workouts:{custom,logs,prefs}};
}

// Add missing records and let the user explicitly choose which edited record wins.
export function combineBackup(local,incoming,useBackupEdits=false){
  function merge(current,restored){
    const indexed=new Map(current.map(item=>[item.id,item]));
    for(const item of restored)if(useBackupEdits||!indexed.has(item.id))indexed.set(item.id,item);
    return [...indexed.values()];
  }
  const before=local.workouts, restored=incoming.workouts;
  const mobility={...local.mobility};
  for(const [day,items] of Object.entries(incoming.mobility))mobility[day]=[...new Set([...(mobility[day]||[]),...items])];
  return {workouts:{
    logs:merge(before.logs||[],restored.logs),
    custom:merge(before.custom||[],restored.custom),
    prefs:{...restored.prefs,...before.prefs}
  },mobility};
}
