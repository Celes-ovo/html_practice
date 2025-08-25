const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ratio = 1;

// Landmark 좌표들이 저장된 dict를 입력받았을 때,
// 이를 기반으로 자동적으로 그리는 기능을 만듦

// 좌표들은 예시로 넣은 것이며, 실제 좌표는 필요에 따라 수정
var landmarkCoords = {}

// 1. Soft tissue landmarks
landmarkCoords['soft_tissue_glabella'] = [487, 21];
landmarkCoords['soft_tissue_nasion'] = [466, 109];
landmarkCoords['pronasale'] = [550, 260];
landmarkCoords['subnasale'] = [496, 304];
landmarkCoords['soft_tissue_subspinale'] = [521, 355];
landmarkCoords['labrale_superius'] = [527, 378];
landmarkCoords['stomion'] = [500, 407];
landmarkCoords['labrale_inferius'] = [510, 435];
landmarkCoords['soft_tissue_submentale'] = [465, 481];
landmarkCoords['soft_tissue_pogonion'] = [460, 544];
landmarkCoords['soft_tissue_gnathion'] = [443, 577];

// 2. Maxilla landmarks
landmarkCoords['sup_inci'] = [471, 421];
landmarkCoords['prosthion'] = [466, 364];
landmarkCoords['sup_api'] = [425, 318];

landmarkCoords['inf_inci'] = [442, 398];
landmarkCoords['infradentale'] = [431, 440];
landmarkCoords['inf_api'] = [394, 476];

landmarkCoords['max_1st'] = [338, 363];
landmarkCoords['man_1st'] = [328, 382];

landmarkCoords['ans'] = [461, 298];
landmarkCoords['pns'] = [244, 276];

landmarkCoords['point_a'] = [448, 321];


//3. Mandible landmarks
landmarkCoords['point_b'] = [412, 469];
landmarkCoords['pogonion'] = [407, 529];
landmarkCoords['gnathion'] = [396, 556];
landmarkCoords['menton'] = [371, 568];
landmarkCoords['gonion'] = [104, 405];
landmarkCoords['articulare'] = [87, 210];




//////////////////////////////////////

// 얼굴의 가장 가장자리 part
const points = [
    { x: landmarkCoords['soft_tissue_glabella'][0],
      y: landmarkCoords['soft_tissue_glabella'][1] },

    //////////////////
    // 중점 1
    { x: (landmarkCoords['soft_tissue_glabella'][0]+landmarkCoords['soft_tissue_nasion'][0])/2,
      y: (landmarkCoords['soft_tissue_glabella'][1]+landmarkCoords['soft_tissue_nasion'][1])/2 },
    //////////////////
    
    { x: landmarkCoords['soft_tissue_nasion'][0],
      y: landmarkCoords['soft_tissue_nasion'][1] },

    //////////////////
    // 중점 2 : Soft Tissue Nasion ~ Pronasale 간 3등분해서 1/3씩 느낌으로
    { x: landmarkCoords['soft_tissue_nasion'][0] + (landmarkCoords['pronasale'][0]-landmarkCoords['soft_tissue_nasion'][0])/3,
      y: landmarkCoords['soft_tissue_nasion'][1] + (landmarkCoords['pronasale'][1]-landmarkCoords['soft_tissue_nasion'][1])/3 },
    { x: landmarkCoords['soft_tissue_nasion'][0] + (landmarkCoords['pronasale'][0]-landmarkCoords['soft_tissue_nasion'][0])*2/3,
      y: landmarkCoords['soft_tissue_nasion'][1] + (landmarkCoords['pronasale'][1]-landmarkCoords['soft_tissue_nasion'][1])*2/3 },
    //////////////////

    { x: landmarkCoords['pronasale'][0],
      y: landmarkCoords['pronasale'][1] },

    //////////////////
    // 중점 3 (Pronasale과 Subnasale의 중간점)
    { x: (landmarkCoords['pronasale'][0]+landmarkCoords['subnasale'][0])/2,
      y: (landmarkCoords['pronasale'][1]+landmarkCoords['subnasale'][1])/2 },
    //////////////////

    { x: landmarkCoords['subnasale'][0],
      y: landmarkCoords['subnasale'][1] },

    //////////////////
    // 중점 4
    { x: (landmarkCoords['subnasale'][0]+landmarkCoords['soft_tissue_subspinale'][0])/2,
      y: (landmarkCoords['subnasale'][1]+landmarkCoords['soft_tissue_subspinale'][1])/2 },
    //////////////////


    { x: landmarkCoords['soft_tissue_subspinale'][0],
      y: landmarkCoords['soft_tissue_subspinale'][1] },
    { x: landmarkCoords['labrale_superius'][0],
      y: landmarkCoords['labrale_superius'][1] },
    { x: landmarkCoords['stomion'][0]-5*ratio,
      y: landmarkCoords['stomion'][1] },

    { x: landmarkCoords['stomion'][0]-5*ratio,
      y: landmarkCoords['stomion'][1] },
    { x: landmarkCoords['labrale_inferius'][0],
      y: landmarkCoords['labrale_inferius'][1] },
    { x: landmarkCoords['soft_tissue_submentale'][0],
      y: landmarkCoords['soft_tissue_submentale'][1] },
    { x: landmarkCoords['soft_tissue_pogonion'][0],
      y: landmarkCoords['soft_tissue_pogonion'][1] },
    { x: landmarkCoords['soft_tissue_gnathion'][0],
      y: landmarkCoords['soft_tissue_gnathion'][1] },
    
];



// 윗니 앞니
const points2 = [
  { x: landmarkCoords['sup_inci'][0],
    y: landmarkCoords['sup_inci'][1] },
  
  // 곡선을 부드럽게 만들어주기 위한 추가점
  { x: landmarkCoords['sup_inci'][0] - 2*ratio,
    y: landmarkCoords['sup_inci'][1] + 2*ratio },

  // 평행사변형(마름모) : D=C+(A−B)
  // { x: 439, y: 386 },
  { x: (landmarkCoords['sup_inci'][0] + landmarkCoords['sup_api'][0] - landmarkCoords['prosthion'][0]),
    y: (landmarkCoords['sup_inci'][1] + landmarkCoords['sup_api'][1] - landmarkCoords['prosthion'][1]) },

  { x: landmarkCoords['sup_api'][0],
    y: landmarkCoords['sup_api'][1] },


  { x: landmarkCoords['prosthion'][0],
    y: landmarkCoords['prosthion'][1] },
  
  ////////////////
  // { x: 475, y: 393 },
  { x: (landmarkCoords['prosthion'][0]+landmarkCoords['sup_inci'][0])/2 + 5*ratio,
    y: (landmarkCoords['prosthion'][1]+landmarkCoords['sup_inci'][1])/2 },
  ////////////////

  // 곡선을 부드럽게 만들어주기 위한 추가점
  { x: landmarkCoords['sup_inci'][0] + 2*ratio,
    y: landmarkCoords['sup_inci'][1] - 2*ratio },
  
  { x: landmarkCoords['sup_inci'][0],
    y: landmarkCoords['sup_inci'][1] },
]



// 아랫니 앞니
const points3 = [
  { x: landmarkCoords['inf_inci'][0],
    y: landmarkCoords['inf_inci'][1] },
  
  // 곡선을 부드럽게 만들어주기 위한 추가점
  { x: landmarkCoords['inf_inci'][0] + 2*ratio,
    y: landmarkCoords['inf_inci'][1] + 2*ratio },
  
  // 중점 1 { x: 441, y: 420 },
  { x: (landmarkCoords['inf_inci'][0] + landmarkCoords['infradentale'][0]) / 2 + 5*ratio,
    y: (landmarkCoords['inf_inci'][1] + landmarkCoords['infradentale'][1]) / 2 },
  
  { x: landmarkCoords['infradentale'][0],
    y: landmarkCoords['infradentale'][1] },

  // 중점 2
  { x: (landmarkCoords['infradentale'][0] + landmarkCoords['inf_api'][0]) / 2 + 5*ratio,
    y: (landmarkCoords['infradentale'][1] + landmarkCoords['inf_api'][1]) / 2 },
  
  { x: landmarkCoords['inf_api'][0],
    y: landmarkCoords['inf_api'][1] },

  ////////////////
  // 평행사변형(마름모) : D=C+(A−B)
  // { x: 408, y: 430 },
  temp_x1 = (landmarkCoords['inf_inci'][0]+landmarkCoords['inf_api'][0]) - landmarkCoords['infradentale'][0],
  temp_y1 = (landmarkCoords['inf_inci'][1]+landmarkCoords['inf_api'][1]) - landmarkCoords['infradentale'][1],
  
  // 중점 3
  { x: (landmarkCoords['inf_api'][0] + temp_x1) / 2,
    y: (landmarkCoords['inf_api'][1] + temp_y1) / 2 },
  
  // 중점 4 : Infradentale의 반대편 개념의 중점
  { x: temp_x1,
    y: temp_y1 },
  ////////////////
  
  // 중점 5
  // { x: 422, y: 410 },
  { x: (temp_x1 + landmarkCoords['inf_inci'][0]) / 2,
    y: (temp_y1 + landmarkCoords['inf_inci'][1]) / 2 - 10*ratio },
  
  
  // 곡선을 부드럽게 만들어주기 위한 추가점
  { x: landmarkCoords['inf_inci'][0] - 2*ratio,
    y: landmarkCoords['inf_inci'][1] - 2*ratio },
  
  
  { x: landmarkCoords['inf_inci'][0],
    y: landmarkCoords['inf_inci'][1] },
]


// Maxilla
const points4 = [
  { x: landmarkCoords['pns'][0],
    y: landmarkCoords['pns'][1] },

  // ANS~PNS 사이의 중점
  { x: (landmarkCoords['ans'][0] + landmarkCoords['pns'][0]) / 2,
    y: (landmarkCoords['ans'][1] + landmarkCoords['pns'][1]) / 2 },
  
  // 중점~ANS 사이에 1/3 정도씩 좌표를 늘리는 개념으로 x좌표 할당
  // y 좌표는 ratio를 써서 조절하자 (각각 25, 10 * ratio 사용함)
  { x: ((landmarkCoords['ans'][0] + landmarkCoords['pns'][0]) / 2) + ( landmarkCoords['ans'][0] - ((landmarkCoords['ans'][0] + landmarkCoords['pns'][0]) / 2) ) * 1/3,
    y: ((landmarkCoords['ans'][1] + landmarkCoords['pns'][1]) / 2) + ( landmarkCoords['ans'][1] - ((landmarkCoords['ans'][1] + landmarkCoords['pns'][1]) / 2) ) * 1/3 - 25*ratio, },
  
  { x: ((landmarkCoords['ans'][0] + landmarkCoords['pns'][0]) / 2) + ( landmarkCoords['ans'][0] - ((landmarkCoords['ans'][0] + landmarkCoords['pns'][0]) / 2) ) * 2/3,
    y: ((landmarkCoords['ans'][1] + landmarkCoords['pns'][1]) / 2) + ( landmarkCoords['ans'][1] - ((landmarkCoords['ans'][1] + landmarkCoords['pns'][1]) / 2) ) * 2/3 - 10*ratio },
  
  { x: landmarkCoords['ans'][0],
    y: landmarkCoords['ans'][1] },
]

const points5 = [
  // { x: 461, y: 298 },
  { x: landmarkCoords['ans'][0],
    y: landmarkCoords['ans'][1] },

  // { x: 450, y: 307 },
  { x: (landmarkCoords['ans'][0] + landmarkCoords['point_a'][0]) / 2,
    y: (landmarkCoords['ans'][1] + landmarkCoords['point_a'][1]) / 2 - 5*ratio},

  // { x: 448, y: 321 },
  { x: landmarkCoords['point_a'][0],
    y: landmarkCoords['point_a'][1] },
  // { x: 466, y: 364 },
  { x: landmarkCoords['prosthion'][0],
    y: landmarkCoords['prosthion'][1] },
]


const points6 = [
  // { x: 439, y: 386 },
  { x: (landmarkCoords['sup_inci'][0] + landmarkCoords['sup_api'][0] - landmarkCoords['prosthion'][0]),
    y: (landmarkCoords['sup_inci'][1] + landmarkCoords['sup_api'][1] - landmarkCoords['prosthion'][1]) },
  
  // { x: 375, y: 323 },
  // PNS와 [439, 386] 사이의 중점
  { x: ( landmarkCoords['pns'][0] + (landmarkCoords['sup_inci'][0] + landmarkCoords['sup_api'][0] - landmarkCoords['prosthion'][0]) ) / 2 + 20*ratio,
    y: ( landmarkCoords['pns'][1] + (landmarkCoords['sup_inci'][1] + landmarkCoords['sup_api'][1] - landmarkCoords['prosthion'][1]) ) / 2 - 20*ratio},

  
  // { x: 244, y: 276 },
  { x: landmarkCoords['pns'][0],
    y: landmarkCoords['pns'][1] },
]


// Mandible
const points7 = [
  // { x: 431, y: 440 },
  { x: landmarkCoords['infradentale'][0],
    y: landmarkCoords['infradentale'][1] },
  // { x: 412, y: 469 },
  { x: landmarkCoords['point_b'][0],
    y: landmarkCoords['point_b'][1] },
  // { x: 407, y: 529 },
  { x: landmarkCoords['pogonion'][0],
    y: landmarkCoords['pogonion'][1] },
  // { x: 396, y: 556 },
  { x: landmarkCoords['gnathion'][0],
    y: landmarkCoords['gnathion'][1] },
  // { x: 371, y: 568 },
  { x: landmarkCoords['menton'][0],
    y: landmarkCoords['menton'][1] },
  
  // 임의의 point 할당
  // 이미 존재하는 point들을 기반으로 최대한 대칭이 되게 해 보자
  // { x: 352, y: 555 },
  { x: landmarkCoords['menton'][0] - (landmarkCoords['gnathion'][0] - landmarkCoords['menton'][0]),
    y: landmarkCoords['gnathion'][1] },
  
    // { x: 341, y: 538 },
  temp_x2 = landmarkCoords['menton'][0] - (landmarkCoords['pogonion'][0] - landmarkCoords['menton'][0]),
  { x: (temp_x2 + landmarkCoords['menton'][0]) / 2,
    y: (landmarkCoords['pogonion'][1] + landmarkCoords['menton'][1]) / 2 + 10*ratio },
  
    // { x: 341, y: 522 },
  { x: temp_x2,
    y: landmarkCoords['pogonion'][1] },
  // { x: 355, y: 489 },
  { x: temp_x2 + 15*ratio,
    y: landmarkCoords['pogonion'][1] - 40*ratio },
  // { x: 374, y: 459 },
  { x: temp_x2 + 35*ratio,
    y: landmarkCoords['pogonion'][1] - 70*ratio },
  // { x: 408, y: 430 }, : temp_x1, temp_y1
  { x: temp_x1,
    y: temp_y1
  }
]

const points8 = [
  // { x: 352, y: 555 },
  { x: landmarkCoords['menton'][0] - (landmarkCoords['gnathion'][0] - landmarkCoords['menton'][0]),
    y: landmarkCoords['gnathion'][1] },
  
    // { x: 274, y: 502 },
  { x: landmarkCoords['gonion'][0] + (landmarkCoords['menton'][0] - landmarkCoords['gonion'][0]) * 2/3,
    y: landmarkCoords['gonion'][1] + (landmarkCoords['menton'][1] - landmarkCoords['gonion'][1]) * 2/3 },
  
    // { x: 195, y: 445 },
  { x: landmarkCoords['gonion'][0] + (landmarkCoords['menton'][0] - landmarkCoords['gonion'][0]) * 1/3,
    y: landmarkCoords['gonion'][1] + (landmarkCoords['menton'][1] - landmarkCoords['gonion'][1]) * 1/3 - 20*ratio },
  
    // { x: 104, y: 405 },
  { x: landmarkCoords['gonion'][0],
    y: landmarkCoords['gonion'][1] },
  
    // { x: 97, y: 305 },
  { x: (landmarkCoords['gonion'][0] + landmarkCoords['articulare'][0]) / 2 + 10*ratio,
    y: (landmarkCoords['gonion'][1] + landmarkCoords['articulare'][1]) / 2 },
  
  // { x: 87, y: 210 },
  { x: landmarkCoords['articulare'][0],
    y: landmarkCoords['articulare'][1] },
]



// Maxilla 1st molar
const points9 = [
  // { x: 341, y: 334 },
  { x: landmarkCoords['max_1st'][0],
    y: landmarkCoords['max_1st'][1] - 30*ratio},
  // { x: 338, y: 363 },
  { x: landmarkCoords['max_1st'][0],
    y: landmarkCoords['max_1st'][1] },
  
    // { x: 322, y: 369 },
  { x: landmarkCoords['max_1st'][0] - 20*ratio,
    y: landmarkCoords['max_1st'][1] + 5*ratio},
  // { x: 310, y: 364 },
  { x: landmarkCoords['max_1st'][0] - 25*ratio,
    y: landmarkCoords['max_1st'][1] - 5*ratio},
  // { x: 298, y: 363 },
  { x: landmarkCoords['max_1st'][0] - 35*ratio,
    y: landmarkCoords['max_1st'][1]},
  
  // { x: 289, y: 343 },
  { x: landmarkCoords['max_1st'][0] - 50*ratio,
    y: landmarkCoords['max_1st'][1] - 15*ratio},
  // { x: 304, y: 320 },
  { x: landmarkCoords['max_1st'][0] - 30*ratio,
    y: landmarkCoords['max_1st'][1] - 45*ratio},
]

const points10 = [
  // { x: 304, y: 320 },
  { x: landmarkCoords['max_1st'][0] - 30*ratio,
    y: landmarkCoords['max_1st'][1] - 45*ratio},
  // { x: 313, y: 301 },
  { x: landmarkCoords['max_1st'][0] - 35*ratio,
    y: landmarkCoords['max_1st'][1] - 40*ratio},
  // { x: 324, y: 281 },
  { x: landmarkCoords['max_1st'][0] - 12*ratio,
    y: landmarkCoords['max_1st'][1] - 80*ratio},
  // { x: 327, y: 297 },
  { x: landmarkCoords['max_1st'][0] - 9*ratio,
    y: landmarkCoords['max_1st'][1] - 65*ratio},
  // { x: 328, y: 314 },
  { x: landmarkCoords['max_1st'][0] - 15*ratio,
    y: landmarkCoords['max_1st'][1] - 35*ratio},
  // { x: 337, y: 299 },
  { x: landmarkCoords['max_1st'][0] - 2*ratio,
    y: landmarkCoords['max_1st'][1] - 65*ratio},
  // { x: 346, y: 288 },
  { x: landmarkCoords['max_1st'][0] + 10*ratio,
    y: landmarkCoords['max_1st'][1] - 70*ratio},
  // { x: 345, y: 312 },
  { x: landmarkCoords['max_1st'][0],
    y: landmarkCoords['max_1st'][1] - 30*ratio},
  // { x: 341, y: 334 },
  { x: landmarkCoords['max_1st'][0],
    y: landmarkCoords['max_1st'][1] - 30*ratio},
]



// Mandible 1st molar
const points11 = [
  // { x: 318, y: 397 },
  { x: landmarkCoords['man_1st'][0] - 12*ratio,
    y: landmarkCoords['man_1st'][1] + 15*ratio},
  // { x: 328, y: 382 },
  { x: landmarkCoords['man_1st'][0],
    y: landmarkCoords['man_1st'][1]},
  // { x: 323, y: 375 },
  { x: landmarkCoords['man_1st'][0] - 15*ratio,
    y: landmarkCoords['man_1st'][1] - 10*ratio},
  // { x: 308, y: 370 },
  { x: landmarkCoords['man_1st'][0] - 27*ratio,
    y: landmarkCoords['man_1st'][1] - 5*ratio},
  // { x: 294, y: 364 },
  { x: landmarkCoords['man_1st'][0] - 35*ratio,
    y: landmarkCoords['man_1st'][1] - 20*ratio},
  // { x: 278, y: 368 },
  { x: landmarkCoords['man_1st'][0] - 50*ratio,
    y: landmarkCoords['man_1st'][1] - 15*ratio},
  // { x: 273, y: 386 },
  { x: landmarkCoords['man_1st'][0] - 55*ratio,
    y: landmarkCoords['man_1st'][1] + 5*ratio},
]

const points12 = [
  // { x: 318, y: 397 },
  { x: landmarkCoords['man_1st'][0] - 12*ratio,
    y: landmarkCoords['man_1st'][1] + 15*ratio},
  // { x: 304, y: 422 },
  { x: landmarkCoords['man_1st'][0] - 20*ratio,
    y: landmarkCoords['man_1st'][1] + 25*ratio},
  // { x: 284, y: 450 },
  { x: landmarkCoords['man_1st'][0] - 40*ratio,
    y: landmarkCoords['man_1st'][1] + 70*ratio},
  // { x: 286, y: 428 },
  { x: landmarkCoords['man_1st'][0] - 45*ratio,
    y: landmarkCoords['man_1st'][1] + 55*ratio},
  // { x: 289, y: 409 },
  { x: landmarkCoords['man_1st'][0] - 35*ratio,
    y: landmarkCoords['man_1st'][1] + 20*ratio},
  // { x: 273, y: 424 },
  { x: landmarkCoords['man_1st'][0] - 65*ratio,
    y: landmarkCoords['man_1st'][1] + 50*ratio},
  // { x: 255, y: 437 },
  { x: landmarkCoords['man_1st'][0] - 70*ratio,
    y: landmarkCoords['man_1st'][1] + 55*ratio},
  // { x: 265, y: 408 },
  { x: landmarkCoords['man_1st'][0] - 70*ratio,
    y: landmarkCoords['man_1st'][1] + 40*ratio},
  // { x: 273, y: 386 },
  { x: landmarkCoords['man_1st'][0] - 55*ratio,
    y: landmarkCoords['man_1st'][1] + 5*ratio},
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