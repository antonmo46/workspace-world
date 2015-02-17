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
//Add global matrix for grid states
var matrixmap = [];
//Add global building
var building;
//Add global list of towers
var towers = [];
//Add global list of enemies
var enemies = [];

/*################ BUILDINGS ################*/
function Building(game){
	this.xpos = 1455;
	this.ypos = 280;
	this.width = 125
	this.healthbar = new Healthbar(95,4,10, 100);
	Entity.call(this, game, 0, 0);}
Building.prototype = new Entity();
Building.prototype.constructor = Building;
Building.prototype.update = function(){
	this.healthbar.update();
	Entity.prototype.update.call(this);}
Building.prototype.draw = function(ctx){
	var framex = 267;
	var framey = 0;
	var width = 125;
	var scale = width * 1;
	
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), framex, framey, width,width, this.xpos, this.ypos, scale, scale);
    this.healthbar.draw(this.xpos, this.ypos, ctx);
	
    Entity.prototype.draw.call(this);}

/*################ Background ################*/
function Background(game){Entity.call(this, game, 0, 0);}
Background.prototype = new Entity();
Background.prototype.constructor = Background;
Background.prototype.update = function(){}
Background.prototype.draw = function(ctx){ctx.drawImage(ASSET_MANAGER.getAsset("./img/terrain2.png"),0,0);}

/*################ TOWER ###############*/
function Tower(game, xindex, yindex) {
	this.xindex = xindex;
	this.yindex = yindex;
	this.range = 200;
	this.attack = 10;
	//this.buildingAnimation
	//this.attackAnimation

}

Tower.prototype = new Entity();
Tower.prototype.constructor = Tower;

Tower.prototype.update = function() {

}

Tower.prototype.draw = function(ctx) {

}

/*################ OGRE ################*/
function Ogre(game){
    this.frameWidth = 73;
    this.healthbar = new Healthbar(150, 3, 20, 30);
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/ogre-2.png"), 0, 0, this.frameWidth, this.frameWidth, 0.10, 5, true, true);
    this.attackAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ogre-2.png"), 0, 365, this.frameWidth, this.frameWidth, 0.10, 4, true, true);
    this.attacking = false;
    this.attack = .1;
	this.speed = 5;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 310);
}

Ogre.prototype = new Entity();
Ogre.prototype.constructor = Ogre;
Ogre.prototype.update = function(){
	if (this.game.directionChanged){
		this.animation.direction = this.game.direction;
		this.attackAnimation.direction = this.game.direction;
	}
    if (this.game.space) {
		this.attacking = true;
	}
	if (this.x === 1410){
		this.attacking = true;
	}
    if (this.attacking) {
        if (this.attackAnimation.isDone()) {
            this.attackAnimation.elapsedTime = 0;
            this.attacking = false;
        }
    }
	this.healthbar.update();
    Entity.prototype.update.call(this);
}

Ogre.prototype.draw = function(ctx){
    if (this.attacking) {
        this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
		if (building.healthbar.health > 0) {
			building.healthbar.health -= this.attack;
		}
    } else {
		this.x += this.speed;
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
	this.healthbar.draw(this.x, this.y, ctx);
    Entity.prototype.draw.call(this);}

/*############## Health Bar #############*/
function Healthbar(width, height, offset, hitpoints) {
	this.width = width;
	this.height = height;
    this.offset = offset;
	this.health = hitpoints;
	this.maxhealth = hitpoints;
	this.color = "#33CC33";}
Healthbar.prototype.constructor = Healthbar;
Healthbar.prototype.update = function() {
	if (this.health > .5*this.maxhealth) {
        this.color = "#33CC33";
    } else if (this.health > .2*this.maxhealth && this.health < .5*this.maxhealth) {
        this.color = "#FFD700";
    } else if (this.health < .2*this.maxhealth) {
        this.color = "#CC0000";
    }}
Healthbar.prototype.draw = function(pos1, pos2, ctx) {
	ctx.fillStyle = this.color;
    ctx.fillRect(pos1+this.offset,pos2,(this.health/100)*this.width,this.height);}

/*############## Board #############*/
function GameBoard(game) {
    Entity.call(this, game, 20, 20);
    this.grid = false;
    matrixmap = [];
	// Adjust these 3 variables to change grid size.
	this.gridwidth = 22;
	this.gridheight = 11;
	this.size = 65;
    for (var i = 0; i < this.gridwidth; i++) {
        matrixmap.push([]);
        for (var j = 0; j < this.gridheight; j++) {
            matrixmap[i].push(0);
        }
    }}
GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;
GameBoard.prototype.update = function () {
    // check if clicked within a grid
    if (this.game.click && this.game.mouse.x < this.gridwidth && this.game.mouse.y < this.gridheight) {
        matrixmap[this.game.click.x][this.game.click.y] = 1;
		towers.push(new Tower(this.game, this.game.click.x, this.game.click.y));
		console.log(towers);
    }
	
	//Update building
	
	//Update towers
	
	//Update enemies
	
    Entity.prototype.update.call(this);
}

GameBoard.prototype.draw = function (ctx) {
	//Draw grid
	for (var i = 0; i < this.gridwidth; i++) {
		for (var j = 0; j < this.gridheight; j++) {
			if(this.grid) {
				ctx.strokeStyle = "Red";
				ctx.strokeRect(i * this.size, j * this.size, this.size, this.size);
			}
			if (matrixmap[i][j] === 1) {
				ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size,this.size,this.size,this.size,i * this.size, j * this.size, this.size, this.size);
			}
		}
	}
	
	//Draw building
	
	//Draw towers
	
	//Draw enemies
	
    //Draw mouse shadow
    if (this.game.mouse) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        // check if moved within a grid
        if(this.game.mouse.x < this.gridwidth && this.game.mouse.y < this.gridheight){
            ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size,this.size,this.size,this.size, this.game.mouse.x * this.size, this.game.mouse.y * this.size, this.size, this.size);
        }
        ctx.restore();
    }}

/*################ ASSET_MANAGER ################*/
var ASSET_MANAGER = new AssetManager();
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

    
    var gameEngine = new GameEngine();
    var gameboard = new GameBoard(gameEngine);
    var bg = new Background(gameEngine);
	building = new Building(gameEngine);
    var ogre = new Ogre(gameEngine);

    
    gameEngine.addEntity(bg);
	gameEngine.addEntity(building);    
    gameEngine.addEntity(gameboard);
    gameEngine.addEntity(ogre);
    
    gameEngine.init(ctx);
    gameEngine.start();
});
