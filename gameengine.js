// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
var timer = 0;
var period = 0;
var amount_in_wave = 3;
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (/* function */ callback, /* DOMElement */ element) {
    window.setTimeout(callback, 1000 / 60);
  };
})();


function Timer() {
  this.gameTime = 0;
  this.maxStep = 0.05;
  this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
  var wallCurrent = Date.now();
  var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
  this.wallLastTimestamp = wallCurrent;

  var gameDelta = Math.min(wallDelta, this.maxStep);
  this.gameTime += gameDelta;
  return gameDelta;
}

function GameEngine() {
  this.entities = [];
  this.showOutlines = false;
  this.ctx = null;
  this.click = null;
  this.mouse = null;
  this.wheel = null;
  this.surfaceWidth = null;
  this.surfaceHeight = null;
  this.direction = 0;
  this.gameover = 0;
}

GameEngine.prototype.init = function (ctx) {
  this.ctx = ctx;
  this.surfaceWidth = this.ctx.canvas.width;
  this.surfaceHeight = this.ctx.canvas.height;
  this.startInput();
  this.timer = new Timer();
  console.log('game initialized');
}

GameEngine.prototype.start = function () {
	var audio = new Audio('sound/Game of Thrones.mp3');
	audio.loop = true;
	audio.play();
	console.log("starting game");
	var that = this;
	(function gameLoop() {
		that.loop();
		requestAnimFrame(gameLoop, that.ctx.canvas);
  })();
}

GameEngine.prototype.startInput = function () {
  console.log('Starting input');
  var that = this;

  this.ctx.canvas.addEventListener("keydown", function (e) {
    if (String.fromCharCode(e.which) === ' ') {


      var that = this;

      setInterval(function() {
        if(timer < amount_in_wave && period == 0) {
          var troll = new Troll();
          enemies.push(troll);
          timer++;
        }
        else if(timer < amount_in_wave && period == 1) {
          var grunt = new Grunt();
          enemies.push(grunt);
          timer++;
        }
        else if(timer < amount_in_wave && period == 2){
          var ogre = new Ogre();
          enemies.push(ogre);
          timer++;
        }
        if(timer == amount_in_wave)  {
          timer = 500000;
          setTimeout(function () {

            timer = 0;
            if(period == 3) {
              setTimeout(function () {
                period = 0;
                amount_in_wave = amount_in_wave + 3;
              }, 10000);
            }
          }, 3000);
          period++;
        }

        //console.log("timer is " + timer);
        //console.log("amount in wave " + amount_in_wave);
        //console.log("period " + amount_in_wave);
      }, 1000);


      //that.space = true;
      // var ogre = new Ogre();
      // enemies.push(ogre);
      // console.log(enemies);
    }else if (String.fromCharCode(e.which) === 'g') {
      var grunt = new Grunt();
      enemies.push(grunt);
      //2console.log(enemies);
    }
    else if (String.fromCharCode(e.which) === 't') {
      var troll = new Troll();
      enemies.push(troll);
      console.log(enemies);
    } else if (String.fromCharCode(e.which) === '1') {
		if (money >= 100) {
			buildmode = 1;
		}
    } else if (String.fromCharCode(e.which) === '2') {
		if (money >= 250) {
			buildmode = 2;
		}
    } else if (String.fromCharCode(e.which) === '3') {
		if (money >= 150) {
			buildmode = 3;
		}
    } else if (e.which === 27) {
      that.gameover = that.gameover === 1 ? 0 : 1;
      console.log('gameover=' + that.gameover);
    }
    //console.log(String.fromCharCode(e.which));
    console.log(e.which);
    e.preventDefault();
  }, false);

  var getXandY = function (e) {
    var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
    var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
    //x= Math.floor(x / 65);
    //y = Math.floor(y / 65);
    return { x: x, y: y };
  }

  this.ctx.canvas.addEventListener("mousemove", function (e) {
    //console.log(getXandY(e));
    that.mouse = getXandY(e);
  }, false);

  this.ctx.canvas.addEventListener("click", function (e) {
    //console.log(getXandY(e));
    that.click = getXandY(e);
  }, false);


  console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
  console.log('added entity');
  this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  this.ctx.save();
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].draw(this.ctx);
  }
  this.ctx.restore();
}

GameEngine.prototype.update = function () {
  var entitiesCount = this.entities.length;

  for (var i = 0; i < entitiesCount; i++) {
    var entity = this.entities[i];

    if (!entity.removeFromWorld) {
      entity.update();
    }
  }

  for (var i = this.entities.length - 1; i >= 0; --i) {
    if (this.entities[i].removeFromWorld) {
      this.entities.splice(i, 1);
    }
  }
}

GameEngine.prototype.loop = function () {
  if (this.gameover === 0){
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.click = null;
    this.space = null;
    //this.direction = null;
    this.directionChanged = null;
  }

}

function Entity(game, x, y) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
  if (this.game.showOutlines && this.radius) {
    this.game.ctx.beginPath();
    this.game.ctx.strokeStyle = "green";
    this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.game.ctx.stroke();
    this.game.ctx.closePath();
  }
}

Entity.prototype.rotateAndCache = function (image, angle) {
  var offscreenCanvas = document.createElement('canvas');
  var size = Math.max(image.width, image.height);
  offscreenCanvas.width = size;
  offscreenCanvas.height = size;
  var offscreenCtx = offscreenCanvas.getContext('2d');
  offscreenCtx.save();
  offscreenCtx.translate(size / 2, size / 2);
  offscreenCtx.rotate(angle);
  offscreenCtx.translate(0, 0);
  offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
  offscreenCtx.restore();
  //offscreenCtx.strokeStyle = "red";
  //offscreenCtx.strokeRect(0,0,size,size);
  return offscreenCanvas;
}
