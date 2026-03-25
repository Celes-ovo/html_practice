// Landmark 좌표들이 저장된 dict를 입력받았을 때,
// 이를 기반으로 자동적으로 그리는 기능을 만듦

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

    ctx.restore();
    ctx.save();
    // 캔버스 transform matrix 적용
    ctx.transform(a, b, c, d, e, f);
    const p = new Path2D(pathData);
    
    return p;
}


////////////////////////////////////

// function applyProjectiveTransform(pathInput, src, dst, ctx) {
//     const pathData = typeof pathInput === 'string' ? pathInput : pathInput.getAttribute("d");
    
//     if (src.length !== 4 || dst.length !== 4) {
//         throw new Error("Exactly 4 source and 4 destination points required");
//     }
    
//     // 4점으로부터 3x3 호모그래피 행렬 계산 (DLT 알고리즘)
//     const H = computeHomography(src, dst);
    
//     // Path2D 명령어 파싱 및 변환
//     const newPath = parseAndTransformPath(pathData, H);
    
//     ctx.save();
//     // 필요시 추가 아핀 변환 적용 가능
//     // ctx.transform(...);
    
//     return newPath;
// }

// function computeHomography(src, dst) {
//     // Direct Linear Transformation (DLT)
//     const A = [];
    
//     for (let i = 0; i < 4; i++) {
//         const x = src[i].x, y = src[i].y;
//         const u = dst[i].x, v = dst[i].y;
        
//         // x' = (h11 x + h12 y + h13) / (h31 x + h32 y + h33)
//         // → A * h = 0 형태의 방정식 2개
//         A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, -u]);
//         A.push([0, 0, 0, x, y, 1, -v * x, -v * y, -v]);
//     }
    
//     // SVD로 해 구하기 (h33=1 정규화)
//     const { Vt } = numeric.svd(numeric.transpose(A));
//     const h = Vt[Vt.length - 1]; // singular vector with smallest singular value
    
//     const H = [
//         [h[0], h[1], h[2]],
//         [h[3], h[4], h[5]],
//         [h[6], h[7], 1]  // h[8] = 1로 정규화
//     ];
    
//     return H;
// }

// function transformPoint(x, y, H) {
//     const px = H[0][0] * x + H[0][1] * y + H[0][2];
//     const py = H[1][0] * x + H[1][1] * y + H[1][2];
//     const pw = H[2][0] * x + H[2][1] * y + H[2][2];
    
//     return {
//         x: px / pw,
//         y: py / pw
//     };
// }

// function parseAndTransformPath(pathData, H) {
//     const tokens = pathData.match(/[a-z][^a-z]*/gi) || [];
//     const newPath = new Path2D();
//     let currentCmd = '';
//     let currentX = 0, currentY = 0;
//     let startX, startY;
    
//     for (let token of tokens) {
//         const cmd = token[0].toUpperCase();
//         const args = token.slice(1).match(/[+-]?\d*\.?\d+(?:e[+-]?\d+)?/g).map(Number);
        
//         switch (cmd) {
//             case 'M':
//                 const mPt = transformPoint(args[0] + (token[0]==='m'?currentX:0), 
//                                          args[1] + (token[0]==='m'?currentY:0), H);
//                 currentX = mPt.x;
//                 currentY = mPt.y;
//                 startX = currentX;
//                 startY = currentY;
//                 newPath.moveTo(currentX, currentY);
//                 break;
                
//             case 'L':
//                 const lPt = transformPoint(args[0] + (token[0]==='l'?currentX:0), 
//                                          args[1] + (token[0]==='l'?currentY:0), H);
//                 newPath.lineTo(lPt.x, lPt.y);
//                 currentX = lPt.x;
//                 currentY = lPt.y;
//                 break;
                
//             case 'H':
//                 const hPt = transformPoint(args[0] + (token[0]==='h'?currentX:0), currentY, H);
//                 newPath.lineTo(hPt.x, hPt.y);
//                 currentX = hPt.x;
//                 break;
                
//             case 'V':
//                 const vPt = transformPoint(currentX, args[0] + (token[0]==='v'?currentY:0), H);
//                 newPath.lineTo(vPt.x, vPt.y);
//                 currentY = vPt.y;
//                 break;
                
//             case 'C':
//                 // cubic bezier (6 args: x1 y1 x2 y2 x y)
//                 const c1 = transformPoint(args[0] + currentX, args[1] + currentY, H);
//                 const c2 = transformPoint(args[2] + currentX, args[3] + currentY, H);
//                 const cEnd = transformPoint(args[4] + currentX, args[5] + currentY, H);
//                 newPath.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, cEnd.x, cEnd.y);
//                 currentX = cEnd.x;
//                 currentY = cEnd.y;
//                 break;
                
//             case 'Q':
//                 // quadratic bezier (4 args: x1 y1 x y)
//                 const q1 = transformPoint(args[0] + currentX, args[1] + currentY, H);
//                 const qEnd = transformPoint(args[2] + currentX, args[3] + currentY, H);
//                 newPath.quadraticCurveTo(q1.x, q1.y, qEnd.x, qEnd.y);
//                 currentX = qEnd.x;
//                 currentY = qEnd.y;
//                 break;
                
//             case 'Z':
//                 newPath.closePath();
//                 currentX = startX;
//                 currentY = startY;
//                 break;
//         }
//     }
    
//     return newPath;
// };

////////////////////////////////////


// 좌표들은 예시로 넣은 것이며, 실제로는 반환된 dictionary를 받아와서 동작하도록 하면 됨.

// // M0001
// var landmarkCoords = {"Nasion": [663, 164], "Sella": [471, 206], "Porion": [387, 261], 
//   "Pterygoid point": [517, 258], "Basion": [400, 332], "Articulare": [418, 308], 
//   "Orbitale": [642, 251], "ANS": [684, 335], "PNS": [528, 340], "Point A": [676, 356], 
//   "Prosthion": [703, 403], "Incision superius apicalis": [677, 384], 
//   "Incision superius incisalis": [705, 433], "Incision inferius incisalis": [682, 420], 
//   "Incision inferius apicalis": [647, 458], "Infradentale": [670, 443], "Point B": [647, 470], 
//   "Pogonion": [640, 533], "Gnathion": [634, 545], "Menton": [620, 549], "Gonion": [439, 451], 
//   "Anterior Maxillary first molar": [608, 414], "Posterior Maxillary first molar": [576, 408], 
//   "Maxillary first root": [587, 365], "Anterior Mandibular first molar": [602, 423], 
//   "Posterior Mandibular first molar": [573, 416], "Mandibular first root": [564, 462], 
//   "Soft tissue glabella": [688, 126], "Soft tissue nasion": [686, 203], "Pronasale": [753, 310], 
//   "Subnasale": [718, 349], "Soft tissue subspinale": [726, 380], "Labrale superius": [737, 408], 
//   "Stomion": [716, 429], "Labrale inferius": [721, 448], "Soft tissue submentale": [693, 470], 
//   "Soft tissue pogonion": [686, 522], "Soft tissue gnathion": [670, 548]}


// M0002
var landmarkCoords = {"Nasion": [669, 131], "Sella": [472, 167], "Porion": [393, 232],
  "Pterygoid point": [516, 219], "Basion": [395, 303], "Articulare": [416, 275],
  "Orbitale": [643, 221], "ANS": [691, 317], "PNS": [535, 328], "Point A": [678, 342],
  "Prosthion": [696, 394], "Incision superius apicalis": [676, 367], "Incision superius incisalis": [696, 428],
  "Incision inferius incisalis": [683, 412], "Incision inferius apicalis": [668, 465],
  "Infradentale": [685, 441], "Point B": [671, 478], "Pogonion": [678, 533], "Gnathion": [671, 551],
  "Menton": [650, 553], "Gonion": [451, 456], "Anterior Maxillary first molar": [605, 399],
  "Posterior Maxillary first molar": [571, 395], "Maxillary first root": [586, 352],
  "Anterior Mandibular first molar": [613, 415], "Posterior Mandibular first molar": [579, 408],
  "Mandibular first root": [577, 456], "Soft tissue glabella": [698, 82], "Soft tissue nasion": [690, 162],
  "Pronasale": [770, 308], "Subnasale": [726, 337], "Soft tissue subspinale": [733, 367],
  "Labrale superius": [744, 392], "Stomion": [724, 413], "Labrale inferius": [738, 434],
  "Soft tissue submentale": [714, 463], "Soft tissue pogonion": [716, 526], "Soft tissue gnathion": [705, 549]}


// // S0014
// var landmarkCoords = {"Nasion": [1292, 928], "Sella": [868, 915], "Porion": [664, 1023], 
//   "Pterygoid point": [933, 1074], "Basion": [638, 1184], "Articulare": [698, 1133], "Orbitale": [1207, 1101], 
//   "ANS": [1279, 1305], "PNS": [938, 1260], "Point A": [1246, 1339], "Prosthion": [1269, 1423], 
//   "Incision superius apicalis": [1233, 1384], "Incision superius incisalis": [1267, 1494], 
//   "Incision inferius incisalis": [1231, 1455], "Incision inferius apicalis": [1181, 1559], 
//   "Infradentale": [1225, 1513], "Point B": [1197, 1590], "Pogonion": [1205, 1680], "Gnathion": [1189, 1714], 
//   "Menton": [1140, 1721], "Gonion": [685, 1464], "Anterior Maxillary first molar": [1096, 1437], 
//   "Posterior Maxillary first molar": [1026, 1417], "Maxillary first root": [1060, 1321], 
//   "Anterior Mandibular first molar": [1091, 1458], "Posterior Mandibular first molar": [1016, 1435], 
//   "Mandibular first root": [1000, 1529], "Soft tissue glabella": [1355, 819], "Soft tissue nasion": [-1, -1], 
//   "Pronasale": [1460, 1262], "Subnasale": [1355, 1339], "Soft tissue subspinale": [1355, 1386], 
//   "Labrale superius": [1375, 1429], "Stomion": [1313, 1478], "Labrale inferius": [1345, 1525], 
//   "Soft tissue submentale": [1290, 1572], "Soft tissue pogonion": [1283, 1698], "Soft tissue gnathion": [1254, 1749]}



// // S0015
// var landmarkCoords = {"Nasion": [1254, 789], "Sella": [809, 844], "Porion": [647, 968], 
//   "Pterygoid point": [931, 991], "Basion": [654, 1140], "Articulare": [701, 1087], 
//   "Orbitale": [1202, 997], "ANS": [1266, 1199], "PNS": [954, 1170], "Point A": [1244, 1243], 
//   "Prosthion": [1282, 1345], "Incision superius apicalis": [1244, 1305], 
//   "Incision superius incisalis": [1288, 1409], "Incision inferius incisalis": [1238, 1411], 
//   "Incision inferius apicalis": [1171, 1509], "Infradentale": [1226, 1468], "Point B": [1186, 1529], 
//   "Pogonion": [1176, 1637], "Gnathion": [1160, 1670], "Menton": [1125, 1682], "Gonion": [719, 1447], 
//   "Anterior Maxillary first molar": [1076, 1368], "Posterior Maxillary first molar": [1010, 1339], 
//   "Maxillary first root": [1047, 1246], "Anterior Mandibular first molar": [1091, 1388], 
//   "Posterior Mandibular first molar": [1018, 1366], "Mandibular first root": [995, 1468], 
//   "Soft tissue glabella": [1328, 679], "Soft tissue nasion": [1298, 854], "Pronasale": [1424, 1150], 
//   "Subnasale": [1328, 1231], "Soft tissue subspinale": [1344, 1296], "Labrale superius": [1373, 1356], 
//   "Stomion": [1308, 1413], "Labrale inferius": [1342, 1478], "Soft tissue submentale": [1280, 1529], 
//   "Soft tissue pogonion": [1259, 1651], "Soft tissue gnathion": [1231, 1700]}




/////////////////////////////////////////////////
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// canvas 크기 설정
// 이후 이것을 이미지의 width, height로 맞출 것
canvas.ctx = 3000;
canvas.ctx = 3000;

const strokeWidth = 2; // 모든 선의 공통 굵기

ctx.strokeStyle = 'white';
ctx.lineCap = 'round';    // stroke-linecap="round"
ctx.lineJoin = 'round';   // stroke-linejoin="round"
/////////////////////////////////////////////////


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
    
      // 곡선을 만들어 주기 위한 임의의 point : Soft Tissue Gnathion의 살짝 왼쪽 아래 지점
    { x: landmarkCoords['Soft tissue gnathion'][0] - 7*ratio,
      y: landmarkCoords['Soft tissue gnathion'][1] + 7*ratio},
    
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

  // Articulare 이후 부분을 표시하기 위한 test 추가점
  { x: landmarkCoords['Articulare'][0] - 2*ratio,
    y: landmarkCoords['Articulare'][1] - 5*ratio},
]


////////////////////////////////////
// Porion 주변 원을 그리는 부분
// Porion에서 시작해서, 아래 방향으로 원을 그리도록 함.
const points9 = [
  { x: landmarkCoords['Porion'][0],
    y: landmarkCoords['Porion'][1] },
  { x: landmarkCoords['Porion'][0] + 3*ratio,
    y: landmarkCoords['Porion'][1] + 1*ratio},
  { x: landmarkCoords['Porion'][0] + 5*ratio,
    y: landmarkCoords['Porion'][1] + 3*ratio },
  
  ///////////////////
  { x: landmarkCoords['Porion'][0] + 7.5*ratio,
    y: landmarkCoords['Porion'][1] + 5*ratio },
  { x: landmarkCoords['Porion'][0] + 10*ratio,
    y: landmarkCoords['Porion'][1] + 10*ratio },
  { x: landmarkCoords['Porion'][0] + 7.5*ratio,
    y: landmarkCoords['Porion'][1] + 15*ratio },
  ///////////////////


  
  { x: landmarkCoords['Porion'][0] + 5*ratio,
    y: landmarkCoords['Porion'][1] + 17.5*ratio },
  { x: landmarkCoords['Porion'][0],
    y: landmarkCoords['Porion'][1] + 20*ratio },
  { x: landmarkCoords['Porion'][0] - 5*ratio,
    y: landmarkCoords['Porion'][1] + 17.5*ratio },

  
  ///////////////////
  { x: landmarkCoords['Porion'][0] - 7.5*ratio,
    y: landmarkCoords['Porion'][1] + 15*ratio },
  { x: landmarkCoords['Porion'][0] - 10*ratio,
    y: landmarkCoords['Porion'][1] + 10*ratio },
  { x: landmarkCoords['Porion'][0] - 7.5*ratio,
    y: landmarkCoords['Porion'][1] + 5*ratio },
  ///////////////////

  
  { x: landmarkCoords['Porion'][0] - 5*ratio,
    y: landmarkCoords['Porion'][1] + 3*ratio },
  { x: landmarkCoords['Porion'][0] - 3*ratio,
    y: landmarkCoords['Porion'][1] + 1*ratio},
   { x: landmarkCoords['Porion'][0],
    y: landmarkCoords['Porion'][1] },
]


// Orbitale 주변 곡선을 그리는 부분
const points10 = [
  { x: landmarkCoords['Orbitale'][0] - 10*ratio,
    y: landmarkCoords['Orbitale'][1] - 80*ratio},
  { x: landmarkCoords['Orbitale'][0] - 15*ratio,
    y: landmarkCoords['Orbitale'][1] - 70*ratio},
  { x: landmarkCoords['Orbitale'][0] - 17*ratio,
    y: landmarkCoords['Orbitale'][1] - 50*ratio},
  { x: landmarkCoords['Orbitale'][0] - 16*ratio,
    y: landmarkCoords['Orbitale'][1] - 30*ratio},
  { x: landmarkCoords['Orbitale'][0] - 15*ratio,
    y: landmarkCoords['Orbitale'][1] - 20*ratio},
  { x: landmarkCoords['Orbitale'][0] - 10*ratio,
    y: landmarkCoords['Orbitale'][1] - 5*ratio },
  { x: landmarkCoords['Orbitale'][0],
    y: landmarkCoords['Orbitale'][1] },
  { x: landmarkCoords['Orbitale'][0] + 5*ratio,
    y: landmarkCoords['Orbitale'][1] - 3*ratio },
]


/////////////////////////////////////////////////

contours_list = [points, points4,
  points5, points6, points7, points8,
  points9, points10];

ctx.lineWidth = strokeWidth;


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


///////////////////////////////////

// maxilla_track = 
// `M 670 340 
// Q 590 260 690 240 
// C 400 40 670 260 190 240 
// Q 510 280 600 360 `

// const maxilla_src = [
//   { x: 670, y: 340 }, // 기준점 1
//   { x: 690, y: 240 }, // 기준점 2
//   { x: 190, y: 240 }, // 기준점 3
// ];
// const maxilla_dst = [
//   { x: landmarkCoords['Prosthion'][0], y: landmarkCoords['Prosthion'][1] },
//   { x: landmarkCoords['ANS'][0], y: landmarkCoords['ANS'][1] },
//   { x: landmarkCoords['PNS'][0], y: landmarkCoords['PNS'][1] },
// ]

// maxilla_2 = applyAffineTransform(maxilla_track, maxilla_src, maxilla_dst);

// ctx.strokeStyle = 'white';
// ctx.lineWidth = 5;
// ctx.stroke(maxilla_2);



//////////////////////////////////////

const max_molar_track =
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

// const dst = [
//     { x: p_max[0], y: p_max[1] },  // p_max
//     { x: max_1st[0], y: max_1st[1] }, // max_1st
//     { x: a_max[0], y: a_max[1] }  // a_max
// ];


// Maxilla 1st molar의 src, dst points
const max_molar_src = [
    { x: 250, y: 500 }, // 기준점 1
    { x: 330, y: 90 }, // 기준점 2
    { x: 560, y: 500 }, // 기준점 3
    // { x: 490, y: 500 }, // 기준점 4
];
const max_molar_dst = [
    { x: p_max[0], y: p_max[1] },  // p_max
    { x: max_1st[0], y: max_1st[1] }, // max_1st
    { x: a_max[0], y: a_max[1] }  // a_max
];


max_molar_2 = applyAffineTransform(max_molar_track, max_molar_src, max_molar_dst);
const max_molar_2_path2d = new Path2D(max_molar_2);

ctx.lineWidth = strokeWidth * (Math.sqrt((560 - 250)**2 + (500 - 500)**2) / Math.sqrt((a_max[0] - p_max[0])**2 + (a_max[1] - p_max[1])**2));
ctx.stroke(max_molar_2_path2d);


////////////////////////////

const man_molar_track = 
`M 410 500
Q 300 450 250 500
Q 200 550 260 650
L 290 740
Q 290 860 330 910
Q 390 860 400 740
Q 410 730 420 740
Q 440 860 490 910
Q 530 860 530 740
L 550 650
Q 600 550 560 500
Q 510 450 410 500 Z`

// Mandible 1st molar의 src, dst points
const man_molar_src = [
  { x: 330, y: 910 }, // 기준점 1
  { x: 250, y: 500 }, // 기준점 2
  { x: 560, y: 500 }, // 기준점 3
];
const man_molar_dst = [
  { x: man_1st[0], y: man_1st[1] }, // man_1st
  { x: p_man[0], y: p_man[1] },  // p man
  { x: a_man[0], y: a_man[1] }  // a man
];

man_molar_2 = applyAffineTransform(man_molar_track, man_molar_src, man_molar_dst);

ctx.lineWidth = strokeWidth * (Math.sqrt((560 - 250)**2 + (500 - 500)**2) / Math.sqrt((a_man[0] - p_man[0])**2 + (a_man[1] - p_man[1])**2));
ctx.stroke(man_molar_2);

/////////////////////////////////

const incisor_sup_track =
`M 480 460
Q 500 440 510 400
Q 530 340 500 260
Q 490 190 410 140
Q 380 120 380 210
L 390 290
C 390 380 430 340 450 420
Q 460 470 480 460 Z`

// Incisor superius의 src, dst points
const incisor_sup_src = [
  { x: 480, y: 460 }, // 기준점 1
  { x: 500, y: 260 }, // 기준점 2
  { x: 410, y: 140 }, // 기준점 3
];
const incisor_sup_dst = [
  { x: landmarkCoords['Incision superius incisalis'][0], y: landmarkCoords['Incision superius incisalis'][1] },
  { x: landmarkCoords['Prosthion'][0], y: landmarkCoords['Prosthion'][1] },
  { x: landmarkCoords['Incision superius apicalis'][0], y: landmarkCoords['Incision superius apicalis'][1] }
];

incisor_superius_2 = applyAffineTransform(
  incisor_sup_track,
  incisor_sup_src, 
  incisor_sup_dst
);

ctx.lineWidth = strokeWidth * (Math.sqrt((500 - 410)**2 + (260 - 140)**2) / Math.sqrt((landmarkCoords['Prosthion'][0] - landmarkCoords['Incision superius apicalis'][0])**2 + (landmarkCoords['Prosthion'][1] - landmarkCoords['Incision superius apicalis'][1])**2));
ctx.stroke(incisor_superius_2);


//////////////////////////////////

const incisor_inf_track =
`M 480 540
Q 500 560 510 600
Q 530 660 500 740
Q 490 810 410 860
Q 380 880 380 790
L 390 710
C 390 620 430 660 450 580
Q 460 530 480 540 Z`

// Incisor inferius의 src, dst points
const incisor_inferius_src = [
  { x: 410, y: 860 }, // 기준점 3
  { x: 480, y: 540 }, // 기준점 1
  { x: 500, y: 740 }, // 기준점 2
];
const incisor_inferius_dst = [
  { x: landmarkCoords['Incision inferius apicalis'][0], y: landmarkCoords['Incision inferius apicalis'][1] },
  { x: landmarkCoords['Incision inferius incisalis'][0], y: landmarkCoords['Incision inferius incisalis'][1] },
  { x: landmarkCoords['Infradentale'][0], y: landmarkCoords['Infradentale'][1] },
];

incisor_inferius_2 = applyAffineTransform(
  incisor_inf_track,
  incisor_inferius_src, 
  incisor_inferius_dst
);

ctx.lineWidth = strokeWidth * (Math.sqrt((500 - 410)**2 + (740 - 860)**2) / Math.sqrt((landmarkCoords['Infradentale'][0] - landmarkCoords['Incision inferius apicalis'][0])**2 + (landmarkCoords['Infradentale'][1] - landmarkCoords['Incision inferius apicalis'][1])**2));
ctx.stroke(incisor_inferius_2);




// // Porion 근처의 둥근 부분
// const porion_track_data =
// `M 420 260 
// A 50 50 0 1 1 370 300 
// Q 380 260 420 260 `

// const porion_path = new Path2D(porion_track_data);

// ctx.save();
// // track을 porion 근처로 이동 (420, 260 지점을 landmark Porion 위치로 맞춤)
// ctx.translate(landmarkCoords['Porion'][0] - 420, landmarkCoords['Porion'][1] - 260);

// // ctx.lineWidth = strokeWidth;
// ctx.stroke(porion_path);
// // ctx.restore();



//////////////////////////////////