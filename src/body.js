// Paired anatomical regions share one contour so front and rear maps stay symmetric.
const front = [
  ['shoulders', 'M48 42Q42 42 38 47Q33 53 34 62Q37 58 43 56Q49 51 51 44Z'],
  ['chest','M58 43Q54 43 51 45Q48 51 44 56Q43 60 48 62Q55 65 59 61L59 48Z'],
  ['biceps','M40 58Q34 60 33 66L29 81Q34 82 38 76Q42 68 42 61Z'],
  ['triceps','M33 62Q31 67 28 78L27 84L30 79L34 64Z'],
  ['forearms','M29 83Q25 86 23 94L20 108Q25 104 29 96L33 84Z'],
  ['forearms','M34 84Q32 94 25 103L23 109Q28 104 32 95L36 85Z'],
  ['abs','M48 64Q51 67 52 73L49 79L45 71L44 62Z'],
  ['abs','M46 73L51 80L49 88L45 83Z'],
  ['abs','M51 65Q55 66 59 64L59 71Q55 73 52 71Z'],
  ['abs','M53 74Q56 73 59 74L59 81Q56 83 53 80Z'],
  ['abs','M52 83Q55 85 59 83L59 91Q56 93 52 90Z'],
  ['abs','M51 92L59 94L59 104Q54 101 51 96Z'],
  ['abductors','M46 92Q49 96 48 101L43 111Q40 106 44 97Z'],
  ['adductors','M52 107Q58 109 59 116L55 134Q52 123 51 115Z'],
  ['quads','M45 99Q46 105 51 114Q53 123 52 136L49 146Q44 141 43 131Q41 114 44 103Z'],
  ['quads','M43 105Q40 117 42 132Q43 141 46 145Q43 128 45 116Z'],
  ['quads','M54 124Q56 134 53 145Q52 149 50 149Q49 144 51 136Z'],
  ['calves','M45 157Q41 164 44 179L47 193L48 186Q46 171 47 159Z'],
];
const rear = [
  ['back','M54 35L51 40L44 44Q49 46 54 51L59 62L59 43Z'],
  ['shoulders','M44 44Q35 45 33 60Q37 57 43 57L50 50Z'],
  ['back','M44 58Q48 54 52 53L58 64L55 71Q49 69 44 62Z'],
  ['back','M43 65Q48 68 54 73L57 79L52 91Q47 85 45 77Z'],
  ['spine','M58 68Q55 74 55 81L52 94L55 99L59 94L59 74Z'],
  ['triceps','M35 60Q39 58 42 60Q42 68 39 73L32 82Q30 81 30 77Z'],
  ['triceps','M34 62L30 76L28 82L27 78L30 66Z'],
  ['forearms','M30 84Q27 84 24 91L20 107L22 109Q28 99 33 87Z'],
  ['forearms','M34 86L31 97L25 106Q27 98 31 91Z'],
  ['abductors','M45 92Q48 89 54 92L53 97Q49 97 43 108L41 105Z'],
  ['glutes','M48 94Q52 96 56 99L59 102L58 114Q50 120 44 115Q41 111 43 103Z'],
  ['hams','M44 118Q47 121 50 120Q52 131 48 147Q45 142 43 134Z'],
  ['hams','M51 120L57 117Q57 129 54 140L51 148Q51 142 52 136Z'],
  ['adductors','M58 118Q59 125 55 135L55 130Z'],
  ['calves','M47 154Q45 155 43 164Q42 175 46 180Q49 174 49 164L49 156Z'],
  ['calves','M51 154Q55 157 55 167Q54 175 50 183Q48 177 50 169Z'],
];
const head = 'M60 7Q53 7 51 14Q50 19 51 22Q49 20 50 26L52 29Q53 34 56 35L60 37Q64 36 67 31L68 28Q70 27 70 22Q69 20 68 22Q70 8 61 7Z';
const half = 'M60 34Q57 34 55 32L54 38Q52 40 44 42Q37 43 34 49Q31 54 31 62Q29 68 26 78L26 83Q23 87 21 93L18 106L16 110L13 116Q12 119 14 119L17 114L14 123Q14 125 16 124L18 119Q16 127 18 126L21 120Q20 125 22 123L25 116L26 110Q31 103 35 94L37 85L40 79L44 69Q46 77 45 85Q44 94 41 103Q38 115 40 128L43 145Q44 149 43 154Q40 163 42 175L46 191L46 199L43 205Q42 208 46 209L53 209Q56 208 54 203L53 197L54 182Q58 169 56 159L54 152Q58 136 59 123L60 119Z';
const mirror = 'translate(120 0) scale(-1 1)';
const inactive = '#607783';
const border = '#222e34';
const fibersFront = ['M47 58Q52 60 57 57','M36 65Q35 72 32 77','M47 115Q46 132 48 138','M57 46L58 50','M26 94L23 102'];
const fibersRear = ['M48 62L54 66','M48 73L53 81','M46 111Q51 114 55 110','M48 124L47 137','M46 161L46 172','M37 64L33 74'];

export function bodyMap(primary = [], secondary = [], view = 'front') {
  const isRear = view === 'back' || view === 'rear';
  const color = key => primary.includes(key) ? '#ff674b' : secondary.includes(key) ? '#66aea7' : inactive;
  const regions = (isRear ? rear : front).map(([key, d]) =>
    '<path data-muscle="' + key + '" d="' + d + '" fill="' + color(key) + '"/>'
  ).join('');
  const fibers = (isRear ? fibersRear : fibersFront).map(d => '<path d="' + d + '"/>').join('');
  const drawHalf = '<path d="' + half + '" fill="#394a54" stroke="#7e9197" stroke-width=".85"/>' +
    '<g stroke="' + border + '" stroke-linejoin="round" stroke-width="1">' + regions + '</g>' +
    '<g fill="none" stroke="#213039" stroke-width=".65" stroke-linecap="round" opacity=".5">' + fibers + '</g>';
  const headDetail = isRear ? 'M53 25Q55 31 60 32Q64 31 67 26' : 'M52 22L56 23M64 23L68 22M59 25L58 28L61 28M57 31Q60 32 63 31';
  return '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (isRear ? '후면' : '전면') +
    ' 근육 도식" viewBox="9 4 102 208" preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:100%">' +
    '<g stroke-linecap="round" stroke-linejoin="round">' + drawHalf + '<g transform="' + mirror + '">' + drawHalf + '</g>' +
    '<path d="M57 37L60 40L63 37" fill="none" stroke="#5c717e" stroke-width="1"/>' +
    '<path d="' + head + '" fill="#546873" stroke="#788b94" stroke-width=".8"/>' +
    '<path d="' + headDetail + '" fill="none" stroke="#354852" stroke-width="1"/></g></svg>';
}
