import {groups,large,readiness} from './data.js';

const lower=['quads','glutes','hams','calves','adductors','abductors'];
const core=['abs','spine'];

export function planOptions(logs,catalog,prefs,now,tomorrow=false,bigOnly=false){
  const today=new Date(now);
  today.setHours(0,0,0,0);
  const target=new Date(now);
  if(tomorrow)target.setDate(target.getDate()+1);
  const week=new Date(today);
  week.setDate(week.getDate()-(week.getDay()+6)%7);
  const byId=new Map(catalog.map(exercise=>[exercise.id,exercise]));
  const workouts=logs.filter(log=>log.time<=now&&log.sets?.length&&byId.has(log.ex));
  const todayMuscles=new Set();
  const recent=new Map();
  const thisWeek=new Set();
  for(const log of workouts){
    const exercise=byId.get(log.ex);
    for(const muscle of [...exercise.p,...exercise.s]){
      if(log.time>=+today)todayMuscles.add(muscle);
      recent.set(muscle,Math.max(recent.get(muscle)??0,log.time));
    }
    if(log.time>=+week)for(const muscle of exercise.p)thisWeek.add(muscle);
  }
  const blocked=Object.keys(groups).filter(muscle=>todayMuscles.has(muscle)||readiness(workouts,muscle,prefs,catalog)>+target);
  const ready={upper:[],lower:[],core:[]};
  for(const exercise of catalog){
    if(exercise.cardio||!exercise.p.length)continue;
    if(bigOnly&&!exercise.p.some(muscle=>large.includes(muscle)))continue;
    const muscles=[...new Set([...exercise.p,...exercise.s])];
    if(muscles.some(muscle=>blocked.includes(muscle)))continue;
    const region=exercise.p.some(muscle=>lower.includes(muscle))?'lower'
      :exercise.p.every(muscle=>core.includes(muscle))?'core':'upper';
    ready[region].push({exercise,muscles,region});
  }
  const plans=[];
  for(const upper of [null,...ready.upper]){
    for(const lower of [null,...ready.lower]){
      if(upper&&lower&&upper.muscles.some(muscle=>lower.muscles.includes(muscle)))continue;
      const base=[upper,lower].filter(Boolean);
      const extras=(bigOnly?(upper?ready.upper:[]):ready.core).filter(item=>
        base.every(other=>item.muscles.every(muscle=>!other.muscles.includes(muscle)))
      );
      for(const extra of [null,...extras]){
        const items=extra?[...base,extra]:base;
        if(!items.length)continue;
        const primary=items.flatMap(item=>item.exercise.p);
        const age=primary.map(muscle=>recent.get(muscle)??0).reduce((total,time)=>total+time/primary.length,0);
        plans.push({items,main:base.length,unused:primary.filter(muscle=>!thisWeek.has(muscle)).length,age});
      }
    }
  }
  plans.sort((a,b)=>b.main-a.main||(bigOnly?b.items.length-a.items.length:0)||b.unused-a.unused||a.age-b.age||b.items.length-a.items.length);
  const first=plans[0];
  const seen=new Set();
  const alternatives=first?plans.filter(plan=>{
    if(plan.main!==first.main||plan.items.length!==first.items.length)return false;
    const key=JSON.stringify(plan.items.map(item=>String(item.exercise.id)).sort());
    if(seen.has(key))return false;
    seen.add(key);
    return true;
  }):[];
  return {target:+target,blocked,todayMuscles:[...todayMuscles],thisWeek,alternatives};
}
