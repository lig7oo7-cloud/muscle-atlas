import {groups} from './data.js';
import {dayKey} from './mobility.js';

export const lessons=[
  {
    id:'wall-plus', title:'벽 푸시업 플러스', region:'날개뼈', muscle:'앞톱니근',
    layer:'갈비뼈 옆 · 날개뼈 아래', role:'날개뼈를 갈비뼈를 따라 앞으로 움직이는 데 관여해요.',
    attach:'위쪽 갈비뼈의 바깥쪽에서 시작해 날개뼈 안쪽 가장자리의 갈비뼈 쪽 면에 붙어요.',
    everyday:'앞으로 손을 뻗어 문을 미는 동작과 연결해 보세요.',
    cue:'팔꿈치 각도는 그대로, 날개뼈만 부드럽게 벌어지는지 보세요.',
    phases:[['준비','벽에 양손을 대고 팔을 편 채 서세요.'],['한 번 더 밀기','팔꿈치를 더 펴지 않고 벽을 부드럽게 밀어 날개뼈가 등 양옆으로 움직이게 하세요.']],
    deep:'팔을 편 채 벽을 한 번 더 미는 구간에서 앞톱니근이 날개뼈 움직임에 기여해요.',
    source:'https://www.ncbi.nlm.nih.gov/books/NBK531457/',
    movementSource:'https://pmc.ncbi.nlm.nih.gov/articles/PMC6863690/'
  },
  {
    id:'bird-dog', title:'버드독', region:'허리·골반', muscle:'몸통 안정화 근육',
    layer:'척추 가까운 뭇갈래근과 깊은 배가로근 등', role:'팔·다리를 뻗는 동안 몸통과 골반이 흔들리는 것을 조절하는 데 여러 근육이 함께 관여해요.',
    attach:'뭇갈래근은 척추 가까이에서 여러 척추뼈를 잇고, 배가로근은 복부 옆과 깊은 복벽을 이룹니다.',
    everyday:'한 손으로 물건을 들어 몸이 옆으로 쏠리지 않게 잡는 것과 연결해 보세요.',
    cue:'팔이나 다리를 높이 드는 것보다, 숨을 쉬면서 골반이 돌아가지 않는지 보세요.',
    phases:[['준비','손은 어깨 아래, 무릎은 엉덩이 아래에 둡니다.'],['뻗어 유지하기','처음에는 팔이나 다리 하나만 뻗으세요. 자세가 안정되면 반대쪽 팔과 다리를 함께 뻗어보세요.']],
    deep:'팔과 다리가 움직일 때 몸통 근육들은 골반과 척추가 크게 돌아가지 않도록 협력해요.',
    source:'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/core-strength/art-20546851'
  },
  {
    id:'standing-march', title:'서서 무릎 들어 올리기', region:'골반 앞', muscle:'엉덩허리근',
    layer:'큰허리근과 엉덩근', role:'고관절을 굽혀 허벅지를 들어 올리는 데 기여해요.',
    attach:'큰허리근은 허리뼈 주변, 엉덩근은 골반 안쪽에서 시작해 넙다리뼈의 작은돌기 쪽으로 이어져요.',
    everyday:'계단에 발을 올리려고 허벅지를 들어 올리는 구간에 쓰여요.',
    cue:'지지대를 한 손으로 짚고 몸을 뒤로 젖히지 않으면서 허벅지를 들어 보세요.',
    phases:[['준비','의자 등받이나 벽을 한 손으로 가볍게 짚고 섭니다.'],['무릎 올리기','골반을 크게 기울이지 않고 허벅지를 편한 높이까지 든 뒤 천천히 내립니다.']],
    deep:'허리와 골반 안쪽에서 내려오는 엉덩허리근이 허벅지가 앞으로 올라오도록 힘을 보태요.',
    source:'https://www.ncbi.nlm.nih.gov/books/NBK531508/'
  },
  {
    id:'side-hip-raise',title:'옆으로 누워 다리 벌리기',region:'엉덩이 옆',muscle:'중간볼기근 · 작은볼기근',
    layer:'중간볼기근(중둔근) 아래에 작은볼기근(소둔근)이 있고, 앞쪽의 넙다리근막긴장근도 협력해요.',
    role:'다리를 옆으로 벌리는 데 기여하고, 한 발로 섰을 때는 지지하는 쪽에서 골반이 기울어지는 것을 조절해요.',
    attach:'중간·작은볼기근은 골반의 엉덩뼈 바깥면에서 넙다리뼈 위쪽의 큰돌기 부위로 이어집니다.',
    everyday:'걸을 때 한쪽 발이 바닥에서 떨어지는 순간, 바닥에 닿은 쪽 다리와 골반을 생각해 보세요.',
    cue:'다리를 높이 드는 것보다 골반이 뒤로 넘어가지 않는지 확인하세요. 발끝은 정면을 향하게 두세요.',
    phases:[['준비','옆으로 눕고 아래쪽 무릎을 접어 몸을 받칩니다. 위쪽 다리는 펴고 양쪽 골반을 포갭니다.'],['옆으로 들기','위쪽 다리를 편한 범위만큼 들어 올리고 천천히 내립니다. 골반이 움직이기 시작하는 곳보다 낮게 드세요.']],
    deep:'그 아래에 있는 작은볼기근도 다리 벌림에 참여해요. 다리 자세에 따라 여러 근육이 나눠서 일합니다.',
    source:'https://www.orthoinfo.org/bodypart/hip-thigh/hip-conditioning-program/',
    movementSource:'https://pubmed.ncbi.nlm.nih.gov/19449297/'
  }
];

export function muscleUsage(logs,catalog,history,now){
  const today=dayKey(now);
  const byId=new Map(catalog.map(x=>[x.id,x]));
  const recent=logs.filter(log=>log.time<=now&&dayKey(log.time)===today);
  const mapped=recent.map(log=>byId.get(log.ex)).filter(Boolean);
  const direct=new Set(mapped.flatMap(x=>x.p));
  const assisting=new Set(mapped.flatMap(x=>x.s));
  const done=new Set(history[today]||[]);
  const groupStatus={direct:[],assist:[],unrecorded:[]};
  for(const [key,name] of Object.entries(groups)){
    groupStatus[direct.has(key)?'direct':assisting.has(key)?'assist':'unrecorded'].push(name);
  }
  const links=lessons.map(lesson=>{
    const status=done.has(lesson.id)?'focused'
      :lesson.id==='side-hip-raise'&&direct.has('abductors')?'targeted'
      :lesson.id==='side-hip-raise'&&(assisting.has('abductors')||recent.some(log=>log.walk))?'possible'
      :lesson.id==='wall-plus'&&mapped.some(x=>x.id===22)?'possible'
      :lesson.id==='bird-dog'&&(done.has('brace')||mapped.some(x=>x.p.includes('abs')||x.s.includes('abs')))?'possible'
      :lesson.id==='standing-march'&&recent.some(log=>log.walk)?'possible'
      :'unrecorded';
    const lastDay=Object.keys(history).filter(day=>day<=today&&history[day].includes(lesson.id)).sort().at(-1)||'';
    return {...lesson,status,lastDay};
  });
  const next=links.filter(x=>!['focused','targeted'].includes(x.status))
    .sort((a,b)=>a.lastDay.localeCompare(b.lastDay)||Number(a.status==='possible')-Number(b.status==='possible'))[0];
  return {groupStatus,links,next,workouts:[...new Set(mapped)]};
}
