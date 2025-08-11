const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const scale = window.devicePixelRatio;
const canvasWidth = 800;
const canvasHeight = 800;
canvas.width = canvasWidth * scale;
canvas.height = canvasHeight * scale;
canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";
ctx.scale(scale, scale);

// 랜덤 함수 추가
function randomItemInArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

class Player {
    xPos; yPos; size;
    color = "rgba(22,22,22,0.9)"

    constructor(canvasWidth, canvasHeight, size = 40){
        this.xPos = Math.round(canvasWidth / 2) - size / 2;
        this.yPos = Math.round(canvasHeight / 2) - size / 2;
        this.size = size;
    }

    drawPlayerRect(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.xPos, this.yPos, this.size, this.size);
        ctx.fill();
    }
}

// 마우스 좌표를 캔버스 좌표로 변환
canvas.addEventListener('mousemove', (e)=>{
    const rect = canvas.getBoundingClientRect();
    user.xPos = e.clientX - rect.left - user.size / 2;
    user.yPos = e.clientY - rect.top - user.size / 2;
});

class Bomb {
    xPos; yPos; size; xVector; yVector;
    color = "rgba(231, 87, 58, 0.9)"
    minVector = 5;
    maxVector = 7;

    constructor(canvasWidth, canvasHeight, size = 10, vector = 2){
        this.xPos = randomItemInArray([0, canvasWidth]);
        this.yPos = randomItemInArray([0, canvasHeight]);
        this.size = size;
        // this.xVector = vector;
        // this.yVector = vector;
        this.xVector = vector * (Math.random() > 0.5 ? 1 : -1);
        this.yVector = vector * (Math.random() > 0.5 ? 1 : -1);
    }

    checkFrame(){
        if(this.xPos > canvasWidth){
            this.xPos = canvasWidth;
            this.#changeDirectionX();
        }
        if(this.xPos < 0){
            this.xPos = 0;
            this.#changeDirectionX();
        }
        if(this.yPos > canvasHeight){
            this.yPos = canvasHeight;
            this.#changeDirectionY();
        }
        if(this.yPos < 0){
            this.yPos = 0;
            this.#changeDirectionY();
        }
    }

    #changeDirectionX(){
        this.xVector = -(this.xVector) * (1.5 - Math.random());
        this.xVector = Math.abs(this.xVector) < this.minVector ? this.minVector * Math.sign(this.xVector) : this.xVector;
        this.xVector = Math.abs(this.xVector) > this.maxVector ? this.maxVector * Math.sign(this.xVector) : this.xVector;
    }

    #changeDirectionY(){
        this.yVector = -(this.yVector) * (1.5 - Math.random());
        this.yVector = Math.abs(this.yVector) < this.minVector ? this.minVector * Math.sign(this.yVector) : this.yVector;
        this.yVector = Math.abs(this.yVector) > this.maxVector ? this.maxVector * Math.sign(this.yVector) : this.yVector;
    }

    checkCollision(user){
        const xCollision = this.xPos > user.xPos && this.xPos < user.xPos + user.size;
        const yCollision = this.yPos > user.yPos && this.yPos < user.yPos + user.size;
        return xCollision && yCollision;
    }

    drawBomb(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.xPos, this.yPos, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


class GameTimer {
    startTime;
    playTime;

    constructor(startTime){
        this.startTime = startTime;
    }

    drawTime(){
        this.#updateTime();
        ctx.beginPath();
        ctx.font = '24px serif';
        ctx.fillStyle = "black";
        ctx.fillText(`${this.playTime}sec`, 20, 50);
    }

    #updateTime(){
        const now = Date.now()
        this.playTime =  Math.floor((now - this.startTime)/1000);
    }
}



// 격자 그리기 함수
function drawGrid(gridNumber = 10){
    ctx.beginPath();
    for (let index = 0; index <= gridNumber; index++) {
        ctx.moveTo(index * (canvasHeight/gridNumber), 0);
        ctx.lineTo(index * (canvasHeight/gridNumber), canvasHeight);
        ctx.moveTo(0, index * (canvasWidth/gridNumber));
        ctx.lineTo(canvasWidth, index * (canvasWidth/gridNumber));
    }
    ctx.strokeStyle = "rgba(32, 55, 38, 0.62)";
    ctx.stroke();
}

// 객체 생성
const user = new Player(canvasWidth, canvasHeight);

// Bomb 배열로 변경
const bombs = [new Bomb(canvasWidth, canvasHeight, 8, 8)];
const maxBombs = 30;
let lastBombAddTime = Date.now();

// GameTimer 객체 생성
const gameTimer = new GameTimer(Date.now());

let drawAnimation;

function drawGame(){
    ctx.fillStyle = "rgba(255,255,255,0.2)"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    drawGrid();

    // 타이머 표시
    gameTimer.drawTime();

    user.drawPlayerRect(ctx);

    // Bomb 추가 (2초마다, 최대 10개)
    const now = Date.now();
    if (bombs.length < maxBombs && now - lastBombAddTime > 2000) {
        bombs.push(new Bomb(canvasWidth, canvasHeight, 8, 8));
        lastBombAddTime = now;
    }

    // 모든 bomb 이동 및 그리기
    for (const bomb of bombs) {
        bomb.xPos += bomb.xVector;
        bomb.yPos += bomb.yVector;
        bomb.checkFrame();
        bomb.drawBomb(ctx);

        if(bomb.checkCollision(user)){
            window.cancelAnimationFrame(drawAnimation);
            alert("Game over");
            return;
        }
    }

    drawAnimation = window.requestAnimationFrame(drawGame);
}

function resetGame() {
    // 플레이어 위치 초기화
    user.xPos = Math.round(canvasWidth / 2) - user.size / 2;
    user.yPos = Math.round(canvasHeight / 2) - user.size / 2;

    // 폭탄 배열 초기화
    bombs.length = 0;
    bombs.push(new Bomb(canvasWidth, canvasHeight, 8, 8));
    lastBombAddTime = Date.now();

    // 타이머 초기화
    gameTimer.startTime = Date.now();

    // 애니메이션 재시작
    if (drawAnimation) window.cancelAnimationFrame(drawAnimation);
    drawGame();
}

// 재시작 버튼 이벤트 등록
document.getElementById('restartBtn').addEventListener('click', resetGame);

drawGame();