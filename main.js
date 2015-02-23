function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse){
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
	this.direction = 2;}
Animation.prototype.drawFrame = function(tick, ctx, x, y, scaleBy){
    var scaleBy = scaleBy || 1.1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    }
    else 
        if (this.isDone()) {
            return;
        }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    if ((index + 1) * this.frameWidth > this.frames * this.frameWidth) {
        index -= this.frameWidth;
    }
	
    var locX = x;
    var locY = y;
    var offset = this.startY;
    ctx.drawImage(this.spriteSheet, this.direction * this.frameWidth, index * this.frameWidth + offset,
    			this.frameWidth, this.frameHeight, 
    			locX, locY, this.frameWidth * scaleBy, 
				this.frameHeight * scaleBy);}
Animation.prototype.currentFrame = function(){return Math.floor(this.elapsedTime / this.frameDuration);}
Animation.prototype.isDone = function(){return (this.elapsedTime >= this.totalTime);}

/*########### GLOBAL DATA STRUCTURES ##################*/
var gameEngine;

var gameboard;
//Background
var background;
//Add global matrix for grid states
var matrixmap = [];
//Add global building
var building;
//Add global list of towers
var towers = [];
//Add global list of enemies
var enemies = [];

//Add global cotrol
var toolbar;
var money = 300;
var score = 0;
var buildmode = 0;

/*################ BUILDINGS ################*/
function Building(game){
	this.xpos = 1455;
	this.ypos = 280;
	this.width = 125
	this.healthbar = new Healthbar(95,4,10, 100);
	Entity.call(this, game, 0, 0);
}
//Building.prototype = new Entity();
Building.prototype.constructor = Building;

Building.prototype.update = function(){
    if(this.healthbar.health <= 0){
        gameEngine.gameover = 1;
    }
	this.healthbar.update();
	//Entity.prototype.update.call(this);
}

Building.prototype.draw = function(ctx){
	var framex = 267;
	var framey = 0;
	var width = 125;
	var scale = width * 1;
	
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), framex, framey, width,width, this.xpos, this.ypos, scale, scale);
    this.healthbar.draw(this.xpos, this.ypos, ctx);
	
    //Entity.prototype.draw.call(this);
}

/*################ Background ################*/
function Background(game){Entity.call(this, game, 0, 0);}
//Background.prototype = new Entity();
Background.prototype.constructor = Background;
Background.prototype.update = function(){}
Background.prototype.draw = function(ctx){
	//ctx.drawImage(ASSET_MANAGER.getAsset("./img/terrain2.png"),0,0);
}

/*################ Toolbar Box ################*/
function Toolbar(game){
    this.w = 46;
    this.h = 38;
    this.lx = 1600;
    this.ly = 10;
    this.scalex = this.w * 1;
    this.scaley = this.h * 1;
    this.color = "Chartreuse";

    this.action = -1;

    Entity.call(this, game, 0, 0);}
Toolbar.prototype.constructor = Toolbar;
Toolbar.prototype.update = function(){  
}
Toolbar.prototype.draw = function(ctx){
    for(var i = 0; i < 3; i++) {
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.lx + this.w * i + i, this.ly, this.w, this.h);
    }
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/toolbar.png"),6,251,  this.w,this.h,this.lx + this.scalex * 0 + 0,this.ly,this.scalex,this.scaley);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/toolbar.png"),251,292,this.w,this.h,this.lx + this.scalex * 1 + 1,this.ly,this.scalex,this.scaley);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/toolbar.png"),300,292,this.w,this.h,this.lx + this.scalex * 2 + 2,this.ly,this.scalex,this.scaley);
    ctx.fillStyle = "#FF0000";
    ctx.font = "14px sans-serif"
    ctx.fillText  ("Money: " + money, this.lx, 80);
    ctx.fillText  ("Score: " + score, this.lx, 100);
    ctx.fillText  ("Time: " + parseInt(gameEngine.timer.gameTime,10) + " sec(s)", this.lx, 120);
    if(gameEngine.gameover === 1){
        ctx.fillText  ("GameOver:", this.lx, 140);
    }

}



/*################ TOWER ###############*/
function Tower(game, xindex, yindex) {
	this.xindex = xindex;
	this.yindex = yindex;
	this.size = 65;
	this.x = xindex * this.size + this.size/2;
	this.y = yindex * this.size + this.size/2;
	console.log(this.x +","+ this.y);
	this.range = 15;
	this.attack = .1;
	this.target = 0;
	//this.buildingAnimation
	//this.attackAnimation

}

Tower.prototype = new Entity();
Tower.prototype.constructor = Tower;
Tower.prototype.update = function() {
	
	if (this.target != 0) { //Tower has target
 		this.target.healthbar.health -= this.attack;
		if (this.target.healthbar.health <= 0 || Math.sqrt((Math.abs((this.x - this.target.comx))^2) + (Math.abs((this.y - this.target.comy))^2)) > this.range) {
			this.target = 0;
		}
	}
	if (this.target == 0) { //Tower has no target
		var newtarget = 0;
		var farthest = 0;
		for (var i = 0; i < enemies.length; i++) {
				//If enemy is in range
				if (Math.sqrt((Math.abs((this.x - enemies[i].comx))^2) + (Math.abs((this.y - enemies[i].comy))^2)) <= this.range) {
					//If enemy x value greater than current target				
					if (enemies[i].comx > farthest) {
						farthest = enemies[i].comx;
						newtarget = enemies[i];
					}
				}
		}
		this.target = newtarget;
		
	}
}

Tower.prototype.draw = function(ctx) {
	ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size,this.size,this.size,this.size,this.xindex * this.size, this.yindex * this.size, this.size, this.size);
	if (this.target != 0) {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.target.comx, this.target.comy);
		ctx.stroke();
	}
}

/*################ OGRE ################*/
function Ogre(){
    this.frameWidth = 73;
	this.x = 0;
	this.y = 300;
	this.comx = this.x + 36;
	this.comy = this.y + 36;
    this.healthbar = new Healthbar(150, 3, 20, 30);
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/ogre-2.png"), 0, 0, this.frameWidth, this.frameWidth, 0.10, 5, true, true);
    this.attackAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ogre-2.png"), 0, 365, this.frameWidth, this.frameWidth, 0.10, 4, true, true);
    this.attacking = false;
    this.attack = .1;
	this.speed = 2;
    this.radius = 100;
    this.ground = 400;
}

Ogre.prototype.constructor = Ogre;
Ogre.prototype.update = function(){
	if (this.x === 1410){
		this.attacking = true;
	} else {
		this.x += this.speed;
		this.comx = this.x + 36;
		this.comy = this.y + 36;
	}
	this.healthbar.update();
}

Ogre.prototype.draw = function(ctx){
    if (this.attacking) {
        this.attackAnimation.drawFrame(gameboard.game.clockTick, ctx, this.x, this.y);
		if (building.healthbar.health > 0) {
			building.healthbar.health -= this.attack;
		}
    } else {		
        this.animation.drawFrame(gameboard.game.clockTick, ctx, this.x, this.y);
    }
	if (this.healthbar.health < this.healthbar.maxhealth) {
		this.healthbar.draw(this.x, this.y, ctx);
	}
}

/*############## Health Bar #############*/
function Healthbar(width, height, offset, hitpoints) {
	this.width = width;
	this.height = height;
    this.offset = offset;
	this.health = hitpoints;
	this.maxhealth = hitpoints;
	this.color = "#33CC33";
}
Healthbar.prototype.constructor = Healthbar;
Healthbar.prototype.update = function() {
	if (this.health > .5*this.maxhealth) {
        this.color = "#33CC33";
    } else if (this.health > .2*this.maxhealth && this.health < .5*this.maxhealth) {
        this.color = "#FFD700";
    } else if (this.health < .2*this.maxhealth) {
        this.color = "#CC0000";
    }
}
Healthbar.prototype.draw = function(pos1, pos2, ctx) {
	ctx.fillStyle = this.color;
    ctx.fillRect(pos1+this.offset,pos2,(this.health/100)*this.width,this.height);
}

/*############## Board #############*/
function GameBoard(game) {
    Entity.call(this, game, 20, 20);
    this.grid = true; //Sets if grid is visible or not.
    matrixmap = [];
	// Adjust these 3 variables to change grid size.
	this.gridwidth = 22;
	this.gridheight = 11;
	this.size = 65;
    for (var i = 0; i < this.gridwidth; i++) {
        matrixmap.push([]);
        for (var j = 0; j < this.gridheight; j++) {
			if (j == 5) {
				matrixmap[i].push(1);
			} else {
				matrixmap[i].push(0);
			}
        }
    }}
GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;
GameBoard.prototype.update = function () {
    // check if clicked within a grid
    if (this.game.click && this.game.mouse.x < this.gridwidth && this.game.mouse.y < this.gridheight && money >= 100) {
		if (matrixmap[this.game.click.x][this.game.click.y] == 0) {
			if (buildmode == 1) {
				matrixmap[this.game.click.x][this.game.click.y] = 1;
				towers.push(new Tower(this.game, this.game.click.x, this.game.click.y));
				money -= 100;
				score += 15;
				buildmode = 0;
				console.log(towers);
			}
		}
	}
    // if (this.game.click && this.game.mouse.x < this.gridwidth && this.game.mouse.y < this.gridheight && money >= 100) {
        // matrixmap[this.game.click.x][this.game.click.y] = 1;
        // towers.push(new Tower(this.game, this.game.click.x, this.game.click.y));
        // money -= 100;
        // score += 15;
        // console.log(towers);
    // }
	
	//Update building
	building.update();
	//Update towers 
	for(var i = 0; i < towers.length; i++) {
		towers[i].update();
	}
	//Update enemies
	for(var i = 0; i < enemies.length; i++) {
		enemies[i].update();
		if (enemies[i].healthbar.health <= 0) {
            money += 100;
            score += 30;
			enemies.splice(i,1);
		}
	}
	//Remove enemies that have been killed
	
    Entity.prototype.update.call(this);
}

GameBoard.prototype.draw = function (ctx) {
	//Draw grid
	for (var i = 0; i < this.gridwidth; i++) {
		for (var j = 0; j < this.gridheight; j++) {
            if(this.grid){
              ctx.strokeStyle = "Red";
            ctx.strokeRect(i * this.size, j * this.size, this.size, this.size);  
            }
			
			// if (matrixmap[i][j] === 1) {
				// ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size,this.size,this.size,this.size,i * this.size, j * this.size, this.size, this.size);
			// }
		}
	}
	//Draw background
	background.draw(ctx);
	//Draw building
	building.draw(ctx);
	//Draw towers 
	for(var i = 0; i < towers.length; i++) {
		towers[i].draw(ctx);
	}
	//Draw enemies
	for(var i = 0; i < enemies.length; i++) {
		enemies[i].draw(ctx);
	}
    //Draw mouse shadow
    if (this.game.mouse) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        // check if moved within a grid
        if(this.game.mouse.x < this.gridwidth && this.game.mouse.y < this.gridheight){
			if (matrixmap[this.game.mouse.x][this.game.mouse.y] == 0 ) {
				if (buildmode == 1) {
					ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size,this.size,this.size,this.size, this.game.mouse.x * this.size, this.game.mouse.y * this.size, this.size, this.size);
				}
			}
        }
        ctx.restore();
    }
	Entity.prototype.draw.call(this);
}

/*################ ASSET_MANAGER ################*/
var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./img/toolbar.png");
ASSET_MANAGER.queueDownload("./img/ogre-2.png");
ASSET_MANAGER.queueDownload("./img/human-buildings.png");
ASSET_MANAGER.queueDownload("./img/human-towers.png");
ASSET_MANAGER.queueDownload("./img/terrain2.png");
ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function(){
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    
    gameEngine = new GameEngine();
    gameboard = new GameBoard(gameEngine);
    background = new Background(gameEngine);
	building = new Building(gameEngine);
    //var ogre = new Ogre(gameEngine);
    //gameEngine.addEntity(bg);
	//gameEngine.addEntity(building);
    toolbar = new Toolbar(gameEngine);
    gameEngine.addEntity(toolbar);
    gameEngine.addEntity(gameboard);
    //gameEngine.addEntity(ogre);
    
    gameEngine.init(ctx);
    gameEngine.start();
});
