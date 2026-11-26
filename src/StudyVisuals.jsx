import React,{useEffect,useRef,useState} from 'react';
import {Maximize2,X} from 'lucide-react';
import {anatomy} from './anatomy';
import credits from './anatomy-credits.json';

const photos=import.meta.glob('./motion-photos/*.webp',{eager:true,query:'?url&no-inline',import:'default'});
const atlasImages=import.meta.glob('./anatomy-images/*.webp',{eager:true,query:'?url&no-inline',import:'default'});
const byId=new Map(anatomy.map(muscle=>[muscle.id,muscle]));
// The arrows sit beside the moving body part in the second reference photo.
const directionPaths={
  'wall-plus':['M58 31H76 M70 26L76 31L70 36'],
  'bird-dog':['M26 36H8 M14 31L8 36L14 41','M69 37H91 M85 32L91 37L85 42'],
  'standing-march':['M39 72Q34 62 37 51 M31 55L37 51L41 57'],
  'side-hip-raise':['M80 61Q85 51 84 45 M79 50L84 45L89 50']
};
function PhotoFrame({src,caption,arrows}){
  return <span className="motionPhotoFrame">
    <img src={src} alt={caption}/>
    {arrows&&<svg className="motionDirection" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
      {arrows.map(d=><g key={d}><path d={d} stroke="#223832" strokeWidth="4.5"/><path d={d} stroke="#ffab65" strokeWidth="2.3"/></g>)}
    </svg>}
  </span>;
}
const studyVisuals={
  'wall-plus':{
    compare:'팔꿈치는 두 장면에서 모두 펴져 있어요. 두 번째 자세에서는 등을 살짝 넓히듯 몸통이 벽에서 조금 멀어집니다.',
    muscles:[['serratus','갈비뼈 옆 → 날개뼈 안쪽']]
  },
  'bird-dog':{
    compare:'두 번째 자세에서 뻗은 팔과 다리는 서로 반대쪽이에요. 바닥을 짚은 손과 무릎이 몸을 받칩니다.',
    muscles:[['multifidus','허리뼈 바로 양옆'],['transverse','배 옆을 둘러싸는 깊은 근육']]
  },
  'standing-march':{
    compare:'두 번째 자세에서 허벅지가 앞쪽으로 올라가요. 옆에서 볼 때 몸통은 두 장면 모두 세워져 있습니다.',
    muscles:[['psoas','허리뼈 옆 → 허벅지뼈 안쪽'],['iliacus','골반 안쪽에 부채처럼 붙는 근육']]
  },
  'side-hip-raise':{
    compare:'아래쪽 무릎은 접은 채 바닥에 둡니다. 위쪽 다리만 편 채 옆으로 들고, 골반은 포갠 상태를 유지해요.',
    muscles:[['glutemed','골반 바깥쪽 윗부분'],['glutemin','중간볼기근 바로 아래']]
  }
};

function PhotoDetail({caption,src,arrows,onClose}){
  const pane=useRef(null);
  useEffect(()=>{
    const dialog=pane.current;
    dialog.showModal();
    return ()=>dialog.close();
  },[]);
  return <dialog className="studyPhotoDialog" ref={pane} aria-label={caption} onCancel={onClose}>
    <div><header><strong>{caption}</strong><button type="button" className="icon" onClick={onClose} aria-label="큰 사진 닫기"><X size={20}/></button></header>
      <PhotoFrame src={src} caption={caption} arrows={arrows}/></div>
  </dialog>;
}

export function StudyVisuals({lesson,onMuscle,visuals,stretch=false}){
  const [zoom,setZoom]=useState(null);
  const visual=visuals||studyVisuals[lesson.id];
  const arrowsForLesson=directionPaths[lesson.id];
  const picturesAvailable=lesson.showPhotos!==false;
  return <>
    {picturesAvailable?<><h3>{stretch?'시작 자세와 스트레칭 자세':'시작과 끝 자세 비교'}</h3>
    <div className="motionPhotos">
      {lesson.phases.map(([title,instruction],index)=>{
        const src=photos['./motion-photos/'+lesson.id+'-'+index+'.webp'];
        const caption=lesson.title+' · '+title;
        const arrows=index===1?arrowsForLesson:null;
        return <figure key={title}>
          <button type="button" aria-haspopup="dialog" aria-label={title+' 사진 크게 보기'} onClick={()=>setZoom({src,caption,arrows})}>
            <PhotoFrame src={src} caption={caption} arrows={arrows}/><Maximize2 className="motionZoom" size={17} aria-hidden="true"/>
          </button>
          <figcaption><strong>{index+1}. {title}</strong><span>{instruction}</span></figcaption>
        </figure>
      })}
    </div>
    <small className="motionCredit">동작 사진은 자세 설명을 위해 만든 참고 이미지예요.</small></>
      :<ol>{lesson.phases.map(([title,instruction])=><li key={title}><strong>{title}</strong> {instruction}</li>)}</ol>}
    <p className="motionCompare"><strong>{stretch?'어디가 당기는지 확인하기':'내 몸에서 확인하기'}</strong>{visual.compare}{arrowsForLesson&&' 화살표가 움직이는 방향을 보여줘요.'}</p>
    <h3>{stretch?'그림으로 보는 관련 근육':'이 동작에서 보는 근육'}</h3>
    <div className="motionMuscles">
      {visual.muscles.map(([id,landmark])=>{
        const muscle=byId.get(id);
        return <button key={id} type="button" onClick={()=>onMuscle(muscle)} aria-haspopup="dialog">
          <img src={atlasImages['./anatomy-images/'+id+'.webp']} alt={muscle.name+'이(가) 뼈에 붙는 위치'}/>
          <strong>{muscle.name}</strong><span>{landmark}</span><small>근육 카드 열기</small>
        </button>;
      })}
    </div>
    <details className="studyDetails"><summary>해부 그림 출처</summary>
      {visual.muscles.map(([id])=>{
        const credit=credits[id];
        return <p key={id}><a href={credit.url} target="_blank" rel="noreferrer">{byId.get(id).name} · {credit.author||'Wikimedia Commons'}</a>
          {' · '}{credit.licenseUrl?<a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>:credit.license}
          <small>{credit.change}</small></p>;
      })}
    </details>
    {zoom&&<PhotoDetail {...zoom} onClose={()=>setZoom(null)}/>}
  </>;
}
