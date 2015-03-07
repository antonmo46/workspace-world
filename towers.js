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
  this.attack = .1;
  this.target = 0;
}
Tower.prototype = new Entity();
Tower.prototype.constructor = Tower;
Tower.prototype.update = function() {
  if (this.target != 0) { //Tower has target
    this.target.healthbar.health -= this.attack;
    if (this.target.healthbar.health <= 0 || Math.sqrt((Math.abs((this.x - this.target.comx)) ^ 2) + (Math.abs((this.y - this.target.comy)) ^ 2)) > this.range) {
      this.target = 0;
    }
  }
  if (this.target == 0) { //Tower has no target
    var newtarget = 0;
    var farthest = 0;
    for (var i = 0; i < this.gameBoard.enemies.length; i++) {
      //If enemy is in range
      if (Math.sqrt((Math.abs((this.x - this.gameBoard.enemies[i].comx)) ^ 2) + (Math.abs((this.y - this.gameBoard.enemies[i].comy)) ^ 2)) <= this.range) {
        //If enemy x value greater than current target
        if (this.gameBoard.enemies[i].comx > farthest) {
          farthest = this.gameBoard.enemies[i].comx;
          newtarget = this.gameBoard.enemies[i];
        }
      }
    }
    this.target = newtarget;
  }
}
Tower.prototype.draw = function(ctx) {
  ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size, this.size, this.size, this.size, this.xindex * this.size, this.yindex * this.size, this.size, this.size);
  // this.animation.drawFrame(gameboard.game.clockTick, ctx, this.size * this.xindex, this.size * this.yindex);
  // var that = this;
  // setTimeout(function () {
  // that.d = 1;
  // }, 2000);
  // if(this.d == 1)  {
  // this.animation2.drawFrame(gameboard.game.clockTick, ctx, this.size * this.xindex, this.size * this.yindex);
  // }

  if (this.target != 0) {
    ctx.beginPath();
    ctx.strokeStyle = "#00FF00";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.target.comx, this.target.comy);
    ctx.stroke();
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
  this.attack = .03;
  this.target = [];

}
AOETower.prototype = new Entity();
AOETower.prototype.constructor = AOETower;
AOETower.prototype.update = function() {
  for (var i = 0; i < this.gameBoard.enemies.length; i++) {
    if (Math.sqrt((Math.abs((this.x - this.gameBoard.enemies[i].comx)) ^ 2) + (Math.abs((this.y - this.gameBoard.enemies[i].comy)) ^ 2)) <= this.range) {
      this.gameBoard.enemies[i].healthbar.health -= this.attack;
    }
  }
}
AOETower.prototype.draw = function(ctx) {
  ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 400, 360, 100, 100, this.xindex * this.size, this.yindex * this.size, this.size, this.size);
  //this.animation.drawFrame(gameboard.game.clockTick, ctx, this.size * this.xindex, this.size * this.yindex);
  // var that = this;
  // setTimeout(function () {
  // that.d = 1;
  // }, 2000);
  // if(this.d == 1)  {
  // this.animation2.drawFrame(gameboard.game.clockTick, ctx, this.size * this.xindex, this.size * this.yindex);
  // }

  for (var i = 0; i < this.gameBoard.enemies.length; i++) {
    if (Math.sqrt((Math.abs((this.x - this.gameBoard.enemies[i].comx)) ^ 2) + (Math.abs((this.y - this.gameBoard.enemies[i].comy)) ^ 2)) <= this.range) {
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.gameBoard.enemies[i].comx, this.gameBoard.enemies[i].comy);
      ctx.stroke();
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
    if (Math.sqrt((Math.abs((this.x - this.gameBoard.enemies[i].comx)) ^ 2) + (Math.abs((this.y - enemies[i].comy)) ^ 2)) <= this.range) {
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