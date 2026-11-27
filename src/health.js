// 삼성헬스(갤럭시 핏) → 헬스 커넥트 → 이 앱
import {useCallback,useEffect,useState} from 'react';
import {Health} from '@capgo/capacitor-health';
import {App} from '@capacitor/app';
import {isNative} from './native';

const READ=['steps','calories','workouts','weight'];

function startOfToday(){const d=new Date();d.setHours(0,0,0,0);return d}

export async function connectHealth(){
  const {available,reason}=await Health.isAvailable();
  if(!available)throw new Error(reason||'헬스 커넥트를 쓸 수 없는 기기입니다.');
  const status=await Health.requestAuthorization({read:READ});
  if(!status.readAuthorized.includes('steps'))throw new Error('걸음 수 권한이 허용되지 않았어요.');
  return status;
}

export async function latestWeight(){
  try{
    const {samples}=await Health.readSamples({dataType:'weight',limit:1,ascending:false,
      startDate:new Date(Date.now()-365*864e5).toISOString(),endDate:new Date().toISOString()});
    return samples[0]?.value||null;
  }catch{return null}
}

async function sumToday(dataType){
  const {samples}=await Health.queryAggregated({dataType,startDate:startOfToday().toISOString(),
    endDate:new Date().toISOString(),bucket:'day',aggregation:'sum'});
  return samples.reduce((s,x)=>s+(x.value||0),0);
}

async function readHealth(){
  const start=new Date(startOfToday().getTime()-30*864e5).toISOString(),end=new Date().toISOString();
  const [steps,activeKcal,workouts]=await Promise.all([
    sumToday('steps').catch(()=>null),
    sumToday('calories').catch(()=>null),
    Health.queryWorkouts({startDate:start,endDate:end,limit:200}).then(r=>r.workouts).catch(()=>[])
  ]);
  return {steps,activeKcal,workouts,updated:Date.now()};
}

// linked: 설정에서 연결한 적 있는지
export function useHealth(linked){
  const [data,setData]=useState(null),[error,setError]=useState('');
  const refresh=useCallback(async()=>{
    if(!isNative()||!linked)return;
    try{setData(await readHealth());setError('')}
    catch(e){setError(e?.message||'삼성헬스 자료를 읽지 못했어요.')}
  },[linked]);
  useEffect(()=>{
    void refresh();
    if(!isNative())return;
    const listener=App.addListener('resume',()=>void refresh());
    return ()=>{listener.then(l=>l.remove())};
  },[refresh]);
  return {data,error,refresh};
}
