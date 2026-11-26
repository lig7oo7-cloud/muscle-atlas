import React,{useState} from 'react';
import {Check,ChevronDown} from 'lucide-react';
import {StudyVisuals} from './StudyVisuals';
import {dayKey} from './mobility';
import {movementCoverage,movementRegions,movements} from './movementCatalog';
import {readSaved,writeSaved,mobilityKey} from './recordStorage';

const readHistory=()=>readSaved(mobilityKey);

export function MobilityPanel({now,initialMove,onMuscle}){
  const [region,setRegion]=useState(()=>movements.find(move=>move.id===initialMove)?.region||'');
  const [open,setOpen]=useState(initialMove||'');
  const [history,setHistory]=useState(readHistory);
  const [error,setError]=useState('');
  const today=dayKey(now);
  const monday=new Date(now);
  monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
  const covered=movementCoverage(history,dayKey(monday),today);
  const done=history[today]||[];
  const regions=region?[region]:movementRegions;

  function toggle(id){
    const existing=readHistory(),current=existing[today]||[];
    const next={...existing,[today]:current.includes(id)?current.filter(key=>key!==id):[...current,id]};
    try{writeSaved(mobilityKey,next);setHistory(next);setError('')}
    catch{setError('완료 기록을 저장하지 못했습니다.')}
  }

  return <section className="panel mobilityPanel" aria-labelledby="mobility-title">
    <h2 id="mobility-title">부위별 스트레칭 · 동작 연습</h2>
    <p className="sub">부위를 고르고 사진, 관련 근육, 직접 느껴볼 곳을 한 번에 보세요.</p>
    <div className="movementRegions" aria-label="신체 부위">
      {['',...movementRegions].map(value=><button key={value} aria-pressed={region===value}
        onClick={()=>{setRegion(value);setOpen('')}}>{value||'전체 부위'}</button>)}
    </div>
    <details className="movementProgress">
      <summary>이번 주 스트레칭 {covered.size} / {movementRegions.length}부위</summary>
      <progress aria-label="이번 주 스트레칭한 부위" value={covered.size} max={movementRegions.length}/>
      <p className="sub">{covered.size?[...covered].join(' · '):'이번 주 스트레칭 기록이 아직 없어요.'}</p>
    </details>
    {error&&<p role="alert">{error}</p>}
    {regions.map(area=>{
      const visible=movements.filter(move=>move.region===area);
      return <section className="movementRegion" key={area}>
        <h3>{area}</h3>
        <div className="mobilityList">{visible.map(move=>{
          const recordId=move.recordId||move.id,completed=done.includes(recordId);
          return <article key={move.id} className="mobilityMove">
            <button className="mobilitySummary" type="button" aria-expanded={open===move.id} onClick={()=>setOpen(open===move.id?'':move.id)}>
              <span>{move.label&&<small>{move.label}</small>}<strong>{move.title}</strong></span>
              {completed?<Check size={20} aria-label="오늘 완료"/>:<ChevronDown size={20} aria-hidden="true"/>}
            </button>
            {open===move.id&&<div className="mobilitySteps">
              {move.dose&&<strong>{move.dose}</strong>}
              <StudyVisuals lesson={move} visuals={move.visuals} stretch={move.kind==='스트레칭'} onMuscle={onMuscle}/>
              {move.deep&&<p className="sub">{move.deep}</p>}
              {move.cue&&<p><strong>내 몸에서 확인하기</strong> {move.cue}</p>}
              <a href={move.source} target="_blank" rel="noreferrer">참고 자료 열기</a>
              <button className="outline" type="button" aria-pressed={completed} onClick={()=>toggle(recordId)}>{completed?'오늘 완료 취소':'오늘 완료 표시'}</button>
            </div>}
          </article>;
        })}</div>
      </section>;
    })}
  </section>
}
