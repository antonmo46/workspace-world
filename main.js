function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
  this.spriteSheet = spriteSheet;
  this.startX = startX;
  this.startY = startY;
  this.frameWidth = frameWidth;
  this.frameHeight = frameHeight;
  this.frameDuration = frameDuration;
  this.frames = frames;
  this.loop = loop;
  this.reverse = reverse;

  this.totalTime = frameDuration * frames;
  this.elapsedTime = 0;
}
Animation.prototype.drawFrame = function(tick, ctx, x, y, scaleBy) {
  var scaleBy = scaleBy || 1.1;
  this.elapsedTime += tick;
  if (this.loop) {
    if (this.isDone()) {
      this.elapsedTime = 0;
    }
  }

  var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
  if ((index + 1) * this.frameWidth > this.frames * this.frameWidth) {
    index -= this.frameWidth;
  }

  var locX = x;
  var locY = y;
  var offset = this.startY;
  ctx.drawImage(this.spriteSheet, this.startX, index * this.frameHeight + offset,
    this.frameWidth, this.frameHeight,
    locX, locY, this.frameWidth * scaleBy,
    this.frameHeight * scaleBy);
	
}

Animation.prototype.drawFireFrame = function (tick, ctx, xx, yy) {
	//console.log("elapsed time= " + this.elapsedTime);
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) {
			this.elapsedTime = 0;
		}
    } else {
		var frame = this.currentFrame();
		var xindex = 0;
		var yindex = 0;
		xindex = frame % 4 ;

		//console.log(frame + " " + xindex + " " + yindex);
		//ctx.fillRect(0,300,1450,100);
		for (var i = 0; i < 19; i++) {
			var pos = i*75;
			ctx.drawImage(this.spriteSheet,
						 xindex * this.frameWidth + frame*2, yindex * this.frameHeight,
						 this.frameWidth, this.frameHeight,
						 pos, yy,
						 this.frameWidth,
						 this.frameHeight);
		}
				 
	}
}

Animation.prototype.drawHealFrame = function (tick, ctx, xx, yy) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) {
			this.elapsedTime = 0;
		}
    } else {
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
	xindex = frame % 5 ;
    yindex = Math.floor(frame/5);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,
                 this.frameWidth, this.frameHeight,
                 xx, yy,
                 this.frameWidth,
                 this.frameHeight);
				 
	}
	gameboard.building.healthbar.health += .5;
    if (gameboard.building.healthbar.health > 100) {
		gameboard.building.healthbar.health = 100;
    }
}

Animation.prototype.currentFrame = function() {
  return Math.floor(this.elapsedTime / this.frameDuration);
}
Animation.prototype.isDone = function() {
  return (this.elapsedTime >= this.totalTime);
}

/*########### GLOBAL DATA STRUCTURES ##################*/
var gameboard;

/*################ BUILDINGS ################*/
function Building(board) {
  this.gameBoard = board;
  this.xpos = 1455;
  this.ypos = 280;
  this.width = 125
  this.healthbar = new Healthbar(board, 95, 4, 10, 100);
}
Building.prototype.constructor = Building;
Building.prototype.update = function() {
  if (this.healthbar.health <= 0) {
    this.gameBoard.gameEngine.gameover = 1;
	alert("Score: "+this.gameBoard.score);
	restart();
  }
  this.healthbar.update();
}
Building.prototype.draw = function(ctx) {
  ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 267, 0, 125, 125, this.xpos, this.ypos, 125, 125);
  this.healthbar.draw(this.xpos, this.ypos, ctx);
}

/*################ Background ################*/
function Background(board) {
  this.gameBoard = board;
}
Background.prototype.constructor = Background;
Background.prototype.update = function() {}
Background.prototype.draw = function(ctx) {
  ctx.drawImage(ASSET_MANAGER.getAsset("./img/terrain2.png"), 0, 0);
  ctx.drawImage(ASSET_MANAGER.getAsset("./img/scroll.png"), 1515, -100);
}

/*################ Toolbar Box ################*/
function Toolbar(board) {
  this.gameBoard = board;
  this.lx = 1600;
  this.ly = 50;
  this.cx = 0;
  this.cy = 0;

  this.mx;
  this.my;

}
Toolbar.prototype.constructor = Toolbar;
Toolbar.prototype.update = function() {
  if (this.gameBoard.gameEngine.click) {
    this.cx = this.gameBoard.gameEngine.click.x;
    this.cy = this.gameBoard.gameEngine.click.y;
    //normal tower button
    if (this.cx >= this.lx && this.cx <= this.lx + 65 && this.cy >= this.ly + 70 && this.cy <= this.ly + 70 + 65) {
      if (this.gameBoard.money >= this.gameBoard.cost[0]) {
        this.gameBoard.buildmode = 1;
      }
    }
    //AOE tower button
    if (this.cx >= this.lx + 65 && this.cx <= this.lx + 65 + 65 && this.cy >= this.ly + 70 && this.cy <= this.ly + 70 + 65) {
      if (this.gameBoard.money >= this.gameBoard.cost[1]) {
        this.gameBoard.buildmode = 2;
      }
    }
    //Slow tower button
    if (this.cx >= this.lx + 65 + 65 && this.cx <= this.lx + 65 + 65 + 65 && this.cy >= this.ly + 70 && this.cy <= this.ly + 70 + 65) {
      if (this.gameBoard.money >= this.gameBoard.cost[2]) {
        this.gameBoard.buildmode = 3;
      }
    }
    //Fire Wave button
    if (this.cx >= this.lx && this.cx <= this.lx + 65 && this.cy >= this.ly + 300 && this.cy <= this.ly + 300 + 65) {
      if (this.gameBoard.money >= this.gameBoard.cost[3]) {
        this.gameBoard.money -= this.gameBoard.cost[3];
		this.gameBoard.firewaveOn = true;
		var audio = new Audio('sound/firewave.mp3');
		audio.volume = 1;
		audio.play();
		setTimeout(function() {
			gameboard.firewaveOn = false;
		}, 400)
        for (var i = 0; i < this.gameBoard.enemies.length; i++) {
          this.gameBoard.enemies[i].healthbar.health = this.gameBoard.enemies[i].healthbar.health / 2;
        }
      }
    }
    //Building Heal button
    if (this.cx >= this.lx && this.cx <= this.lx + 65 && this.cy >= this.ly + 375 && this.cy <= this.ly + 375 + 65) {
      if (this.gameBoard.money >= this.gameBoard.cost[4]) {
        this.gameBoard.money -= this.gameBoard.cost[4];
		var audio = new Audio('sound/heal.mp3');
		audio.volume = 1;
		audio.play();
		this.gameBoard.healOn = true;
		setTimeout(function() {
			gameboard.healOn = false;
		}, 2500)
      }
    }
  }
}

// Draws a build button for a tower including tooltip
Toolbar.prototype.towerbutton = function(ctx, image, x, y, framex, framey, size, cost, buildnum, name, tooltip) {
  ctx.font = "22px sans-serif";
  ctx.fillStyle = "#000000";
  ctx.fillText(name, x, y - 10);
  ctx.drawImage(ASSET_MANAGER.getAsset(image), framex, framey, size, size, x, y, 65, 65);
  if (this.gameBoard.money >= cost) {
    ctx.fillStyle = "#00ff00";
  }
  ctx.fillText("$" + cost, x + 10, y + 80);
  if (this.gameBoard.buildmode === buildnum) {
    ctx.strokeStyle = "#00ff00";
    ctx.strokeRect(x, y, 65, 65);
  }
  ctx.drawImage(ASSET_MANAGER.getAsset("./img/tooltip.png"), 0, 0, 16, 16, x, y, 16, 16);

  var backcolor = "#222222";
  //Normal tower
  if (this.mx >= x && this.mx <= x + 16 && this.my >= y && this.my <= y + 16) {
    ctx.drawImage(ASSET_MANAGER.getAsset(tooltip), 0, 0, 250, 90, 1600, y - 100, 200, 80);
  }
}
Toolbar.prototype.abilitybutton = function(ctx, image, x, y, name, cost, tooltip) {
  // Draws a button for a special ability including tooltip
  ctx.drawImage(ASSET_MANAGER.getAsset(image), 0, 0, 64, 64, x, y, 65, 65);
  ctx.fillStyle = "#000000";
  ctx.fillText(name, x + 75, y + 20);
  if (this.gameBoard.money >= cost) {
    ctx.fillStyle = "#00ff00";
  }
  ctx.fillText("$" + cost, x + 75, y + 50);
  ctx.drawImage(ASSET_MANAGER.getAsset("./img/tooltip.png"), 0, 0, 16, 16, x - 10, y, 16, 16);

  if (this.mx >= x - 10 && this.mx <= x + 6 && this.my >= y && this.my <= y + 16) {
    ctx.drawImage(ASSET_MANAGER.getAsset(tooltip), 0, 0, 250, 120, x - 10, y - 100, 200, 100);
  }
}
Toolbar.prototype.draw = function(ctx) {
  if (this.gameBoard.gameEngine.mouse) {
    this.mx = this.gameBoard.gameEngine.mouse.x;
    this.my = this.gameBoard.gameEngine.mouse.y;
  }
  // Tower buttons
  this.towerbutton(ctx, "./img/human-towers.png", this.lx, this.ly + 70, 65, 65, 65, this.gameBoard.cost[0], 1, "REG", "./img/tower1_tooltip.png");
  this.towerbutton(ctx, "./img/human-buildings.png", this.lx + 65, this.ly + 70, 400, 360, 100, this.gameBoard.cost[1], 2, "AOE", "./img/tower2_tooltip.png");
  this.towerbutton(ctx, "./img/human-buildings.png", this.lx + 130, this.ly + 70, 405, 265, 95, this.gameBoard.cost[2], 3, "SLOW", "./img/tower3_tooltip.png");

  //------------GAME INFO-------------
  ctx.fillStyle = "#000000";
  ctx.font = "22px sans-serif";
  var text = this.ly + 200;
  ctx.fillText("Money: " + this.gameBoard.money, this.lx, text);
  ctx.fillText("Score: " + this.gameBoard.score, this.lx, text + 20);
  ctx.fillText("Next wave: " + this.gameBoard.waveTimer, this.lx, text + 40);
  ctx.fillText("Wave: " + this.gameBoard.wave_num, this.lx, text + 60);
  

  //Ability buttons
  this.abilitybutton(ctx, "./img/firewave.png", this.lx, this.ly + 300, "Fire Wave", this.gameBoard.cost[3], "./img/firewave_tooltip.png");
  this.abilitybutton(ctx, "./img/buildingheal.png", this.lx, this.ly + 375, "Heal", this.gameBoard.cost[4], "./img/heal_tooltip.png");
  //abilitybutton(ctx, "./img/spawnmage.png",    this.lx, this.ly+450, "Mage",       cost[5], "./img/mage_tooltip.png");
}

/*############## Health Bar #############*/
function Healthbar(board, width, height, offset, hitpoints) {
  this.gameBoard = board;
  this.width = width;
  this.height = height;
  this.offset = offset;
  this.health = hitpoints * board.unitsCoeff;
  this.maxhealth = this.health;
  this.color = "#33CC33";
}
Healthbar.prototype.constructor = Healthbar;
Healthbar.prototype.update = function() {
  if (this.health > .5 * this.maxhealth) {
    this.color = "#33CC33";
  } else if (this.health > .2 * this.maxhealth && this.health < .5 * this.maxhealth) {
    this.color = "#FFD700";
  } else if (this.health < .2 * this.maxhealth) {
    this.color = "#CC0000";
  }
}
Healthbar.prototype.draw = function(pos1, pos2, ctx) {
  var fixed =  this.health / this.maxhealth;
  ctx.fillStyle = this.color;
  ctx.fillRect(pos1 + this.offset, pos2, fixed * this.width, this.height);
}
/*########## Fire Wave #################*/
function Firewave(game, spritesheet) {
    this.animation = new Animation(spritesheet,0,300, 164, 344, .1, 4, true, false);
    this.x = 0;
    this.y = 70;
    this.game = game;
}
Firewave.prototype.constructor = Firewave;
Firewave.prototype.draw = function (ctx) {
	this.animation.drawFireFrame(this.game.clockTick, ctx, 0, this.y);

}

/*########## Heal #################*/
function Heal(game, spritesheet) {
    this.animation = new Animation(spritesheet,1300,200, 192, 192, .1, 25, true, false);
    this.x = 1400;
    this.y = 225;
    this.game = game;
}
Heal.prototype.constructor = Heal;
Heal.prototype.draw = function (ctx) {
	this.animation.drawHealFrame(this.game.clockTick, ctx, this.x, this.y);
}

/*############## Board #############*/
function GameBoard(game) {
  this.unitsCoeff = 1.2;// increase as game level
  this.money = 250;// starting money
  this.gameEngine = game; 
  this.background = new Background(this);
  this.building = new Building(this);
  this.toolbar = new Toolbar(this);
  this.firewave = new Firewave(game, ASSET_MANAGER.getAsset("./img/fire.png"));
  this.firewaveOn = false;
  this.heal = new Heal(game, ASSET_MANAGER.getAsset("./img/heal.png"));
  this.healOn = false;
  this.waveTimer = 0;
  this.wave_num = 1;
  this.buildmode = 0;
  this.score = 0;
  //-------------BALANCE-------------------------
  //		   norm, aoe, slow, fire, heal, mage 
  this.cost = [100,  250, 150,  800,  400,  300];
  //           		norm, aoe, ogre, troll, grunt
  this.attack =    [4,    3,   .1,   .05,   .05];
  //				norm  aoe                    
  this.cooldowns = [30,   120];
  //			   ogre, troll, grunt            
  this.bounties = [50,   35,    25];
  this.speeds =   [1,    1.82,  2.5];
  //---------------------------------------------
  this.enemies = [];
  this.towers = [];
  this.matrixmap = [];
  // Adjust these 3 variables to change grid size.
  this.gridwidth = 22;
  this.gridheight = 11;
  this.size = 65;
 
  //Initialize matrixmap
  for (var i = 0; i < this.gridwidth; i++) {
    this.matrixmap.push([]);
    for (var j = 0; j < this.gridheight; j++) {
      if (j == 5) {
        this.matrixmap[i].push(-1);
      } else {
        this.matrixmap[i].push(0);
      }
    }
  }
  
  	setInterval(function() {
		if (gameboard.waveTimer > 0) {
			gameboard.waveTimer--;
		}
	}, 1000);
  Entity.call(this, game, 20, 20);
}
GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;
GameBoard.prototype.update = function() {
  // check if clicked within a grid
  if (this.gameEngine.mouse) {
    var mx = Math.floor(this.gameEngine.mouse.x / 65);
    var my = Math.floor(this.gameEngine.mouse.y / 65);
  }
  if (this.gameEngine.click) {
    var cx = Math.floor(this.gameEngine.click.x / 65);
    var cy = Math.floor(this.gameEngine.click.y / 65);
  }

  if (this.gameEngine.click && mx < this.gridwidth && my < this.gridheight) {
    if (this.matrixmap[cx][cy] == 0) {
      if (this.money >= this.cost[0]) {
        if (this.buildmode == 1) {
          this.matrixmap[cx][cy] = 1;
          this.towers.push(new Tower(this, cx, cy));
          this.money -= this.cost[0];
          this.score += 15;
          this.buildmode = 0;
        }
      }
      if (this.money >= this.cost[1]) {
        if (this.buildmode == 2) {
          this.matrixmap[cx][cy] = 2;
          this.towers.push(new AOETower(this, cx, cy));
          this.money -= this.cost[1];
          this.score += 15;
          this.buildmode = 0;
        }
      }
      if (this.money >= this.cost[2]) {
        if (this.buildmode == 3) {
          this.matrixmap[cx][cy] = 3;
          this.towers.push(new SlowTower(this, cx, cy));
          this.money -= this.cost[2];
          this.score += 15;
          this.buildmode = 0;
        }
      }
    }
  }

  Entity.prototype.update.call(this);
  //Update building
  this.building.update();
  this.toolbar.update();
  //Update towers
  for (var i = 0; i < this.towers.length; i++) {
    this.towers[i].update();
  }
  //Update enemies
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].update();
    if (this.enemies[i].healthbar.health <= 0) {
      this.money += this.enemies[i].bounty;
      this.score += 30;
      this.enemies.splice(i, 1);
    }
  }
  //Remove enemies that have been killed

}
GameBoard.prototype.draw = function(ctx) {
  this.background.draw(ctx);
  this.toolbar.draw(ctx);
  this.building.draw(ctx);
  //Draw towers
  for (var i = 0; i < this.towers.length; i++) {
    this.towers[i].draw(ctx);
  }
  //Draw enemies
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].draw(ctx);
  }
  //Draw tower shadow
  if (this.gameEngine.mouse) {
    var mx = Math.floor(this.gameEngine.mouse.x / 65);
    var my = Math.floor(this.gameEngine.mouse.y / 65);
    ctx.save();
    ctx.globalAlpha = 0.5;
    // check if moved within a grid
    if (mx < this.gridwidth && my < this.gridheight) {
      if (this.matrixmap[mx][my] == 0) {
        if (this.buildmode == 1) {
          ctx.beginPath();
          ctx.fillStyle = "gray";
          ctx.arc(mx * this.size + 32, my * this.size + 32, 150, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.closePath();
          ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size, this.size, this.size, this.size, mx * this.size, my * this.size, this.size, this.size);
        } else if (this.buildmode == 2) {
          ctx.beginPath();
          ctx.fillStyle = "gray";
          ctx.arc(mx * this.size + 32, my * this.size + 32, 150, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.closePath();
          ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 400, 360, 100, 100, mx * this.size, my * this.size, this.size, this.size);
        } else if (this.buildmode == 3) {
          ctx.beginPath();
          ctx.fillStyle = "gray";
          ctx.arc(mx * this.size + 32, my * this.size + 32, 150, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.closePath();
          ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 405, 265, 95, 95, mx * this.size, my * this.size, this.size, this.size);
        }
      }
    }
    ctx.restore();
  }
  //Draw fire wave if active
  if (this.firewaveOn) {
	this.firewave.draw(ctx);
  }
    if (this.healOn) {
	this.heal.draw(ctx);
  }
  Entity.prototype.draw.call(this);
}
GameBoard.prototype.spawnWaves = function() {
  this.monsters = 0;
  this.wave_size = 3;
  this.lock = 0;
  this.wave_last_updated = 0
  
  var that = this;

  (function loop() {
    var rand = Math.round(Math.random() * 1000);
	console.log(rand);	
    setTimeout(function() {
      if (that.lock === 0) {
        that.monsters++;
        if (Math.floor((Math.random() * 3)) === 0){
          that.enemies.push(new Grunt(that));
        }else if (Math.floor((Math.random() * 3)) === 1){
          that.enemies.push(new Troll(that));
        }else if (Math.floor((Math.random() * 3)) === 2){
          that.enemies.push(new Ogre(that));
        }
      }
      if (that.monsters === that.wave_size) {
        that.lock = 1;
        //that2 = this;
        setTimeout(function() {
          that.lock = 0;
		  if (gameboard.waveTimer <= 0) {
			gameboard.wave_num++;
			gameboard.waveTimer = 25;
			var horn = new Audio("sound/wavehorn.mp3");
			horn.play();
			}
        }, 25000);
        that.monsters = 0;
        that.wave_size = that.wave_size + 3;
      }
      //console.log("count " + that.wave_num);
      if(that.wave_num % 4 ===0 && Math.floor(that.wave_num / 4) !== that.wave_last_updated){
        that.wave_last_updated = Math.floor(that.wave_num / 4);
        //console.log("last " + that.wave_last_updated);
        that.unitsCoeff = that.unitsCoeff * 1.7;
        //console.log("coeff " + that.unitsCoeff);
      }
      if (that.gameEngine.gameover === 0) {
        loop();
      }
    }, rand);
  }());
}


/*################ ASSET_MANAGER ################*/
var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./img/toolbar.png");
ASSET_MANAGER.queueDownload("./img/ogre-2.png");
ASSET_MANAGER.queueDownload("./img/grunt.png");
ASSET_MANAGER.queueDownload("./img/troll.png");
ASSET_MANAGER.queueDownload("./img/human-buildings.png");
ASSET_MANAGER.queueDownload("./img/tower1.png");
ASSET_MANAGER.queueDownload("./img/human-towers.png");
ASSET_MANAGER.queueDownload("./img/terrain2.png");
ASSET_MANAGER.queueDownload("./img/scroll.png");
ASSET_MANAGER.queueDownload("./img/firewave.png");
ASSET_MANAGER.queueDownload("./img/buildingheal.png");
ASSET_MANAGER.queueDownload("./img/spawnmage.png");
ASSET_MANAGER.queueDownload("./img/tooltip.png");
ASSET_MANAGER.queueDownload("./img/firewave_tooltip.png");
ASSET_MANAGER.queueDownload("./img/heal_tooltip.png");
ASSET_MANAGER.queueDownload("./img/mage_tooltip.png");
ASSET_MANAGER.queueDownload("./img/tower1_tooltip.png");
ASSET_MANAGER.queueDownload("./img/tower2_tooltip.png");
ASSET_MANAGER.queueDownload("./img/tower3_tooltip.png");
ASSET_MANAGER.queueDownload("./img/arrow.png");
ASSET_MANAGER.queueDownload("./img/fire.png");
ASSET_MANAGER.queueDownload("./img/heal.png");


ASSET_MANAGER.downloadAll(function() {
  var canvas = document.getElementById('gameWorld');
  var ctx = canvas.getContext('2d');

  var gameEngine = new GameEngine();
  gameboard = new GameBoard(gameEngine);

  gameEngine.addEntity(gameboard);
  gameEngine.init(ctx, gameboard);
  gameEngine.start();
  var audio = new Audio('sound/Game of Thrones.mp3');
  audio.loop = true;
  audio.volume = .6;
  audio.play();
});

function start() {
  gameboard.waveTimer = 25;
  var horn = new Audio("sound/wavehorn.mp3");
  horn.volume=.4;
  horn.play();
  document.getElementById("start").style.display = "none";
  gameboard.spawnWaves();
}

function restart() {
  document.getElementById("start").style.display = "block";
  var canvas = document.getElementById('gameWorld');
  var ctx = canvas.getContext('2d');

  var gameEngine = new GameEngine();
  gameboard = new GameBoard(gameEngine);

  gameEngine.addEntity(gameboard);
  gameEngine.init(ctx, gameboard);
  gameEngine.start();
}
