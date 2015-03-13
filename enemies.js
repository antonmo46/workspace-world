
/*################ GRUNT ################*/
function Grunt(gameboard) {
  this.gameBoard = gameboard;
  this.frameWidth = 76;
  this.frameHeight = 54;
  this.direction = this.frameWidth * 2;
  this.x = 0;
  this.y = 300;
  this.comx = this.x + 35;
  this.comy = this.y + 28.5;
  this.healthbar = new Healthbar(gameboard,40, 3, 20, 20);
  this.animation = new Animation(ASSET_MANAGER.getAsset("./img/grunt.png"), this.direction, 0,
    this.frameWidth, this.frameHeight, 0.1, 5, true, true);
  this.attackAnimation = new Animation(ASSET_MANAGER.getAsset("./img/grunt.png"), this.direction, 272,
    this.frameWidth, this.frameHeight, 0.1, 4, true, true);
  this.attacking = false;
  this.bounty = 25;
  this.attack = .05;
  this.speed = 2.5;
  this.radius = 100;
  this.ground = 400;
  this.slowed = false;
}
Grunt.prototype.constructor = Grunt;
Grunt.prototype.update = function() {
  if (this.x >= 1410) {
    this.attacking = true;
	this.speed = 0;
  } else {
    if (this.slowed) {
      this.x += this.speed / 2;
    } else {
      this.x += this.speed;
    }
    this.comx = this.x + 35;
    this.comy = this.y + 28.5;
  }
  this.healthbar.update();
}
Grunt.prototype.draw = function(ctx) {
  if (this.attacking) {
    this.attackAnimation.drawFrame(this.gameBoard.gameEngine.clockTick, ctx, this.x, this.y);
    if (this.gameBoard.building.healthbar.health > 0) {
      this.gameBoard.building.healthbar.health -= this.attack;
    }
  } else {
    this.animation.drawFrame(this.gameBoard.gameEngine.clockTick, ctx, this.x, this.y);
  }
  if (this.healthbar.health < this.healthbar.maxhealth) {
    this.healthbar.draw(this.x, this.y, ctx);
  }
}

/*################ TROLL ################*/
function Troll(gameboard) {
  this.gameBoard = gameboard;
  this.frameWidth = 62.4;
  this.frameHeight = 54;
  this.direction = this.frameWidth * 2;
  this.x = 0;
  this.y = 300;
  this.comx = this.x + 31.2;
  this.comy = this.y + 27;
  this.healthbar = new Healthbar(gameboard, 40, 3, 20, 30);
  this.animation = new Animation(ASSET_MANAGER.getAsset("./img/troll.png"), this.direction, 0,
    this.frameWidth, this.frameHeight, 0.1, 5, true, true);
  this.attackAnimation = new Animation(ASSET_MANAGER.getAsset("./img/troll.png"), this.direction, 337,
    this.frameWidth, this.frameHeight, 0.1, 3, true, true);
  this.attacking = false;
  this.bounty = 35;
  this.attack = .05;
  this.speed = 1.82;
  this.radius = 100;
  this.ground = 400;
  this.slowed = false;
}
Troll.prototype.constructor = Troll;
Troll.prototype.update = function() {
  if (this.x >= 1410) {
    this.attacking = true;
	this.speed = 0;
  } else {
    if (this.slowed) {
      this.x += this.speed / 2;
    } else {
      this.x += this.speed;
    }
    this.comx = this.x + 31.2;
    this.comy = this.y + 27;
  }
  this.healthbar.update();
}
Troll.prototype.draw = function(ctx) {
  if (this.attacking) {
    this.attackAnimation.drawFrame(this.gameBoard.gameEngine.clockTick, ctx, this.x, this.y);
    if (this.gameBoard.building.healthbar.health > 0) {
      this.gameBoard.building.healthbar.health -= this.attack;
    }
  } else {
    this.animation.drawFrame(this.gameBoard.gameEngine.clockTick, ctx, this.x, this.y);
  }
  if (this.healthbar.health < this.healthbar.maxhealth) {
    this.healthbar.draw(this.x, this.y, ctx);
  }
}

/*################ OGRE ################*/
function Ogre(gameboard) {
  this.gameBoard = gameboard;

  this.frameWidth = 73;
  this.direction = this.frameWidth * 2;
  this.x = 0;
  this.y = 300;
  this.comx = this.x + 36;
  this.comy = this.y + 36;
  this.healthbar = new Healthbar(gameboard,50, 3, 20, 60);
  this.animation = new Animation(ASSET_MANAGER.getAsset("./img/ogre-2.png"), this.direction, 0, this.frameWidth, this.frameWidth, 0.10, 5, true, true);
  this.attackAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ogre-2.png"), this.direction, 365, this.frameWidth, this.frameWidth, 0.10, 4, true, true);
  this.dieAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ogre-2.png"), (73 * 9), 0, this.frameWidth, this.frameWidth, 1, 5, true, true);
  this.attacking = false;
  this.attack = .1;
  this.speed = 1;
  this.bounty = 50;
  this.radius = 100;
  this.ground = 400;
  this.slowed = false;
}
Ogre.prototype.constructor = Ogre;
Ogre.prototype.update = function() {
  if (this.x >= 1410) {
    this.attacking = true;
	this.speed = 0;
  } else {
    if (this.slowed) {
      this.x += this.speed / 2;
    } else {
      this.x += this.speed;
    }
    this.comx = this.x + 36;
    this.comy = this.y + 36;
  }
  this.healthbar.update();
}
Ogre.prototype.draw = function(ctx) {

  if (this.attacking) {
    this.attackAnimation.drawFrame(this.gameBoard.gameEngine.clockTick, ctx, this.x, this.y);
    if (this.gameBoard.building.healthbar.health > 0) {
      this.gameBoard.building.healthbar.health -= this.attack;
    }
  } else if (this.healthbar.health > 1.0) {
    this.animation.drawFrame(this.gameBoard.gameEngine.clockTick, ctx, this.x, this.y);
  } else {
    this.dieAnimation.drawFrame(this.gameBoard.gameEngine.clockTick, ctx, this.x, this.y);
  }
  if (this.healthbar.health < this.healthbar.maxhealth) {
    this.healthbar.draw(this.x, this.y, ctx);
  }
}

