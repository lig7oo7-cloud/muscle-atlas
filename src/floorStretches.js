// Keep the observation IDs used by the original nine video chapters.
const backGuide='https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/back-pain/art-20546859';
const stretchGuide='https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20546848';
const original='https://www.youtube.com/watch?v=jJJiR7nNeqQ';

export const floorStretches=[
  {time:11,region:'골반·엉덩이',title:'누워 한쪽 무릎 가슴 쪽으로',label:'엉덩이 스트레칭',
    phases:[['시작','등을 대고 편하게 누워요.'],['무릎 당기기','한쪽 허벅지 뒤를 양손으로 받치고 무릎을 가슴 쪽으로 가볍게 가져와요.']],
    compare:'무릎을 가슴에 닿게 하기보다 엉덩이 뒤에 가벼운 당김이 드는 지점에서 멈춰요.',
    muscles:[['glutemax','고관절이 굽혀지면서 엉덩이 뒤쪽이 늘어나요.']],source:backGuide},
  {time:81,region:'허벅지 뒤',title:'누워 허벅지 뒤 늘리기',label:'햄스트링 스트레칭',
    phases:[['시작','등을 대고 누워 한쪽 무릎을 굽힌 채 허벅지 뒤를 받쳐요.'],['무릎 펴기','올린 허벅지는 편하게 유지하면서 무릎을 천천히 펴요.']],
    compare:'무릎을 다 펴는 건 목표가 아니에요. 허벅지 뒤에 가볍게 당기는 느낌이 드는 곳을 찾으세요.',
    muscles:[['hams','무릎을 펴는 동안 허벅지 뒤쪽이 늘어나요.']],source:stretchGuide},
  {time:154,region:'골반·엉덩이',title:'누워 다리 4자 만들기',label:'이상근 스트레칭',
    phases:[['시작','누워 한쪽 발목을 반대 허벅지 위에 걸쳐요.'],['허벅지 당기기','아래쪽 허벅지 뒤를 받쳐 가슴 쪽으로 조금 가져와요.']],
    compare:'걸친 쪽 엉덩이 뒤가 당기는지 살펴요. 무릎을 손으로 누르지 않고 어깨는 편하게 둡니다.',
    muscles:[['piriformis','엉덩이 깊은 쪽 위치를 그림에서 확인하세요. 이 자세에서는 주변 근육도 함께 당길 수 있어요.']],source:original},
  {time:231,region:'골반·엉덩이',title:'누워 무릎 반대쪽으로 넘기기',label:'엉덩이 측면 스트레칭',
    phases:[['시작','등을 대고 누워 한쪽 무릎을 세워요.'],['옆으로 넘기기','굽힌 무릎을 반대쪽으로 조금 보내고 양쪽 어깨는 편하게 바닥에 둬요.']],
    compare:'어깨가 바닥에서 뜨기 전에 멈추고, 엉덩이 바깥과 몸통 옆이 어떻게 당기는지 살펴요.',
    muscles:[['glutemed','엉덩이 바깥의 관련 부위예요. 몸통 옆도 같이 당길 수 있어요.']],source:backGuide},
  {time:307,region:'등·허리',title:'팔꿈치를 받치는 반 코브라',label:'세미 코브라',
    phases:[['시작','배를 대고 엎드려 아래팔을 매트에 두세요.'],['가슴 들어 올리기','아래팔과 팔꿈치로 받치고 가슴을 조금 들어요. 골반과 다리는 바닥에 둡니다.']],
    compare:'가슴만 조금 올리고 턱을 위로 빼지 않아요. 허리가 불편하면 이 동작은 건너뛰세요.',
    muscles:[['rectabs','몸통이 펴지면서 배 앞쪽이 길어질 수 있어요.'],['multifidus','허리 뒤에서 척추 자세 조절에 관여하는 근육입니다.']],source:original},
  {time:343,region:'등·허리',title:'네발 자세에서 등 굽혔다 펴기',label:'캣 카우',
    phases:[['등 둥글게','손과 무릎을 짚고 숨을 내쉬면서 등을 부드럽게 둥글게 해요.'],['등 펴기','숨을 들이쉬면서 등을 편한 범위에서 반대 방향으로 움직여요.']],
    compare:'손과 무릎을 같은 자리에 두고 골반과 등이 움직이는 차이를 비교해 보세요.',
    muscles:[['rectabs','등을 둥글게 할 때 몸통 굽힘에 참여할 수 있어요.'],['multifidus','등을 펴는 구간에서 척추의 자세 조절에 관여해요.']],source:backGuide},
  {time:378,region:'골반·엉덩이',title:'한쪽 무릎 대고 골반 앞 늘리기',label:'장요근 스트레칭',
    phases:[['시작','한쪽 무릎을 매트에 대고 반대 발을 앞으로 둬요.'],['골반 옮기기','상체를 세운 채 골반을 앞쪽으로 조금 옮겨요.']],
    compare:'허리를 꺾기 전에 멈추고 뒤쪽 다리의 사타구니 위쪽을 살펴요. 무릎을 대기 불편하면 건너뛰세요.',
    muscles:[['psoas','큰허리근은 허리뼈 옆에서 허벅지뼈로 이어져요.'],['iliacus','엉덩근은 골반 안쪽에 있고 큰허리근과 함께 고관절 앞을 지나요.']],source:stretchGuide},
  {time:452,region:'등·허리',title:'아기 자세에서 몸통 말아 올리기',label:'아기 자세 롤업',
    phases:[['몸통 숙이기','무릎을 꿇고 엉덩이를 뒤꿈치 쪽으로 보내며 상체를 숙여요.'],['몸통 일으키기','상체를 서서히 일으켜 무릎을 꿇은 자세로 돌아와요.']],
    compare:'내릴 때는 몸통 뒤가 길어지는 느낌을, 올라올 때는 움직임을 천천히 조절하는 느낌을 살펴요.',
    muscles:[['lat','팔을 앞에 둔 자세에서 겨드랑이 뒤에서 옆등까지 당길 수 있어요.'],['multifidus','몸통을 다시 세울 때 척추 자세 조절에 관여해요.']],source:original},
  {time:489,region:'등·허리',title:'앉아서 두 팔 머리 위로 뻗기',label:'등 스트레칭',
    phases:[['시작','편하게 앉아 어깨에 들어간 힘을 빼요.'],['팔 뻗기','양손을 모아 머리 위로 뻗고 갈비뼈가 과하게 들리지 않게 해요.']],
    compare:'팔을 높이 드는 것보다 겨드랑이 뒤와 옆등이 길어지는 느낌을 살펴요.',
    muscles:[['lat','팔이 위로 올라갈 때 겨드랑이 뒤에서 옆등으로 이어지는 넓은등근을 볼 수 있어요.'],['serratus','팔을 올릴 때 날개뼈가 위로 도는 움직임에 관여해요.']],source:original}
].map(move=>({...move,id:'daechan-stretch-'+move.time,kind:'스트레칭'}));

export const wtyStretches=[
  {id:'wty-w',region:'어깨·날개뼈',title:'어깨 W 운동',label:'어깨 · 날개뼈 안정화 (5초 유지 · 3세트)',kind:'스트레칭',
    dose:'5초 유지 × 3세트',
    phases:[['준비','엎드린 상태에서 양팔을 구부려 몸 옆에서 W 모양을 만들고 바닥에 대세요.'],['자세 잡기','날개뼈 사이를 조이고 어깨가 으쓱하지 않게 끌어내리며 팔꿈치·손·이마를 바닥에서 떼고 5초 유지해요.']],
    compare:'팔꿈치보다 손이 아래로 떨어지면 어깨가 앞으로 말릴 수 있으니 팔꿈치와 손이 나란히 올라오게 맞추고 복부에 가볍게 힘을 주세요.',
    muscles:[['rhomboid-major','날개뼈 안쪽을 모아 견갑골을 안정화해요.'],['delt','그림에서 어깨를 덮는 근육의 뒤쪽을 보세요.']],
    source:'https://www.youtube.com/watch?v=x7fMYil_smA'},
  {id:'wty-t',region:'어깨·날개뼈',title:'어깨 T 운동',label:'어깨 후면 · 날개뼈 강화 (5초 유지 · 3세트)',kind:'스트레칭',
    dose:'5초 유지 × 3세트',
    phases:[['준비','엎드려서 양팔을 양옆으로 곧게 뻗어 T 모양으로 만들어 준비하세요.'],['자세 잡기','날개뼈를 먼저 뒤로 세팅해 사이를 조이고, 팔꿈치를 쭉 편 채로 팔·어깨 앞쪽·이마를 바닥에서 살짝 떼어 5초 유지해요.']],
    compare:'어깨가 앞으로 말리거나 으쓱 올라가지 않도록 귀와 어깨 사이를 멀리 두고 정면 바닥을 응시해요.',
    muscles:[['delt','어깨 뒤쪽(후면 삼각근)을 강화해요.'],['traps','날개뼈 사이의 중부 승모근이 함께 쓰여요.']],
    source:'https://www.youtube.com/watch?v=x7fMYil_smA'},
  {id:'wty-y',region:'어깨·날개뼈',title:'어깨 Y 운동',label:'하부 승모근 강화 (5초 유지 · 3세트)',kind:'스트레칭',
    dose:'5초 유지 × 3세트',
    phases:[['준비','엎드려서 양팔을 머리 위 대각선 방향으로 쭉 뻗어 Y 모양으로 만들어 준비하세요.'],['자세 잡기','날개뼈를 뒤·아래로 끌어내린 상태에서 팔꿈치를 쭉 편 채 팔과 어깨 앞쪽·이마를 바닥에서 떼고 5초 유지해요.']],
    compare:'팔을 머리 위로 올리는 동작이라 어깨가 으쓱 올라가기 쉬워요. 항상 귀와 어깨가 멀어지게 겨드랑이 아래로 끌어내리세요.',
    muscles:[['traps','등 중앙 아래쪽의 하부 승모근을 집중적으로 사용해요.'],['serratus','팔을 위로 들 때 날개뼈 안정화를 보조해요.']],
    source:'https://www.youtube.com/watch?v=x7fMYil_smA'}
];
