/*################ TOWER ###############*/
function Tower(gameboard, xindex, yindex) {
  this.gameBoard = gameboard;
  this.d = 0;
  this.xindex = xindex;
  this.yindex = yindex;
  this.size = 65;
  this.x = xindex * this.size + this.size / 2;
  this.y = yindex * this.size + this.size / 2;
  this.range = 15;
  this.attack = gameboard.attack[0];
  this.timer = 0;
  this.cooldown = gameboard.cooldowns[0];
  this.target = 0;
  this.projectiles = [];

}
Tower.prototype = new Entity();
Tower.prototype.constructor = Tower;
Tower.prototype.update = function() {
  if (this.target == 0) { //Tower has no target
    var newtarget = 0;
    var farthest = 0;
    for (var i = 0; i < this.gameBoard.enemies.length; i++) {
      if (Math.sqrt((Math.abs((this.x - this.gameBoard.enemies[i].comx)) ^ 2) + (Math.abs((this.y - this.gameBoard.enemies[i].comy)) ^ 2)) <= this.range) {
        if (this.gameBoard.enemies[i].comx > farthest) {
          farthest = this.gameBoard.enemies[i].comx;
          newtarget = this.gameBoard.enemies[i];
        }
      }
    }
    this.target = newtarget;
  } else { //tower has target
	if (this.timer == 0) { //ready to attack
		this.projectiles.push(new Projectile(this.x-20, this.y-20, this.target, this.attack));
	}
	this.timer += 1;
	if (this.target.healthbar.health <= 0 || Math.sqrt((Math.abs((this.x - this.target.comx)) ^ 2) + (Math.abs((this.y - this.target.comy)) ^ 2)) > this.range) {
		this.target = 0;
	}
  }
  
  for (var i = 0; i < this.projectiles.length; i++) {
	this.projectiles[i].update();
	if (this.projectiles[i].hit) {
		this.projectiles.splice(i,1);
	}
  }
  
  if (this.timer == this.cooldown) {
	this.timer = 0;
  }
}
Tower.prototype.draw = function(ctx) {
  ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size, this.size, this.size, this.size, this.xindex * this.size, this.yindex * this.size, this.size, this.size);
  for (var i = 0; i < this.projectiles.length; i++) {
	  if (!this.projectiles[i].hit){
		this.projectiles[i].draw(ctx);
	  } 
  }
}

/*############## AOE TOWER #############*/
function AOETower(gameboard, xindex, yindex) {
  this.gameBoard = gameboard;
  this.d = 0;
  this.xindex = xindex;
  this.yindex = yindex;
  this.size = 65;
  this.x = xindex * this.size + this.size / 2;
  this.y = yindex * this.size + this.size / 2;
  this.animation = new Animation(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size, this.size, this.size, this.size, this.x, this.y, this.size, this.size);
  console.log(this.x + "," + this.y);
  this.range = 15;
  this.attack = gameboard.attack[1];
  this.targets = [];
  this.projectiles = [];
  this.timer = 0;
  this.cooldown = gameboard.cooldowns[1];

}
AOETower.prototype = new Entity();
AOETower.prototype.constructor = AOETower;
AOETower.prototype.update = function() {
	if (this.timer == 0) {
	  for (var i = 0; i < this.gameBoard.enemies.length; i++) {
		if (Math.sqrt((Math.abs((this.x - this.gameBoard.enemies[i].comx)) ^ 2) + (Math.abs((this.y - this.gameBoard.enemies[i].comy)) ^ 2)) <= this.range) {
		  this.targets.push(this.gameBoard.enemies[i]);
		  this.projectiles.push(new Projectile(this.x-20, this.y-20, this.gameBoard.enemies[i], this.attack));
		}
	  }

	  for (var i = 0; i < this.targets.length; i++) {
		if (Math.sqrt((Math.abs((this.x - this.targets[i].comx)) ^ 2) + (Math.abs((this.y - this.targets[i].comy)) ^ 2)) > this.range) {
			this.targets.splice(i, 1);
		}
	  }
	}
	for (var i = 0; i < this.projectiles.length; i++) {
	this.projectiles[i].update();
	if (this.projectiles[i].hit) {
		this.projectiles.splice(i,1);
	}
	}
	if (this.timer == this.cooldown) {
		this.timer = 0;
	} else {
		this.timer += 1;
	}

}
AOETower.prototype.draw = function(ctx) {
  ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 400, 360, 100, 100, this.xindex * this.size, this.yindex * this.size, this.size, this.size);
  for (var i = 0; i < this.projectiles.length; i++) {
	if (!this.projectiles[i].hit){
		this.projectiles[i].draw(ctx);
	}
  }
}

/*############## SLOW TOWER #############*/
function SlowTower(gameboard, xindex, yindex) {
  this.gameBoard = gameboard;
  this.d = 0;
  this.xindex = xindex;
  this.yindex = yindex;
  this.size = 65;
  this.x = xindex * this.size + this.size / 2;
  this.y = yindex * this.size + this.size / 2;
  this.animation = new Animation(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size, this.size, this.size, this.size, this.x, this.y, this.size, this.size);
  console.log(this.x + "," + this.y);
  this.range = 15;
  this.attack = .03;
  this.targets = [];

}
SlowTower.prototype = new Entity();
SlowTower.prototype.constructor = AOETower;
SlowTower.prototype.update = function() {
  for (var i = 0; i < this.gameBoard.enemies.length; i++) {
    if (Math.sqrt((Math.abs((this.x - this.gameBoard.enemies[i].comx)) ^ 2) + (Math.abs((this.y - this.gameBoard.enemies[i].comy)) ^ 2)) <= this.range) {
      this.targets.push(this.gameBoard.enemies[i]);
    }
  }

  for (var i = 0; i < this.targets.length; i++) {
    if (Math.sqrt((Math.abs((this.x - this.targets[i].comx)) ^ 2) + (Math.abs((this.y - this.targets[i].comy)) ^ 2)) <= this.range) {
      this.targets[i].slowed = true;
    } else {
      this.targets[i].slowed = false;
      this.targets.splice(i, 1);
    }
  }
}
SlowTower.prototype.draw = function(ctx) {
  ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 405, 265, 95, 95, this.xindex * this.size, this.yindex * this.size, this.size, this.size);
  for (var i = 0; i < this.gameBoard.enemies.length; i++) {
    if (Math.sqrt((Math.abs((this.x - this.gameBoard.enemies[i].comx)) ^ 2) + (Math.abs((this.y - this.gameBoard.enemies[i].comy)) ^ 2)) <= this.range) {
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.gameBoard.enemies[i].comx, this.gameBoard.enemies[i].comy);
      ctx.stroke();
    }
  }
}

function Projectile(startx, starty, target, damage) {
	this.x = startx;
	this.y = starty;
	this.scale = 20;
	if (!target.slowed) {
		this.endx = target.comx + this.scale * target.speed;
	} else {
		this.endx = target.comx + this.scale * (target.speed*.5);
	}
	this.endy = target.comy;
	this.vx = (this.endx - startx)/this.scale;
	this.vy = (this.endy - starty)/this.scale;
	this.target = target;
	this.damage = damage;
	this.hit = false;
	var audio = new Audio('sound/arrow_launch.mp3');
	audio.volume = .035;
	audio.play();
}

Projectile.prototype.constructor = Projectile;
Projectile.prototype.update = function() {
	if (Math.sqrt((Math.abs((this.x - this.endx)) ^ 2) + (Math.abs((this.y - this.endy)) ^ 2)) <= 2) {
		this.hit = true;
	}
	if (!this.hit) {
		this.x += this.vx;
		this.y += this.vy;
	} else {
		this.target.healthbar.health -= this.damage;
	}
}
Projectile.prototype.draw = function(ctx) {
	var angle = Math.atan2(this.endy - this.y, this.endx - this.x) + .25*Math.PI;
	ctx.translate(this.x+20, this.y+20);
	ctx.rotate(angle);
	ctx.translate(-this.x-20, -this.y-20);
	ctx.drawImage(ASSET_MANAGER.getAsset("./img/arrow.png"), 0, 0, 250, 234, this.x , this.y, 40, 40);  // draw image
	ctx.setTransform(1,0,0,1,0,0); 
}