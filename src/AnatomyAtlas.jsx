import React,{useEffect,useRef,useState} from 'react';
import {Search,BookOpen,Maximize2,X} from 'lucide-react';
import {filterAnatomy,regions,purposesForRegion,searchedPurpose} from './anatomy';
import {anatomyCues} from './anatomy-cues';
import {relatedExercises} from './exerciseMuscles';
import credits from './anatomy-credits.json';

const pictures=import.meta.glob('./anatomy-images/*.webp',{eager:true,query:'?url&no-inline',import:'default'});
// Only mark attachments visible in the selected view of the source illustration.
const attachmentPoints={};
const lessonPurposes={
  'wall-plus':['밀기','날개뼈 움직이기'],
  'bird-dog':['몸통 잡기'],
  'standing-march':['다리 앞으로 들기'],
  'side-hip-raise':['다리 옆으로 벌리기','관절 잡기']
};
const layers=['겉층','중간층','깊은층','안쪽 위치','여러 층'];

export function AnatomyAtlas({catalog,onExercise,onLesson}){
  const [region,setRegion]=useState('');
  const [purpose,setPurpose]=useState('');
  const [layer,setLayer]=useState('');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState('');
  const availablePurposes=purposesForRegion(region);
  function changeRegion(next){
    setRegion(next);
    if(purpose&&!purposesForRegion(next).includes(purpose))setPurpose('');
  }
  const results=filterAnatomy({region,purpose,layer,query});
  const muscle=results.find(x=>x.id===selected);
  function showPurpose(value){
    setSelected('');setPurpose(value);setLayer('');setQuery('');
    window.scrollTo(0,0);
  }

  function reset(){setRegion('');setPurpose('');setLayer('');setQuery('');setSelected('')}

  return <section className="panel anatomyPanel" aria-labelledby="anatomy-title">
    <h2 id="anatomy-title">근육 도감</h2>
    <p className="sub">그림을 눌러 근육의 위치와 내 몸에서 확인할 동작을 보세요.</p>
      <div className="anatomyFilters">
        <label className="search anatomySearch"><Search size={18}/><input type="search" aria-label="근육 이름 또는 동작 검색" value={query} onChange={e=>setQuery(e.target.value)} placeholder="예: 대요근, 다리 벌리기"/></label>
        <div className="anatomySelects">
          <label>신체 부위<select value={region} onChange={e=>changeRegion(e.target.value)}><option value="">전체 부위</option>{regions.map(x=><option key={x}>{x}</option>)}</select></label>
          <label>하는 동작<select value={purpose} onChange={e=>setPurpose(e.target.value)}><option value="">전체 동작</option>{availablePurposes.map(x=><option key={x}>{x}</option>)}</select></label>
          <label>근육 층<select value={layer} onChange={e=>setLayer(e.target.value)}><option value="">모든 층</option>{layers.map(x=><option key={x}>{x}</option>)}</select></label>
        </div>
        <p className="anatomyCount" aria-live="polite">{results.length}개 근육·근육군</p>
        {(region||purpose||layer||query)&&<button className="outline anatomyReset" onClick={reset}>검색 초기화</button>}
      </div>
      {results.length>0?<div className="anatomyGallery">
        {results.map(item=><button key={item.id} className="anatomyGalleryCard" aria-haspopup="dialog" onClick={()=>setSelected(item.id)}>
          <span className="anatomyThumb"><img src={pictures['./anatomy-images/'+item.id+'.webp']} alt="" loading="lazy" decoding="async"/><Maximize2 size={14} aria-hidden="true"/></span>
          <span className="anatomyCardLabel"><small>{item.region} · {item.layer}</small><strong>{item.name}</strong><span>{item.purposes[0]}</span></span>
        </button>)}
      </div>:<p className="empty">조건에 맞는 근육이 없어요. 부위나 동작 조건을 바꿔보세요.</p>}
      {muscle&&<MuscleCard muscle={muscle} catalog={catalog} close={()=>setSelected('')} showPurpose={showPurpose} purpose={purpose||searchedPurpose(query)} onExercise={onExercise} onLesson={onLesson}/>}
  </section>
}

export function MuscleCard({muscle,catalog,close,showPurpose,onExercise,onLesson,purpose,fromExercise}){
  const dialog=useRef(null);
  useEffect(()=>{
    const element=dialog.current;
    element.showModal();
    return ()=>element.close();
  },[]);
  const credit=credits[muscle.id];
  const image=pictures['./anatomy-images/'+muscle.id+'.webp'];
  const points=attachmentPoints[muscle.id];
  const related=onExercise?relatedExercises(muscle.id,catalog,purpose):[];
  const hasLesson=onLesson&&muscle.lesson&&(!purpose||lessonPurposes[muscle.lesson]?.includes(purpose));
  const [landmark,movement]=anatomyCues[muscle.id];
  return <dialog className="anatomyDialog" ref={dialog} aria-label={muscle.name} onCancel={event=>{event.preventDefault();close()}} onClick={event=>{if(event.target===dialog.current)close()}}>
    <article className="anatomyDetail">
        <div className="anatomyHeading"><div><small>{muscle.region} · {muscle.layer}</small><h3>{muscle.name}</h3><p>{muscle.alias}</p></div><button type="button" className="icon" aria-label="카드 닫기" onClick={close}><X size={20}/></button></div>
        {image&&credit&&<figure className="anatomyFigure">
          <a href={credit.url} target="_blank" rel="noreferrer" aria-label={muscle.name+' 그림 원본과 출처 열기'}><span className="anatomyDrawing"><img src={image} alt={muscle.name+'과 주변 뼈 또는 근육의 위치를 보여주는 해부학 그림'}/>
          {points?.map(([left,top],i)=><span key={i} className="attachmentMarker" style={{left:left+'%',top:top+'%'}} aria-label={i?'B 닿는 곳':'A 이는 곳'}>{i?'B':'A'}</span>)}</span></a>
          <figcaption><a href={credit.url} target="_blank" rel="noreferrer">{credit.author||'Wikimedia Commons'} · 그림 원본</a> · {credit.licenseUrl?<a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>:credit.license}<span>{credit.change}{points?' · A/B 위치 표시 추가':''}</span></figcaption>
        </figure>}
        <div className="bodyCue">
          <h4>내 몸에서 확인하기</h4>
          <p><strong>위치 기준</strong> {landmark}</p>
          <p><strong>움직여 보기</strong> {movement}</p>
        </div>
        <dl className="anatomyAttachments">
          <div><dt><b>A</b> 이는 곳 (기시)</dt><dd>{muscle.origin}</dd></div>
          <div><dt><b>B</b> 닿는 곳 (정지)</dt><dd>{muscle.insertion}</dd></div>
          <div><dt>주요 기능</dt><dd>{muscle.role}</dd></div>
          <div><dt>일상에서 쓰일 때</dt><dd>{muscle.everyday}</dd></div>
        </dl>
        {fromExercise&&<button className="outline studyAction" type="button" onClick={close}>{fromExercise.name} 화면으로 돌아가기</button>}
        {showPurpose&&<div className="anatomyTags" aria-label="관련 동작">{muscle.purposes.map(x=><button key={x} onClick={()=>showPurpose(x)}>{x}</button>)}</div>}
        {(related.length>0||hasLesson)&&<div className="anatomyRelated">
          <h4>{purpose?'동작과 맞는 운동':'운동에서 확인하기'}</h4><div>{related.map(e=><button key={e.id} className="outline" onClick={()=>onExercise(e)}>{e.name}</button>)}
          {hasLesson&&<button className="outline" onClick={()=>onLesson(muscle.lesson)}><BookOpen size={16}/> 동작 단계 그림</button>}</div>
        </div>}
        {purpose&&related.length===0&&!hasLesson&&<p className="sub">이 동작에 연결된 운동은 아직 없어요.</p>}
        <a className="anatomySource" href={muscle.source} target="_blank" rel="noreferrer">해부학 참고 자료</a>
    </article>
  </dialog>
}
