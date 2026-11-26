import {stability,stretches} from './mobility.js';
import {lessons} from './muscleLearning.js';
import {stretchLesson,stretchVisuals} from './stretchVisuals.js';
import {floorStretches,wtyStretches} from './floorStretches.js';

const standardRegions={목:'목',어깨:'어깨·날개뼈',가슴:'가슴','등·몸통':'등·허리','팔·손목':'팔·손목',골반:'골반·엉덩이'};
const lessonRegions={'wall-plus':'어깨·날개뼈','bird-dog':'등·허리','standing-march':'골반·엉덩이','side-hip-raise':'골반·엉덩이'};
const stabilityVisuals={
  brace:{compare:'숨을 계속 쉬면서 배에 가볍게 힘을 유지할 수 있는지 확인하세요.',muscles:[['transverse','배 옆을 감싸는 깊은 복벽']]},
  bridge:{compare:'허리를 젖히지 않고 엉덩이가 바닥에서 올라오는지 확인하세요.',muscles:[['glutemax','엉덩이에서 고관절이 펴지게 도와요.'],['hams','허벅지 뒤쪽에서 고관절이 펴지는 데 참여해요.']]},
  'band-out':{compare:'팔꿈치는 옆구리에 두고, 몸통은 돌아가지 않는지 확인하세요.',muscles:[['infra','날개뼈 뒤쪽에서 위팔을 바깥으로 돌리는 데 참여해요.']]}
};
const illustratedStretches=stretches.map(move=>({
  ...stretchLesson(move),recordId:move.id,region:standardRegions[move.area]||move.area,kind:'스트레칭',
  dose:move.dose||'좌우 각각 약 20~30초',visuals:stretchVisuals[move.id],source:move.source[0]
}));
const originalLessons=lessons.map(lesson=>({
  ...lesson,region:lessonRegions[lesson.id],kind:lesson.id==='bird-dog'?'안정화':'동작 공부',
  dose:stability.find(move=>move.id===lesson.id)?.dose
}));
const additionalStability=stability.filter(move=>move.id!=='bird-dog').map(move=>({
  id:move.id,title:move.name,region:move.area==='몸통'?'등·허리':standardRegions[move.area],kind:'안정화',
  dose:move.dose,phases:move.steps.map((step,index)=>[index===0?'시작':'움직임',step]),visuals:stabilityVisuals[move.id],
  source:move.source[0],showPhotos:false
}));

export const movementRegions=['목','어깨·날개뼈','가슴','등·허리','팔·손목','골반·엉덩이','허벅지 앞','허벅지 뒤','종아리·발목'];
export const movements=[...illustratedStretches,...wtyStretches.map(move=>({...move,visuals:move})),...floorStretches.map(move=>({...move,visuals:move})),...originalLessons,...additionalStability];

export function movementCoverage(history,start,end){
  const activities=new Set(Object.entries(history).filter(([day])=>day>=start&&day<=end).flatMap(([,ids])=>ids));
  return new Set(movements.filter(move=>move.kind==='스트레칭'&&activities.has(move.recordId||move.id)).map(move=>move.region));
}
