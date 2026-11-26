const book='https://openstax.org/books/anatomy-and-physiology-2e/pages/';
const sources={
  neck:book+'11-3-axial-muscles-of-the-head-neck-and-back',
  trunk:book+'11-4-axial-muscles-of-the-abdominal-wall-and-thorax',
  upper:book+'11-5-muscles-of-the-pectoral-girdle-and-upper-limbs',
  lower:book+'11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs',
  iliopsoas:'https://www.ncbi.nlm.nih.gov/books/NBK531508/',
  serratus:'https://www.ncbi.nlm.nih.gov/books/NBK531457/',
  piriformis:'https://www.ncbi.nlm.nih.gov/sites/books/NBK519497/',
  hip:'https://www.orthoinfo.org/bodypart/hip-thigh/hip-conditioning-program/'
};
export const regions=['목','등·날개뼈','가슴','어깨','팔','배·허리','골반·엉덩이','허벅지','종아리·발목'];
const rows=[
 ['semicap',0,'머리반가시근','Semispinalis capitis','깊은층','목 돌리기|고개 들기','아랫목뼈와 위쪽 등뼈의 돌기','뒤통수뼈','고개를 뒤로 들고 한쪽이 수축할 때 반대 방향으로 돌리는 데 기여합니다.','고개를 돌려 뒤쪽을 볼 때','neck'],
 ['semicerv',0,'목반가시근','Semispinalis cervicis','깊은층','목 돌리기|고개 들기','위쪽 등뼈의 가로돌기','목뼈 위쪽의 가시돌기','목을 뒤로 펴고 돌리는 동작을 돕습니다.','고개를 돌리는 동안 목뼈의 자세 잡기','neck'],
 ['scalene',0,'목갈비근','사각근 · Scalene muscles','깊은층','호흡|목 옆으로 기울이기','목뼈의 가로돌기','앞·중간목갈비근은 첫째 갈비뼈, 뒤목갈비근은 둘째 갈비뼈','목을 옆으로 기울이는 데 참여하고, 들숨에 갈비뼈를 들어 올리는 데 보탬이 됩니다.','숨을 크게 들이마실 때','neck'],
 ['traps',1,'등세모근','승모근 · Trapezius','겉층','날개뼈 움직이기|팔 올리기','뒤통수뼈, 목덜미인대, 목·등뼈 가시돌기','빗장뼈 바깥쪽과 날개뼈 윗부분','윗부분은 날개뼈를 올리고, 중간은 뒤로 모으며, 아래쪽은 내리는 데 참여합니다. 윗부분과 아래쪽은 팔을 올릴 때 날개뼈의 위쪽 돌림을 돕습니다.','선반에 물건 올리기','upper'],
 ['rhomboid-minor',1,'작은마름근','소능형근 · Rhomboid minor','깊은층','날개뼈 움직이기|당기기','아랫목뼈와 첫째 등뼈 주변','날개뼈 가시가 안쪽 가장자리와 만나는 곳','날개뼈를 등 가운데로 끌어당기고 아래쪽으로 돌리는 데 참여합니다.','손잡이를 몸 쪽으로 당길 때','upper'],
 ['rhomboid-major',1,'큰마름근','대능형근 · Rhomboid major','깊은층','날개뼈 움직이기|당기기','위쪽 등뼈의 가시돌기','날개뼈 가시 아래의 안쪽 가장자리','날개뼈를 뒤로 모으고 아래쪽으로 돌리는 데 참여합니다.','서랍을 몸 쪽으로 당기기','upper'],
 ['lat',1,'넓은등근','광배근 · Latissimus dorsi','겉층','당기기|팔 내리기','아래쪽 등뼈, 등허리근막, 골반 위쪽과 아래 갈비뼈','위팔뼈 결절사이고랑 바닥','올라간 팔을 몸 쪽과 뒤쪽으로 당기고 위팔을 안으로 돌리는 데 참여합니다.','머리 위 물건을 아래로 당기기','upper'],
 ['serratus',1,'앞톱니근','전거근 · Serratus anterior','안쪽 위치','날개뼈 움직이기|밀기|팔 올리기','위쪽 갈비뼈 바깥면','날개뼈 안쪽 가장자리의 갈비뼈 쪽 면','날개뼈를 갈비뼈를 따라 앞으로 보내고 팔을 올릴 때 위쪽 돌림을 돕습니다.','팔을 뻗어 문 밀기','serratus','wall-plus'],
 ['pec-major',2,'큰가슴근','대흉근 · Pectoralis major','겉층','밀기|팔 모으기','빗장뼈 안쪽, 복장뼈와 위쪽 갈비연골 주변','위팔뼈 결절사이고랑 바깥쪽 모서리','팔을 가슴 앞으로 모으고 위팔을 안쪽으로 돌리는 데 참여합니다.','양팔로 상자를 끌어안기','upper'],
 ['pec-minor',2,'작은가슴근','소흉근 · Pectoralis minor','깊은층','날개뼈 움직이기','셋째~다섯째 갈비뼈 앞쪽','날개뼈의 부리돌기','날개뼈를 앞·아래 방향으로 당기고 안정시키는 데 관여합니다.','팔을 아래 앞으로 뻗을 때 날개뼈 조절하기','upper'],
 ['delt',3,'어깨세모근','삼각근 · Deltoid','겉층','팔 올리기|팔 벌리기|팔 수평으로 벌리기','빗장뼈 바깥쪽, 어깨봉우리, 날개뼈 가시','위팔뼈 바깥쪽의 어깨세모근 거친면','앞부분은 팔을 앞쪽으로, 중간은 옆쪽으로, 뒷부분은 뒤쪽으로 움직이는 데 주로 관여합니다.','옆으로 팔을 들어 물건 집기','upper'],
 ['supra',3,'가시위근','극상근 · Supraspinatus','깊은층','팔 벌리기|관절 잡기','날개뼈 가시 위의 오목한 면','위팔뼈 큰결절 위쪽','팔을 옆으로 벌리는 데 참여하고 위팔뼈 머리를 안정시키는 회전근개 근육입니다.','팔을 옆으로 들어 올리기','upper'],
 ['infra',3,'가시아래근','극하근 · Infraspinatus','깊은층','팔 바깥 돌리기|관절 잡기','날개뼈 가시 아래의 오목한 면','위팔뼈 큰결절 뒤쪽 부위','위팔을 바깥으로 돌리고 어깨관절을 안정시키는 데 참여합니다.','팔꿈치를 붙인 채 손을 바깥으로 열기','upper'],
 ['biceps',4,'위팔두갈래근','이두근 · Biceps brachii','겉층','팔꿈치 굽히기|손바닥 위로 돌리기|당기기','날개뼈의 관절오목 위쪽과 부리돌기','노뼈 거친면과 아래팔 근막','팔꿈치를 굽히고 손바닥이 위를 향하게 아래팔을 치켜돌립니다.','손바닥을 위로 해서 물건 들기','upper'],
 ['triceps',4,'위팔세갈래근','삼두근 · Triceps brachii','겉층','팔꿈치 펴기|밀기','날개뼈 관절오목 아래와 위팔뼈 뒤쪽','자뼈의 팔꿈치머리','팔꿈치를 펴는 데 힘을 냅니다. 긴갈래는 어깨관절도 지납니다.','손으로 문 밀기','upper'],
 ['brachialis',4,'위팔근','상완근 · Brachialis','깊은층','팔꿈치 굽히기|당기기','위팔뼈 아래쪽 앞면','자뼈 거친면과 갈고리돌기 주변','손바닥 방향과 관계없이 팔꿈치를 굽히는 데 힘을 냅니다.','손등이 위를 향해도 팔꿈치를 접어 물건 당기기','upper'],
 ['wrist-flexor',4,'노쪽손목굽힘근','요측수근굴근 · Flexor carpi radialis','겉층','손목 굽히기','위팔뼈 안쪽위관절융기','둘째 손허리뼈 바닥 부위','손목을 손바닥 쪽으로 굽히고 엄지 쪽으로 기울이는 데 참여합니다.','손목을 손바닥 쪽으로 접을 때','upper'],
 ['multifidus',5,'뭇갈래근','다열근 · Multifidus','깊은층','몸통 잡기|몸통 돌리기','엉치뼈와 척추뼈 뒤쪽의 여러 돌기','몇 마디 위 척추뼈의 가시돌기','짧은 근육 다발이 척추 마디 사이 움직임을 조절하고, 척추를 펴거나 돌리는 데 참여합니다.','한 손으로 짐 들 때 몸통 흔들림 조절','neck','bird-dog'],
 ['transverse',5,'배가로근','복횡근 · Transversus abdominis','깊은층','몸통 잡기|호흡','아래 갈비연골, 등허리근막과 골반 위쪽 등','배 가운데의 백색선과 두덩뼈 주변','깊은 복벽을 이루고 복부를 조여 몸통 지지와 힘주는 날숨에 관여합니다.','팔·다리를 움직이면서 몸통 자세 유지하기','trunk','bird-dog'],
 ['rectabs',5,'배곧은근','복직근 · Rectus abdominis','겉층','몸통 굽히기|몸통 잡기','골반 앞쪽 두덩뼈','복장뼈 끝과 다섯째~일곱째 갈비연골','갈비뼈와 골반 앞쪽을 가까이하며 몸통을 굽히는 데 기여합니다.','누운 상태에서 어깨를 살짝 들기','trunk'],
 ['iliacus',6,'엉덩근','장골근 · Iliacus · 엉덩허리근','깊은층','다리 앞으로 들기','골반 안쪽의 엉덩뼈오목','큰허리근 힘줄과 함께 넙다리뼈 작은돌기 부위','고관절을 굽혀 허벅지를 앞으로 들어 올리는 데 참여합니다.','계단에 발 올리기','iliopsoas','standing-march'],
 ['psoas',6,'큰허리근','대요근 · Psoas major · 엉덩허리근','깊은층','다리 앞으로 들기|몸통 잡기','마지막 등뼈와 허리뼈의 몸통·가로돌기 주변','넙다리뼈 작은돌기','엉덩근과 함께 고관절을 굽혀 허벅지를 앞으로 드는 데 참여합니다.','서 있는 자세에서 한쪽 무릎 들기','iliopsoas','standing-march'],
 ['glutemed',6,'중간볼기근','중둔근 · Gluteus medius','중간층','다리 옆으로 벌리기|관절 잡기|걷기','엉덩뼈 바깥면','넙다리뼈 큰돌기 바깥쪽','다리를 옆으로 벌리고, 한 발에 체중을 실을 때 그쪽 골반이 크게 기울어지지 않도록 돕습니다.','걷다가 반대쪽 발이 바닥에서 떨어지는 순간','hip','side-hip-raise'],
 ['glutemin',6,'작은볼기근','소둔근 · Gluteus minimus','깊은층','다리 옆으로 벌리기|관절 잡기|걷기','중간볼기근보다 아래쪽 엉덩뼈 바깥면','넙다리뼈 큰돌기 앞쪽','중간볼기근 아래에서 다리 벌림과 고관절 안정에 관여합니다.','옆으로 한 발 내딛거나 한 발로 설 때','hip','side-hip-raise'],
 ['glutemax',6,'큰볼기근','대둔근 · Gluteus maximus','겉층','다리 뒤로 펴기|일어서기','엉덩뼈 뒤쪽, 엉치뼈와 꼬리뼈 주변','엉덩정강근막띠와 넙다리뼈 뒤쪽','고관절을 펴고 넙다리를 바깥으로 돌리는 데 참여합니다.','낮은 의자에서 일어서기','lower'],
 ['piriformis',6,'궁둥구멍근','이상근 · Piriformis','깊은층','다리 바깥 돌리기|관절 잡기','엉치뼈 앞면','넙다리뼈 큰돌기 위쪽','고관절이 펴진 자세에서 허벅지를 바깥쪽으로 돌리는 데 관여합니다. 고관절이 굽혀진 자세에서는 다리 벌림을 도울 수 있습니다.','똑바로 선 자세에서 허벅지를 바깥쪽으로 돌리는 동작','piriformis'],
 ['adductor',7,'긴모음근','장내전근 · Adductor longus','겉층','다리 안으로 모으기','골반 앞쪽 두덩뼈','넙다리뼈 뒤의 거친선 중간 부분','허벅지를 몸 중심 쪽으로 모으는 데 참여합니다.','옆으로 벌린 다리 다시 모으기','lower'],
 ['quads',7,'넙다리네갈래근','대퇴사두근 · Quadriceps','여러 층','무릎 펴기|일어서기','넙다리곧은근은 골반 앞쪽, 나머지 세 근육은 넙다리뼈','무릎뼈를 거쳐 무릎인대로 정강뼈 거친면','네 근육 모두 무릎을 펴고, 넙다리곧은근은 고관절 굽힘에도 참여합니다.','의자에서 일어나며 무릎 펴기','lower'],
 ['hams',7,'허벅지 뒤 근육군','햄스트링 · Hamstrings','여러 층','무릎 굽히기|다리 뒤로 펴기','대부분 골반 아래의 궁둥뼈결절, 넙다리두갈래근 짧은갈래는 넙다리뼈','각 갈래에 따라 정강뼈 안쪽 또는 종아리뼈 머리','무릎을 굽힙니다. 고관절을 지나는 갈래들은 허벅지를 뒤로 펴는 데도 참여합니다.','발뒤꿈치를 엉덩이 방향으로 당기기','lower'],
 ['soleus',8,'가자미근','Soleus','깊은층','발뒤꿈치 들기|걷기','정강뼈와 종아리뼈의 윗부분 뒤쪽','아킬레스힘줄을 통해 발꿈치뼈','발목에서 발바닥을 아래로 향하게 하고, 서 있거나 걸을 때 정강뼈가 앞으로 넘어가는 움직임도 조절합니다.','서서 앞으로 살짝 기울 때 균형 잡기','lower'],
 ['gastroc',8,'장딴지근','비복근 · Gastrocnemius','겉층','발뒤꿈치 들기|무릎 굽히기|걷기','넙다리뼈 아래쪽 안·가쪽 관절융기 주변','아킬레스힘줄을 통해 발꿈치뼈','발뒤꿈치를 드는 동작에 힘을 내며 무릎 굽힘을 돕습니다.','발끝으로 서서 높은 곳에 손 뻗기','lower'],
 ['tibialis',8,'앞정강근','전경골근 · Tibialis anterior','겉층','발끝 들기|걷기','정강뼈 앞·가쪽 윗부분과 뼈사이막','발 안쪽 쐐기뼈와 첫째 발허리뼈 바닥','발끝을 위로 들고 발바닥을 안쪽으로 돌리는 데 참여합니다.','걸을 때 발끝이 바닥에 끌리지 않게 올리기','lower']
];

export const anatomy=rows.map(([id,region,name,alias,layer,purpose,origin,insertion,role,everyday,ref,lesson])=>({
  id,region:regions[region],name,alias,layer,purposes:purpose.split('|'),origin,insertion,role,everyday,source:sources[ref],lesson
}));
export const purposes=[...new Set(anatomy.flatMap(muscle=>muscle.purposes))];
export function purposesForRegion(region){
  return region?purposes.filter(purpose=>anatomy.some(muscle=>muscle.region===region&&muscle.purposes.includes(purpose))):purposes;
}
const normalized=value=>value.normalize('NFKC').toLowerCase().replace(/[\s·-]/g,'');
export function searchedPurpose(query){
  const key=normalized(query);
  if(key==='팔들어올리기'||key==='팔옆으로들기')return key==='팔옆으로들기'?'팔 벌리기':'팔 올리기';
  return purposes.find(value=>normalized(value)===key)||'';
}
export function filterAnatomy({region,layer,purpose,query}){
  const matchedPurpose=searchedPurpose(query);
  const words=(matchedPurpose?'':query).trim().split(/\s+/).map(normalized).filter(Boolean);
  return anatomy.filter(muscle=>(!region||muscle.region===region)&&(!layer||muscle.layer===layer)&&
    (!purpose||muscle.purposes.includes(purpose))&&(!matchedPurpose||muscle.purposes.includes(matchedPurpose))&&
    words.every(word=>normalized([muscle.name,muscle.alias,muscle.region,...muscle.purposes].join(' ')).includes(word)));
}
