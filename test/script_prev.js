const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// // Path 1
// ctx.beginPath();
// ctx.moveTo(50, 50);
// ctx.lineTo(150, 50);
// ctx.lineTo(100, 200);
// ctx.lineTo(50, 50);
// ctx.closePath();

// ctx.fillStyle = '#92c88cff';
// ctx.fill();
// ctx.stroke();


// // Path 2
// ctx.beginPath();
// ctx.moveTo(200, 50);
// ctx.lineTo(150, 200);
// ctx.lineTo(250, 200);
// // ctx.closePath();
// ctx.stroke();


// // Path 3
// ctx.beginPath();
// // ctx.rect(300, 50, 100, 100);
// center_x = canvas.width / 4;
// center_y = canvas.height / 3;
// ctx.arc(center_x, center_y, 50, 0, Math.PI, false);
// // ctx.fillStyle = '#90bfc8ff';
// // ctx.fill();
// ctx.stroke();


// // Path 4 (Test for complex curves)
// ctx.moveTo(50, 400);
// ctx.fillStyle = '#90bfc8ff';
// ctx.bezierCurveTo(100, 300, 200, 500, 300, 400);
// ctx.bezierCurveTo(400, 300, 500, 500, 600, 400);
// // ctx.closePath();
// ctx.stroke();


// // Path 5 (Test for quadratic curves)
// ctx.beginPath();
// ctx.moveTo(50, 500);
// ctx.quadraticCurveTo(420, 370, 540, 400);
// ctx.quadraticCurveTo(600, 410, 660, 480);
// ctx.quadraticCurveTo(680, 540, 600, 560);
// ctx.quadraticCurveTo(620, 600, 560, 600);
// ctx.quadraticCurveTo(500, 630, 510, 570);
// ctx.quadraticCurveTo(480, 540, 520, 510);
// ctx.quadraticCurveTo(460, 510, 460, 430);
// ctx.quadraticCurveTo(400, 420, 350, 400);
// ctx.stroke();


// Path 6 (Mask 0)
const points = [
    { x: 487, y: 21 },

    //////////////////
    // 중점 1
    { x: 475, y: 61 },
    //////////////////
    
    { x: 466, y: 109 },

    //////////////////
    // 중점 2 : 3등분해서 1/3씩 느낌으로
    { x: 489, y: 161 },
    { x: 521, y: 207 },
    //////////////////

    { x: 550, y: 260 },

    //////////////////
    // 중점 3
    { x: 523, y: 282 },
    //////////////////

    { x: 496, y: 304 },

    //////////////////
    // 중점 3
    { x: 508, y: 330 },
    //////////////////


    { x: 521, y: 355 },
    { x: 527, y: 378 },
    { x: 500, y: 407 },

    { x: 500, y: 407 },
    { x: 510, y: 435 },
    { x: 465, y: 481 },
    { x: 460, y: 544 },
    { x: 443, y: 577 },
    
];

// 아랫니 앞니
const points2 = [
  { x: 442, y: 397 },
  { x: 441, y: 420 },
  { x: 431, y: 440 },
  { x: 394, y: 476 },

  { x: 408, y: 430 },
  { x: 432, y: 397 },
  { x: 442, y: 397 },
]


// Mandible
const points3 = [
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

const points4 = [
  { x: 352, y: 555 },
  { x: 274, y: 502 },
  { x: 195, y: 445 },
  { x: 104, y: 405 },
  { x: 97, y: 305 },
  { x: 87, y: 210 },
]


// Maxilla
const points5 = [
  { x: 244, y: 276 },
  { x: 375, y: 279 },
  { x: 417, y: 269 },
  { x: 439, y: 285 },
  { x: 461, y: 298 },
]

const points6 = [
  { x: 461, y: 298 },
  { x: 450, y: 307 },
  { x: 448, y: 321 },
  { x: 466, y: 364 },
]


const points7 = [
  { x: 439, y: 386 },
  { x: 375, y: 323 },
  { x: 244, y: 276 },
]


// 윗니 앞니
const points8 = [
  { x: 471, y: 421 },
  { x: 439, y: 386 },
  { x: 425, y: 318 },
  { x: 466, y: 364 },
  
  ////////////////
  { x: 475, y: 393 },
  ////////////////

  { x: 471, y: 421 },
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