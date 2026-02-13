// Landmark 좌표들이 저장된 dict를 입력받았을 때,
// 이를 기반으로 자동적으로 그리는 기능을 만듦

// 좌표들은 예시로 넣은 것이며, 실제 좌표는 필요에 따라 수정
// var landmarkCoords = {"Nasion": [1266, 822], "Sella": [811, 877], "Porion": [647, 968], "Pterygoid point": [913, 1029], "Basion": [620, 1101], "Articulare": [716, 1046], "Orbitale": [1204, 999], "ANS": [1266, 1193], "PNS": [936, 1162], "Point A": [1235, 1227], "Prosthion": [1275, 1305], "Incision superius apicalis": [1213, 1246], "Incision superius incisalis": [1295, 1396], "Incision inferius incisalis": [1269, 1384], "Incision inferius apicalis": [1191, 1486], "Infradentale": [1248, 1458], "Point B": [1208, 1513], "Pogonion": [1197, 1602], "Gnathion": [1177, 1639], "Menton": [1130, 1639], "Gonion": [781, 1382], "Maxillary first molar": [1011, 1299], "Mandibular first molar": [1019, 1345], "Soft tissue glabella": [1332, 713], "Soft tissue nasion": [1298, 897], "Pronasale": [1425, 1148], "Subnasale": [1326, 1219], "Soft tissue subspinale": [1355, 1274], "Labrale superius": [1381, 1329], "Stomion": [1323, 1384], "Labrale inferius": [1368, 1449], "Soft tissue submentale": [1295, 1509], "Soft tissue pogonion": [1295, 1604], "Soft tissue gnathion": [1259, 1666]}
var landmarkCoords = {"Nasion": [1292, 926], "Sella": [868, 919], "Porion": [664, 1011], 
  "Pterygoid point": [921, 1089], "Basion": [633, 1180], "Articulare": [685, 1152],
  "Orbitale": [1204, 1099], "ANS": [1269, 1303], "PNS": [938, 1258], "Point A": [1246, 1341],
  "Prosthion": [1261, 1400], "Incision superius apicalis": [1213, 1343],
  "Incision superius incisalis": [1269, 1494], "Incision inferius incisalis": [1231, 1458],
  "Incision inferius apicalis": [1168, 1576], "Infradentale": [1220, 1531], "Point B": [1200, 1578],
  "Pogonion": [1207, 1672], "Gnathion": [1187, 1714], "Menton": [1151, 1729], "Gonion": [667, 1445],
  "Maxillary first molar": [1093, 1437], "Mandibular first molar": [1088, 1458],
  "Soft tissue glabella": [1354, 805], "Soft tissue nasion": [1316, 981], "Pronasale": [1458, 1260],
  "Subnasale": [1360, 1329], "Soft tissue subspinale": [1354, 1386], "Labrale superius": [1375, 1421],
  "Stomion": [1313, 1474], "Labrale inferius": [1345, 1527], "Soft tissue submentale": [1283, 1580],
  "Soft tissue pogonion": [1292, 1668], "Soft tissue gnathion": [1252, 1751]}

const canvas = document.getElementById('canvas');


// canvas 크기 설정
// 이후 이것을 이미지의 width, height로 맞출 것
canvas.width = 3000;
canvas.height = 3000;

// 원본 이미지의 height 크기 정보를 받은 후,
// predict되지 않은 임의의 point들의 추정에 사용되는 ratio 계산
// Ratio에 가장 큰 영향을 받는 maxilla 1st molar, mandibular 1st molar 사이의
// Euclidean distance를 기준으로 계산
// ratio = 1;
ratio = Math.sqrt( (landmarkCoords['Maxillary first molar'][0]-landmarkCoords['Mandibular first molar'][0])**2 + (landmarkCoords['Maxillary first molar'][1]-landmarkCoords['Mandibular first molar'][1])**2 ) / 21.47;

const ctx = canvas.getContext('2d');


//////////////////////////////////////

// 얼굴의 가장 가장자리 part
const points = [
    { x: landmarkCoords['Soft tissue glabella'][0],
      y: landmarkCoords['Soft tissue glabella'][1] },

    //////////////////
    // 중점 1
    { x: (landmarkCoords['Soft tissue glabella'][0]+landmarkCoords['Soft tissue nasion'][0])/2,
      y: (landmarkCoords['Soft tissue glabella'][1]+landmarkCoords['Soft tissue nasion'][1])/2 },
    //////////////////
    
    { x: landmarkCoords['Soft tissue nasion'][0],
      y: landmarkCoords['Soft tissue nasion'][1] },

    //////////////////
    // 중점 2 : Soft Tissue Nasion ~ Pronasale 간 3등분해서 1/3씩 느낌으로
    { x: landmarkCoords['Soft tissue nasion'][0] + (landmarkCoords['Pronasale'][0]-landmarkCoords['Soft tissue nasion'][0])/3,
      y: landmarkCoords['Soft tissue nasion'][1] + (landmarkCoords['Pronasale'][1]-landmarkCoords['Soft tissue nasion'][1])/3 },
    { x: landmarkCoords['Soft tissue nasion'][0] + (landmarkCoords['Pronasale'][0]-landmarkCoords['Soft tissue nasion'][0])*2/3,
      y: landmarkCoords['Soft tissue nasion'][1] + (landmarkCoords['Pronasale'][1]-landmarkCoords['Soft tissue nasion'][1])*2/3 },
    //////////////////

    { x: landmarkCoords['Pronasale'][0],
      y: landmarkCoords['Pronasale'][1] },

    //////////////////
    // 중점 3 (Pronasale과 Subnasale의 중간점)
    { x: (landmarkCoords['Pronasale'][0]+landmarkCoords['Subnasale'][0])/2,
      y: (landmarkCoords['Pronasale'][1]+landmarkCoords['Subnasale'][1])/2 },
    //////////////////

    { x: landmarkCoords['Subnasale'][0],
      y: landmarkCoords['Subnasale'][1] },

    //////////////////
    // 중점 4
    { x: (landmarkCoords['Subnasale'][0]+landmarkCoords['Soft tissue subspinale'][0])/2,
      y: (landmarkCoords['Subnasale'][1]+landmarkCoords['Soft tissue subspinale'][1])/2 },
    //////////////////


    { x: landmarkCoords['Soft tissue subspinale'][0],
      y: landmarkCoords['Soft tissue subspinale'][1] },
    { x: landmarkCoords['Labrale superius'][0],
      y: landmarkCoords['Labrale superius'][1] },
    { x: landmarkCoords['Stomion'][0]-5*ratio,
      y: landmarkCoords['Stomion'][1] },

    { x: landmarkCoords['Stomion'][0]-5*ratio,
      y: landmarkCoords['Stomion'][1] },
    { x: landmarkCoords['Labrale inferius'][0],
      y: landmarkCoords['Labrale inferius'][1] },
    { x: landmarkCoords['Soft tissue submentale'][0],
      y: landmarkCoords['Soft tissue submentale'][1] },
    { x: landmarkCoords['Soft tissue pogonion'][0],
      y: landmarkCoords['Soft tissue pogonion'][1] },
    { x: landmarkCoords['Soft tissue gnathion'][0],
      y: landmarkCoords['Soft tissue gnathion'][1] },
    
];



// 윗니 앞니
const points2 = [
  { x: landmarkCoords['Incision superius incisalis'][0],
    y: landmarkCoords['Incision superius incisalis'][1] },
  
  // 곡선을 부드럽게 만들어주기 위한 추가점
  { x: landmarkCoords['Incision superius incisalis'][0] - 2*ratio,
    y: landmarkCoords['Incision superius incisalis'][1] + 2*ratio },

  // 평행사변형(마름모) : D=C+(A−B)
  // { x: 439, y: 386 },
  { x: (landmarkCoords['Incision superius incisalis'][0] + landmarkCoords['Incision superius apicalis'][0] - landmarkCoords['Prosthion'][0]),
    y: (landmarkCoords['Incision superius incisalis'][1] + landmarkCoords['Incision superius apicalis'][1] - landmarkCoords['Prosthion'][1]) },

  { x: landmarkCoords['Incision superius apicalis'][0],
    y: landmarkCoords['Incision superius apicalis'][1] },


  { x: landmarkCoords['Prosthion'][0],
    y: landmarkCoords['Prosthion'][1] },
  
  ////////////////
  // { x: 475, y: 393 },
  { x: (landmarkCoords['Prosthion'][0]+landmarkCoords['Incision superius incisalis'][0])/2 + 5*ratio,
    y: (landmarkCoords['Prosthion'][1]+landmarkCoords['Incision superius incisalis'][1])/2 },
  ////////////////

  // 곡선을 부드럽게 만들어주기 위한 추가점
  { x: landmarkCoords['Incision superius incisalis'][0] + 2*ratio,
    y: landmarkCoords['Incision superius incisalis'][1] - 2*ratio },
  
  { x: landmarkCoords['Incision superius incisalis'][0],
    y: landmarkCoords['Incision superius incisalis'][1] },
]



// 아랫니 앞니
const points3 = [
  { x: landmarkCoords['Incision inferius incisalis'][0],
    y: landmarkCoords['Incision inferius incisalis'][1] },
  
  // 곡선을 부드럽게 만들어주기 위한 추가점
  { x: landmarkCoords['Incision inferius incisalis'][0] + 2*ratio,
    y: landmarkCoords['Incision inferius incisalis'][1] + 2*ratio },
  
  // 중점 1 { x: 441, y: 420 },
  { x: (landmarkCoords['Incision inferius incisalis'][0] + landmarkCoords['Infradentale'][0]) / 2 + 5*ratio,
    y: (landmarkCoords['Incision inferius incisalis'][1] + landmarkCoords['Infradentale'][1]) / 2 },
  
  { x: landmarkCoords['Infradentale'][0],
    y: landmarkCoords['Infradentale'][1] },

  // 중점 2
  { x: (landmarkCoords['Infradentale'][0] + landmarkCoords['Incision inferius apicalis'][0]) / 2 + 5*ratio,
    y: (landmarkCoords['Infradentale'][1] + landmarkCoords['Incision inferius apicalis'][1]) / 2 },
  
  { x: landmarkCoords['Incision inferius apicalis'][0],
    y: landmarkCoords['Incision inferius apicalis'][1] },

  ////////////////
  // 평행사변형(마름모) : D=C+(A−B)
  // { x: 408, y: 430 },
  temp_x1 = (landmarkCoords['Incision inferius incisalis'][0]+landmarkCoords['Incision inferius apicalis'][0]) - landmarkCoords['Infradentale'][0],
  temp_y1 = (landmarkCoords['Incision inferius incisalis'][1]+landmarkCoords['Incision inferius apicalis'][1]) - landmarkCoords['Infradentale'][1],
  
  // 중점 3
  { x: (landmarkCoords['Incision inferius apicalis'][0] + temp_x1) / 2,
    y: (landmarkCoords['Incision inferius apicalis'][1] + temp_y1) / 2 },
  
  // 중점 4 : Infradentale의 반대편 개념의 중점
  { x: temp_x1,
    y: temp_y1 },
  ////////////////
  
  // 중점 5
  // { x: 422, y: 410 },
  { x: (temp_x1 + landmarkCoords['Incision inferius incisalis'][0]) / 2,
    y: (temp_y1 + landmarkCoords['Incision inferius incisalis'][1]) / 2 - 10*ratio },
  
  
  // 곡선을 부드럽게 만들어주기 위한 추가점
  { x: landmarkCoords['Incision inferius incisalis'][0] - 2*ratio,
    y: landmarkCoords['Incision inferius incisalis'][1] - 2*ratio },
  
  
  { x: landmarkCoords['Incision inferius incisalis'][0],
    y: landmarkCoords['Incision inferius incisalis'][1] },
]


// Maxilla
const points4 = [
  { x: landmarkCoords['PNS'][0],
    y: landmarkCoords['PNS'][1] },

  // ANS~PNS 사이의 중점
  { x: (landmarkCoords['ANS'][0] + landmarkCoords['PNS'][0]) / 2,
    y: (landmarkCoords['ANS'][1] + landmarkCoords['PNS'][1]) / 2 },
  
  // 중점~ANS 사이에 1/3 정도씩 좌표를 늘리는 개념으로 x좌표 할당
  // y 좌표는 ratio를 써서 조절하자 (각각 25, 10 * ratio 사용함)
  { x: ((landmarkCoords['ANS'][0] + landmarkCoords['PNS'][0]) / 2) + ( landmarkCoords['ANS'][0] - ((landmarkCoords['ANS'][0] + landmarkCoords['PNS'][0]) / 2) ) * 1/3,
    y: ((landmarkCoords['ANS'][1] + landmarkCoords['PNS'][1]) / 2) + ( landmarkCoords['ANS'][1] - ((landmarkCoords['ANS'][1] + landmarkCoords['PNS'][1]) / 2) ) * 1/3 - 25*ratio, },
  
  { x: ((landmarkCoords['ANS'][0] + landmarkCoords['PNS'][0]) / 2) + ( landmarkCoords['ANS'][0] - ((landmarkCoords['ANS'][0] + landmarkCoords['PNS'][0]) / 2) ) * 2/3,
    y: ((landmarkCoords['ANS'][1] + landmarkCoords['PNS'][1]) / 2) + ( landmarkCoords['ANS'][1] - ((landmarkCoords['ANS'][1] + landmarkCoords['PNS'][1]) / 2) ) * 2/3 - 10*ratio },
  
  { x: landmarkCoords['ANS'][0],
    y: landmarkCoords['ANS'][1] },
]

const points5 = [
  // { x: 461, y: 298 },
  { x: landmarkCoords['ANS'][0],
    y: landmarkCoords['ANS'][1] },

  // { x: 450, y: 307 },
  { x: (landmarkCoords['ANS'][0] + landmarkCoords['Point A'][0]) / 2,
    y: (landmarkCoords['ANS'][1] + landmarkCoords['Point A'][1]) / 2 - 5*ratio},

  // { x: 448, y: 321 },
  { x: landmarkCoords['Point A'][0],
    y: landmarkCoords['Point A'][1] },
  // { x: 466, y: 364 },
  { x: landmarkCoords['Prosthion'][0],
    y: landmarkCoords['Prosthion'][1] },
]


const points6 = [
  // { x: 439, y: 386 },
  { x: (landmarkCoords['Incision superius incisalis'][0] + landmarkCoords['Incision superius apicalis'][0] - landmarkCoords['Prosthion'][0]),
    y: (landmarkCoords['Incision superius incisalis'][1] + landmarkCoords['Incision superius apicalis'][1] - landmarkCoords['Prosthion'][1]) },
  
  // { x: 375, y: 323 },
  // PNS와 [439, 386] 사이의 중점
  { x: ( landmarkCoords['PNS'][0] + (landmarkCoords['Incision superius incisalis'][0] + landmarkCoords['Incision superius apicalis'][0] - landmarkCoords['Prosthion'][0]) ) / 2 + 20*ratio,
    y: ( landmarkCoords['PNS'][1] + (landmarkCoords['Incision superius incisalis'][1] + landmarkCoords['Incision superius apicalis'][1] - landmarkCoords['Prosthion'][1]) ) / 2 - 20*ratio},

  
  // { x: 244, y: 276 },
  { x: landmarkCoords['PNS'][0],
    y: landmarkCoords['PNS'][1] },
]


// Mandible
const points7 = [
  // { x: 431, y: 440 },
  { x: landmarkCoords['Infradentale'][0],
    y: landmarkCoords['Infradentale'][1] },
  // { x: 412, y: 469 },
  { x: landmarkCoords['Point B'][0],
    y: landmarkCoords['Point B'][1] },
  // { x: 407, y: 529 },
  { x: landmarkCoords['Pogonion'][0],
    y: landmarkCoords['Pogonion'][1] },
  // { x: 396, y: 556 },
  { x: landmarkCoords['Gnathion'][0],
    y: landmarkCoords['Gnathion'][1] },
  // { x: 371, y: 568 },
  { x: landmarkCoords['Menton'][0],
    y: landmarkCoords['Menton'][1] },
  
  // 임의의 point 할당
  // 이미 존재하는 point들을 기반으로 최대한 대칭이 되게 해 보자
  // { x: 352, y: 555 },
  { x: landmarkCoords['Menton'][0] - (landmarkCoords['Gnathion'][0] - landmarkCoords['Menton'][0]),
    y: landmarkCoords['Gnathion'][1] },
  
    // { x: 341, y: 538 },
  temp_x2 = landmarkCoords['Menton'][0] - (landmarkCoords['Pogonion'][0] - landmarkCoords['Menton'][0]),
  { x: (temp_x2 + landmarkCoords['Menton'][0]) / 2,
    // y: (landmarkCoords['Pogonion'][1] + landmarkCoords['Menton'][1]) / 2 + 10*ratio },
    y: (landmarkCoords['Pogonion'][1] + landmarkCoords['Menton'][1]) / 2 + 10*ratio },
  
    // { x: 341, y: 522 },
  { x: temp_x2,
    y: landmarkCoords['Pogonion'][1] },
  // { x: 355, y: 489 },
  // { x: temp_x2 + 15*ratio,
  //   y: landmarkCoords['Pogonion'][1] - 40*ratio },
  // // { x: 374, y: 459 },
  // { x: temp_x2 + 35*ratio,
  //   y: landmarkCoords['Pogonion'][1] - 70*ratio },
  // { x: 408, y: 430 }, : temp_x1, temp_y1
  { x: temp_x1,
    y: temp_y1
  }
]

const points8 = [
  // { x: 352, y: 555 },
  { x: landmarkCoords['Menton'][0] - (landmarkCoords['Gnathion'][0] - landmarkCoords['Menton'][0]),
    y: landmarkCoords['Gnathion'][1] },
  
    // { x: 274, y: 502 },
  { x: landmarkCoords['Gonion'][0] + (landmarkCoords['Menton'][0] - landmarkCoords['Gonion'][0]) * 2/3,
    y: landmarkCoords['Gonion'][1] + (landmarkCoords['Menton'][1] - landmarkCoords['Gonion'][1]) * 2/3 },
  
    // { x: 195, y: 445 },
  { x: landmarkCoords['Gonion'][0] + (landmarkCoords['Menton'][0] - landmarkCoords['Gonion'][0]) * 1/3,
    y: landmarkCoords['Gonion'][1] + (landmarkCoords['Menton'][1] - landmarkCoords['Gonion'][1]) * 1/3 - 20*ratio },
  
    // { x: 104, y: 405 },
  { x: landmarkCoords['Gonion'][0],
    y: landmarkCoords['Gonion'][1] },
  
    // { x: 97, y: 305 },
  { x: (landmarkCoords['Gonion'][0] + landmarkCoords['Articulare'][0]) / 2 + 10*ratio,
    y: (landmarkCoords['Gonion'][1] + landmarkCoords['Articulare'][1]) / 2 },
  
  // { x: 87, y: 210 },
  { x: landmarkCoords['Articulare'][0],
    y: landmarkCoords['Articulare'][1] },
]

ratio_2 = ratio * 0.9;

// Maxilla 1st molar
const points9 = [
  // { x: 341, y: 334 },
  { x: landmarkCoords['Maxillary first molar'][0],
    y: landmarkCoords['Maxillary first molar'][1] - 30*ratio_2},
  // { x: 338, y: 363 },
  { x: landmarkCoords['Maxillary first molar'][0],
    y: landmarkCoords['Maxillary first molar'][1] },
  
    // { x: 322, y: 369 },
  { x: landmarkCoords['Maxillary first molar'][0] - 20*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] + 5*ratio_2},
  // { x: 310, y: 364 },
  { x: landmarkCoords['Maxillary first molar'][0] - 25*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] - 5*ratio_2},
  // { x: 298, y: 363 },
  { x: landmarkCoords['Maxillary first molar'][0] - 35*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1]},
  
  // { x: 289, y: 343 },
  { x: landmarkCoords['Maxillary first molar'][0] - 50*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] - 15*ratio_2},
  // { x: 304, y: 320 },
  { x: landmarkCoords['Maxillary first molar'][0] - 30*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] - 45*ratio_2},
]

const points10 = [
  // { x: 304, y: 320 },
  { x: landmarkCoords['Maxillary first molar'][0] - 30*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] - 45*ratio_2},
  // { x: 313, y: 301 },
  { x: landmarkCoords['Maxillary first molar'][0] - 35*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] - 40*ratio_2},
  // { x: 324, y: 281 },
  { x: landmarkCoords['Maxillary first molar'][0] - 12*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] - 80*ratio_2},
  // { x: 327, y: 297 },
  { x: landmarkCoords['Maxillary first molar'][0] - 9*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] - 65*ratio_2},
  // { x: 328, y: 314 },
  { x: landmarkCoords['Maxillary first molar'][0] - 15*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] - 35*ratio_2},
  // { x: 337, y: 299 },
  { x: landmarkCoords['Maxillary first molar'][0] - 2*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] - 65*ratio_2},
  // { x: 346, y: 288 },
  { x: landmarkCoords['Maxillary first molar'][0] + 10*ratio_2,
    y: landmarkCoords['Maxillary first molar'][1] - 70*ratio_2},
  // { x: 345, y: 312 },
  { x: landmarkCoords['Maxillary first molar'][0],
    y: landmarkCoords['Maxillary first molar'][1] - 30*ratio_2},
  // { x: 341, y: 334 },
  { x: landmarkCoords['Maxillary first molar'][0],
    y: landmarkCoords['Maxillary first molar'][1] - 30*ratio_2},
]



// Mandible 1st molar
const points11 = [
  // { x: 318, y: 397 },
  { x: landmarkCoords['Mandibular first molar'][0] - 12*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 15*ratio_2},
  // { x: 328, y: 382 },
  { x: landmarkCoords['Mandibular first molar'][0],
    y: landmarkCoords['Mandibular first molar'][1]},
  // { x: 323, y: 375 },
  { x: landmarkCoords['Mandibular first molar'][0] - 15*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] - 10*ratio_2},
  // { x: 308, y: 370 },
  { x: landmarkCoords['Mandibular first molar'][0] - 27*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] - 5*ratio_2},
  // { x: 294, y: 364 },
  { x: landmarkCoords['Mandibular first molar'][0] - 35*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] - 20*ratio_2},
  // { x: 278, y: 368 },
  { x: landmarkCoords['Mandibular first molar'][0] - 50*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] - 15*ratio_2},
  // { x: 273, y: 386 },
  { x: landmarkCoords['Mandibular first molar'][0] - 55*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 5*ratio_2},
]

const points12 = [
  // { x: 318, y: 397 },
  { x: landmarkCoords['Mandibular first molar'][0] - 12*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 15*ratio_2},
  // { x: 304, y: 422 },
  { x: landmarkCoords['Mandibular first molar'][0] - 20*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 25*ratio_2},
  // { x: 284, y: 450 },
  { x: landmarkCoords['Mandibular first molar'][0] - 40*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 70*ratio_2},
  // { x: 286, y: 428 },
  { x: landmarkCoords['Mandibular first molar'][0] - 45*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 55*ratio_2},
  // { x: 289, y: 409 },
  { x: landmarkCoords['Mandibular first molar'][0] - 35*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 20*ratio_2},
  // { x: 273, y: 424 },
  { x: landmarkCoords['Mandibular first molar'][0] - 65*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 50*ratio_2},
  // { x: 255, y: 437 },
  { x: landmarkCoords['Mandibular first molar'][0] - 70*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 55*ratio_2},
  // { x: 265, y: 408 },
  { x: landmarkCoords['Mandibular first molar'][0] - 70*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 40*ratio_2},
  // { x: 273, y: 386 },
  { x: landmarkCoords['Mandibular first molar'][0] - 55*ratio_2,
    y: landmarkCoords['Mandibular first molar'][1] + 5*ratio_2},
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