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
        this.tetro = Mino.tetro;
    }

    //Minoの各長さ
    static size = 4;

    static tetro = [//試しにz型のみ
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

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

    rotate() {
        const rotatedMatrix = rotateMatrix(this.tetro);
        const center = calculateCenterOfGravity(this.tetro);
        const centerAfterRotation = calculateCenterOfGravity(rotatedMatrix);
    
        const shiftX = center[0] - centerAfterRotation[0];
        const shiftY = center[1] - centerAfterRotation[1];
        const shiftedMatrix = shiftMatrix(rotatedMatrix, shiftX, shiftY);
        this.tetro = shiftedMatrix;
        // return shiftedMatrix;

        function calculateCenterOfGravity(matrix) {
            // 重心位置を返す関数
            let totalWeight = 0;
            let xSum = 0;
            let ySum = 0;
          
            for (let i = 0; i < matrix.length; i++) {
              for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === 1) {
                  totalWeight++;
                  xSum += j;
                  ySum += i;
                }
              }
            }
          
            const centerX = Math.round(xSum / totalWeight);
            const centerY = Math.round(ySum / totalWeight);
            return [centerX, centerY];
              
        }

        function rotateMatrix(matrix) {
            // 転置して、逆順にすれば90°回転を利用
            const size = matrix.length;
            const rotated = [];
          
            for (let i = 0; i < size; i++) {
              const newRow = [];
              for (let j = size - 1; j >= 0; j--) {
                newRow.push(matrix[j][i]);
              }
              rotated.push(newRow);
            }
            return rotated;
        }

        function shiftMatrix(matrix, shiftX, shiftY) {
            // 1を持つ要素を(shiftX, shiftY)分　シフトする
            const shifted = [...matrix].map(row => [...row]);
            const rows = shifted.length;
            const cols = shifted[0].length;
          
            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                if (matrix[i][j] === 1) {
                    shifted[i][j] = 0;
                    if ( 
                        i + shiftY >= 0 && 
                        i + shiftY < rows && 
                        j + shiftX >= 0 && 
                        j + shiftX < cols
                    ) 
                        shifted[i + shiftY][j + shiftX] = 1;
                }
              }
            }
            return shifted;
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
let block1 = new Block(3,4);
block1.draw();
new Block(2,8).draw()

//Minoを表示
let mino1 = new Mino(1,10);
mino1.draw()

let mino2 = new Mino(8,0);
mino2.draw()

let mino4 = new Mino(7,7);
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

console.log(Block.windowH);
console.log(Block.size);

