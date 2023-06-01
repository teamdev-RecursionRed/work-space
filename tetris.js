//canvasとcontextの取得&canvasの大きさ設定
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");


//各クラス
class Helper {
    static calcColsCenter(){
        return Math.floor((Field.Col - Mino.size) / 2);
    }
}

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
          [0, 1, 0, 0],
          [1, 1, 1, 0],
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

    /**tatrominoを描写する関数*/
    draw(){
        //前にあったminoを消す
        context.clearRect(0, 0, canvas.width, canvas.height);
        //fieldを塗る
        Field.draw();

        //minoの描写
        for (let y = 0; y < Mino.size; y++){
            for(let x = 0; x < Mino.size; x++){

                if(this.tetro[y][x]==1){
                    //tetorominoの1ブロックの座標
                    let tetroX = (this.x + x) * Block.size;
                    let tetroY = (this.y + y) * Block.size;

                    //座標に1ブロック描写
                    context.fillStyle = "rgb(0, 0, 255)";
                    context.fillRect(tetroX, tetroY, Block.size, Block.size);
                    context.strokeStyle="rgb(0, 0, 0)";
                    context.strokeRect(tetroX, tetroY, Block.size, Block.size);
                }
            }
        }
    }

    /**
     * minoの衝突判定の結果ブーリアン値を返す関数
     * @param {*} dx x方向にずらしたい値
     * @param {*} dy y方向にずらしたい値
     */
    checkCollision(dx, dy) {
        for (let y = 0; y < Mino.size; y++) {
            for (let x = 0; x < Mino.size; x++) {
                if (this.tetro[y][x]) {
                    const newX = this.x + x + dx;
                    const newY = this.y + y + dy;

                    // 範囲外アクセスまたは他のブロックとの衝突をチェック
                    if (newX < 0 || newX >= Field.Col || newY >= Field.Row) {
                        // 衝突がある場合はtrueを返す
                        return true;
                    }
                }
            }
        }
        // 衝突がない場合はfalseを返す
        return false;
    }
    
    /**
     * minoをdx,dyマスずつ動かす関数
     * @param {*} dx x方向にずらす値
     * @param {*} dy y方向にずらす値
     */
    move(dx, dy){
        if (!this.checkCollision(dx, dy)){
            this.x += dx;
            this.y += dy;
        }
    }

    /** minoを回転させる関数*/
    rotate() {
        const preMatrix = this.tetro;
        this.tetro = this.tetro[0].map((_, index) => this.tetro.map(row => row[index])).reverse();

        if (this.checkCollision(0, 0)) {
            // 衝突がある場合は回転前の状態に戻す
            this.tetro = preMatrix;
        }
        else {
            // 回転後のミノが範囲外に出る場合は位置を調整する
            while (this.x + this.tetro[0].length > Field.Col) {
              this.move(-1, 0);
        }
            while (this.y + this.tetro.length > Field.Row) {
              this.move(0, -1);
            }
        }
    }

    /** キャンバス上部中心に生成したminoをインスタンスとして返す関数*/
    static createMino() {
        const positionX = Helper.calcColsCenter();
        const positionY = 0;

        const newMino = new Mino(positionX, positionY);
        
        return newMino;
    }
}


class Field {
    //col(列：横に何個入るか), row(行：縦に何個入るか), colはminoの中心計算より偶数が望ましい
    static Col = 10;
    static Row = 20;

    //canvasの長さ = 行の長さ(列の長さ) * 1ブロックの大きさ
    static canvasW = Field.Col * Block.size;
    static canvasH = Field.Row * Block.size;

    /**canvasのwidthとheightを決める関数*/
    static decideCanvasScale(){
        canvas.width = Field.canvasW;
        canvas.height = Field.canvasH;
    }

    /**canvas内のマスを全て白にする関数*/
    static draw(){
      for (let x = 0; x < Field.Col; x++){
        for (let y = 0; y < Field.Row; y++){
          //1マスを白くする
          context.fillStyle = "white";
          context.fillRect(x * Block.size, y * Block.size, Block.size, Block.size);
          
          //1マスに枠を付ける(無くてもいい)
          context.strokeStyle="rgb(192, 192, 192, 0.1)";
          context.strokeRect(x * Block.size, y * Block.size, Block.size, Block.size);
        }
      }
    }

}

class Game {
    /** fieldを初期化する関数*/
    static setField(){
        Field.decideCanvasScale();
        Field.draw();
    }
}



//ゲームの実行(ここは最終的に関数化したいです)
//field 初期化
Game.setField();

//1.mino生成
let tetro = Mino.createMino();
tetro.draw();
//キーボードの矢印キー入力に応じてミノの移動や回転を制御
document.addEventListener('keydown', (e) => {
  switch (e.key) {
      case 'ArrowUp':
        tetro.rotate();
        tetro.draw();
        break;
      case 'ArrowRight':
        tetro.move(1, 0);
        tetro.draw();
        break;
      case 'ArrowLeft':
        tetro.move(-1, 0);
        tetro.draw();
        break;
      case 'ArrowDown':
        tetro.move(0, 1);
        tetro.draw();
        break;
      default:
        break;
  }
});

//2. minoの連続落下、一番下にたどり着く
// 描画間隔(ms)
const interval = 700; 
let lastTime = 0;


/** 下までminoを落とす関数*/
function drawGame() {
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime;

  if (deltaTime > interval) {
    //キャンバスをクリアしフィールドとミノを描画
    context.clearRect(0, 0, canvas.width, canvas.height);
    Field.draw();
    tetro.draw();

    //tetro.move(0, 1); によりミノを下に移動
    tetro.move(0, 1);
    lastTime = currentTime;
  }
  //requestAnimationFrame を使用して連続的に描画を更新
  requestAnimationFrame(drawGame);
}
drawGame();

//3. minoを固定

//4. line判定

//1.に戻り1~4を繰り返す。


















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