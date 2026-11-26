import React from 'react';
import {groups} from './data';
import {muscleUsage} from './muscleLearning';
import {readSaved,mobilityKey} from './recordStorage';

export function TodayMuscles({logs,catalog,now,onStudy}){
  const {groupStatus,next,workouts}=muscleUsage(logs,catalog,readSaved(mobilityKey),now);
  return <section className="panel studyCard">
      <h2>오늘 쓴 근육</h2>
      <p className="sub">운동 기록과 도감의 근육 분류를 바탕으로 보여줘요. 실제로 어느 근육이 얼마나 쓰였는지는 측정하지 않습니다.</p>
      {workouts.length>0?<dl className="studyCoverage">
        <div><dt>주로 쓴 근육</dt><dd>{groupStatus.direct.join(' · ')||'등록된 주동근 기록 없음'}</dd></div>
        <div><dt>함께 관여한 근육</dt><dd>{groupStatus.assist.join(' · ')||'등록된 보조근 기록 없음'}</dd></div>
        <div><dt>연결된 기록이 없는 부위</dt><dd>{groupStatus.unrecorded.join(' · ')||'모든 부위에 기록 있음'}</dd></div>
      </dl>:<p>오늘 기록한 근력·유산소 운동이 없어요.</p>}
      {workouts.length>0&&<details className="studyDetails"><summary>오늘 한 운동별로 보기</summary><dl className="studyCoverage">{workouts.map(workout=><div key={workout.id}><dt>{workout.name}</dt><dd>
        {workout.p.length?'주로 쓰는 근육 · '+workout.p.map(key=>groups[key]).join(' · '):'도감에 부위 연결이 없는 운동'}
        {workout.s.length>0&&<><br/>함께 관여 · {workout.s.map(key=>groups[key]).join(' · ')}</>}
      </dd></div>)}</dl></details>}
      <h3>다음 운동에서 의식할 것</h3>
      {next?<><button className="outline studyAction" onClick={()=>onStudy(next.id)}>{next.title} 보기</button><p>{next.cue}</p></>:<p>오늘은 등록된 부위를 모두 연습했거나 집중 관찰했어요. 다음번에는 움직임과 호흡이 더 편해졌는지 비교해 보세요.</p>}
    </section>
}
