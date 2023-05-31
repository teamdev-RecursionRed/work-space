//canvasとcontextの取得&canvasの大きさ設定
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");


//各クラス
class Block {
    //ブロック1マスのサイズ(px)をwindow.heightによってブロックのサイズを決定します
    static windowH = window.innerHeight;
    static size = (Block.windowH > 768) ? 28 : 25;
    
    //block1つの座標
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    //ブロックobject(x,y)を描写
    draw(){
        context.fillStyle = "rgb(0, 0, 255)";//一旦全部青で表示しておきます、あとでテトロミノ別に設定します。
        context.fillRect(this.x * Block.size, this.y * Block.size, Block.size, Block.size);
        context.strokeStyle="rgb(0, 0, 0)";
        context.strokeRect(this.x * Block.size, this.y * Block.size, Block.size, Block.size);
    }
    
}

class Mino {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.tetro = Mino.tetros[Math.floor(Math.random() * Mino.tetros.length)];
    }

    //Minoの各長さ
    static size = 4;

    static tetros = [
        [
          [0, 0, 0, 0],
          [1, 1, 0, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
        ],
      
        [
          [0, 0, 0, 0],
          [1, 1, 1, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0],
        ],
        
        [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        
        [
          [0, 0, 0, 0],
          [0, 1, 1, 1],
          [0, 1, 0, 0],
          [0, 0, 0, 0],
        ],
        
        [
          [0, 0, 0, 0],
          [1, 1, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 0],
        ],
        
        [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
        ],

        [
          [0, 0, 0, 0],
          [0, 0, 1, 1],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
        ]
      ];

    //tatroを描写
    draw(){
        for (let y = 0; y < this.tetro.length; y++){
            for(let x = 0; x < this.tetro[0].length; x++){
                let tetroX = (this.x + x) * Block.size;
                let tetroY = (this.y + y) * Block.size;

                if(this.tetro[y][x]==1){
                    context.fillStyle = "rgb(0, 0, 255)";
                    context.fillRect(tetroX, tetroY, Block.size, Block.size);
                    context.strokeStyle="rgb(0, 0, 0)";
                    context.strokeRect(tetroX, tetroY, Block.size, Block.size);
                }
            }
        }
    }

    checkCollision(dx, dy) {
        for (let y = 0; y < this.tetro.length; y++) {
            for (let x = 0; x < this.tetro[y].length; x++) {
                if (this.tetro[y][x]) {
                    const newX = this.x + x + dx;
                    const newY = this.y + y + dy;

                    // 範囲外アクセスまたは他のブロックとの衝突をチェック
                    if (newX < 0 || newX >= Field.Col || newY >= Field.Row) {
                        return true; // 衝突がある場合はtrueを返す
                    }
                }
            }
        }
        return false; // 衝突がない場合はfalseを返す
    }
    
    move(dx, dy){
        if (!this.checkCollision(dx, dy)){
            this.x += dx;
            this.y += dy;
        }
    }

    rotate() {
        const preMatrix = this.tetro;
        this.tetro = this.tetro[0].map((_, index) => this.tetro.map(row => row[index])).reverse();
        if (this.checkCollision(0, 0)) {
            this.tetro = preMatrix;
        }
    }
}

class Field {
    //col(列：横に何個入るか), row(行：縦に何個入るか)
    static Col = 10;
    static Row = 20;

    //canvasの長さ = 行の長さ(列の長さ) * 1ブロックの大きさ
    static canvasW = Field.Col * Block.size;
    static canvasH = Field.Row * Block.size;

    //canvasのwidthとheightを決める関数
    static makeCanvas(){
        canvas.width = Field.canvasW;
        canvas.height = Field.canvasH;
    }

    static draw(){
      for (let x = 0; x < Field.Col; x++){
        for (let y = 0; y < Field.Row; y++){
          context.fillStyle = "white";
          context.fillRect(x * Block.size, y * Block.size, Block.size, Block.size);
        }
      }
    }
}

//canvasの大きさを決定
Field.makeCanvas();
let tetro = new Mino(3, -1);

let lastTime = 0;
const interval = 1000; // 1秒ごとに描画するための間隔(ms)

function drawGame() {
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime;

  if (deltaTime > interval) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    Field.draw();
    tetro.draw();
    tetro.move(0, 1);
    lastTime = currentTime;
  }
  requestAnimationFrame(drawGame);
}

drawGame();

document.addEventListener('keydown', (e) => {
  e.preventDefault();
  switch (e.key) {
    case 'ArrowUp':
      tetro.rotate();
      break;
    case 'ArrowRight':
      tetro.move(1, 0);
      break;
    case 'ArrowLeft':
      tetro.move(-1, 0);
      break;
    case 'ArrowDown':
      tetro.move(0, 1);
      break;
    default:
      break;
  }
});



//ボタンで動かす。
let mino4 = new Mino(3, 0);
// 回転ボタンのクリックイベント
let rotateButton = document.getElementById("rotateButton");
rotateButton.addEventListener("click", function(){
    mino4.rotate();
    mino4.draw();
});

//　右移動のクリックイベント
let toRightButton = document.getElementById("moveToRight");
toRightButton.addEventListener("click", function(){
    mino4.move(1, 0);
    mino4.draw();
});

//　左移動のクリックイベント
let toLeftButton = document.getElementById("moveToLeft");
toLeftButton.addEventListener("click", function(){
    mino4.move(-1, 0);
    mino4.draw();
});
