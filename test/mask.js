const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const points = [
    { x: 100, y: 100 },
    { x: 300, y: 200 },
    { x: 500, y: 400 }
];

const img = document.getElementById('mask/mask0_b.png');
img.onload = function() {
    points.forEach(point => {
        // 이미지를 각 포인트의 좌표에 그리기
        ctx.drawImage(img, point.x, point.y);
    });
};