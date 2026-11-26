import React,{useState} from 'react';
import {groups} from './data';
import {safeVideoUrl} from './demonstrations';
async function resizePhoto(file){
  const image=await createImageBitmap(file);
  try{
    const ratio=Math.min(1,720/Math.max(image.width,image.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(image.width*ratio));
    canvas.height=Math.max(1,Math.round(image.height*ratio));
    const context=canvas.getContext('2d');
    context.fillStyle='#fff';
    context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(image,0,0,canvas.width,canvas.height);
    return canvas.toDataURL('image/jpeg',0.75);
  }finally{image.close()}
}
export function EquipmentForm({existing,query,catalog,onSave}){
  const [name,setName]=useState(existing?.name??query);
  const [roles,setRoles]=useState(()=>Object.fromEntries([
    ...(existing?.p||[]).map(k=>[k,'primary']),...(existing?.s||[]).map(k=>[k,'secondary'])
  ]));
  const [error,setError]=useState('');
  const [photo,setPhoto]=useState(existing?.photo||'');
  const [photoError,setPhotoError]=useState('');
  const [loading,setLoading]=useState(false);
  async function choosePhoto(event){
    const file=event.target.files[0];
    event.target.value='';
    if(!file)return;
    setLoading(true);setPhotoError('');
    try{setPhoto(await resizePhoto(file))}
    catch{setPhotoError('이 사진을 열 수 없습니다. JPG, PNG 또는 WebP 사진을 선택하세요.')}
    finally{setLoading(false)}
  }
  function submit(event){
    event.preventDefault();
    if(loading)return;
    const cleaned=name.trim();
    const normalize=s=>s.normalize('NFKC').replace(/\s+/g,'').toLowerCase();
    if(!cleaned){setError('기구 이름을 입력하세요.');return}
    if(catalog.some(x=>x.id!==existing?.id&&normalize(x.name)===normalize(cleaned))){setError('같은 이름이 이미 있습니다. 운동명이나 기구 모델을 덧붙여 주세요.');return}
    const data=new FormData(event.currentTarget);
    const inputUrl=data.get('videoUrl').trim();
    const videoUrl=inputUrl?safeVideoUrl(inputUrl):'';
    if(videoUrl===null){setError('https://로 시작하는 공개 영상 주소를 입력하세요.');return}
    const muscles=role=>Object.keys(groups).filter(k=>roles[k]===role);
    onSave({id:existing?.id??crypto.randomUUID(),custom:true,name:cleaned,en:'',gear:data.get('gear'),p:muscles('primary'),s:muscles('secondary'),notes:data.get('notes').trim(),photo,videoUrl});
  }
  return <form onSubmit={submit}><label>기구 또는 운동 이름<input autoFocus required maxLength={90} value={name} onChange={e=>setName(e.target.value)} placeholder="헬스장 기구에 적힌 이름"/></label>
    <label>기구 종류<select name="gear" defaultValue={existing?.gear||'머신'}>{['머신','케이블','바벨','덤벨','맨몸','기타'].map(n=><option key={n}>{n}</option>)}</select></label>
    <label>기구 사진 (선택 사항)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} disabled={loading}/></label>
    {photoError&&<p role="alert">{photoError}</p>}
    {photo&&<div className="photoPreview"><img src={photo} alt="기구 사진 미리보기"/><button type="button" className="textbtn" onClick={()=>setPhoto('')} disabled={loading}>사진 제거</button></div>}
    <details open={existing?undefined:true}><summary>운동 부위 선택 (선택 사항)</summary><p className="sub">모르면 이름만 저장하세요. 나중에 부위를 지정하면 이전 기록도 회복 일정에 반영됩니다.</p>
    <div className="muscleRoles">{Object.entries(groups).map(([k,v])=><label key={k}>{v}<select value={roles[k]||''} onChange={ev=>setRoles({...roles,[k]:ev.target.value})}><option value="">미선택</option><option value="primary">주동근</option><option value="secondary">보조근</option></select></label>)}</div></details>
    <label>운동방법 · 호흡 메모 (선택 사항)<textarea name="notes" rows="3" defaultValue={existing?.notes||''} placeholder="기구 안내판이나 트레이너에게 배운 내용을 적으세요."/></label>
    <label>시범 영상 링크 (선택 사항)<input name="videoUrl" type="url" maxLength={2048} defaultValue={existing?.videoUrl||''} placeholder="https://…" /></label>
    {error&&<p role="alert">{error}</p>}<button className="cta wide" disabled={loading}>기구 저장</button></form>
}
