// 기준점 좌표들 (예: 이미지의 왼쪽 위를 둘 좌표)
var landmarkCoords = {"Nasion": [707, 392], "Sella": [458, 422], "Porion": [370, 505], 
  "Pterygoid point": [520, 506], "Basion": [370, 582], "Articulare": [393, 552], "Orbitale": [662, 505], 
  "ANS": [709, 602], "PNS": [535, 608], "Point A": [701, 619], "Prosthion": [718, 669], 
  "Incision superius apicalis": [692, 646], "Incision superius incisalis": [718, 699], 
  "Incision inferius incisalis": [705, 699], "Incision inferius apicalis": [672, 751], 
  "Infradentale": [697, 728], "Point B": [683, 754], "Pogonion": [697, 826], 
  "Gnathion": [690, 841], "Menton": [669, 846], "Gonion": [436, 744], 
  "Anterior Maxillary first molar": [625, 672], "Posterior Maxillary first molar": [593, 670], 
  "Maxillary first root": [603, 619], "Anterior Mandibular first molar": [632, 695], 
  "Posterior Mandibular first molar": [592, 687], "Mandibular first root": [589, 740], 
  "Soft tissue glabella": [741, 349], "Soft tissue nasion": [720, 422], "Pronasale": [804, 563], 
  "Subnasale": [756, 607], "Soft tissue subspinale": [759, 649], "Labrale superius": [771, 678], 
  "Stomion": [743, 704], "Labrale inferius": [758, 723], "Soft tissue submentale": [729, 760], 
  "Soft tissue pogonion": [733, 827], "Soft tissue gnathion": [722, 850]};


const points = [
  { x: 100, y: 50 },
  { x: 200, y: 150 },
  { x: 400, y: 300 }
];

window.addEventListener("load", () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = "./mask3_b.png";

  img.onload = () => {
    const w = img.width;
    const h = img.height;

    points.forEach(p => {
      const drawX = p.x - w / 2;
      const drawY = p.y - h / 2;
      ctx.drawImage(img, drawX, drawY); // [web:2][web:3][web:5]
    });
  };
});