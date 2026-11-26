export function equipmentSection(exercise){
  if(exercise.gear==='덤벨')return 'dumbbell';
  return exercise.cardio||['머신','케이블'].includes(exercise.gear)?'machine':'other';
}
