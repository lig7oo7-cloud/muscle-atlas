import React,{useState} from 'react';
import {Cloud,Download,Upload} from 'lucide-react';
import {combineBackup,currentBackup,validatedBackup} from './recordBackup';
import {writeRestored} from './recordStorage';

export function RecordBackup({onRestore}){
  const [pending,setPending]=useState(null);
  const [useBackupEdits,setUseBackupEdits]=useState(false);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  const [url,setUrl]=useState('');
  const [secret,setSecret]=useState('');
  const [confirm,setConfirm]=useState(false);
  async function protectDeviceStorage(){
    try{
      const granted=await navigator.storage?.persist?.();
      setStatus(granted?'브라우저의 자동 정리에서 운동 기록 저장공간을 보호하도록 설정했습니다.':'이 브라우저는 자동 정리 보호를 허용하지 않았습니다. 백업 파일을 별도로 저장하세요.');
    }catch{setStatus('브라우저 저장 보호를 설정하지 못했습니다. 백업 파일을 별도로 저장하세요.')}
  }
  function download(){
    const date=new Date();
    const backup=currentBackup();
    const address=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));
    const a=document.createElement('a');
    a.href=address;a.download='근육지도-백업-'+date.toISOString().slice(0,19).replaceAll(':','')+'.json';
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
      onRestore(data.workouts);
    }catch{setStatus('이 기기에 복원할 수 없었습니다. 공간을 확인하고 원본 파일을 보관하세요.')}
  }
  async function server(operation){
    setConfirm(false);
    let address;
    try{
      address=new URL(url.trim());
      if(address.protocol!=='https:'||address.username||address.password||!secret.trim())throw new Error();
    }catch{setStatus('HTTPS 웹훅 주소와 개인 인증키를 입력하세요.');return}
    setBusy(true);setStatus('');
    if(operation==='restore')setPending(null);
    try{
      const payload=operation==='backup'?{operation,backup:currentBackup()}:{operation};
      const response=await fetch(address,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json','X-Backup-Key':secret.trim()},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const result=await response.json();
      if(operation==='restore')preview(result.backup);
      else{
        if(result.saved!==true)throw new Error('서버 저장 확인 응답이 없습니다.');
        setStatus('n8n이 백업 저장을 확인했습니다.');
      }
    }catch(e){setStatus('서버 연결을 완료하지 못했습니다. 주소·인증·CORS와 n8n 실행 기록을 확인하세요. '+e.message)}
    finally{setBusy(false)}
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
    <details className="backupServer"><summary><Cloud size={17}/> VPS · n8n 백업 연결</summary>
      <p>개인 웹훅을 준비한 뒤 연결하세요. 인증키는 이 화면을 닫으면 저장되지 않습니다.</p>
      <label>HTTPS 웹훅 주소<input type="url" value={url} onChange={e=>{setUrl(e.target.value);setConfirm(false)}} placeholder="https://…/webhook/…"/></label>
      <label>개인 인증키<input type="password" autoComplete="off" value={secret} onChange={e=>{setSecret(e.target.value);setConfirm(false)}}/></label>
      <div className="backupActions">
        <button className="outline" type="button" disabled={busy} onClick={()=>setConfirm(true)}>서버에 백업</button>
        <button className="outline" type="button" disabled={busy} onClick={()=>server('restore')}>서버 백업 열기</button>
      </div>
      {confirm&&<div className="backupReview"><p>입력한 서버 주소로 위에 설명한 백업 전체를 보냅니다.</p><button type="button" className="cta wide" onClick={()=>server('backup')}>이 주소로 보내기</button></div>}
      <details><summary>n8n 연결 규격</summary>
        <p>활성화한 HTTPS POST 웹훅에 Header Auth <code>X-Backup-Key</code>를 설정하고, 허용 출처에 이 앱 주소 <code>{location.origin}</code>를 지정하세요.</p>
        <p><code>operation: "backup"</code>이면 <code>body.backup</code>을 VPS의 데이터베이스나 영구 볼륨에 새 백업으로 저장한 뒤 <code>{'{"saved":true}'}</code>를 응답하세요.</p>
        <p><code>operation: "restore"</code>이면 가장 최근 백업을 <code>{'{"backup": …}'}</code> 형태로 응답하세요. 서버 보존과 별도 백업 정책은 VPS에 설정합니다.</p>
        <a href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/" target="_blank" rel="noreferrer">n8n Webhook 설정 문서</a>
      </details>
    </details>
    {busy&&<p role="status">서버에 연결하는 중입니다.</p>}
    {status&&<p className="backupStatus" role="status">{status}</p>}
  </div>;
}
