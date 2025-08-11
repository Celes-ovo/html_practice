const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Path 1
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(150, 50);
ctx.lineTo(100, 200);
ctx.lineTo(50, 50);
ctx.closePath();

ctx.fillStyle = '#92c88cff';
ctx.fill();
ctx.stroke();


// Path 2
ctx.beginPath();
ctx.moveTo(200, 50);
ctx.lineTo(150, 200);
ctx.lineTo(250, 200);
// ctx.closePath();
ctx.stroke();


// Path 3
ctx.beginPath();
// ctx.rect(300, 50, 100, 100);
center_x = canvas.width / 4;
center_y = canvas.height / 3;
ctx.arc(center_x, center_y, 50, 0, Math.PI, false);
// ctx.fillStyle = '#90bfc8ff';
// ctx.fill();
ctx.stroke();


// Path 4 (Test for complex curves)
ctx.moveTo(50, 400);
ctx.fillStyle = '#90bfc8ff';
ctx.bezierCurveTo(100, 300, 200, 500, 300, 400);
ctx.bezierCurveTo(400, 300, 500, 500, 600, 400);
// ctx.closePath();
ctx.stroke();


// Path 5 (Test for quadratic curves)
ctx.beginPath();
ctx.moveTo(50, 500);
ctx.quadraticCurveTo(420, 370, 540, 400);
ctx.quadraticCurveTo(600, 410, 660, 480);
ctx.quadraticCurveTo(680, 540, 600, 560);
ctx.quadraticCurveTo(620, 600, 560, 600);
ctx.quadraticCurveTo(500, 630, 510, 570);
ctx.quadraticCurveTo(480, 540, 520, 510);
ctx.quadraticCurveTo(460, 510, 460, 430);
ctx.quadraticCurveTo(400, 420, 350, 400);
ctx.stroke();