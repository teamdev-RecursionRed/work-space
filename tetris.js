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
          [0, 1, 1, 0],
          [0, 0, 1, 1],
          [0, 0, 0, 0]
      ],
      
      [
          [0, 0, 0, 0],
          [1, 1, 1, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ],
        
        [
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0]
        ],
        
        [
          [0, 0, 0, 0],
          [0, 1, 1, 1],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ],
        
        [
          [0, 0, 0, 0],
          [1, 1, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 0]
        ],
        
        [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0]
        ],

        [
          [0, 0, 0, 0],
          [0, 0, 1, 1],
          [0, 1, 1, 0],
          [0, 0, 0, 0]
        ]
      ];


    //tatroを描写
    draw(){
        for (let y = 0; y < Mino.size; y++){
            for(let x = 0; x < Mino.size; x++){

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

    move(dx, dy){
        this.x += dx;
        this.y += dy;
    }

    
    rotate() {
        const array = this.tetro;
        let rotatedArray = array[0].map((_, index) => array.map(row => row[index])).reverse();
      
        this.x += Math.round((this.tetro[0].length - this.tetro.length) / 2);
        this.y += Math.round((this.tetro.length - this.tetro[0].length) / 2);
        this.tetro = rotatedArray;

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

    constructor() {
        this.field = this.createField();
    }

    createField() {
        const field = [];
        for (let y = 0; y < Field.Row; y++) {
          const row = [];
          for (let x = 0; x < Field.Col; x++) {
            row.push(0);
          }
          field.push(row);
        }
        return field;
    }



    draw() {
        for (let y = 0; y < Field.Row; y++) {
          for (let x = 0; x < Field.Col; x++) {
            if (this.field[y][x] === 1) {
              const block = new Block(x, y);
              block.draw();
            }
          }
        }
      }
      
}







//ここから記述                                                                            //ボタンで動かす。
//canvasの大きさを決定
Field.makeCanvas()

    // main
    let field = new Field();
    let mino4 = new Mino(3, 7);

    // 描写
    function draw(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        field.draw();
        mino4.draw();
    }

    draw();

    // 回転ボタンのクリックイベント
    let rotateButton = document.getElementById("rotateButton");
    rotateButton.addEventListener("click", function(){
        mino4.rotate();
        draw();
    });

    //　右移動のクリックイベント
    let toRightButton = document.getElementById("moveToRight");
    toRightButton.addEventListener("click", function(){
        mino4.move(1, 0);
        draw();
    });
    
    //　左移動のクリックイベント
    let toLeftButton = document.getElementById("moveToLeft");
    toLeftButton.addEventListener("click", function(){
        mino4.move(-1, 0);
        draw();
    });
//blockを表示

/*
let block1 = new Block(3,4);
block1.draw();
new Block(2,8).draw()

//Minoを表示
let mino1 = new Mino(1,10);
mino1.draw()

let mino2 = new Mino(8,0);
mino2.draw()

let mino4 = new Mino(6,7);
//mino4.draw();//
mino4.rotate();
mino4.draw();


let mino5 = new Mino(6,12);
mino5.rotate();
mino5.rotate();
mino5.draw()

let mino6 = new Mino(6,17);

let mino7 = new Mino(3,17);
mino6.draw()
*/

console.log(Block.windowH);
console.log(Block.size);