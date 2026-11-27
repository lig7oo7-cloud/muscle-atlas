import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Dumbbell,Activity,CalendarDays,Layers,Settings2,Search,Plus,X,Check,BookOpen,History,Clock3,ChevronRight,Trash2,Moon,Sun,Target,Filter,Save,Download,PlayCircle} from 'lucide-react';
import {groups,large,exercises as defaultsCatalog,summary,readiness,dateText,localInput,walkingSchedule,walkingText,treadmill} from './data';
import {bodyMap} from './body';
import './styles.css';
import {ExerciseMuscles} from './ExerciseMuscles';
import {exerciseMovement} from './exerciseMuscles';
import {AnatomyAtlas,MuscleCard} from './AnatomyAtlas';
import {TodayMuscles} from './MuscleStudy';
import {equipmentSection} from './workoutSections';
import {MobilityPanel} from './MobilityPanel';
import {Recommendations} from './Recommendations';
import {useAppInstall} from './useAppInstall';
import {WalkingForm} from './WalkingForm';
import {RecordBackup} from './RecordBackup';
import {readSaved,writeSaved,recoverMissingRecords,workoutKey} from './recordStorage';
import {guides} from './guides';
import {onBackButton,isNative} from './native';
import {useHealth,connectHealth,latestWeight} from './health';
import {logCalories} from './calories';
import {Footprints,Flame,RefreshCw} from 'lucide-react';
const defaults={big:72,small:48,dark:matchMedia('(prefers-color-scheme: dark)').matches};
const names=keys=>keys.map(k=>groups[k]).join(' · ');
const stockPhotos=import.meta.glob('./equipment/*.webp',{eager:true,query:'?url&no-inline',import:'default'});
function EquipmentPhoto({exercise,detail=false}){
  const [failed,setFailed]=useState(false);
  const source=exercise.photo||stockPhotos[`./equipment/${exercise.id}.webp`];
  if(!source||failed)return detail?null:<Dumbbell size={24} aria-hidden="true"/>;
  return <img className={detail?'equipmentLarge':'equipmentThumb'} src={source}
    alt={detail?exercise.name+(exercise.custom?' 기구 사진':' 참고 이미지'):''}
    loading={detail?'eager':'lazy'} onError={()=>setFailed(true)}/>;
}
function Figure({e,side}){return <div className="figure" dangerouslySetInnerHTML={{__html:bodyMap(e.p,e.s,side)}}/>}
function Modal({title,close,children}){const ref=React.useRef(null);useEffect(()=>{const d=ref.current;d.showModal();return()=>d.close()},[]);return <dialog ref={ref} onCancel={close} onClick={e=>{if(e.target===ref.current)close()}}><article><header><h2>{title}</h2><button className="icon" aria-label="닫기" onClick={close}><X/></button></header>{children}</article></dialog>}
function RecordForm({e,record,last,onSave}){const [time,setTime]=useState(localInput(record?.time||Date.now())),[sets,change]=useState((record?.sets||last?.sets||[{kg:'',reps:''}]).map(s=>({...s}))),[err,error]=useState('');function update(i,k,v){change(sets.map((s,j)=>i===j?{...s,[k]:v}:s))}
return <form onSubmit={ev=>{ev.preventDefault();const t=new Date(time).getTime();if(!Number.isFinite(t)||t>Date.now()){error('운동한 시각을 현재 또는 과거로 입력하세요.');return}onSave({id:record?.id||crypto.randomUUID(),ex:e.id,time:t,sets:sets.map(s=>({kg:Number(s.kg),reps:Number(s.reps)}))})}}><p className="sub">{e.name} · {names(e.p)}</p><label>운동 날짜와 시간<input required type="datetime-local" value={time} max={localInput(Date.now())} onChange={ev=>setTime(ev.target.value)}/></label><div className="setrow labels"><span>세트</span><span>무게 (kg)</span><span>횟수 (회)</span></div>{sets.map((s,i)=><div className="setrow" key={i}><b>{i+1}</b><input required aria-label={i+1+'세트 무게'} placeholder="0" type="number" min="0" step="any" value={s.kg} onChange={ev=>update(i,'kg',ev.target.value)}/><input required aria-label={i+1+'세트 반복 횟수'} placeholder="10" type="number" min="1" step="1" value={s.reps} onChange={ev=>update(i,'reps',ev.target.value)}/><button type="button" className="icon" disabled={sets.length===1} aria-label="세트 삭제" onClick={()=>change(sets.filter((_,j)=>i!==j))}><X size={16}/></button></div>)}<button className="outline wide" type="button" onClick={()=>change([...sets,{...sets.at(-1)}])}><Plus size={17}/> 세트 추가</button><small>맨몸 운동은 0 kg, 덤벨은 한 손 기준으로 입력하세요.</small>{err&&<p role="alert">{err}</p>}<button className="cta wide"><Save size={17}/> 기록 저장</button></form>}
function WalkingSchedule({schedule,now}){
  const today=new Date(now);
  today.setHours(0,0,0,0);
  const status=schedule?.next===+today?' · 오늘 예정':schedule&&schedule.next<+today?' · 예정일 지남':'';
  return <div className="walkSchedule"><strong>다음 빠르게 걷기</strong>
    {schedule?<><span>{dateText(schedule.next)}{status}</span>
    <small>최근 {dateText(schedule.last.time)} · {walkingText(schedule.last.walk)}</small></>:<small>첫 걸음 기록을 저장하면 이틀 뒤 날짜가 표시됩니다.</small>}
  </div>
}
function TodayHealth({health,linked,todayKcal,todayMeasured,bodyKg,onConnect}){
  const d=health.data;
  return <section className="panel todayHealth">
    <div className="sectiontitle"><h2>오늘 활동</h2>{linked&&<button className="icon" aria-label="새로고침" onClick={health.refresh}><RefreshCw size={17}/></button>}</div>
    <div className="healthStats">
      {isNative()&&linked&&<>
        <div><Footprints size={20}/><small>걸음 수</small><strong>{d?.steps!=null?Math.round(d.steps).toLocaleString():'–'}<em>걸음</em></strong></div>
        <div><Flame size={20}/><small>활동 칼로리 (삼성헬스)</small><strong>{d?.activeKcal!=null?Math.round(d.activeKcal).toLocaleString():'–'}<em>kcal</em></strong></div>
      </>}
      <div><Dumbbell size={20}/><small>오늘 운동 소모 ({todayMeasured?'핏 측정 기반':'추정'})</small><strong>{Math.round(todayKcal)}<em>kcal</em></strong></div>
    </div>
    {isNative()&&!linked&&<button className="outline wide" onClick={onConnect}>삼성헬스 연결하고 걸음 수 보기</button>}
    {health.error&&<p className="sub">{health.error}</p>}
    <p className="sub">운동 칼로리는 체중 {bodyKg} kg 기준입니다. 갤럭시 핏에서 운동을 켜고 하면 실제 측정값으로 계산돼요.</p>
  </section>;
}
function Technique({exercise}){
  if(exercise.cardio)return <div className="technique">
    <h3>러닝머신에서 빠르게 걷기</h3>
    <ol><li>기구에 안전 클립이 있으면 옷에 고정하세요. 낮은 속도에서 걷기 시작하세요.</li>
    <li>시선은 앞을 보고, 편하게 걷는 보폭을 유지하면서 속도를 조금씩 올리세요.</li>
    <li>걷는 동안 숨을 자연스럽게 쉬세요. 마칠 때는 속도를 서서히 낮춘 뒤 벨트가 완전히 멈추면 내려오세요.</li></ol>
  </div>;
  if(exercise.custom)return <div className="technique"><p style={{whiteSpace:"pre-wrap"}}>{exercise.notes||"작성된 메모가 없습니다."}</p></div>;
  const [equipment,setup,first,second,lowerFirst]=guides[exercise.name];
  return <div className="technique"><p>{equipment}</p><h3>시작 자세</h3><p>{setup}</p><h3>한 번의 움직임과 호흡</h3><ol>{[first,second].map((step,i)=><li key={step}><b>{(lowerFirst ? i===0 : i===1) ? '들이쉬면서' : '내쉬면서'}</b>{step}</li>)}</ol><small>처음에는 가볍게 연습하고, 관절에 통증이 느껴지면 멈추세요.</small></div>
}
function App(){const [initial]=useState(()=>readSaved(workoutKey));
const [logs,setLogs]=useState(initial.logs||[]),[prefs,setPrefs]=useState({...defaults,...initial.prefs}),[tab,T]=useState(0),[id,I]=useState(0),[filter,F]=useState('all'),[q,Q]=useState(''),[modal,M]=useState(''),[editing,E]=useState(null),[toast,S]=useState(''),[now,N]=useState(Date.now()),[side,V]=useState('both'),[weekday,W]=useState('all'),[category,setCategory]=useState('machine'),[otherGear,setOtherGear]=useState(false),[study,setStudy]=useState(null),[muscleExercise,setMuscleExercise]=useState(null),[muscleCard,setMuscleCard]=useState(null);
const {installed,install}=useAppInstall(()=>M('install'));
const tabRef=React.useRef(tab);tabRef.current=tab;
useEffect(()=>onBackButton(()=>{
  const open=[...document.querySelectorAll('dialog[open]')].pop();
  if(open){open.dispatchEvent(new Event('cancel',{cancelable:true}));return true}
  if(tabRef.current!==0){navigate(0);return true}
  return false;
}),[]);
useEffect(()=>{const timer=setInterval(()=>N(Date.now()),30000);return()=>clearInterval(timer)},[]);useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>S(''),3000);return()=>clearTimeout(timer)},[toast]);useEffect(()=>{document.documentElement.dataset.theme=prefs.dark?'dark':'light'},[prefs.dark]);
const [custom,setCustom]=useState(initial.custom||[]);
useEffect(()=>{
  function syncRecords(event){
    if(event.key!==workoutKey||event.newValue===null)return;
    const data=readSaved(workoutKey);
    setLogs(data.logs||[]);setCustom(data.custom||[]);setPrefs({...defaults,...data.prefs});
  }
  window.addEventListener('storage',syncRecords);
  return ()=>window.removeEventListener('storage',syncRecords);
},[]);
const exercises=[...defaultsCatalog,...custom];
const health=useHealth(!!prefs.healthLinked);
const bodyKg=prefs.bodyKg||70;
const byId=new Map(exercises.map(x=>[x.id,x]));
const missing={name:'삭제된 운동',p:[],s:[],gear:''};
const exerciseOf=key=>byId.get(key)||missing;
const calories=logCalories(logs,byId,bodyKg,health.data?.workouts);
const todayStart=new Date(now);todayStart.setHours(0,0,0,0);
const todayLogs=logs.filter(l=>l.time>=+todayStart);
const todayKcal=todayLogs.reduce((sum,l)=>sum+(calories[l.id]?.kcal||0),0);
const todayMeasured=todayLogs.some(l=>calories[l.id]?.measured);
async function linkHealth(){
  try{
    await connectHealth();
    const weight=prefs.bodyKg?null:await latestWeight();
    if(commit(logs,{...prefs,healthLinked:true,...(weight?{bodyKg:Math.round(weight*10)/10}:{})}))S('삼성헬스를 연결했습니다.');
  }catch(e){S(e?.message||'연결하지 못했습니다.')}
}
function commit(ls,ps,items=custom){try{writeSaved(workoutKey,{logs:ls,prefs:ps,custom:items});setCustom(items);setLogs(ls);setPrefs(ps);return true}catch{S('저장 공간을 확인하세요. 기록을 저장하지 못했습니다.');return false}}
const e=byId.get(id)||defaultsCatalog[0],LogForm=e.cardio?WalkingForm:RecordForm,stat=summary(logs,id),weekStart=new Date(now);weekStart.setHours(0,0,0,0);weekStart.setDate(weekStart.getDate()-(weekStart.getDay()+6)%7);const weekly=logs.filter(l=>l.time>=+weekStart),worked=new Set(weekly.flatMap(l=>exerciseOf(l.ex).p));
const walkSchedule=walkingSchedule(logs);
const weeklyWalk=weekly.reduce((minutes,log)=>minutes+(log.walk?.minutes||0),0);
const visible=exercises.filter(x=>equipmentSection(x)===(category==='machine'&&otherGear?'other':category)).filter(x=>(filter==='all'||(filter==='cardio'?x.cardio:x.p.includes(filter)||x.s.includes(filter)))&&[x.name,x.en,x.gear,x.aliases,names([...x.p,...x.s])].join(' ').toLowerCase().replaceAll(' ','').includes(q.toLowerCase().replaceAll(' ','')));
function select(x){I(x.id);V('both');if(window.innerWidth<800)document.querySelector('#atlas')?.scrollIntoView({block:'start'})}
function openMuscle(muscle,exercise){setMuscleCard({muscle,exercise})}
function navigate(i){setMuscleCard(null);setMuscleExercise(null);T(i);window.scrollTo(0,0)}
function changeCategory(value,other=false){
  setCategory(value);setOtherGear(other);setStudy(null);F('all');Q('');
  if(value!=='stretch'){
    const first=exercises.find(exercise=>equipmentSection(exercise)===(other?'other':value));
    if(first){I(first.id);V('both')}
  }
}
function showExercise(exercise,bodyFilter='all'){
  const section=equipmentSection(exercise);
  setOtherGear(section==='other');setCategory(section==='dumbbell'?'dumbbell':'machine');
  F(bodyFilter);Q('');select(exercise);navigate(0);
}
function showStudy(lesson){
  setCategory('stretch');setStudy(lesson);navigate(0);
}
return <><header className="top"><div className="shell flex items-center justify-between"><div className="brand"><i><Dumbbell size={22}/></i>근육지도</div><div className="tools">{!installed&&<button className="outline installButton" onClick={install}><Download size={16}/> 앱 설치</button>}<span><CalendarDays size={15}/>{dateText(now)}</span><button className="icon" aria-label="설정" onClick={()=>M('settings')}><Settings2 size={19}/></button></div></div></header>
<main className="shell"><section className="intro"><div><div className="kicker"><b/> TRAINING ATLAS</div><h1>{['운동 도감','운동 기록','회복 일정','근육 도감'][tab]}</h1><p>{['운동을 고르고, 자극되는 근육을 확인하세요.','날짜와 요일별로 세트와 최고 중량을 확인하세요.','근육별 휴식시간과 이번 주 운동한 부위를 확인하세요.','부위와 동작으로 근육을 찾아보세요.'][tab]}</p></div>{tab===0&&category!=='stretch'&&<button className="outline recommendEntry" onClick={()=>navigate(2)}><Dumbbell size={18}/> 추천 운동</button>}<div className="week"><Activity size={19}/><div><small>이번 주 운동</small><strong>{weekly.reduce((n,l)=>n+(l.sets?.length||0),0)} <em>세트</em></strong>{weeklyWalk>0&&<small>걷기 {weeklyWalk}분</small>}</div></div></section>
{tab===3&&<AnatomyAtlas catalog={exercises} onExercise={exercise=>{I(exercise.id);V('both');M('guide')}} onLesson={showStudy}/>}
{tab===0&&<div className="workoutSections" aria-label="운동 도감 분류">
  {[['machine','머신'],['dumbbell','덤벨'],['stretch','스트레칭']].map(([value,label])=><button key={value} aria-pressed={category===value} onClick={()=>changeCategory(value)}>{label}</button>)}
</div>}
{tab===0&&category==='stretch'&&<MobilityPanel key={study||'stretch-menu'} now={now} initialMove={study} onMuscle={openMuscle}/>}
{tab===1&&<TodayHealth health={health} linked={!!prefs.healthLinked} todayKcal={todayKcal} todayMeasured={todayMeasured} bodyKg={bodyKg} onConnect={linkHealth}/>}
{tab===1&&<TodayMuscles logs={logs} catalog={exercises} now={now} onStudy={showStudy}/>}
{tab===0&&category!=='stretch'&&<div className="layout"><section id="atlas" className="atlas"><div className="atlasHead"><div className="kicker warm"><b/> {e.cardio?'빠르게 걷기':'MUSCLE MAP'}</div><span>{e.gear}</span></div><div className="exerciseHeading"><div className="headingPhoto"><EquipmentPhoto key={e.id+(e.photo||"")} exercise={e}/></div><div><h2>{e.name}</h2>{e.en&&<p className="english">{e.en}</p>}</div></div>{exerciseMovement(e.id)&&<button className="methodBtn" aria-haspopup="dialog" onClick={()=>setMuscleExercise(e)}><BookOpen size={17}/> 이 동작에서 쓰는 근육</button>}<button className="methodBtn" onClick={()=>M('guide')}><BookOpen size={17}/> {e.custom?"운동방법 · 호흡 메모":"운동방법 · 호흡법 보기"}</button>{e.cardio?<WalkingSchedule schedule={walkSchedule} now={now}/>:<><div className="stage"><div className="axis"/>{(side==='both'?['front','back']:[side]).map(v=><div className="model" key={v}><Figure e={e} side={v}/><b>{v==='front'?'전면':'후면'}</b></div>)}</div><div className="switch">{[['both','전체'],['front','전면'],['back','후면']].map(([v,n])=><button aria-pressed={v===side} key={v} onClick={()=>V(v)}>{n}</button>)}</div><div className="legend"><p><i/>주동근 <strong>{names(e.p)||"미지정"}</strong></p><p><i/>보조근 <strong>{names(e.s)||'등록 없음'}</strong></p></div><div className="best"><span>{e.gear==='맨몸'?'내 최고 반복':'내 최고 중량'}</span><strong>{stat?(e.gear==='맨몸'?stat.maxReps+'회':stat.max+' kg'):'기록 없음'}</strong></div>{stat&&<small>최근 {dateText(stat.last.time)} · {stat.last.sets.length}세트</small>}</>}<button className="cta wide" onClick={()=>{E(null);M('record')}}><Plus size={19}/> {e.cardio?'걷기 기록하기':'이 운동 기록하기'}</button></section>
<section className="library"><div className="sectiontitle"><h2>운동 라이브러리</h2><span>{visible.length}개 운동</span></div>{category==='machine'&&<div className="recommendControls" aria-label="기구 운동 분류"><button aria-pressed={!otherGear} onClick={()=>changeCategory('machine')}>머신·케이블·유산소</button><button aria-pressed={otherGear} onClick={()=>changeCategory('machine',true)}>바벨·맨몸·기타</button></div>}<div className="search"><Search size={19}/><input aria-label="운동 검색" placeholder="운동명, 기구, 근육 검색" value={q} onChange={ev=>Q(ev.target.value)}/>{q&&<button aria-label="검색 지우기" onClick={()=>Q('')}><X size={16}/></button>}</div><div className="filters"><Filter size={16}/><select aria-label="근육 부위 필터" value={filter} onChange={ev=>F(ev.target.value)}><option value="all">전체 부위</option><option value="cardio">유산소</option>{Object.entries(groups).map(([k,n])=><option key={k} value={k}>{n}</option>)}</select><button aria-pressed={filter==='cardio'} onClick={()=>F(filter==='cardio'?'all':'cardio')}>유산소</button>{['chest','back','quads'].map(k=><button aria-pressed={filter===k} key={k} onClick={()=>F(filter===k?'all':k)}>{groups[k]}</button>)}</div><div className="cards">{visible.map(x=><button className={'exercise '+(x.id===id?'selected':'')} key={x.id} onClick={()=>select(x)}><div className="thumb"><EquipmentPhoto key={x.photo||x.id} exercise={x}/></div><div><small>{x.gear}</small><h3>{x.name}</h3><p>{x.cardio?"빠르게 걷기":names(x.p)||"부위 미지정"}</p></div>{x.id===id?<Check className="end" size={17}/>:<ChevronRight className="end" size={16}/>}</button>)}</div>{!visible.length&&<p className="empty">조건에 맞는 운동이 없습니다. <button onClick={()=>{F('all');Q('')}}>필터 초기화</button></p>}</section></div>}
{tab===1&&<section className="panel"><div className="sectiontitle"><h2>운동 일지</h2><select aria-label="요일별 기록" value={weekday} onChange={ev=>W(ev.target.value)}><option value="all">모든 요일</option>{[...'일월화수목금토'].map((d,i)=><option key={i} value={i}>{d}요일</option>)}</select></div>{!logs.filter(l=>weekday==='all'||new Date(l.time).getDay()===Number(weekday)).length&&<div className="empty"><History/><h3>아직 이곳에 기록이 없어요</h3><button className="outline" onClick={()=>navigate(0)}>운동 선택하기</button></div>}{logs.slice().sort((a,b)=>b.time-a.time).filter(l=>weekday==='all'||new Date(l.time).getDay()===Number(weekday)).map(l=><div className="entry" key={l.id}><small>{dateText(l.time,true)}</small><h3>{exerciseOf(l.ex).name}</h3>{l.walk?<p>{walkingText(l.walk)}</p>:<><p>{exerciseOf(l.ex).gear==='맨몸'?'당일 최고 '+Math.max(...l.sets.map(s=>s.reps))+'회':'당일 기록 최고 '+Math.max(...l.sets.map(s=>s.kg))+' kg'} · {l.sets.length}세트</p><div className="chips">{l.sets.map((s,i)=><span key={i}>{i+1}세트　{s.kg} kg × {s.reps}회</span>)}</div></>}{calories[l.id]&&<p className="kcal"><Flame size={14}/> 약 {Math.round(calories[l.id].kcal)} kcal · {calories[l.id].measured?'핏 측정 기반':'추정'}</p>}{exerciseMovement(l.ex)&&<button className="textbtn" onClick={()=>setMuscleExercise(byId.get(l.ex))}>쓴 근육 보기</button>}{byId.has(l.ex)&&<button className="textbtn" onClick={()=>{I(l.ex);E(l);M('record')}}>수정</button>}<button className="textbtn" onClick={()=>{E(l);M('delete')}}>삭제</button></div>)}</section>}
{tab===2&&<><Recommendations onMuscles={setMuscleExercise} logs={logs} catalog={exercises} prefs={prefs} now={now} onOpen={showExercise}/><section className="panel"><WalkingSchedule schedule={walkSchedule} now={now}/><button className="outline walkShortcut" onClick={()=>showExercise(treadmill,'cardio')}>러닝머신 열기</button><div className="sectiontitle"><h2>이번 주 전신 운동</h2><strong>{worked.size} / {Object.keys(groups).length}부위</strong></div><progress max={Object.keys(groups).length} value={worked.size}/><p className="sub">주동근 기준으로 집계합니다. 부위를 누르면 관련 운동을 볼 수 있어요.</p><div className="recovery">{Object.entries(groups).map(([k,n])=>{const due=readiness(logs,k,prefs,exercises);return <button key={k} onClick={()=>{const exercise=exercises.find(x=>x.p.includes(k));if(exercise)showExercise(exercise,k)}}><div><small>{large.includes(k)?'대근육':'소근육·기타'} · {worked.has(k)?'이번 주 운동함':'이번 주 미기록'}</small><h3>{n}</h3></div><div><strong>{!due?'기록 없음':due>now?Math.ceil((due-now)/3600000)+'시간 남음':'예정 휴식 완료'}</strong>{!!due&&<small>{dateText(due,true)} 이후</small>}</div></button>})}</div><p className="sub">주동근과 보조근의 마지막 사용 시각에 설정한 휴식시간을 더한 일정입니다. 통증이나 피로가 남으면 휴식을 늘리세요.</p></section></>}
</main><nav><div>{[[0,BookOpen,'운동 도감'],[3,Layers,'근육 도감'],[1,History,'운동 기록'],[2,Clock3,'회복 일정']].map(([i,Icon,label])=><button aria-current={tab===i?'page':undefined} key={label} onClick={()=>navigate(i)}><Icon size={21}/>{label}</button>)}</div></nav>
{modal==='guide'&&<Modal title={e.name+' 운동방법'} close={()=>M('')}><EquipmentPhoto key={e.id} exercise={e} detail/>{!e.custom&&<small className="photoCaption">AI로 만든 기구 참고 이미지</small>}<Technique exercise={e}/>{exerciseMovement(e.id)&&<ExerciseMuscles exercise={e} onOpen={openMuscle}/>}{(e.id===22||e.id==='hip-abduction')&&<button className="outline studyAction wide" onClick={()=>{M('');showStudy(e.id===22?'wall-plus':'side-hip-raise')}}>{e.id===22?'날개뼈 움직임 · 푸시업 플러스 보기':'엉덩이 옆 근육 · 다리 벌리기 그림 보기'}</button>}<button className="cta wide" onClick={()=>{E(null);M('record')}}>이 운동 기록하기</button></Modal>}
{modal==='record'&&<Modal title={editing?'운동 기록 수정':e.cardio?'걷기 기록하기':'운동 기록하기'} close={()=>M('')}><LogForm exercise={e} e={e} record={editing} last={stat?.last} onSave={l=>{if(commit([...logs.filter(x=>x.id!==l.id),l],prefs)){M('');S('운동 기록을 저장했습니다.')}}}/></Modal>}
{modal==='delete'&&<Modal title="이 기록을 삭제할까요?" close={()=>M('')}><p>{editing.walk?'다음 걷기 일정이 함께 갱신됩니다.':'해당 세트와 회복 일정이 함께 갱신됩니다.'}</p><button className="cta wide" onClick={()=>{if(commit(logs.filter(x=>x.id!==editing.id),prefs))M('')}}>기록 삭제</button></Modal>}
{modal==='install'&&<Modal title="홈 화면에 설치" close={()=>M('')}><div className="technique"><ol><li>갤럭시에서 이 페이지를 Chrome으로 열어요.</li><li>오른쪽 위 ⋮ 메뉴에서 <b>홈 화면에 추가</b> 또는 <b>앱 설치</b>를 선택하세요.</li><li>설치 후 홈 화면의 <b>근육지도</b> 아이콘을 누르면 열립니다.</li></ol></div></Modal>}
{modal==='backup'&&<Modal title="기록 백업 · 복원" close={()=>M('')}><RecordBackup onRestore={data=>{
  setLogs(data.logs);setCustom(data.custom);setPrefs({...defaults,...data.prefs});setStudy(null);M('');S('백업 기록을 합쳤습니다.');
}}/></Modal>}
{modal==='settings'&&<Modal title="운동 설정" close={()=>M('')}><button type="button" className="outline wide backupEntry" onClick={()=>M('backup')}><Download size={17}/> 기록 백업 · 복원</button><form onSubmit={ev=>{ev.preventDefault();const d=new FormData(ev.target);if(commit(logs,{...prefs,dark:d.get('night')==='on',big:Number(d.get('big')),small:Number(d.get('small')),bodyKg:d.get('bodyKg')?Number(d.get('bodyKg')):null})){M('');S('설정을 저장했습니다.')}}}><p className="sub">휴식시간은 개인 일정의 시작값입니다. 변경하면 기존 기록의 다음 운동 예정 시각도 갱신됩니다.</p>{[['big','대근육'],['small','소근육·기타']].map(([k,n])=><label key={k}>{n} 휴식시간 (시간)<input name={k} required type="number" min="1" max="336" defaultValue={prefs[k]}/></label>)}<label>내 체중 (kg) · 칼로리 계산용<input name="bodyKg" type="number" min="25" max="250" step="0.1" placeholder="70" defaultValue={prefs.bodyKg||''}/></label>{isNative()&&<button type="button" className="outline wide" onClick={linkHealth}>{prefs.healthLinked?'삼성헬스 권한 다시 확인':'삼성헬스 연결 (걸음 수·칼로리)'}</button>}<label className="check"><Moon size={17}/> 다크 모드<input name="night" type="checkbox" defaultChecked={prefs.dark}/></label><button className="cta wide">설정 저장</button></form></Modal>}
{muscleExercise&&<Modal title={muscleExercise.name} close={()=>setMuscleExercise(null)}><ExerciseMuscles exercise={muscleExercise} onOpen={openMuscle}/></Modal>}
{muscleCard&&<MuscleCard muscle={muscleCard.muscle} fromExercise={muscleCard.exercise} catalog={exercises} close={()=>setMuscleCard(null)}/>}
{toast&&<div className="toast" role="status">{toast}</div>}</>}
void recoverMissingRecords().finally(()=>createRoot(document.querySelector('#root')).render(<App/>));
if('serviceWorker' in navigator&&!window.Capacitor?.isNativePlatform?.())window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
