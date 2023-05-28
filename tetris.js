//canvasとcontextの取得&canvasの大きさ設定
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");


//各クラス
class Block {
    //ブロック1マスのサイズ(px)
    static size = 29;

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

    //Minoの各長さ
    static size = 4;

    static tetro = [//試しにz型のみ
        [0,0,0,0],
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
    ]

    //tatroを描写
    draw(){
        for (let y = 0; y < Mino.size; y++){
            for(let x = 0; x < Mino.size; x++){

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

//blockを表示
let block1 = new Block(7,4);
block1.draw();
new Block(3,8).draw()

//Minoを表示
let mino1 = new Mino(4,10);
mino1.draw()

let mino2 = new Mino(8,0);
mino2.draw()




