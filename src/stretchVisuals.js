// The captions describe the movement and identify the regions shown by the
// existing licensed anatomical illustrations.
export const stretchVisuals={
  neck:{compare:'어깨 높이는 그대로 두고 머리만 옆으로 조금 기울여요.',muscles:[['scalene','목 옆 깊은 쪽'],['traps','목에서 어깨로 이어지는 겉층']]},
  shoulder:{compare:'위팔이 가슴을 가로지를 때 어깨가 귀 쪽으로 올라가지 않게 해요.',muscles:[['delt','그림에서 어깨를 덮는 근육의 뒤쪽을 보세요.']]},
  chest:{compare:'팔은 문틀에 둔 채 몸만 조금 앞으로 옮겨요.',muscles:[['pec-major','팔과 가슴 앞을 잇는 넓은 근육']]},
  back:{compare:'발과 골반은 의자에 둔 채 몸통을 편 범위에서 부드럽게 굽혔다 펴요.',muscles:[['rectabs','몸통 앞쪽'],['multifidus','몸통 뒤쪽의 척추 가까이']]},
  wrist:{compare:'아래팔은 앞으로 둔 채 손가락이 아래쪽을 향하도록 살짝 움직여요.',muscles:[['wrist-flexor','아래팔의 손바닥 쪽에서 손목으로 이어져요.']]},
  hips:{compare:'뒤쪽 무릎은 그대로 두고 골반만 앞으로 조금 옮겨요.',muscles:[['psoas','허리뼈 옆에서 넙다리뼈 쪽으로 이어져요.'],['iliacus','골반 안쪽에 자리합니다.']]},
  quads:{compare:'무릎은 아래를 향하고, 한쪽 발뒤꿈치가 엉덩이 쪽으로 움직여요.',muscles:[['quads','허벅지 앞에서 무릎뼈로 이어져요.']]},
  hams:{compare:'뻗은 다리의 뒤꿈치는 바닥에 두고 골반에서 상체를 약간 앞으로 기울여요.',muscles:[['hams','엉덩이 아래에서 무릎 뒤까지 이어져요.']]},
  calves:{compare:'앞 무릎을 살짝 굽힐 때 뒷다리는 펴고 뒤꿈치를 바닥에 둬요.',muscles:[['gastroc','무릎 뒤에서 종아리 겉을 지나요.'],['soleus','장딴지근 아래에서 아킬레스힘줄로 이어져요.']]}
};

export function stretchLesson(move){
  return {id:'stretch-'+move.id,title:move.name,phases:[['준비',move.steps[0]],['자세 잡기',move.steps[1]]]};
}
