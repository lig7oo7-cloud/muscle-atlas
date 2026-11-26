const mayo='https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/';
const sources={
  stretch:[mayo+'stretching/art-20546848','Mayo Clinic · 기본 스트레칭 사진'],
  core:[mayo+'core-strength/art-20546851','Mayo Clinic · 자세 사진'],
  seated:['https://orstretch.mayoclinic.org/how-to-stretch','Mayo Clinic · 앉아서 하는 동작'],
  shoulder:['https://www.orthoinfo.org/bodypart/shoulder/rotator-cuff-and-shoulder-conditioning-program/','AAOS · 어깨 운동 그림'],
  chest:['https://www.southtees.nhs.uk/resources/anterior-shoulder-stretch/','NHS · 문틀 스트레칭 사진'],
  wrist:['https://www.mskdorset.nhs.uk/elbow-pain/golfers-elbow/','NHS · 손목 스트레칭']
};

export const stability=[
  {id:'brace',area:'몸통',name:'누워서 배에 힘 주기',goal:'숨을 쉬면서 몸통을 안정시키는 연습',dose:'편한 호흡 3번씩 · 3회',
    steps:['등을 대고 누워 무릎을 세우고 양발을 바닥에 둡니다.','숨을 내쉬며 아랫배에 가볍게 힘을 줍니다. 허리를 바닥에 세게 누르지 말고, 숨을 편하게 이어가세요.'],source:sources.core},
  {id:'bird-dog',area:'몸통',name:'버드독',goal:'팔이나 다리가 움직일 때 골반이 돌아가지 않게 조절',dose:'한쪽씩 3~5회',
    steps:['손을 어깨 아래, 무릎을 엉덩이 아래에 두고 네발 자세를 잡습니다.','팔 하나나 다리 하나만 천천히 뻗었다 돌아옵니다. 몸통이 흔들리지 않으면 반대쪽 팔·다리를 함께 뻗어보세요.'],source:sources.core},
  {id:'bridge',area:'골반',name:'엉덩이 브리지',goal:'발로 바닥을 누르면서 골반을 조절',dose:'천천히 5~8회',
    steps:['누워서 무릎을 세우고 발을 바닥에 놓습니다.','숨을 내쉬며 엉덩이를 들고, 어깨에서 무릎까지 대략 한 줄이 되는 지점까지만 올립니다. 숨을 쉬면서 천천히 내려옵니다.'],source:sources.core},
  {id:'band-out',area:'어깨',name:'밴드 어깨 바깥 돌리기',goal:'팔이 움직일 때 어깨를 잡아주는 회전근개 운동',dose:'가벼운 밴드 · 한쪽 5~8회',
    steps:['밴드를 팔꿈치 높이의 단단한 곳에 고정하고 옆으로 섭니다. 운동하는 팔꿈치는 90도로 굽혀 옆구리에 붙입니다.','팔꿈치를 제자리에 둔 채 손을 몸 바깥으로 옮기고, 밴드가 당기는 힘을 견디며 천천히 돌아옵니다.'],source:sources.shoulder}
];

export const stretches=[
  {id:'neck',area:'목',name:'목 옆 기울이기',steps:['어깨를 편하게 내리고 정면을 봅니다.','한쪽 귀를 같은 쪽 어깨 쪽으로 천천히 기울입니다. 손으로 머리를 당기지 말고, 목 옆이 가볍게 당기는 곳에서 멈춥니다.'],source:sources.stretch},
  {id:'shoulder',area:'어깨',name:'팔 가슴 앞으로 당기기',steps:['한 팔을 가슴 앞으로 가로질러 올립니다.','반대 손으로 팔꿈치 위쪽을 받치고 몸 쪽으로 살짝 가까이 합니다. 어깨 뒤쪽이 가볍게 당기면 유지합니다.'],source:sources.shoulder},
  {id:'chest',area:'가슴',name:'문틀에서 가슴 열기',steps:['문틀에 아래팔을 대고 팔꿈치를 어깨 높이보다 높지 않게 둡니다.','몸통을 천천히 앞으로 옮겨 가슴 앞이 부드럽게 당기는 곳에서 멈춥니다.'],source:sources.chest},
  {id:'back',area:'등·몸통',name:'앉아서 등 굽혔다 펴기',dose:'편하게 3회',steps:['의자에 앉아 발을 바닥에 대고 손을 골반 위에 올립니다.','숨을 들이쉬며 가슴을 가볍게 들어 올리고, 내쉬며 갈비뼈와 골반을 가까이 하듯 등을 부드럽게 둥글게 합니다.'],source:sources.seated},
  {id:'wrist',area:'팔·손목',name:'손바닥 쪽 손목 늘리기',steps:['손바닥을 위로 향하게 하고 팔을 앞으로 뻗습니다.','반대 손으로 손가락을 가볍게 아래쪽으로 내립니다. 팔 안쪽이 당기는 정도에서 유지합니다.'],source:sources.wrist},
  {id:'hips',area:'골반',name:'골반 앞쪽 늘리기',steps:['접은 수건 위에 한쪽 무릎을 대고 반대 발은 앞으로 둡니다. 무릎을 대는 자세가 불편하면 건너뛰세요.','상체를 세운 채 체중을 앞발 쪽으로 조금 옮겨 뒤쪽 다리의 골반 앞부분이 가볍게 당기게 합니다.'],source:sources.stretch},
  {id:'quads',area:'허벅지 앞',name:'서서 허벅지 앞 늘리기',steps:['한 손으로 벽이나 단단한 받침을 짚고 섭니다.','반대 손으로 발목을 잡고 뒤꿈치를 엉덩이 쪽으로 천천히 가져옵니다. 무릎을 옆으로 벌리거나 허리를 꺾지 않습니다.'],source:sources.stretch},
  {id:'hams',area:'허벅지 뒤',name:'앉아서 허벅지 뒤 늘리기',steps:['의자 앞쪽에 앉아 한쪽 다리를 앞으로 뻗고 뒤꿈치를 바닥에 둡니다.','등을 곧게 둔 채 골반에서 상체를 살짝 앞으로 기울입니다. 허벅지 뒤가 가볍게 당기면 멈춥니다.'],source:sources.seated},
  {id:'calves',area:'종아리·발목',name:'벽 밀며 종아리 늘리기',steps:['벽을 짚고 한 발을 뒤로 보냅니다. 발끝은 앞을 향하고 뒤꿈치는 바닥에 둡니다.','앞 무릎을 조금 굽히고 뒷다리는 편 채 몸을 벽 쪽으로 옮깁니다. 뒤쪽 종아리가 가볍게 당기는 곳에서 유지합니다.'],source:sources.stretch}
];

export function dayKey(time){
  const d=new Date(time);
  return [d.getFullYear(),d.getMonth()+1,d.getDate()].map((n,i)=>i?String(n).padStart(2,'0'):String(n)).join('-');
}
export function coveredAreas(history,now){
  const monday=new Date(now);
  monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
  const start=dayKey(monday),end=dayKey(now);
  const movements=new Set(Object.entries(history).filter(([day])=>day>=start&&day<=end).flatMap(([,ids])=>ids));
  return new Set(stretches.filter(move=>movements.has(move.id)).map(move=>move.area));
}
