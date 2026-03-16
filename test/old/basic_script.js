const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// canvas.width = 200;
// canvas.height = 200;


// fillRect
ctx.fillStyle = '#92c88cff';
ctx.fillRect(20, 20, 100, 50);

ctx.fillStyle = '#90bfc8ff';
ctx.fillRect(20, 120, 100, 50);



// strokeRect
ctx.strokeStyle = '#ff0000';
ctx.lineWidth = 2;
ctx.strokeRect(20, 220, 100, 50);


// clearRect
ctx.clearRect(25, 125, 30, 30);


// fillText
ctx.font = '20px Arial';
ctx.fillStyle = '#78466eff';
ctx.fillText('Text', 20, 320);


// strokeText
ctx.strokeText('Stroke Text', 20, 370);