//canvasとcontextの取得
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");


//各クラス
class Block {
    //ブロック1マスのサイズ(px)
    static size = 30;

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


//ここから記述

//blockを表示
let block1 = new Block(7,4);
block1.draw();
new Block(3,8).draw()

//Minoを表示
let mino1 = new Mino(4,10);
mino1.draw()