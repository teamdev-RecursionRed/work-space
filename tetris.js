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
    }

    static tetro = [//試しにz型のみ
        [1,1,0],
        [0,1,1],
    ]

    //tatroを描写
    draw(){
        for (let y = 0; y < Mino.tetro.length; y++){
            for(let x = 0; x < Mino.tetro[y].length; x++){

                let tetroX = (this.x + x) * Block.size;
                let tetroY = (this.y + y) * Block.size;

                if(Mino.tetro[y][x]==1){
                    context.fillStyle = "rgb(0, 0, 255)";
                    context.fillRect(tetroX, tetroY, Block.size, Block.size);
                    context.strokeStyle="rgb(0, 0, 0)";
                    context.strokeRect(tetroX, tetroY, Block.size, Block.size);
                }
            }
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
}

    




//ここから記述
//canvasの大きさを決定
Field.makeCanvas()


let currentPosition = 0; 
let lastTime = 0;
const interval = 1000; // 1秒ごとに描画するための間隔(ms)

function drawBlock(){
  let mino = new Mino(4, currentPosition);
  mino.draw();
  if (currentPosition < Field.Row-1)
    currentPosition++;
  else
    currentPosition = 0;
  delete mino;
}

function drawBoard(){
  for (let x = 0; x < Field.Col; x++){
    for (let y = 0; y < Field.Row; y++){
      context.fillStyle = "white";
      context.fillRect(x * Block.size, y * Block.size, Block.size, Block.size);
    }
  }
}

function drawGame() {
  const deltaTime = Date.now() - lastTime;

  if (deltaTime > interval) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawBlock();
    lastTime = Date.now();
  }
  requestAnimationFrame(drawGame);
}

drawGame();
