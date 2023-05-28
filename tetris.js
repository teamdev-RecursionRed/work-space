//canvasとcontextの取得
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");


//各クラス
class Block {
    static size = 30;//px

    //block1つの座標
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    static test(){
        console.log(this.x);
    }

    // static draw(context){
    //     context.fillStyle = "rgb(0, 0, 255)";//一旦全部青で表示しておきます、あとでテトロミノ別に設定します。
    //     context.fillRect(this.x * Block.size, this.y * Block.size, Block.size, Block.size);
    // }
}

class Mino {
    static size = 4;

    static tetro = [
        [0,0,0,0],
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
    ]

}


//ここから記述

//試しにブロック表示
context.fillStyle = "rgb(0, 0, 255)";
context.fillRect(200, 100, Block.size, Block.size);

//試しにテトロミノ表示
for (let y = 0; y < Mino.size; y++){
    for(let x = 0; x < Mino.size; x++){
        if(Mino.tetro[y][x]==1){
            context.fillStyle = "rgb(0, 0, 255)";
            context.fillRect(x * Block.size, y * Block.size, Block.size, Block.size);
        }
    }
}

//blockObjectの作成
//let block1 = new Block(3,4);
//block1.test();
//block1.draw(context);