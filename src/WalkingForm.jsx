import React,{useState} from 'react';
import {Save} from 'lucide-react';
import {localInput} from './data';

export function WalkingForm({exercise,record,onSave}){
  const [error,setError]=useState('');
  function submit(event){
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const time=new Date(data.get('time')).getTime();
    if(!Number.isFinite(time)||time>Date.now()){
      setError('걸은 날짜와 시간을 현재 또는 과거로 입력하세요.');
      return;
    }
    const optional=name=>data.get(name)===''?null:Number(data.get(name));
    onSave({
      id:record?.id??crypto.randomUUID(),ex:exercise.id,time,
      walk:{minutes:Number(data.get('minutes')),speed:optional('speed'),incline:optional('incline')}
    });
  }
  const maximum=localInput(Date.now());
  return <form onSubmit={submit}>
    <p className="sub">러닝머신 · 빠르게 걷기</p>
    <label>걸은 날짜와 시간<input name="time" required type="datetime-local" max={maximum} defaultValue={record?localInput(record.time):maximum}/></label>
    <label>걸은 시간 (분)<input name="minutes" required type="number" min="1" step="1" inputMode="numeric" defaultValue={record?.walk.minutes}/></label>
    <label>평균 속도 (km/h) · 선택<input name="speed" type="number" min="0.1" step="0.1" inputMode="decimal" defaultValue={record?.walk.speed??''}/></label>
    <label>경사 (%) · 선택<input name="incline" type="number" step="0.1" inputMode="decimal" defaultValue={record?.walk.incline??''}/></label>
    {error&&<p role="alert">{error}</p>}
    <button className="cta wide"><Save size={17}/> 걷기 기록 저장</button>
  </form>
}
