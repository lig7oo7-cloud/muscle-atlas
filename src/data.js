export const groups={chest:'가슴',back:'등',shoulders:'어깨',biceps:'이두근',triceps:'삼두근',forearms:'전완근',abs:'복근',glutes:'둔근',quads:'허벅지 앞',hams:'허벅지 뒤',calves:'종아리',adductors:'허벅지 안쪽',abductors:'엉덩이 옆 · 고관절 벌림근',spine:'척추기립근'};
export const large=['chest','back','glutes','quads','hams'];
const rows=[
['체스트 프레스','Chest Press','머신','chest','triceps shoulders'],
['랫 풀다운','Lat Pulldown','케이블','back','biceps forearms'],
['레그 프레스','Leg Press','머신','quads glutes','adductors'],
['숄더 프레스','Shoulder Press','머신','shoulders','triceps'],
['시티드 로우','Seated Row','케이블','back','biceps shoulders'],
['레그 컬','Leg Curl','머신','hams','calves'],
['펙 덱 플라이','Pec Deck Fly','머신','chest','shoulders'],
['벤치 프레스','Bench Press','바벨','chest','triceps shoulders'],
['덤벨 컬','Dumbbell Curl','덤벨','biceps','forearms'],
['트라이셉스 푸시다운','Triceps Pushdown','케이블','triceps',''],
['레터럴 레이즈','Lateral Raise','덤벨','shoulders',''],
['리스트 컬','Wrist Curl','덤벨','forearms',''],
['힙 쓰러스트','Hip Thrust','바벨','glutes','hams'],
['레그 익스텐션','Leg Extension','머신','quads',''],
['힙 어덕션','Hip Adduction','머신','adductors',''],
['스탠딩 카프 레이즈','Standing Calf Raise','머신','calves',''],
['케이블 크런치','Cable Crunch','케이블','abs',''],
['백 익스텐션','Back Extension','로만 체어','spine','glutes hams'],
['루마니안 데드리프트','Romanian Deadlift','바벨','hams glutes','spine forearms'],
['고블릿 스쿼트','Goblet Squat','덤벨','quads glutes','abs adductors'],
['리버스 펙 덱','Reverse Pec Deck','머신','shoulders','back'],
['해머 컬','Hammer Curl','덤벨','forearms biceps',''],
['푸시업','Push-up','맨몸','chest','triceps shoulders'],
['크런치','Crunch','맨몸','abs','']
];
export const exercises=rows.map(([name,en,gear,p,s],id)=>({id,name,en,gear,p:p.split(' '),s:s?s.split(' '):[]}));
export const treadmill={id:'treadmill',name:'러닝머신',en:'Treadmill',gear:'유산소',p:[],s:[],aliases:'런닝머신 트레드밀 빠르게 걷기',cardio:true};
exercises.push(
  {id:'hip-abduction',name:'힙 어브덕션',en:'Hip Abduction',gear:'머신',p:['abductors'],s:[],aliases:'힙 애브덕션 힙 앱덕션 다리 벌리기 허벅지 바깥 엉덩이 옆 중간볼기근 중둔근 작은볼기근 소둔근'},
  treadmill
);

export function walkingSchedule(logs){
  const last=logs.reduce((latest,log)=>log.ex===treadmill.id&&log.walk&&(!latest||log.time>latest.time)?log:latest,null);
  if(!last)return null;
  const next=new Date(last.time);
  next.setDate(next.getDate()+2);
  next.setHours(0,0,0,0);
  return {last,next:+next};
}
export function walkingText({minutes,speed,incline}){
  return [minutes+'분',speed!=null&&speed+' km/h',incline!=null&&'경사 '+incline+'%'].filter(Boolean).join(' · ');
}

export function summary(logs,id){const list=logs.filter(l=>l.ex===id&&Array.isArray(l.sets));return list.length?{max:Math.max(...list.flatMap(l=>l.sets.map(s=>s.kg))),last:list.slice().sort((a,b)=>b.time-a.time)[0]}:null}
export function readiness(logs,key,prefs,catalog=exercises){const relevant=logs.filter(l=>{const e=catalog.find(x=>x.id===l.ex);return e && (e.p.includes(key)||e.s.includes(key))});return relevant.reduce((v,l)=>Math.max(v,l.time+(large.includes(key)?prefs.big:prefs.small)*3600000),0)}
export const dateText=(t,clock=false)=>new Intl.DateTimeFormat('ko-KR',{month:'numeric',day:'numeric',weekday:'short',...(clock?{hour:'2-digit',minute:'2-digit',hour12:false}:{})}).format(t);
export function localInput(t){const d=new Date(t);return new Date(t-d.getTimezoneOffset()*60000).toISOString().slice(0,16)}
