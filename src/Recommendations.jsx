import React,{useState} from 'react';
import {BookOpen,Dumbbell,RefreshCw} from 'lucide-react';
import {dateText,groups} from './data';
import {exerciseMovement} from './exerciseMuscles';
import {planOptions} from './recommendations';

const regionNames={upper:'상체',lower:'하체',core:'코어'};
const muscleNames=keys=>keys.map(key=>groups[key]).join(' · ');

export function Recommendations({logs,catalog,prefs,now,onOpen,onMuscles}){
  const [day,setDay]=useState(null);
  const [big,setBig]=useState(false);
  const recent=planOptions(logs,catalog,prefs,now,day===true,big);
  const tomorrow=day??Boolean(recent.todayMuscles.length);
  const plan=tomorrow&&day===null?planOptions(logs,catalog,prefs,now,true,big):recent;
  return <section className="panel recommend" aria-labelledby="recommend-title">
    <div className="sectiontitle"><h2 id="recommend-title"><Dumbbell size={21}/> 추천 운동</h2><span>{dateText(plan.target,true)} 기준</span></div>
    <div className="recommendControls">
      <button aria-pressed={!tomorrow} onClick={()=>setDay(false)}>오늘</button>
      <button aria-pressed={tomorrow} onClick={()=>setDay(true)}>내일</button>
      <label><input type="checkbox" checked={big} onChange={event=>setBig(event.target.checked)}/> 대근육 위주</label>
    </div>
    <p className="sub">오늘 쓴 근육과 예정 휴식시간이 남은 근육을 피하고, 최근에 덜 쓴 부위를 우선 추천합니다.</p>
    {plan.blocked.length>0&&<p className="recommendExcluded"><strong>추천에서 뺀 부위</strong> {muscleNames(plan.blocked)}</p>}
    {plan.alternatives.length?<PlanList key={JSON.stringify([tomorrow,big,plan.alternatives[0].items.map(({exercise})=>exercise.id)])} plan={plan} onOpen={onOpen} onMuscles={onMuscles}/>:<p className="recommendNone">이 시간에 조건에 맞는 근력운동이 없어요. 회복 일정에서 부위별 예정 시각을 확인하세요.</p>}
  </section>
}

function PlanList({plan,onOpen,onMuscles}){
  const [index,setIndex]=useState(0);
  const {alternatives,thisWeek}=plan;
  const {items,main}=alternatives[index%alternatives.length];
  return <>
    <div className="recommendList">{items.map(({exercise,region})=><article key={exercise.id} className="recommendExercise"><button className="recommendItem" onClick={()=>onOpen(exercise)}>
      <small>{regionNames[region]} · {exercise.gear}</small>
      <strong>{exercise.name}</strong>
      <span>{muscleNames(exercise.p)}</span>
      {exercise.p.every(key=>!thisWeek.has(key))&&<small>이번 주 주동근 기록 없음</small>}
    </button>{exerciseMovement(exercise.id)&&<button className="recommendMuscles" aria-haspopup="dialog" onClick={()=>onMuscles(exercise)}><BookOpen size={16}/> 근육·동작 보기</button>}</article>)}</div>
    {main<2&&<p className="sub">상체·하체 중 조건에 맞는 쪽만 표시했어요.</p>}
    {alternatives.length>1&&<button className="outline recommendMore" onClick={()=>setIndex(index+1)}><RefreshCw size={16}/> 다른 조합</button>}
  </>
}
