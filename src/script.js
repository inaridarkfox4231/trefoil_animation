'use strict';
// trefoil(x=cosθ+sin2θ, y=sinθ+cos2θ)の上を動く動点
let baseGraph;
let configBoard;
let GRAPH_SIZE = 80;
let MAX_SPEED = 8; // 1フレーム当たりの速度は8が最高
let DEFAULT_SPEED = 3;
let MIN_SPEED = 1; // で、1が最低。3がデフォルト。
let x, y;
let p;

let config = {reverse:1, pause:2}; // フラグ操作
let imageName = ['reverse', 'pause', 'start', 'accell', 'slow'];
let images = {};

function preload(){
  //imageName.forEach(function(name){
  //  let image = loadImage("./assets/" + name + ".png");
  //  images[name] = image;
  //})
}

function setup(){
  document.documentElement.style.setProperty("width", window.screen.width + "px");
  document.documentElement.style.setProperty("height", window.screen.height + "px");
  //document.body.style.setProperty("width", window.screen.width + "px");
  //document.body.style.setProperty("height", window.screen.height + "px");
  console.log("~~w:" + document.body.clientWidth);
  console.log("~~h:" + document.body.clientHeight);

  createCanvas(320, 480);
  baseGraph = createGraphics(320, 480);
  drawGraph();
  configBoard = createGraphics(320, 140);
  drawConfig();
  p = new movePoint();
}

function draw(){
  background(220);
  image(baseGraph, 0, 0);
  image(configBoard, 0, 340);
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
  //configBoard.image(images['reverse'], 20, 20);
  //configBoard.image(images['pause'], 170, 20);
  //configBoard.image(images['accell'], 20, 80);
  //configBoard.image(images['slow'], 170, 80);
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
    this.speed = DEFAULT_SPEED; // デフォルトスピード
    this.flag = 0 // 00で前進、10で前進ポーズ、01で後退、11で後退ポーズ
  }
  reverse(){ this.flag ^= config['reverse']; }
  pause(){
    this.flag ^= config['pause'];
    //if(this.flag & config['pause']){ configBoard.image(images['start'], 170, 20); }
    //else{ configBoard.image(images['pause'], 170, 20); } // 表示テキストの変更
  }
  changeFrame(){
    if(this.flag & config['pause']){ return; }
    if(this.flag & config['reverse']){
      this.frame -= this.speed; }
    else{
      this.frame += this.speed;
    }
  }
  accell(){ // 加速
    if(this.speed == MAX_SPEED){ return; }
    this.speed++;
  }
  slow(){ // 減速
    if(this.speed == MIN_SPEED){ return; }
    this.speed--;
  }
  display(){
    this.changeFrame();
    let t = (this.frame / 360) * 2 * PI;
    ellipse(trefoil_x(t), -40 + trefoil_y(t), 10, 10);
  }
}

// キーによる操作
function keyTyped(e){
  if(key === 'r'){ p.reverse(); } // 逆再生
  else if(key === 'p'){ p.pause(); } // ポーズ/ポーズ解除
  else if(key === 'a'){ p.accell(); } // 加速
  else if(key === 's'){ p.slow(); } // 減速
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
