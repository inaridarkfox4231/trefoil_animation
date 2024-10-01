'use strict';
// trefoil(x=cosθ+sin2θ, y=sinθ+cos2θ)の上を動く動点
let baseGraph;
let configBoard;
let GRAPH_SIZE = 80;
let DEFAULT_PERIOD = 360; // 6秒で1周が基本
let x, y;
let p;

let config = {reverse:1, pause:2}; // フラグ操作

function setup(){
  createCanvas(320, 480);
  baseGraph = createGraphics(320, 480);
  drawGraph();
  configBoard = createGraphics(320, 140);
  drawConfig();
  p = new movePoint();
  console.log(document.body.clientWidth);
  console.log(document.body.clientHeight);
}

function draw(){
  background(220);
  image(baseGraph, 0, 0);
  image(configBoard, 0, 340);
  fill(0); // 文字の色を黒に
  drawTexts();
  translate(width / 2, height / 2);
  fill('blue'); // 動点の色は青
  noStroke(); // 動点の縁取りをなくす
  p.display();
}

// グラフの作成
function drawGraph(){
  baseGraph.translate(baseGraph.width / 2, baseGraph.height / 2);
  baseGraph.noFill();
  let points = [];
  for(let i = 0; i < 380; i++){
    let t = (i / 180) * PI;
    let point = createVector(trefoil_x(t), -40 + trefoil_y(t));
    points.push(point);
  }
  baseGraph.strokeWeight(2.0);
  baseGraph.beginShape();
  points.forEach(function(point){
    baseGraph.curveVertex(point.x, point.y);
  })
  baseGraph.endShape();
}

function drawConfig(){
  configBoard.background(180);
  configBoard.strokeWeight(2.0);
  configBoard.fill(255, 202, 19);
  configBoard.rect(20, 20, 130, 40);
  configBoard.fill(240, 62, 70);
  configBoard.rect(170, 20, 130, 40);
  configBoard.fill(191, 111, 191);
  configBoard.rect(20, 80, 130, 40);
  configBoard.fill(114, 121, 218);
  configBoard.rect(170, 80, 130, 40);
}

function drawTexts(){
  textSize(30);
  text('reverse', 20 + 10, 360 + 28);
  text('pause', 170 + 22, 360 + 27);
  text('accell', 20 + 25, 440 + 11);
  text('slow', 170 + 34, 440 + 10);
}

function trefoil_x(t){ return GRAPH_SIZE * (cos(t) + sin(2 * t)); }
function trefoil_y(t){ return GRAPH_SIZE * (sin(t) + cos(2 * t)); }

class movePoint{
  constructor(){
    this.frame = 0;
    this.period = DEFAULT_PERIOD;
    this.flag = 0 // 00で前進、10で前進ポーズ、01で後退、11で後退ポーズ
  }
  reverse(){ this.flag ^= config['reverse']; }
  pause(){ this.flag ^= config['pause']; }
  changeFrame(){
    if(this.flag & config['pause']){ return; }
    if(this.flag & config['reverse']){ this.frame--; }
    else{ this.frame++; }
  }
  accell(){ this.period /= 2; this.frame /= 2; }
  slow(){ this.period *= 2; this.frame *= 2; }
  display(){
    this.changeFrame();
    let t = (this.frame / this.period) * 2 * PI;
    ellipse(trefoil_x(t), -40 + trefoil_y(t), 10, 10);
  }
}

// キーによる操作
function keyTyped(e){
  if(key === 'r'){ p.reverse(); } // 逆再生
  else if(key === 'p'){ p.pause(); } // ポーズ/ポーズ解除
  else if(key === 'a'){ p.accell(); } // 2倍速
  else if(key === 's'){ p.slow(); } // 0.5倍速
}

// UIによる操作
function mouseClicked(){
  if(mouseX > 20 && mouseX < 150 && mouseY > 360 && mouseY < 400){ p.reverse(); }
  else if(mouseX > 170 && mouseX < 300 && mouseY > 360 && mouseY < 400){ p.pause(); }
  else if(mouseX > 20 && mouseX < 150 && mouseY > 420 && mouseY < 460){ p.accell(); }
  else if(mouseX > 170 && mouseX < 300 && mouseY > 420 && mouseY < 460){ p.slow(); }
}

// 要求1: Pボタンで一時停止できるようにして。
// 要求2: Rボタンで逆再生できるようにして。
// 要求3: 加速、減速処理。
// 要求4: タッチ操作でもそれをできるようにして。

// reverseは30, 388. pauseは192, 387. accellは45, 451. slowは204, 450.
