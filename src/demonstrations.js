// Keys match the stable exercise IDs used by saved workout logs.
const mayo='https://www.mayoclinic.org/healthy-lifestyle/fitness/multimedia/';
const muscle='https://www.muscleandstrength.com/exercises/';
const youtube='https://www.youtube.com/watch?v=';
const fromMayo=path=>({url:mayo+path,source:'Mayo Clinic',language:'영어'});
const fromMuscle=path=>({url:muscle+path,source:'Muscle & Strength',language:'영어'});
const fromYoutube=(id,source,language='영어')=>({url:youtube+id,source,language});

const demos={
  0:fromMayo('chest-press/vid-20084687'),
  1:fromMayo('lat-pull-down/vid-20084683'),
  2:fromMayo('leg-press/vid-20084684'),
  3:fromMuscle('machine-shoulder-press'),
  4:fromMayo('seated-row/vid-20084688'),
  5:fromMuscle('seated-leg-curl'),
  6:fromMuscle('pec-dec.html'),
  7:fromMuscle('barbell-bench-press.html'),
  8:fromMuscle('standing-dumbbell-curl.html'),
  9:fromYoutube('JVUHV3XWCWw','YouTube'),
  10:fromMuscle('dumbbell-lateral-raise.html'),
  11:fromMuscle('dumbbell-wrist-curl.html'),
  12:fromMuscle('barbell-hip-thrust'),
  13:fromMuscle('leg-extension.html'),
  14:fromYoutube('wtzPuwFCpXg','배방 머스트무브짐','한국어'),
  15:fromMuscle('standing-machine-calf-raise'),
  16:fromYoutube('0KEP6A1deBE','YouTube'),
  17:{url:'https://prestige-fit.com/exercises/core/45-degree-back-extension/',source:'Prestige-Fit',language:'영어'},
  18:{url:'https://cdn.muscleandstrength.com/exercises/romanian-deadlift',source:'Muscle & Strength',language:'영어'},
  19:fromMuscle('dumbbell-goblet-squat'),
  20:fromYoutube('wsNAD1BpiaE&t=147s','Coach Kelly Cues'),
  21:fromMuscle('standing-hammer-curl.html'),
  22:fromMuscle('push-up.html'),
  23:fromYoutube('shX_Ux6MxvI','Joanna Soh'),
  'hip-abduction':fromMuscle('hip-abduction-machine.html'),
  treadmill:fromYoutube('kr9fHMbztn0','YouTube')
};

export function safeVideoUrl(value){
  try{
    const url=new URL(value);
    return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;
  }catch{return null}
}

export function demonstrationFor(exercise){
  if(!exercise.custom)return demos[exercise.id];
  const url=safeVideoUrl(exercise.videoUrl);
  return url?{url,source:'내가 저장한 링크'}:null;
}
