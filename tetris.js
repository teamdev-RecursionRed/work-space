//canvasとcontextの取得&canvasの大きさ設定
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let canvas2 = document.getElementById("nextMinoCanvas");
let context2 = canvas2.getContext("2d");


//各クラス 
class Helper {
    static calcColsCenter(){
        return Math.floor((Field.Col - Mino.size) / 2);
    }
}


class music {
  static FeelGood = new Audio("Syn Cole - Feel Good [NCS Release].mp3");
  static rotate = new Audio("rotate.mp3");
  static landing = new Audio("landing.mp3");
  static eraseLine = new Audio("eraseLine.mp3");
}


class Block {
    //ブロック1マスのサイズ(px)をwindow.heightによってブロックのサイズを決定します
    static windowH = window.innerHeight;
    static size = (Block.windowH > 768) ? 28 : 26;


}

let color;

class Mino {
    constructor(x, y){
        this.x = x;
        this.y = y;
        let index = Math.floor(Math.random() * Mino.tetros.length);
        this.shape = Mino.tetros[index];
        this.color = Mino.colors[index];
        color = this.color;

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
    
    /** tetoro 色配列 */
    static colors = ["cyan", "blue", "orange", "yellow", "green", "purple", "pink"];

    /**tatrominoを描写する関数　ミノの関数*/
    draw(){
        //Field に前にあったminoを消す
        //fieldを塗る
        Field.draw();

        //minoの描写
        for (let y = 0; y < Mino.size; y++){
            for(let x = 0; x < Mino.size; x++){

                if(this.shape[y][x]==1){
                    //tetorominoの1ブロックの座標
                    let tetroX = (this.x + x) * Block.size;
                    let tetroY = (this.y + y) * Block.size;

                    //座標に1ブロック描写
                    //context.fillStyle = color;
                    context.fillStyle = this.color;
                    context.fillRect(tetroX, tetroY, Block.size, Block.size);
                    context.strokeStyle="rgb(0, 0, 0, 0.1)";
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
      
                if (this.shape[y][x]) {
                    const newX = this.x + x + dx;
                    const newY = this.y + y + dy;

                    // 範囲外アクセスまたは他のブロックとの衝突をチェック // 以下のnewY < 0を付けたがどうか。。。
                    // console.log("nY = " + newY, "nX = " + newX, field[newY][newX]);
                    if (newX < 0 || newX >= Field.Col || newY < 0 || newY >= Field.Row || field[newY][newX] !== "white") {
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
        const preMatrix = this.shape;
        this.shape = this.shape[0].map((_, index) => this.shape.map(row => row[index])).reverse();

        if (this.checkCollision(0, 0)) {
            // 衝突がある場合は回転前の状態に戻す
            this.shape = preMatrix;
        }
        else {
            // 回転後のミノが範囲外に出る場合は位置を調整する
            while (this.x + this.shape[0].length > Field.Col) {
              this.move(-1, 0);
        }
            while (this.y + this.shape.length > Field.Row) {
              this.move(0, -1);
            }
        }
    }

    /** キャンバス上部中心に生成したminoをインスタンスとして返す関数 */
    static createMino() {
        const positionX = Helper.calcColsCenter();
        const positionY = -1;

        const newMino = new Mino(positionX, positionY);
        
        return newMino;
    }
    
   /*
    static createMino() {

      // let tmpMino = Object.assign({}, nextMino);
      // Mino.assignFunctions(tmpMino);
      // let tmpMino = nextMino;

      const positionX = Helper.calcColsCenter();
      const positionY = -1;

      tetro.x = positionX;
      tetro.y = positionY;
      //tetro.shape = Object.assign({}, nextMino.shape);
      tetro.shape = nextMino.shape;
      tetro.color = nextMino.color;
    

      nextMino = new Mino(0, 0);
      Field.display(nextMino.shape, nextMino.color);

      // return tmpMino;
    }

    static assignFunctions(target) {
      Object.setPrototypeOf(target, Mino.prototype);
    }
    */

}


class Field {
    //col(列：横に何個入るか), row(行：縦に何個入るか), colはminoの中心計算より偶数が望ましい
    static Col = 12;
    static Row = 20;

    //canvasの長さ = 行の長さ(列の長さ) * 1ブロックの大きさ
    static canvasW = Field.Col * Block.size;
    static canvasH = Field.Row * Block.size;
    // canvas2の設定
    static canvas2W = Mino.size * Block.size;
    static canvas2H = Mino.size * Block.size;

    /**canvasのwidthとheightを決める関数*/
    static decideCanvasScale(){
        canvas.width = Field.canvasW;
        canvas.height = Field.canvasH;
        canvas2.width = Field.canvas2W;
        canvas2.hight = Field.canvas2H;
    }


    /** field行列で0の要素を白く染める&　fieldに固定したミノを描く(else)関数*/
    static draw(){
      for (let y = 0; y < Field.Row; y++){
        for(let x = 0; x < Field.Col; x++){
          //fieldの座標
          let fieldX = x * Block.size;
          let fieldY = y * Block.size;

          if(field[y][x] === "white"){
            //座標に1ブロック描写
            context.fillStyle = "rgb(255, 255, 255, 0.7)";
            context.fillRect(fieldX, fieldY, Block.size, Block.size);
            context.strokeStyle="rgb(0, 0, 0, 0.1)";
            context.strokeRect(fieldX, fieldY, Block.size, Block.size);
          }
          else{
            //座標に1ブロック描写
            context.fillStyle = field[y][x];
            context.fillRect(fieldX, fieldY, Block.size, Block.size);
            context.strokeStyle="rgb(255, 255, 255)";
            context.strokeRect(fieldX, fieldY, Block.size, Block.size);
          }
        }
      }
    }

    /** next のcanvas2に次のミノを表示する */
  static display(){
    //前にあったminoを消す
    console.log("display: ", canvas.width, canvas.height);
    context2.clearRect(0, 0, canvas2.width, canvas2.height);

    //minoの描写
    for (let y = 0; y < Mino.size; y++){
        for(let x = 0; x < Mino.size; x++){
            if(nextMino.shape[y][x]==1){
                //tetorominoの1ブロックの座標
                let tetroX = x * Block.size;
                let tetroY = y * Block.size;

                //座標に1ブロック描写
                context2.fillStyle = color;
                context2.fillRect(tetroX, tetroY, Block.size, Block.size);
                context2.strokeStyle="rgb(0, 0, 0, 0.1)";
                context2.strokeRect(tetroX, tetroY, Block.size, Block.size);
            }
        }
    }
  }

    /**field行列を返す関数 */
  static makeField(){
    let field = [];

    for(let y = 0; y < Field.Row; y++){
      field[y] = [];

      for(let x = 0; x < Field.Col; x++){
        field[y][x] = "white";
      }
    }

    return field;
  }

  // ラインを消去する関数
  static clearLines() {
    for (let y = Field.Row - 1; y >= 0; y--) {
      let lineFilled = true;
      for (let x = 0; x < Field.Col; x++) {
        if (field[y][x] === "white") {
          lineFilled = false;
          break;
        }
      }
      if (lineFilled) {
        // ラインを消去
        field.splice(y, 1);
        // 新しい空行を追加
        field.unshift(new Array(Field.Col).fill("white"));
        //消去音
        music.eraseLine.currentTime = 0;
        music.eraseLine.play();

      }
    }
    // ゲームオーバーチェック
    if (field[0].some(block => block !== "white")) {
      console.log("Game Over");
      // GAMEOVERを表示
      context.font = "35px Arial";
      context.fillStyle = "red";
      context.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
      // ゲームを停止する処理
      cancelAnimationFrame(animationFrameId);
      return true;
    }
    return false;
  }

  static moveDown() {
    if (!currentMino.checkCollision(0, 1)) {
      currentMino.move(0, 1);
    } else {
      // ミノが着地した場合
      // フィールドにミノのブロックを追加
      for (let y = 0; y < Mino.size; y++) {
        for (let x = 0; x < Mino.size; x++) {
          if (currentMino.shape[y][x]) {
            const fieldX = currentMino.x + x;
            const fieldY = currentMino.y + y;
            field[fieldY][fieldX] = currentMino.color;
            //着地音
            music.landing.currentTime = 0;
            music.landing.play();

          }
        }
      }
      Field.clearLines(); // ラインの消去
      currentMino = nextMino;
      nextMino = Mino.createMino(); // 新しいミノを生成
    }
  }
}


class Game {
    /** fieldを初期化する関数*/
    static setField(){
        Field.decideCanvasScale();
    }
}

//ゲームの実行(ここは最終的に関数化したいです)

//0.field 初期化
Game.setField();


let field = Field.makeField();
console.log("main: ", canvas.width, canvas.height);

//1.mino生成
let currentMino = Mino.createMino();
let nextMino = Mino.createMino();

Field.display();

currentMino = nextMino;
nextMino = Mino.createMino();

currentMino.draw();

//キーボードの矢印キー入力に応じてミノの移動や回転を制御
document.addEventListener('keydown', (e) => {
  switch (e.key) {
      case 'ArrowUp':
        currentMino.rotate();
        currentMino.draw();
        music.rotate.currentTime = 0;
        music.rotate.play();
        break;
      case 'ArrowRight':
        currentMino.move(1, 0);
        currentMino.draw();
        break;
      case 'ArrowLeft':
        currentMino.move(-1, 0);
        currentMino.draw();
        break;
      case 'ArrowDown':
        currentMino.move(0, 1);
        currentMino.draw();
        break;
      case ' ': // 衝突するまでミノを落とす
        let i = 0;
        while(!currentMino.checkCollision(0, i + 1)) i++;
        currentMino.move(0,i);
        currentMino.draw();
        break;
      default:
        break;
  }
});

// 描画間隔(ms)
const interval = 300; 
let lastTime = 0;

//scoreの計算
let score = 0;

// ゲームの実行
let animationFrameId;

function drawGame() {
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime;

  if (deltaTime > interval) {
    // キャンバスをクリアしフィールドとミノを描画
    context.clearRect(0, 0, canvas.width, canvas.height);
    Field.display();
    Field.draw();
    currentMino.draw();

    Field.moveDown(); // ミノを一つ下に移動
    if (Field.clearLines()) {
      return; // ゲームオーバー時は処理を終了
    }

    lastTime = currentTime;
  }
  animationFrameId = requestAnimationFrame(drawGame);
} 


//ゲームスタート
music.FeelGood.volume = 0.2;
music.FeelGood.play();
drawGame();

