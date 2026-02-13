//////////////////////////////////////
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
  "Soft tissue pogonion": [733, 827], "Soft tissue gnathion": [722, 850]}

ratio = Math.sqrt( (landmarkCoords['Anterior Maxillary first molar'][0]-landmarkCoords['Anterior Mandibular first molar'][0])**2 + (landmarkCoords['Anterior Maxillary first molar'][1]-landmarkCoords['Anterior Mandibular first molar'][1])**2 ) / 21.47;


///////////////////////////////////////////////////////////
// 여러 번 쓰이기 때문에, point들을 쓰기 편한 변수로 미리 정의함.
a_max = landmarkCoords['Anterior Maxillary first molar'];
p_max = landmarkCoords['Posterior Maxillary first molar'];
max_1st = landmarkCoords['Maxillary first root'];

a_man = landmarkCoords['Anterior Mandibular first molar'];
p_man = landmarkCoords['Posterior Mandibular first molar'];
man_1st = landmarkCoords['Mandibular first root'];
///////////////////////////////////////////////////////////

function drawLandmarks(canvas) {


// export default drawLandmarks;