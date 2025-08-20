const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ratio = 1;

// 좌표들은 예시로 넣은 것이며, 실제 좌표는 필요에 따라 수정

// 1. Soft tissue landmarks
soft_tissue_glabella = [487, 21];
soft_tissue_nasion = [466, 109];
pronasale = [550, 260];
subnasale = [496, 304];
soft_tissue_subspinale = [521, 355];
labrale_superius = [527, 378];
stomion = [500, 407];
labrale_inferius = [510, 435];
soft_tissue_submentale = [465, 481];
soft_tissue_pogonion = [460, 544];
soft_tissue_gnathion = [443, 577];

// 2. Maxilla landmarks
sup_inci = [471, 421];
prosthion = [466, 364];
sup_api = [425, 318];

inf_inci = [442, 398];
infradentale = [431, 440];
inf_api = [394, 476];

max_1st = [338, 363];
man_1st = [328, 382];

ans = [461, 298];
pns = [244, 276];


//3. Mandible landmarks




//////////////////////////////////////

// 얼굴의 가장 가장자리 part
const points = [
    { x: soft_tissue_glabella[0],
      y: soft_tissue_glabella[1] },

    //////////////////
    // 중점 1
    { x: (soft_tissue_glabella[0]+soft_tissue_nasion[0])/2,
      y: (soft_tissue_glabella[1]+soft_tissue_nasion[1])/2 },
    //////////////////
    
    { x: soft_tissue_nasion[0],
      y: soft_tissue_nasion[1] },

    //////////////////
    // 중점 2 : Soft Tissue Nasion ~ Pronasale 간 3등분해서 1/3씩 느낌으로
    { x: soft_tissue_nasion[0] + (pronasale[0]-soft_tissue_nasion[0])/3,
      y: soft_tissue_nasion[1] + (pronasale[1]-soft_tissue_nasion[1])/3 },
    { x: soft_tissue_nasion[0] + (pronasale[0]-soft_tissue_nasion[0])*2/3,
      y: soft_tissue_nasion[1] + (pronasale[1]-soft_tissue_nasion[1])*2/3 },
    //////////////////

    { x: pronasale[0],
      y: pronasale[1] },

    //////////////////
    // 중점 3 (Pronasale과 Subnasale의 중간점)
    { x: (pronasale[0]+subnasale[0])/2,
      y: (pronasale[1]+subnasale[1])/2 },
    //////////////////

    { x: subnasale[0],
      y: subnasale[1] },

    //////////////////
    // 중점 4
    { x: (subnasale[0]+soft_tissue_subspinale[0])/2,
      y: (subnasale[1]+soft_tissue_subspinale[1])/2 },
    //////////////////


    { x: soft_tissue_subspinale[0],
      y: soft_tissue_subspinale[1] },
    { x: labrale_superius[0],
      y: labrale_superius[1] },
    { x: stomion[0],
      y: stomion[1] },

    { x: stomion[0],
      y: stomion[1] },
    { x: labrale_inferius[0],
      y: labrale_inferius[1] },
    { x: soft_tissue_submentale[0],
      y: soft_tissue_submentale[1] },
    { x: soft_tissue_pogonion[0],
      y: soft_tissue_pogonion[1] },
    { x: soft_tissue_gnathion[0],
      y: soft_tissue_gnathion[1] },
    
];



// 윗니 앞니
const points2 = [
  { x: sup_inci[0],
    y: sup_inci[1] },

  // 평행사변형(마름모) : D=C+(A−B)
  // { x: 439, y: 386 },
  { x: (sup_inci[0] + sup_api[0] - prosthion[0]),
    y: (sup_inci[1] + sup_api[1] - prosthion[1]) },
  
  { x: sup_api[0],
    y: sup_api[1] },

  { x: prosthion[0],
    y: prosthion[1] },
  
  ////////////////
  // { x: 475, y: 393 },
  { x: (prosthion[0]+sup_inci[0])/2,
    y: (prosthion[1]+sup_inci[1])/2 },
  ////////////////

  { x: sup_inci[0],
    y: sup_inci[1] },
]

// 아랫니 앞니
const points3 = [
  { x: inf_inci[0],
    y: inf_inci[1] },
  
  // { x: 441, y: 420 },
  { x: (inf_inci[0] + infradentale[0]) / 2,
    y: (inf_inci[0] + infradentale[0]) / 2 },
  
  { x: infradentale[0],
    y: infradentale[1] },
  { x: inf_api[0],
    y: inf_api[1] },

  ////////////////
  // { x: 408, y: 430 },
  temp_x = (inf_inci[0]+inf_api[0]) - infradentale[0],
  temp_y = (inf_inci[1]+inf_api[1]) - infradentale[1],
  { x: temp_x,
    y: temp_y },
  ////////////////
  
  // 중점
  // { x: 422, y: 410 },
  { x: (temp_x + inf_inci[0]) / 2,
    y: (temp_y + inf_inci[1]) / 2 },
  
  { x: inf_inci[0],
    y: inf_inci[1] },
]


// Maxilla
const points4 = [
  { x: pns[0],
    y: pns[1] },

  // ANS~PNS 사이의 중점
  { x: (ans[0] + pns[0]) / 2,
    y: (ans[1] + pns[1]) / 2 },
  
  // 중점~ANS 사이에 1/3 정도씩 좌표를 늘리는 개념으로 x좌표 할당
  // y 좌표는 ratio를 써서 조절하자
  { x: 417, y: 269 },
  { x: 439, y: 285 },
  
  { x: ans[0],
    y: ans[1] },
]

const points5 = [
  // { x: 461, y: 298 },
  { x: ans[0],
    y: ans[1] },

  { x: 450, y: 307 },
  { x: 448, y: 321 },
  { x: 466, y: 364 },
]


const points6 = [
  // { x: 439, y: 386 },
  { x: (sup_inci[0] + sup_api[0] - prosthion[0]),
    y: (sup_inci[1] + sup_api[1] - prosthion[1]) },
  
  // { x: 375, y: 323 },
  // PNS와 [439, 386] 사이의 중점
  { x: ( pns[0] + (sup_inci[0] + sup_api[0] - prosthion[0]) ) / 2 + 20*ratio,
    y: ( pns[1] + (sup_inci[1] + sup_api[1] - prosthion[1]) ) / 2 - 20*ratio},

  
  // { x: 244, y: 276 },
  { x: pns[0],
    y: pns[1] },
]


// Mandible
const points7 = [
  { x: 431, y: 440 },
  { x: 412, y: 469 },
  { x: 407, y: 529 },
  { x: 396, y: 556 },
  { x: 371, y: 568 },
  { x: 352, y: 555 },
  { x: 341, y: 538 },
  { x: 341, y: 522 },
  { x: 355, y: 489 },
  { x: 374, y: 459 },
  { x: 408, y: 430 },
]

const points8 = [
  { x: 352, y: 555 },
  { x: 274, y: 502 },
  { x: 195, y: 445 },
  { x: 104, y: 405 },
  { x: 97, y: 305 },
  { x: 87, y: 210 },
]



// Maxilla 1st molar
const points9 = [
  { x: 341, y: 334 },
  { x: 338, y: 363 },
  { x: 322, y: 369 },
  { x: 310, y: 364 },
  { x: 298, y: 363 },
  { x: 289, y: 343 },
  { x: 304, y: 320 },
]

const points10 = [
  { x: 304, y: 320 },
  { x: 313, y: 301 },
  { x: 324, y: 281 },
  { x: 327, y: 297 },
  { x: 328, y: 314 },
  { x: 337, y: 299 },
  { x: 346, y: 288 },
  { x: 345, y: 312 },
  { x: 341, y: 334 },
]



// Mandible 1st molar
const points11 = [
  { x: 318, y: 397 },
  { x: 328, y: 382 },
  { x: 323, y: 375 },
  { x: 308, y: 370 },
  { x: 294, y: 364 },
  { x: 278, y: 368 },
  { x: 273, y: 386 },
]

const points12 = [
  { x: 318, y: 397 },
  { x: 304, y: 422 },
  { x: 284, y: 450 },
  { x: 286, y: 428 },
  { x: 289, y: 409 },
  { x: 273, y: 424 },
  { x: 255, y: 437 },
  { x: 265, y: 408 },
  { x: 273, y: 386 },
]




// 곡선을 부드럽게 연결 (quadraticCurveTo를 사용한 경우)
ctx.strokeStyle = 'white';
ctx.lineWidth = 2;

//////////////////////////////////////
ctx.beginPath();
ctx.moveTo(points[0].x, points[0].y);

for (let i = 1; i < points.length - 1; i++) {
  const xc = (points[i].x + points[i + 1].x) / 2;
  const yc = (points[i].y + points[i + 1].y) / 2;
  ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
}
ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
ctx.stroke();

//////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points2[0].x, points2[0].y);

for (let i = 1; i < points2.length - 1; i++) {
  const xc = (points2[i].x + points2[i + 1].x) / 2;
  const yc = (points2[i].y + points2[i + 1].y) / 2;
  ctx.quadraticCurveTo(points2[i].x, points2[i].y, xc, yc);
}
ctx.lineTo(points2[points2.length - 1].x, points2[points2.length - 1].y);
ctx.stroke();


//////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points3[0].x, points3[0].y);

for (let i = 1; i < points3.length - 1; i++) {
  const xc = (points3[i].x + points3[i + 1].x) / 2;
  const yc = (points3[i].y + points3[i + 1].y) / 2;
  ctx.quadraticCurveTo(points3[i].x, points3[i].y, xc, yc);
}
ctx.lineTo(points3[points3.length - 1].x, points3[points3.length - 1].y);
ctx.stroke();

//////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points4[0].x, points4[0].y);

for (let i = 1; i < points4.length - 1; i++) {
  const xc = (points4[i].x + points4[i + 1].x) / 2;
  const yc = (points4[i].y + points4[i + 1].y) / 2;
  ctx.quadraticCurveTo(points4[i].x, points4[i].y, xc, yc);
}
ctx.lineTo(points4[points4.length - 1].x, points4[points4.length - 1].y);
ctx.stroke();


///////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points5[0].x, points5[0].y);
for (let i = 1; i < points5.length - 1; i++) {
  const xc = (points5[i].x + points5[i + 1].x) / 2;
  const yc = (points5[i].y + points5[i + 1].y) / 2;
  ctx.quadraticCurveTo(points5[i].x, points5[i].y, xc, yc);
}
ctx.lineTo(points5[points5.length - 1].x, points5[points5.length - 1].y);
ctx.stroke();

///////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points6[0].x, points6[0].y);
for (let i = 1; i < points6.length - 1; i++)  {
  const xc = (points6[i].x + points6[i + 1].x) / 2;
  const yc = (points6[i].y + points6[i + 1].y) / 2;
  ctx.quadraticCurveTo(points6[i].x, points6[i].y, xc, yc);
}
ctx.lineTo(points6[points6.length - 1].x, points6[points6.length - 1].y);
ctx.stroke();

///////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points7[0].x, points7[0].y);
for (let i = 1; i < points7.length - 1; i++) {
  const xc = (points7[i].x + points7[i + 1].x) / 2;
  const yc = (points7[i].y + points7[i + 1].y) / 2;
  ctx.quadraticCurveTo(points7[i].x, points7[i].y, xc, yc);
}
ctx.lineTo(points7[points7.length - 1].x, points7[points7.length - 1].y);
ctx.stroke();

///////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points8[0].x, points8[0].y);
for (let i = 1; i < points8.length - 1; i++) {
  const xc = (points8[i].x + points8[i + 1].x) / 2;
  const yc = (points8[i].y + points8[i + 1].y) / 2;
  ctx.quadraticCurveTo(points8[i].x, points8[i].y, xc, yc);
}
ctx.lineTo(points8[points8.length - 1].x, points8[points8.length - 1].y);
ctx.stroke();

///////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points9[0].x, points9[0].y);
for (let i = 1; i < points9.length - 1; i++) {
  const xc = (points9[i].x + points9[i + 1].x) / 2;
  const yc = (points9[i].y + points9[i + 1].y) / 2;
  ctx.quadraticCurveTo(points9[i].x, points9[i].y, xc, yc);
}
ctx.lineTo(points9[points9.length - 1].x, points9[points9.length - 1].y);
ctx.stroke();

///////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points10[0].x, points10[0].y);
for (let i = 1; i < points10.length - 1; i++) {
  const xc = (points10[i].x + points10[i + 1].x) / 2;
  const yc = (points10[i].y + points10[i + 1].y) / 2;
  ctx.quadraticCurveTo(points10[i].x, points10[i].y, xc, yc);
}
ctx.lineTo(points10[points10.length - 1].x, points10[points10.length - 1].y);
ctx.stroke();

///////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points11[0].x, points11[0].y);
for (let i = 1; i < points11.length - 1; i++) {
  const xc = (points11[i].x + points11[i + 1].x) / 2;
  const yc = (points11[i].y + points11[i + 1].y) / 2;
  ctx.quadraticCurveTo(points11[i].x, points11[i].y, xc, yc);
}
ctx.lineTo(points11[points11.length - 1].x, points11[points11.length - 1].y);
ctx.stroke();

///////////////////////////////////////

ctx.beginPath();
ctx.moveTo(points12[0].x, points12[0].y);
for (let i = 1; i < points12.length - 1; i++) {
  const xc = (points12[i].x + points12[i + 1].x) / 2;
  const yc = (points12[i].y + points12[i + 1].y) / 2;
  ctx.quadraticCurveTo(points12[i].x, points12[i].y, xc, yc);
}
ctx.lineTo(points12[points12.length - 1].x, points12[points12.length - 1].y);
ctx.stroke();