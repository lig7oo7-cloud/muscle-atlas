// 운동별 소모 칼로리 계산
// - 근력: 1회 약 4초 + 세트 사이 휴식 90초로 시간을 가정하고 MET 공식(MET × 체중kg × 시간h)으로 추정
// - 걷기: ACSM 보행/달리기 산소소비 공식
// - 같은 날 갤럭시 핏(삼성헬스) 운동 기록이 있으면, 그 실측 총합을 운동별 비율로 나눔
import {large} from './data.js';

const REP_SECONDS=4,REST_SECONDS=90,REST_MET=1.5;
const cardioWorkouts=new Set(['walking','running','runningTreadmill','hiking','cycling','bikingStationary','elliptical','stairClimbing','stairClimbingMachine','swimming','swimmingPool','swimmingOpenWater','rowingMachine','mixedCardio']);
const walkingWorkouts=new Set(['walking','running','runningTreadmill']);

// 운동 강도: 큰 근육 여러 개를 쓰는 운동일수록 높게
export function strengthMet(exercise){
  const bigCount=exercise.p.filter(m=>large.includes(m)).length+exercise.s.filter(m=>large.includes(m)).length*0.5;
  if(bigCount>=1.5)return 6;
  if(exercise.p.some(m=>large.includes(m)))return 5;
  if(exercise.p.includes('abs'))return 3.8;
  return 3.5;
}

function strengthEstimate(exercise,sets,bodyKg){
  const met=strengthMet(exercise);
  return sets.reduce((kcal,set)=>kcal
    +met*bodyKg*(Math.max(0,set.reps)*REP_SECONDS)/3600
    +REST_MET*bodyKg*REST_SECONDS/3600,0);
}

// 근력 운동 비율 나누기용 가중치: 횟수 × √무게 × 근육 크기(MET)
// (무게를 그대로 곱하면 레그프레스처럼 무게 숫자가 큰 머신이 칼로리를 과하게 가져감)
function strengthWeight(exercise,sets,bodyKg){
  const met=strengthMet(exercise);
  return sets.reduce((w,set)=>w+Math.max(0,set.reps)*Math.sqrt(set.kg>0?set.kg:bodyKg*0.5)*met,0);
}

export function walkingEstimate({minutes,speed,incline},bodyKg){
  const kmh=speed||5,grade=(incline||0)/100,mPerMin=kmh*1000/60;
  const vo2=kmh>=8?3.5+0.2*mPerMin+0.9*mPerMin*grade:3.5+0.1*mPerMin+1.8*mPerMin*grade;
  return vo2*bodyKg/1000*5*(minutes||0);
}

const dayKey=t=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};

// logs 전체에 대해 {logId: {kcal, measured}} 반환
export function logCalories(logs,byId,bodyKg,workouts=[]){
  const result={};
  const days=new Map();
  for(const log of logs){
    const key=dayKey(log.time);
    if(!days.has(key))days.set(key,[]);
    days.get(key).push(log);
  }
  const workoutDays=new Map();
  for(const w of workouts){
    if(!(w.totalEnergyBurned>0))continue;
    const key=dayKey(new Date(w.startDate).getTime());
    const day=workoutDays.get(key)||{strength:0,walk:0};
    if(walkingWorkouts.has(w.workoutType))day.walk+=w.totalEnergyBurned;
    else if(!cardioWorkouts.has(w.workoutType))day.strength+=w.totalEnergyBurned;
    workoutDays.set(key,day);
  }
  for(const [key,dayLogs] of days){
    const measured=workoutDays.get(key);
    const strength=dayLogs.filter(l=>l.sets?.length&&byId.has(l.ex));
    const walks=dayLogs.filter(l=>l.walk);
    // 근력
    const totalWeight=strength.reduce((s,l)=>s+strengthWeight(byId.get(l.ex),l.sets,bodyKg),0);
    for(const l of strength){
      const ex=byId.get(l.ex);
      if(measured?.strength&&totalWeight>0)
        result[l.id]={kcal:measured.strength*strengthWeight(ex,l.sets,bodyKg)/totalWeight,measured:true};
      else result[l.id]={kcal:strengthEstimate(ex,l.sets,bodyKg),measured:false};
    }
    // 걷기
    const totalMinutes=walks.reduce((s,l)=>s+(l.walk.minutes||0),0);
    for(const l of walks){
      if(measured?.walk&&totalMinutes>0)
        result[l.id]={kcal:measured.walk*(l.walk.minutes||0)/totalMinutes,measured:true};
      else result[l.id]={kcal:walkingEstimate(l.walk,bodyKg),measured:false};
    }
  }
  return result;
}
