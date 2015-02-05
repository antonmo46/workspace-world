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
	this.direction = 2;
}

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
				this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function(){return Math.floor(this.elapsedTime / this.frameDuration);}
Animation.prototype.isDone = function(){return (this.elapsedTime >= this.totalTime);}

/*################ BUILDINGS ################*/
function Building(game){Entity.call(this, game, 0, 0);}
Building.prototype = new Entity();
Building.prototype.constructor = Building;
Building.prototype.update = function(){}
Building.prototype.draw = function(ctx){
	var x = 267;
	var y = 0;
	var width = 125;
	var pos1 = 700;
	var pos2 = 220;
	var scale = width * 1; 
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), x, y, width,width, pos1, pos2, scale, scale);
	//ctx.strokeStyle = "Chartreuse";
    //ctx.strokeRect(pos1,pos2,width,width);
	
    Entity.prototype.draw.call(this);
}

/*################ Background ################*/

function Background(game){
    Entity.call(this, game, 0, 0);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;
Background.prototype.update = function(){}
Background.prototype.draw = function(ctx){
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/terrain.png"), 0, 0, 900,900, 0, 0, 900, 900);
}

/*################ OGRE ################*/


function Ogre(game){
    this.frameWidth = 73;
    
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/ogre-2.png"), 0, 0, this.frameWidth, this.frameWidth, 0.10, 5, true, true);
    this.attackAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ogre-2.png"), 0, 365, this.frameWidth, this.frameWidth, 0.10, 4, true, true);
    this.attacking = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 250);
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
	if (this.x === 650){
		this.attacking = true;
	}
        
    if (this.attacking) {
        if (this.attackAnimation.isDone()) {
            this.attackAnimation.elapsedTime = 0;
            this.attacking = false;
        }
    }
    Entity.prototype.update.call(this);
}

Ogre.prototype.draw = function(ctx){
    if (this.attacking) {
        this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else {
		this.x += 1;
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
	ctx.strokeStyle = "Chartreuse";
    ctx.strokeRect(this.x+15,this.y+10,this.frameWidth-17,this.frameWidth-15);
    Entity.prototype.draw.call(this);
}

/*################ ASSET_MANAGER ################*/

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/ogre-2.png");
ASSET_MANAGER.queueDownload("./img/human-buildings.png");
ASSET_MANAGER.queueDownload("./img/terrain.png");

ASSET_MANAGER.downloadAll(function(){
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    
    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
	var townhall = new Building(gameEngine);
    var ogre = new Ogre(gameEngine);
    
    gameEngine.addEntity(bg);
	gameEngine.addEntity(townhall);
    gameEngine.addEntity(ogre);
    
    gameEngine.init(ctx);
    gameEngine.start();
});
