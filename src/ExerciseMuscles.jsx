import React from 'react';
import {BookOpen} from 'lucide-react';
import {exerciseMovement} from './exerciseMuscles';

export function ExerciseMuscles({exercise,onOpen}){
  const movement=exerciseMovement(exercise.id);
  if(!movement)return <p className="sub">이 기구의 동작별 근육 카드는 아직 연결되지 않았어요.</p>;
  return <section className="movementMuscles" aria-label="이 동작에서 쓰는 근육">
    <h3>이 동작에서 쓰는 근육</h3>
    <p>{movement.motion}</p>
    <div className="movementMuscleList">{movement.links.map(({muscle,role})=>
      <button key={muscle.id} type="button" onClick={()=>onOpen(muscle,exercise)} aria-haspopup="dialog">
        <BookOpen aria-hidden="true" size={17}/><span><strong>{muscle.name}</strong><small>{role}</small></span>
      </button>
    )}</div>
    <p className="movementCue"><strong>내 동작 확인</strong> {movement.cue}</p>
  </section>;
}
