// Landmark 좌표들이 저장된 dict를 입력받았을 때,
// 이를 기반으로 자동적으로 그리는 기능을 만듦

// 좌표들은 예시로 넣은 것이며, 실제 좌표는 필요에 따라 수정
// var landmarkCoords = {"Nasion": [1269, 774], "Sella": [817, 857], "Porion": [656, 1002], 
//   "Pterygoid point": [916, 1020], "Basion": [639, 1159], "Articulare": [711, 1090],
//   "Orbitale": [1175, 990], "ANS": [1283, 1140], "PNS": [963, 1149], "Point A": [1267, 1195],
//   "Prosthion": [1293, 1271], "Incision superius apicalis": [1232, 1204],
//   "Incision superius incisalis": [1283, 1360], "Incision inferius incisalis": [1231, 1458],
//   "Incision inferius apicalis": [1168, 1576], "Infradentale": [1220, 1531], "Point B": [1200, 1578],
//   "Pogonion": [1207, 1672], "Gnathion": [1187, 1714], "Menton": [1151, 1729], "Gonion": [667, 1445],
//   "Maxillary first molar": [1093, 1437], "Mandibular first molar": [1088, 1458],
//   "Soft tissue glabella": [1354, 805], "Soft tissue nasion": [1316, 981], "Pronasale": [1458, 1260],
//   "Subnasale": [1360, 1329], "Soft tissue subspinale": [1354, 1386], "Labrale superius": [1375, 1421],
//   "Stomion": [1313, 1474], "Labrale inferius": [1345, 1527], "Soft tissue submentale": [1283, 1580],
//   "Soft tissue pogonion": [1292, 1668], "Soft tissue gnathion": [1252, 1751]}


// <!-- svg test -->
//         <svg width="3000" height="3000">
//             <!-- SVG content goes here -->
//              <path id="svgPath" d="M6.771,24.439C6.771,24.439,6.8069999999999995,15.218,7.641,9.6C8.475,3.9819999999999993,12.035,-3.5980000000000008,14.407,4.614999999999999S20.426000000000002,33.98,22.545,15.072S28.894000000000002,-0.25900000000000034,31.353,7.190999999999999S31.301000000000002,29.82,33.529,39.055C35.756,48.289,36.855000000000004,52.364,32.388000000000005,56.101C29.482000000000006,58.742,26.525000000000006,59.315,23.633000000000003,57.356C21.871000000000002,56.329,17.729000000000003,55.872,14.209000000000003,57.579C8.214,60.486,5.64,56.595,3.84,54.745C0.3639999999999999,51.172,0.10299999999999976,47.093999999999994,2.9259999999999997,39.675C3.014,39.444,6.509,32.524,6.771,24.439Z" stroke="red" fill="none" />
// </svg>



function findRightTop(p1, p3, p4) {
    // 두 벡터의 뺄셈 (v1 - v2)
    const subtract = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]];

    // 두 벡터의 덧셈 (v1 + v2)
    const add = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];

    // 벡터에 상수를 곱함 (v1 * s)
    const multiply = (v1, s) => [v1[0] * s, v1[1] * s];

    // 두 벡터의 내적 (Dot Product)
    const dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1];

    // 벡터의 길이(Magnitude) 구하기
    const magnitude = (v) => Math.sqrt(v[0] ** 2 + v[1] ** 2);
    
    // 1. 밑변 벡터 (Left Bottom -> Right Bottom)
    const bottomVector = subtract(p3, p4);
    const bottomLen = magnitude(bottomVector);
    
    // 2. 밑변의 단위 벡터 (u)
    const u = multiply(bottomVector, 1 / bottomLen);
    
    // 3. 빗변 벡터 (Left Bottom -> Left Top)
    const sideVector = subtract(p1, p4);
    
    // 4. 투영 거리 (Offset): 윗변이 밑변에 비해 얼마나 안쪽으로 들어와 있는가
    const offsetDist = dot(sideVector, u);
    
    // 5. 윗변의 길이 계산 (등변사다리꼴 성질: 밑변 - 2 * offset)
    const topLen = bottomLen - (2 * offsetDist);
    
    // 6. 우상단 좌표 (p2) = 좌상단(p1) + (윗변 길이 * 단위 벡터)
    const rightTop = add(p1, multiply(u, topLen));
    
    return rightTop;
};




/**
 * SVG path 데이터를 3개의 기준점을 바탕으로 변환하여 캔버스에 그립니다.
 * @param {string|SVGPathElement} pathInput - 변환할 SVG path 데이터 문자열 또는 요소
 * @param {Array} src - 원본 기준점 3개 [{x, y}, {x, y}, {x, y}]
 * @param {Array} dst - 목표 기준점 3개 [{x, y}, {x, y}, {x, y}]
 */
function applyAffineTransform(pathInput, src, dst) {
    const pathData = typeof pathInput === 'string' ? pathInput : pathInput.getAttribute("d");

    const x1 = src[0].x, y1 = src[0].y;
    const x2 = src[1].x, y2 = src[1].y;
    const x3 = src[2].x, y3 = src[2].y;

    const u1 = dst[0].x, v1 = dst[0].y;
    const u2 = dst[1].x, v2 = dst[1].y;
    const u3 = dst[2].x, v3 = dst[2].y;

    // 행렬식(Determinant) 계산
    const det = x1 * (y2 - y3) - y1 * (x2 - x3) + (x2 * y3 - x3 * y2);
    if (Math.abs(det) < 1e-6) return;

    // 아핀 변환 계수 계산
    // x' = a*x + c*y + e
    // y' = b*x + d*y + f
    const a = (u1 * (y2 - y3) - y1 * (u2 - u3) + (u2 * y3 - u3 * y2)) / det;
    const b = (v1 * (y2 - y3) - y1 * (v2 - v3) + (v2 * y3 - v3 * y2)) / det;
    const c = (x1 * (u2 - u3) - u1 * (x2 - x3) + (x2 * u3 - x3 * u2)) / det;
    const d = (x1 * (v2 - v3) - v1 * (x2 - x3) + (x2 * v3 - x3 * v2)) / det;
    const e = (x1 * (y2 * u3 - y3 * u2) - y1 * (x2 * u3 - x3 * u2) + u1 * (x2 * y3 - x3 * y2)) / det;
    const f = (x1 * (y2 * v3 - y3 * v2) - y1 * (x2 * v3 - x3 * v2) + v1 * (x2 * y3 - x3 * y2)) / det;

    ctx.save();
    // 캔버스 transform matrix 적용
    ctx.transform(a, b, c, d, e, f);
    const p = new Path2D(pathData);
    
    return p;
}








var landmarkCoords = {"Nasion": [663, 164], "Sella": [471, 206], "Porion": [387, 261], "Pterygoid point": [517, 258],
  "Basion": [400, 332], "Articulare": [418, 308], "Orbitale": [642, 251], "ANS": [684, 335], "PNS": [528, 340],
  "Point A": [676, 356], "Prosthion": [703, 403], "Incision superius apicalis": [677, 384],
  "Incision superius incisalis": [705, 433], "Incision inferius incisalis": [682, 420],
  "Incision inferius apicalis": [647, 458], "Infradentale": [670, 443], "Point B": [647, 470],
  "Pogonion": [640, 533], "Gnathion": [634, 545], "Menton": [620, 549], "Gonion": [439, 451],
  "Anterior Maxillary first molar": [608, 414], "Posterior Maxillary first molar": [576, 408], "Maxillary first root": [587, 365],
  "Anterior Mandibular first molar": [602, 423], "Posterior Mandibular first molar": [573, 416], "Mandibular first root": [564, 462],
  "Soft tissue glabella": [688, 126], "Soft tissue nasion": [686, 203], "Pronasale": [753, 310], "Subnasale": [718, 349],
  "Soft tissue subspinale": [726, 380], "Labrale superius": [737, 408], "Stomion": [716, 429], "Labrale inferius": [721, 448],
  "Soft tissue submentale": [693, 470], "Soft tissue pogonion": [686, 522], "Soft tissue gnathion": [670, 548]}

const canvas = document.getElementById('canvas');


// canvas 크기 설정
// 이후 이것을 이미지의 width, height로 맞출 것
canvas.ctx = 3000;
canvas.ctx = 3000;

// 원본 이미지의 height 크기 정보를 받은 후,
// predict되지 않은 임의의 point들의 추정에 사용되는 ratio 계산
// Ratio에 가장 큰 영향을 받는 maxilla 1st molar, mandibular 1st molar 사이의
// Euclidean distance를 기준으로 계산
// ratio = 1;
ratio = Math.sqrt( (landmarkCoords['Anterior Maxillary first molar'][0]-landmarkCoords['Posterior Maxillary first molar'][0])**2 + (landmarkCoords['Anterior Maxillary first molar'][1]-landmarkCoords['Posterior Maxillary first molar'][1])**2 ) / 21.47;
///////////////////////////////////////////////////////////
// 여러 번 쓰이기 때문에, point들을 쓰기 편한 변수로 미리 정의함.
a_max = landmarkCoords['Anterior Maxillary first molar'];
p_max = landmarkCoords['Posterior Maxillary first molar'];
max_1st = landmarkCoords['Maxillary first root'];

a_man = landmarkCoords['Anterior Mandibular first molar'];
p_man = landmarkCoords['Posterior Mandibular first molar'];
man_1st = landmarkCoords['Mandibular first root'];
///////////////////////////////////////////////////////////

// Functions
// 점을 표현하기 위한 간단한 헬퍼
function point(x, y) {
  return { x, y };
}

// 벡터/점 연산 헬퍼
function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

function mul(a, k) {
  return { x: a.x * k, y: a.y * k };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}


// 평행사변형의 좌상단 A, 좌하단 B, 우하단 C 가 주어졌을 때 우상단 D 계산
function rightTop(A, B, C) {
  // 1) 대각선 AC 중점 O
  const O = point((A.x + C.x) / 2, (A.y + C.y) / 2);

  // 2) 왼쪽 변 AB 방향 벡터 v
  const v = sub(B, A); // B - A

  // 3) v 에 수직인 방향 벡터 n (대칭축의 방향)
  const n = point(-v.y, v.x);

  // 4) A 를 O 기준으로 옮긴 벡터 w = A - O
  const w = sub(A, O);

  // 5) w 를 n 에 투영한 계수 t = (w·n) / (n·n)
  const nn = dot(n, n);
  if (nn === 0) {
    throw new Error("A와 B가 같은 점입니다. 유효한 사다리꼴이 아닙니다.");
  }
  const t = dot(w, n) / nn;

  // 6) 투영 벡터 p = t * n
  const p = mul(n, t);

  // 7) 반사된 벡터 w' = 2p - w
  const w_reflected = sub(mul(p, 2), w);

  // 8) 최종 D = O + w'
  const D = add(O, w_reflected);

  return D;
}


///////////////////////////////////////////////////////////



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
  // x: landmarkCoords['Menton'][0] - (landmarkCoords['Gnathion'][0] - landmarkCoords['Menton'][0]),
  { x: landmarkCoords['Menton'][0] - 2*ratio,
    y: landmarkCoords['Menton'][1] - 2*ratio},
  
  // { x: 341, y: 538 },
  // { x: (temp_x2 + landmarkCoords['Menton'][0]) / 2,
  // y: (landmarkCoords['Pogonion'][1] + landmarkCoords['Menton'][1]) / 2 + 10*ratio },
  { x: landmarkCoords['Menton'][0] - 5*ratio,
    y: landmarkCoords['Menton'][1] - 5*ratio },
  
    // { x: 341, y: 522 },
    temp_x2 = landmarkCoords['Menton'][0] - (landmarkCoords['Pogonion'][0] - landmarkCoords['Menton'][0]),
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
  // { x: landmarkCoords['Menton'][0] - (landmarkCoords['Gnathion'][0] - landmarkCoords['Menton'][0]),
  //   y: landmarkCoords['Gnathion'][1] },
  { x: landmarkCoords['Menton'][0],
    y: landmarkCoords['Menton'][1] },
  
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


////////////////////////////////////


// Maxilla 1st molar 왼쪽 절반
const points9 = [
  // 중점 부분에서 스타트
  { x: (a_max[0] + p_max[0]) / 2,
    y: (a_max[1] + p_max[1]) / 2 - 3*ratio },
  { x: (a_max[0] + p_max[0]) / 2 - 3*ratio,
    y: (a_max[1] + p_max[1]) / 2 - 3*ratio },
  
  // p_max 부근에서의 둥근 부분을 만들어 주는 작업
  { x: p_max[0] + 2*ratio,
    y: p_max[1] + 2*ratio},
  { x: p_max[0],
    y: p_max[1] },
  { x: p_max[0] - 2*ratio,
    y: p_max[1] - 5*ratio },
  
  // 둥근 부분 이후 1st root까지 쭉 내려 주는 부분
  { x: ((p_max[0] - 2*ratio) + (max_1st[0] - 2*ratio)) / 2 + 3*ratio,
    y: ((p_max[1] - 5*ratio) + (max_1st[1] + 2*ratio)) / 2 },
  { x: max_1st[0] - 2*ratio,
    y: max_1st[1] + 2*ratio },
  { x: max_1st[0],
    y: max_1st[1] },
  { x: max_1st[0] + 2*ratio,
    y: max_1st[1] + 2*ratio },
  
  // 안쪽 중점까지
  // (max_1st[0] + findRightTop(max_1st, p_max, a_max)[0]) / 2 : 중점의 x좌표
  { x: ((max_1st[0] + 2*ratio + findRightTop(max_1st, p_max, a_max)[0]) / 2) - 2*ratio,
    y: ((max_1st[1] + 2*ratio + findRightTop(max_1st, p_max, a_max)[1]) / 2 + 10*ratio) },
  { x: ((max_1st[0] + 2*ratio + findRightTop(max_1st, p_max, a_max)[0]) / 2),
    y: ((max_1st[1] + 2*ratio + findRightTop(max_1st, p_max, a_max)[1]) / 2 + 10*ratio) },
]

// Maxilla 1st molar 오른쪽 절반
const points10 = [
  // 중점 부분에서 스타트
  { x: (a_max[0] + p_max[0]) / 2,
    y: (a_max[1] + p_max[1]) / 2 - 3*ratio },
  { x: (a_max[0] + p_max[0]) / 2 + 3*ratio,
    y: (a_max[1] + p_max[1]) / 2 - 3*ratio },
  
  // a_max 부근에서의 둥근 부분을 만들어 주는 작업
  { x: a_max[0] - 4*ratio,
    y: a_max[1] - 2*ratio},
  { x: a_max[0],
    y: a_max[1] },
  { x: a_max[0] + 1*ratio,
    y: a_max[1] + 2*ratio },
  { x: a_max[0] + 5*ratio,
    y: a_max[1] - 1*ratio },
  
  // 둥근 부분 이후 1st root까지 쭉 내려 주는 부분
  // findRightTop 함수 사용
  { x: ((a_max[0] + 5*ratio) + findRightTop(max_1st, p_max, a_max)[0]) / 2 + 3*ratio,
    y: ((a_max[1] - 5*ratio) + findRightTop(max_1st, p_max, a_max)[1]) / 2 - 10*ratio },
  { x: (findRightTop(max_1st, p_max, a_max)[0]) + 3*ratio,
    y: (findRightTop(max_1st, p_max, a_max)[1]) + 2*ratio },
  { x: (findRightTop(max_1st, p_max, a_max)[0]),
    y: (findRightTop(max_1st, p_max, a_max)[1]) },
  { x: (findRightTop(max_1st, p_max, a_max)[0]) - 1*ratio,
    y: (findRightTop(max_1st, p_max, a_max)[1]) + 2*ratio},

  // 안쪽 중점까지
  { x: ((max_1st[0] + 2*ratio + findRightTop(max_1st, p_max, a_max)[0]) / 2) + 2*ratio,
    y: ((max_1st[1] + 2*ratio + findRightTop(max_1st, p_max, a_max)[1]) / 2 + 10*ratio) },
  { x: ((max_1st[0] + 2*ratio + findRightTop(max_1st, p_max, a_max)[0]) / 2),
    y: ((max_1st[1] + 2*ratio + findRightTop(max_1st, p_max, a_max)[1]) / 2 + 10*ratio) },
]


/////////////
// 위의 points9, points10의 구조를 상하 대칭의 구조로, mandibular 1st molar를 위한 point11, point12 제작

// Mandibular 1st molar 왼쪽 절반 (상하대칭)
const points11 = [
  // 중점 부분에서 스타트
  { x: (a_man[0] + p_man[0]) / 2,
    y: (a_man[1] + p_man[1]) / 2 + 5*ratio },
  { x: (a_man[0] + p_man[0]) / 2 - 3*ratio,
    y: (a_man[1] + p_man[1]) / 2 + 3*ratio },
  
  // p_man 부근에서의 둥근 부분을 만들어 주는 작업
  { x: p_man[0] + 2*ratio,
    y: p_man[1] + 2*ratio},
  { x: p_man[0],
    y: p_man[1] },
  { x: p_man[0] - 2*ratio,
    y: p_man[1] + 5*ratio },
  
  // 둥근 부분 이후 1st root까지 쭉 내려 주는 부분
  { x: ((p_man[0] - 2*ratio) + (man_1st[0] - 2*ratio)) / 2 + 3*ratio,
    y: ((p_man[1] + 5*ratio) + (man_1st[1] - 2*ratio)) / 2 },
  { x: man_1st[0] - 2*ratio,
    y: man_1st[1] - 2*ratio },
  { x: man_1st[0],
    y: man_1st[1] },
  { x: man_1st[0] + 2*ratio,
    y: man_1st[1] - 2*ratio },
  
  // 안쪽 중점까지
  // (man_1st[0] + findRightTop(man_1st, p_man, a_man)[0]) / 2 : 중점의 x좌표
  { x: ((man_1st[0] + 2*ratio + findRightTop(man_1st, p_man, a_man)[0]) / 2) - 2*ratio,
    y: ((man_1st[1] - 2*ratio + findRightTop(man_1st, p_man, a_man)[1]) / 2 - 10*ratio) },
  { x: ((man_1st[0] + 2*ratio + findRightTop(man_1st, p_man, a_man)[0]) / 2),
    y: ((man_1st[1] - 2*ratio + findRightTop(man_1st, p_man, a_man)[1]) / 2 - 10*ratio) },
]

// Mandibular 1st molar 오른쪽 절반 (상하대칭)
const points12 = [
  // 중점 부분에서 스타트
  { x: (a_man[0] + p_man[0]) / 2,
    y: (a_man[1] + p_man[1]) / 2 + 5*ratio },
  { x: (a_man[0] + p_man[0]) / 2 + 3*ratio,
    y: (a_man[1] + p_man[1]) / 2 + 3*ratio },
  
  // a_man 부근에서의 둥근 부분을 만들어 주는 작업
  { x: a_man[0] - 2*ratio,
    y: a_man[1] },
  { x: a_man[0],
    y: a_man[1] },
  { x: a_man[0] + 6*ratio,
    y: a_man[1] + 1*ratio },
  { x: a_man[0] + 5*ratio,
    y: a_man[1] + 5*ratio },
  
  // 둥근 부분 이후 1st root까지 쭉 내려 주는 부분
  // findRightTop 함수 사용
  { x: ((a_man[0] + 5*ratio) + findRightTop(man_1st, p_man, a_man)[0]) / 2 + 3*ratio,
    y: ((a_man[1] + 5*ratio) + findRightTop(man_1st, p_man, a_man)[1]) / 2 + 10*ratio },
  { x: (findRightTop(man_1st, p_man, a_man)[0]) + 3*ratio,
    y: (findRightTop(man_1st, p_man, a_man)[1]) - 2*ratio },
  { x: (findRightTop(man_1st, p_man, a_man)[0]),
    y: (findRightTop(man_1st, p_man, a_man)[1]) },
  { x: (findRightTop(man_1st, p_man, a_man)[0]) - 1*ratio,
    y: (findRightTop(man_1st, p_man, a_man)[1]) - 2*ratio },

  // 안쪽 중점까지
  { x: ((man_1st[0] + 2*ratio + findRightTop(man_1st, p_man, a_man)[0]) / 2) + 2*ratio,
    y: ((man_1st[1] - 2*ratio + findRightTop(man_1st, p_man, a_man)[1]) / 2 - 10*ratio) },
  { x: ((man_1st[0] + 2*ratio + findRightTop(man_1st, p_man, a_man)[0]) / 2),
    y: ((man_1st[1] - 2*ratio + findRightTop(man_1st, p_man, a_man)[1]) / 2 - 10*ratio) },
]



/////////////////////////////////////////////////

const ctx = canvas.getContext('2d');
// contours_list = [points, points2, points3, points4,
//   points5, points6, points7, points8,
//   points9, points10, points11, points12]

contours_list = [points, points2, points3, points4,
  points5, points6, points7, points8]

// 곡선을 부드럽게 연결 (quadraticCurveTo를 사용한 경우)
ctx.strokeStyle = 'white';
ctx.lineWidth = 2;


for (let k = 0; k < contours_list.length; k++) {
  const points = contours_list[k];

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.stroke();
}


// ================================

const max_molar =
`M 410 500 
Q 300 550 250 500 
Q 200 450 260 350 
L 290 260 
Q 290 140 330 90 
Q 390 140 400 260 
Q 410 270 420 260 
Q 440 140 490 90 
Q 530 140 530 260 
L 550 350 
Q 600 450 560 500 
Q 510 550 410 500 `

// const max_molar = 
// `M 350 810 
// Q 280 850 220 800 
// Q 180 720 240 610 
// Q 280 440 310 470 
// C 350 810 390 200 440 610 
// Q 500 720 460 790 
// Q 410 850 350 810 Z`;

const src = [
    { x: 300, y: 550 }, // 기준점 1
    { x: 290, y: 140 }, // 기준점 2
    { x: 600, y: 450 }  // 기준점 3
];

const dst = [
    { x: p_max[0], y: p_max[1] },  // p_max
    { x: max_1st[0], y: max_1st[1] }, // max_1st
    { x: a_max[0], y: a_max[1] }  // a_max
];

max_molar_2 = applyAffineTransform(max_molar, src, dst);

ctx.strokeStyle = 'white';
ctx.lineWidth = 2;
ctx.stroke(max_molar_2);