//Const
var times, up, right, left, firex = 'fireup',
  fire_speed = 1,
  shot = 0,
  scorex = 0;

function loadCanvas(id) {
  var canvas = document.createElement('canvas');
  div = document.getElementById(id);
  canvas.id = "can";
  canvas.width = 1224;
  canvas.height = 768;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid";
  div.appendChild(canvas);
}
//Clear Rect
function clear() {
  var can = document.getElementById('can');
  var c_c = can.getContext('2d');
  c_c.clearRect(0, 0, can.width, can.height);
}

//Enemy object
var element = {
  canvas: null,
  c: null,
  x: null,
  y: null,
  dist: 5,
  width: null,
  height: null,
  color: null,
  image: null,
  text: null,
  score: 0,
  font: '40px Arial',
  draw: function(fig) {
    this.canvas = document.getElementById('can');
    this.c = this.canvas.getContext('2d');
    this.c.beginPath();
    this.c.fillStyle = this.color;
    switch (fig) {
      case 'text':
        this.c.font = this.font;
        this.c.fillText(this.text + this.score, this.x, this.y);
        break;
      case 'arc':
        this.c.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
        break;
      case 'img':
        this.image = document.getElementById('imgg');
        this.c.drawImage(this.image, this.x, this.y, this.width, this.height);
        break;
      case undefined:
        this.c.rect(this.x, this.y, this.width, this.height);
        break;
    }
    this.c.fill();
    this.c.closePath();
  },
  hit: 1,
  destroy: 0
};
loadCanvas('cana');
//Bonus Create
var bonus = Object.create(element);
//Add varrible to bonus object
bonus.cath=0;
bonus.y = 10;
bonus.x = -1;
//Create Playyer;
var player = Object.create(element);
//Create Fire
var fire = Object.create(element);
//Score
var score = Object.create(element);
//Create Enemy 
var en = [];
for (var i = 0; 10 > i; i++) {
  en[i] = Object.create(element);
  en[i].width = 61 + (i * 40);
  en[i].y = 58 + (i * 40);
  en[i].dist += 0.3 * i;
}

function enemy_update() {
  //Enemy 2 update
  for (var i = 0; en.length > i; i++) {
    if (en[i].x + en[i].width > 1224 || en[i].x < 0) {
      en[i].dist = -en[i].dist;
    }
    en[i].y += 0.1;
    if (en[i].y > player.y) {
      en[i].y = -10;
    }
    en[i].x = en[i].x + en[i].dist;
    en[i].height = 7;
    var col1 = i + 112;
    var col2 = i * 25;
    var col3 = i * 10;
    en[i].color = 'rgb(' + col1 + ',' + col2 + ',' + col3 + ')';
    en[i].draw();
  }
}
function bonus_u() {
    bonus.hit = 0;
    bonus.width = 10;
    bonus.height = 10; 
    bonus.color = 'yellow';
    if(bonus.x <= -1)
      bonus.x = Math.floor((Math.random()*1200)+200);
    if(bonus.y -bonus.height < player.y){
      bonus.y += 0.4;
    }else{
      if(bonus.x + bonus.width >= player.x && bonus.x < player.x + player.width){
        bonus.score = score.score;
        score.score = 'Cath';
        setTimeout(function(){
          score.score = bonus.score;
        },2000);
      }
      bonus.y = 10;
      bonus.x = -1;
    }
    bonus.draw('arc');
  console.log();
}

//Player update
function p_update() {
  player.x = player.x;
  player.color = "red";
  player.width = 100;
  player.height = 100;
  player.y = 600;
  player.draw('img');
}

//Fire update
function f_update() {
  if (firex == 'fireup') {
    fire.dist = 10;
    fire.width = 5;
    fire.color = '#66FF33';
    if (fire.y == player.y) {
      fire.x = player.x + (player.width / 2);
    }
    fire.y -= fire.dist + fire_speed;
    if (fire.y < 0) {
      fire.y = 600;
      firex = 'fire';
    }
    fire.draw('arc');
    fire.Y = player.y + 400;
    fire.draw('arc');
  }
}

//Score update
function s_update() {
  score.x = 900;
  score.y = 700;
  score.dist = 10;
  score.font = '40px Arial';
  score.text = 'Your score: ';
  score.draw('text');
  score.color = '#fff';
}
//controll
function fire_x(enem) {
  firex = 'fireup';
  for (var i = 0; enem.length > i; i++) {
    if (enem[i].hit == 1) {
      fire_speed += 1;
    } else {
      fire_speed = 1;
    }
    enem[i].hit = 0;
  }
}
document.addEventListener("keydown", function(ev) {
  switch (ev.which) {
    case 38:
      //up
      up = 38;
      return true;
    case 39:
      //right
      right = 39;
      return true;
    case 37:
      //left
      left = 37;
      return true;
  }
}, true);

document.addEventListener("keyup", function(ev) {
  switch (ev.which) {
    case 38:
      //up
      up = null;
      return false;
    case 39:
      //right
      right = null;
      return false;
    case 37:
      //left
      left = null;
      return false;
  }
}, false);

function contr() {
  if (up == 38) {
    fire_x(en);
  }
  if (right == 39) {
    player.x += player.dist + 3;
    if (player.x >= player.canvas.width + player.width / 2) {
      player.x = 0;
    }
  }
  if (left == 37) {
    player.x -= player.dist + 3;
    if (player.x <= 0 - player.width / 2) {
      player.x = player.canvas.width;
    }
  }
}

function colision(enemy) {
  for (var i = 0; enemy.length > i; i++) {
    if (fire.y < enemy[i].y && fire.y < enemy[i].y + 30 && enemy[i].hit === 0 && fire.x > enemy[i].x && fire.x < enemy[i].x + enemy[i].width) {
      enemy[i].width -= 50;
      if (enemy[i].width < 50) {
        enemy[i].width = 251;
        enemy[i].x = 451;
        enemy[i].y = -10;
        enemy[i].destroy += 1;
        if (enemy.dist > 0) {
          enemy[i].x = enemy[i].canvas.width / 2;
        } else {
          enemy[i].x = enemy[i].canvas.width / 2;
        }
        enemy[i].dist += 10 / i;
        fire_speed += 20;
        score.score += 10;
      }
      score.score += 1;
      enemy[i].hit = 1;
      fire.y = player.y;
      firex = 'fire';
    }
  }
}
//Update

function update() {
  clear();
  bonus_u();
  contr();
  p_update();
  f_update();
  enemy_update();
  colision(en);
  s_update();
}
times = setInterval(update, 10);
document.addEventListener("click", function(ev) {
  clearInterval(times);
  times = setInterval(update, 10);
}, false);