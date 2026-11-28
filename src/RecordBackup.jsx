import React,{useEffect,useState} from 'react';
import {Cloud,Download,RotateCcw,Trash2,Upload} from 'lucide-react';
import {combineBackup,currentBackup,validatedBackup} from './recordBackup';
import {writeRestored} from './recordStorage';
import {isNative,shareBackupFile} from './native';
import {DEFAULT_SYNC_URL,connectSync,deleteServerHistory,disconnectSync,onSyncChange,restoreServerHistory,scheduleSync,serverHistory,syncConfig,syncNow,syncStatus} from './sync';

export function RecordBackup({onRestore}){
  const [pending,setPending]=useState(null);
  const [useBackupEdits,setUseBackupEdits]=useState(false);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  async function protectDeviceStorage(){
    try{
      const granted=await navigator.storage?.persist?.();
      setStatus(granted?'브라우저의 자동 정리에서 운동 기록 저장공간을 보호하도록 설정했습니다.':'이 브라우저는 자동 정리 보호를 허용하지 않았습니다. 백업 파일을 별도로 저장하세요.');
    }catch{setStatus('브라우저 저장 보호를 설정하지 못했습니다. 백업 파일을 별도로 저장하세요.')}
  }
  async function download(){
    const date=new Date();
    const backup=currentBackup();
    const name='근육지도-백업-'+date.toISOString().slice(0,19).replaceAll(':','')+'.json';
    if(isNative()){
      try{
        await shareBackupFile(name,JSON.stringify(backup,null,2));
        setStatus('백업 파일을 공유했습니다. 선택한 곳(드라이브, 내 파일 등)에 저장됐는지 확인하세요.');
      }catch(e){
        setStatus(/cancel/i.test(e?.message||'')?'저장을 취소했습니다. 백업 파일이 만들어지지 않았어요.':'백업 파일을 만들지 못했습니다. 다시 시도하세요.');
      }
      return;
    }
    const address=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));
    const a=document.createElement('a');
    a.href=address;a.download=name;
    a.click();setTimeout(()=>URL.revokeObjectURL(address),1000);
    setStatus('백업 파일을 만들었습니다. 휴대폰의 다운로드 폴더를 확인하세요.');
  }
  function preview(bundle){
    setPending(validatedBackup(bundle));
    setUseBackupEdits(false);setStatus('');
  }
  async function readFile(event){
    const file=event.target.files?.[0];
    event.target.value='';
    if(!file)return;
    setPending(null);
    try{preview(JSON.parse(await file.text()))}
    catch(e){setStatus(e instanceof SyntaxError?'JSON 백업 파일을 읽을 수 없어요.':e.message)}
  }
  function apply(){
    if(!pending)return;
    try{
      const data=combineBackup(currentBackup(),pending,useBackupEdits);
      writeRestored(data);
      scheduleSync();
      onRestore(data.workouts);
    }catch{setStatus('이 기기에 복원할 수 없었습니다. 공간을 확인하고 원본 파일을 보관하세요.')}
  }
  return <div className="backupPanel">
    <p className="sub">운동·걷기 기록, 사용자 기구와 사진, 안정화·스트레칭·관찰 기록 및 설정을 한 파일로 보관합니다.</p>
    <button className="cta wide" type="button" onClick={download}><Download size={17}/> 백업 파일 저장</button>
    <button className="textbtn" type="button" onClick={protectDeviceStorage}>이 기기 저장 보호 요청</button>
    <label className="backupFile"><Upload size={17}/> 백업 파일 열기 <input type="file" accept="application/json,.json" onChange={readFile}/></label>
    {pending&&<section className="backupReview" aria-label="복원 확인">
      <strong>복원할 파일</strong>
      <p>운동·걷기 {pending.workouts.logs.length}건 · 직접 추가한 기구 {pending.workouts.custom.length}개 · 동작 기록 {Object.values(pending.mobility).flat().length}건</p>
      <p>기존 기록에 합칩니다. ID가 같은 기록은 기본 설정에서 현재 내용이 유지됩니다.</p>
      <label><input type="checkbox" checked={useBackupEdits} onChange={event=>setUseBackupEdits(event.target.checked)}/> 같은 기록의 수정 내용도 백업 기준으로 복원</label>
      <button className="outline wide" type="button" onClick={apply}>기록에 합치기</button>
    </section>}
    <ServerSync onRestore={onRestore}/>
    {busy&&<p role="status">서버에 연결하는 중입니다.</p>}
    {status&&<p className="backupStatus" role="status">{status}</p>}
  </div>;
}

const when=t=>new Date(t).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});
function ServerSync({onRestore}){
  const [config,setConfig]=useState(syncConfig());
  const [state,setState]=useState(syncStatus());
  const [url,setUrl]=useState(config.url||DEFAULT_SYNC_URL);
  const [key,setKey]=useState('');
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [history,setHistory]=useState(null);
  const [ask,setAsk]=useState(null);
  useEffect(()=>onSyncChange(()=>{setConfig(syncConfig());setState(syncStatus())}),[]);
  async function run(job){setBusy(true);setMessage('');try{await job()}catch(e){setMessage(e.message||'서버에 연결하지 못했어요.')}finally{setBusy(false)}}
  const connect=()=>run(async()=>{
    if(!/^https:\/\//.test(url.trim())||!key.trim())throw new Error('서버 주소(https://…)와 인증키를 입력하세요.');
    await connectSync(url,key);setKey('');
  });
  const loadHistory=()=>run(async()=>setHistory(await serverHistory()));
  const restore=rev=>run(async()=>{const data=await restoreServerHistory(rev);onRestore(data.workouts);setAsk(null);setHistory(await serverHistory())});
  const remove=rev=>run(async()=>{await deleteServerHistory(rev);setAsk(null);setHistory(await serverHistory())});
  const connected=!!(config.url&&config.key);
  return <section className="backupServer backupReview" aria-label="VPS 자동 저장">
    <strong><Cloud size={17}/> VPS 자동 저장</strong>
    {!connected?<>
      <p>연결하면 운동 기록을 추가·수정·삭제할 때마다 서버에 자동으로 저장합니다. 앱을 지우고 다시 깔아도 연결만 하면 기록이 돌아와요.</p>
      <label>서버 주소<input type="url" value={url} onChange={e=>setUrl(e.target.value)}/></label>
      <label>인증키<input type="password" autoComplete="off" value={key} onChange={e=>setKey(e.target.value)} placeholder="받은 인증키를 입력하세요"/></label>
      <button className="cta wide" type="button" disabled={busy} onClick={connect}>연결하고 자동 저장 켜기</button>
    </>:<>
      <p>{state.message||(config.lastSync?'마지막 저장: '+when(config.lastSync):'연결됨')}{config.dirty&&state.state!=='saving'?' · 아직 저장 안 된 변경이 있어요':''}</p>
      <div className="backupActions">
        <button className="outline" type="button" disabled={busy} onClick={()=>run(()=>syncNow('manual'))}>지금 저장</button>
        <button className="outline" type="button" disabled={busy} onClick={loadHistory}>저장 기록 보기</button>
      </div>
      {history&&<ul className="syncHistory">
        {history.items.map(item=><li key={item.rev}>
          <div><b>{when(item.savedAt)}</b><small>운동 {item.counts.logs}건 · 기구 {item.counts.custom}개 · 동작 {item.counts.mobility}건{item.rev===history.current?' · 현재':''}</small></div>
          {item.rev!==history.current&&<span>
            <button className="textbtn" type="button" aria-label="이 시점으로 되돌리기" onClick={()=>setAsk({rev:item.rev,what:'restore',item})}><RotateCcw size={16}/></button>
            <button className="textbtn" type="button" aria-label="이 저장 기록 삭제" onClick={()=>setAsk({rev:item.rev,what:'delete',item})}><Trash2 size={16}/></button>
          </span>}
        </li>)}
        {!history.items.length&&<li>아직 저장된 기록이 없어요.</li>}
      </ul>}
      {ask&&<div className="backupReview">
        <p>{ask.what==='restore'?when(ask.item.savedAt)+' 시점(운동 '+ask.item.counts.logs+'건)으로 이 기기 기록을 바꿀까요? 지금 기록도 서버 저장 기록에 남아 있어 다시 되돌릴 수 있어요.':when(ask.item.savedAt)+' 저장 기록을 서버에서 지울까요? 지운 저장 기록은 되돌릴 수 없어요.'}</p>
        <div className="backupActions">
          <button className="cta" type="button" disabled={busy} onClick={()=>ask.what==='restore'?restore(ask.rev):remove(ask.rev)}>{ask.what==='restore'?'되돌리기':'지우기'}</button>
          <button className="outline" type="button" onClick={()=>setAsk(null)}>취소</button>
        </div>
      </div>}
      <button className="textbtn" type="button" onClick={()=>{disconnectSync();setHistory(null)}}>이 기기 연결 끊기</button>
    </>}
    {message&&<p className="backupStatus" role="status">{message}</p>}
  </section>;
}
