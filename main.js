$(function() {
  let ctx;
  let myPaddle;
  let myBall;
  let block;
  let mouseX;
  let score;
  let scoreLabel;
  let isPlaying = false;
  let timerId;

  let canvas = document.getElementById('mycanvas');
  if (!canvas || !canvas.getContext) {
    return false;
  }
  ctx = canvas.getContext('2d');

  // ラベル
  let Label = function(x, y) {
    this.x = x;
    this.y = y;
    this.draw = function(text) {
      ctx.font = 'bold 14px "Century Gothic"';
      ctx.fillStyle = '#00AAFF';
      ctx.textAlign = 'left';
      ctx.fillText(text, this.x, this.y);
    }
  }

  // ボール
  let Ball = function(x, y, vx, vy, r) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    // ボールの描画関数
    this.draw = function() {
      ctx.beginPath();
      ctx.fillStyle = '#FF0088';
      ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, true);
      ctx.fill();
    };
    // ボールの移動関数
    this.move = function() {
      this.x += this.vx;
      this.y += this.vy;
      // 右端・左端でx軸方向反転
      if (this.x + this.r > canvas.width || this.x - this.r < 0) {
        this.vx *= -1;
      }
      // 上端でy軸方向反転
      if (this.y - this.r < 40) {
        this.vy *= -1;
      }
      // 下
      if (this.y + this.r > canvas.height) {
        isPlaying = false;
        $('#btn').text('REPLAY').fadeIn();
      }
    };
    // パドルとの衝突判定
    this.checkCollision = function(paddle) {
      if ((this.y + this.r > paddle.y && this.y + this.r < paddle.y + paddle.h) &&
          (this.x > paddle.x - paddle.w / 2 && this.x < paddle.x + paddle.w / 2)) {
        this.vy *= -1;
        score++; // パドルが返す度に1得点
        if (score < 15 && score % 3 === 0) {
          this.vx *= 1.2;
          paddle.w *= 0.8;
        }
      }
    };
    // ブロックとの衝突判定
    this.checkCollisionBlock = function(block) {
      if (((block.y < this.y + this.r && this.y + this.r < block.y + 5) &&
          (block.x - block.w / 2 < this.x + this.r && this.x - this.r < block.x + block.w / 2)) ||
          ((block.y + block.h - 5 < this.y - this.r && this.y - this.r < block.y + block.h) &&
          (block.x - block.w / 2 < this.x + this.r && this.x - this.r < block.x + block.w / 2))) {
        this.vy *= -1;
      }
      if (((this.x + this.r > block.x - block.w / 2 && this.x + this.r < block.x - block.w / 2 + 5) &&
          (this.y + this.r > block.y && this.y - this.r < block.y + block.h)) ||
          ((this.x - this.r> block.x + block.w / 2 - 5 && this.x - this.r < block.x + block.w / 2) &&
          (this.y + this.r > block.y && this.y - this.r < block.y + block.h))) {
        this.vx *= -1;
      }
    }
  }

  // パドル（プレイヤー）
  let Paddle = function(w, h) {
    this.w = w;
    this.h = h;
    this.x = canvas.width / 2;
    this.y = canvas.height - 80;
    this.draw = function() {
      ctx.fillStyle = "#00AAFF";
      ctx.fillRect(this.x - this.w / 2, this.y, this.w, this.h);
    };
    this.move = function() {
      this.x = mouseX -$('#mycanvas').offset().left; // マウスのx座標からcancasの始点のx座標を引く
    }
  };

  // ブロック：上部にある障害物
  let Block = function(w, h) {
    this.w = w;
    this.h = h;
    this.x = canvas.width / 2;
    this.y = 100;
    this.draw = function() {
      ctx.fillStyle = "#00AAFF";
      ctx.fillRect(this.x - this.w / 2, this.y, this.w, this.h);
    };
  }

  // ランダムな整数を返す
  function rand(min, max) {
    return Math.floor(Math.random() * (max- min + 1)) + min;
  }

  // ゲーム初期化関数
  function init() {
    score = 0;
    isPlaying = true;
    myPaddle = new Paddle(100, 10);
    myBall = new Ball(rand(50,250), rand(50, 80), rand(4, 6), -6, 6);
    block = new Block(100,100);
    scoreLabel = new Label(10, 25);
    scoreLabel.draw('SCORE: ' + score);
  }

  // キャンバス初期化関数
  function clearStage() {
    ctx.fillStyle = "#AAEDFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#CCC";
    ctx.fillRect(0, 0, canvas.width, 40);
  }

  // 画面更新関数
  function update() {
    clearStage();
    scoreLabel.draw('SCORE: ' + score);
    myPaddle.draw();
    myPaddle.move();
    myBall.draw();
    block.draw();
    myBall.move();
    myBall.checkCollision(myPaddle);
    myBall.checkCollisionBlock(block);
    timerId = setTimeout(function() {
      update();
    }, 33); // 33ミリ秒毎に画面を更新(30fps)
    if (!isPlaying) {
      clearTimeout(timerId);
    }
  }

  // スタート・リプレイボタン
  $('#btn').click(function() {
    $(this).fadeOut();
    init();
    update();
  });

  // マウスの　x座標取得
  $('body').mousemove(function(e) {
    mouseX = e.pageX;
  });
});