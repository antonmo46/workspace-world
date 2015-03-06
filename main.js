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
}
Animation.prototype.drawFrame = function(tick, ctx, x, y, scaleBy){
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

    var showrange = {flag:false, x:-200, y:-200};

    var wavenumber = 0;
    var wavespawning = false;
    var wavecount = [4, 0, 0];
    var currentwave;
    var spawn;

    //Add global control
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
      ctx.drawImage(ASSET_MANAGER.getAsset("./img/terrain2.png"),0,0);
	  ctx.drawImage(ASSET_MANAGER.getAsset("./img/scroll.png"),1515,-100);
    }

    /*################ Toolbar Box ################*/
    function Toolbar(game){
      this.w = 46;
      this.h = 38;
      this.lx = 1600;
      this.ly = 50;
      this.scalex = this.w * 1;
      this.scaley = this.h * 1;
      this.color = "Chartreuse";

      this.cx = 0;
      this.cy = 0;



      Entity.call(this, game, 0, 0);}
      Toolbar.prototype.constructor = Toolbar;
      Toolbar.prototype.update = function(){
        if(this.game.click){
          this.cx = this.game.click.x;
          this.cy = this.game.click.y;
		  //normal tower button
          if(this.cx >= this.lx && this.cx <= this.lx + 65
			&& this.cy >= this.ly +70 && this.cy <= this.ly+70+65) {
			if (money >= 100) {
				buildmode = 1;
			}
          }
		  //AOE tower button
		 if(this.cx >= this.lx +65 && this.cx <= this.lx + 65+65
			&& this.cy >= this.ly +70 && this.cy <= this.ly+70+65)		 {
			if (money >= 250) {
				buildmode = 2;
			}
          }
		  //Slow tower button
		  if(this.cx >= this.lx +65+65 && this.cx <= this.lx + 65+65+65
			&& this.cy >= this.ly +70 && this.cy <= this.ly+70+65)		 {
			if (money >= 150) {
				buildmode = 3;
			}
          }
		  //Fire Wave button this.lx, this.ly + 300
		  if(this.cx >= this.lx && this.cx <= this.lx + 65
			&& this.cy >= this.ly +300 && this.cy <= this.ly+300+65)		 {
			if (money >= 200) {
				money -= 200;
				for(var i = 0; i < enemies.length; i++) {
					enemies[i].healthbar.health = enemies[i].healthbar.health/2; 
				}
			}
          }
		  //Building Heal button this.lx,this.ly + 375, 65, 65
		  if(this.cx >= this.lx && this.cx <= this.lx + 65
			&& this.cy >= this.ly +375 && this.cy <= this.ly+375+65)		 {
			if (money >= 200) {
				money -= 200;
				building.healthbar.health += 50;
				if(building.healthbar.health > 100) {
					building.healthbar.health = 100;
				}
			}
          }
        }
      }
      Toolbar.prototype.draw = function(ctx){
        // -----------TOWER CONTROLS--------------
		ctx.font = "22px sans-serif";
		// NORMAL TOWER
		ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-towers.png"), 65,65,65,65,this.lx,this.ly + 70, 65, 65);
		if (money >= 100) {
			ctx.fillStyle = "#00ff00";
		} else {
			ctx.fillStyle = "#000000";
		}
		ctx.fillText  ("$100", this.lx+10, this.ly+150);
		if (buildmode === 1) {
			ctx.strokeStyle = this.color;
			ctx.strokeRect(this.lx, this.ly+70, 65, 65);
			
		}
		
		//AOE TOWER
		ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 400,360,100,100, this.lx + 65,this.ly + 70, 65, 65);
		if (money >= 250) {
			ctx.fillStyle = "#00ff00";
		} else {
			ctx.fillStyle = "#000000";
		}
		ctx.fillText  ("$250", this.lx+75, this.ly+150);
		if (buildmode === 2) {
			ctx.strokeStyle = this.color;
			ctx.strokeRect(this.lx + 65, this.ly+70, 65, 65);
		}
		
		//SLOW TOWER
		ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 405,265,95,95, this.lx + 65+65,this.ly + 70, 65, 65);
		if (money >= 150) {
			ctx.fillStyle = "#00ff00";
		} else {
			ctx.fillStyle = "#000000";
		}
		ctx.fillText  ("$150", this.lx+75+65, this.ly+150);
		if (buildmode === 3) {
			ctx.strokeStyle = this.color;
			ctx.strokeRect(this.lx + 65+65, this.ly+70, 65, 65);
		}
		
		//------------GAME INFO-------------
       // ctx.drawImage(ASSET_MANAGER.getAsset("./img/toolbar.png"),300,292,this.w,this.h,this.lx + this.scalex * 2 + 8,this.ly + 75,this.scalex,this.scaley);
        ctx.fillStyle = "#000000";
        ctx.font = "22px sans-serif";
		var text = this.ly + 200;
        ctx.fillText  ("Money: " + money, this.lx, text);
        ctx.fillText  ("Score: " + score, this.lx, text + 20);
        ctx.fillText  ("Time: " + parseInt(gameEngine.timer.gameTime,10) + " sec(s)", this.lx, text + 40);
        if(gameEngine.gameover === 1){
          ctx.fillText  ("GameOver:", this.lx, 1800);
        }
		
		// -------SPECIAL ABILITIES---------
		// FIRE WAVE
		ctx.drawImage(ASSET_MANAGER.getAsset("./img/firewave.png"), 0,0,64,64, this.lx,this.ly + 300, 65, 65);
		if (money >= 200) {
			ctx.fillStyle = "#00ff00";
		} else {
			ctx.fillStyle = "#000000";
		}
		ctx.fillText  ("$200", this.lx+75, this.ly+320);
		if (buildmode === 3) {
			ctx.strokeStyle = this.color;
			ctx.strokeRect(this.lx + 65+65, this.ly+70, 65, 65);
		}
		
		// BUILDING HEAL
		ctx.drawImage(ASSET_MANAGER.getAsset("./img/buildingheal.png"), 0,0,64,64, this.lx,this.ly + 375, 65, 65);
		if (money >= 200) {
			ctx.fillStyle = "#00ff00";
		} else {
			ctx.fillStyle = "#000000";
		}
		ctx.fillText  ("$200", this.lx+75, this.ly+395);
		if (buildmode === 3) {
			ctx.strokeStyle = this.color;
			ctx.strokeRect(this.lx + 65+65, this.ly+70, 65, 65);
		}
		

      }



      /*################ TOWER ###############*/
      function Tower(game, xindex, yindex) {
        this.d = 0;
        this.xindex = xindex;
        this.yindex = yindex;
        this.size = 65;
        this.x = xindex * this.size + this.size/2;
        this.y = yindex * this.size + this.size/2;
        console.log(this.x +","+ this.y);
        this.range = 15;
        this.attack = .1;
        this.target = 0;
        // this.animation = new Animation(ASSET_MANAGER.getAsset("./img/tower1.png"),
        // 0, 0, 64, 64, 1, 3, false, false);

        // this.animation2 = new Animation(ASSET_MANAGER.getAsset("./img/tower1.png"),
        // 0, 64 * 2, 64, 64, 1, 1, true, false);
      }

      Tower.prototype = new Entity();
      Tower.prototype.constructor = Tower;
      Tower.prototype.update = function() {
        if (this.target != 0) { //Tower has target
          this.target.healthbar.health -= this.attack;
          if (this.target.healthbar.health <= 0 || Math.sqrt((Math.abs((this.x - this.target.comx))^2)
          + (Math.abs((this.y - this.target.comy))^2)) > this.range) {
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
	  function AOETower(game, xindex, yindex) {
        this.d = 0;
        this.xindex = xindex;
        this.yindex = yindex;
        this.size = 65;
        this.x = xindex * this.size + this.size/2;
        this.y = yindex * this.size + this.size/2;
		this.animation = new Animation(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size,this.size,this.size,this.size,this.x, this.y, this.size, this.size);
        console.log(this.x +","+ this.y);
        this.range = 15;
        this.attack = .03;
        this.target = [];

      }

      AOETower.prototype = new Entity();
      AOETower.prototype.constructor = AOETower;
      AOETower.prototype.update = function() {
          for (var i = 0; i < enemies.length; i++) {
            if (Math.sqrt((Math.abs((this.x - enemies[i].comx))^2) + (Math.abs((this.y - enemies[i].comy))^2)) <= this.range) {
				enemies[i].healthbar.health -= this.attack;
            }
          }
      }

      AOETower.prototype.draw = function(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 400,360,100,100, this.xindex * this.size, this.yindex * this.size, this.size, this.size);
        //this.animation.drawFrame(gameboard.game.clockTick, ctx, this.size * this.xindex, this.size * this.yindex);
        // var that = this;
        // setTimeout(function () {
          // that.d = 1;
        // }, 2000);
        // if(this.d == 1)  {
          // this.animation2.drawFrame(gameboard.game.clockTick, ctx, this.size * this.xindex, this.size * this.yindex);
        // }

        for (var i = 0; i < enemies.length; i++) {
            if (Math.sqrt((Math.abs((this.x - enemies[i].comx))^2) + (Math.abs((this.y - enemies[i].comy))^2)) <= this.range) {
				ctx.beginPath();
				ctx.strokeStyle = "red";
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(enemies[i].comx, enemies[i].comy);
				ctx.stroke();
            }
          }
      }
	  
	  	  /*############## SLOW TOWER #############*/
	  function SlowTower(game, xindex, yindex) {
        this.d = 0;
        this.xindex = xindex;
        this.yindex = yindex;
        this.size = 65;
        this.x = xindex * this.size + this.size/2;
        this.y = yindex * this.size + this.size/2;
		this.animation = new Animation(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size,this.size,this.size,this.size,this.x, this.y, this.size, this.size);
        console.log(this.x +","+ this.y);
        this.range = 15;
        this.attack = .03;
        this.targets = [];

      }

      SlowTower.prototype = new Entity();
      SlowTower.prototype.constructor = AOETower;
      SlowTower.prototype.update = function() {
		for (var i = 0; i < enemies.length; i++) {
			if (Math.sqrt((Math.abs((this.x - enemies[i].comx))^2) + (Math.abs((this.y - enemies[i].comy))^2)) <= this.range) {
				this.targets.push(enemies[i]);
			}
          }
		  
		for (var i = 0; i < this.targets.length; i++) {
			if (Math.sqrt((Math.abs((this.x - this.targets[i].comx))^2) + (Math.abs((this.y - this.targets[i].comy))^2)) <= this.range) {
				this.targets[i].slowed =true;
			} else {
				this.targets[i].slowed =false;
				this.targets.splice(i,1);
			}
		}
      }

      SlowTower.prototype.draw = function(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 405,265,95,95, this.xindex * this.size, this.yindex * this.size, this.size, this.size);
        for (var i = 0; i < enemies.length; i++) {
            if (Math.sqrt((Math.abs((this.x - enemies[i].comx))^2) + (Math.abs((this.y - enemies[i].comy))^2)) <= this.range) {
				ctx.beginPath();
				ctx.strokeStyle = "blue";
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(enemies[i].comx, enemies[i].comy);
				ctx.stroke();
            }
          }
      }

	  
	  
	    
      /*################ GRUNT ################*/
      function Grunt(){
        this.frameWidth = 76;
        this.frameHeight = 54;
        this.direction = this.frameWidth * 2;
        this.x = 0;
        this.y = 300;
        this.comx = this.x + 35;
        this.comy = this.y + 28.5;
        this.healthbar = new Healthbar(100, 3, 20, 20);
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
      Grunt.prototype.update = function(){
        if (this.x >= 1410){
			this.attacking = true;
        } else {
			if (this.slowed) {
				this.x += this.speed/2;
			} else {
				this.x += this.speed;
			}
			this.comx = this.x + 35;
			this.comy = this.y + 28.5;
        }
        this.healthbar.update();
      }

      Grunt.prototype.draw = function(ctx){
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


      /*################ TROLL ################*/
      function Troll(){
        this.frameWidth = 62.4;
        this.frameHeight = 54;
        this.direction = this.frameWidth * 2;
        this.x = 0;
        this.y = 300;
        this.comx = this.x + 31.2;
        this.comy = this.y + 27;
        this.healthbar = new Healthbar(50, 3, 20, 30);
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
      Troll.prototype.update = function(){
        if (this.x >= 1410){
          this.attacking = true;
        } else {
          	if (this.slowed) {
				this.x += this.speed/2;
			} else {
				this.x += this.speed;
			}
          this.comx = this.x + 31.2;
          this.comy = this.y + 27;
        }
        this.healthbar.update();
      }

      Troll.prototype.draw = function(ctx){
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


      /*################ OGRE ################*/
      function Ogre(){
        this.frameWidth = 73;
        this.direction = this.frameWidth * 2;
        this.x = 0;
        this.y = 300;
        this.comx = this.x + 36;
        this.comy = this.y + 36;
        this.healthbar = new Healthbar(150, 3, 20, 60);
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
      Ogre.prototype.update = function(){
        if (this.x >= 1410){
          this.attacking = true;
        } else {
          	if (this.slowed) {
				this.x += this.speed/2;
			} else {
				this.x += this.speed;
			}
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
        } else if (this.healthbar.health > 1.0) {
          this.animation.drawFrame(gameboard.game.clockTick, ctx, this.x, this.y);
        }
        else {
          this.dieAnimation.drawFrame(gameboard.game.clockTick, ctx, this.x, this.y);
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
        this.grid = false; //Sets if grid is visible or not.
        matrixmap = [];
        // Adjust these 3 variables to change grid size.
        this.gridwidth = 22;
        this.gridheight = 11;
        this.size = 65;
        for (var i = 0; i < this.gridwidth; i++) {
          matrixmap.push([]);
          for (var j = 0; j < this.gridheight; j++) {
            if (j == 5) {
              matrixmap[i].push(-1);
            } else {
              matrixmap[i].push(0);
            }
          }
        }}
        GameBoard.prototype = new Entity();
        GameBoard.prototype.constructor = GameBoard;
        GameBoard.prototype.update = function () {
          // check if clicked within a grid
          if(this.game.mouse){
            var mx = Math.floor(this.game.mouse.x / 65);
            var my = Math.floor(this.game.mouse.y / 65);
          }
          if(this.game.click){
            var cx = Math.floor(this.game.click.x / 65);
            var cy = Math.floor(this.game.click.y / 65);
          }

          if (this.game.click && mx < this.gridwidth && my < this.gridheight) {
            if (matrixmap[cx][cy] == 0) {
              showrange.flag = false;
              showrange.x = -200;
              showrange.y = -200;
              if(money >= 100) {
                if (buildmode == 1) {
                  matrixmap[cx][cy] = 1;
                  towers.push(new Tower(this.game, cx, cy));
                  money -= 100;
                  score += 15;
                  buildmode = 0;
                  console.log(towers);
                }
              }
			  if(money >= 250) {
                if (buildmode == 2) {
                  matrixmap[cx][cy] = 2;
                  towers.push(new AOETower(this.game, cx, cy));
                  money -= 250;
                  score += 15;
                  buildmode = 0;
                  console.log(towers);
                }
              }
			  if(money >= 150) {
                if (buildmode == 3) {
                  matrixmap[cx][cy] = 3;
                  towers.push(new SlowTower(this.game, cx, cy));
                  money -= 150;
                  score += 15;
                  buildmode = 0;
                  console.log(towers);
                }
              }
            } else if (matrixmap[cx][cy] == 1) {
              showrange.flag = true;
              showrange.x = cx;
              showrange.y = cy;

            }
          }

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
              money += enemies[i].bounty;
              score += 30;
              enemies.splice(i,1);
            }
          }
          //Remove enemies that have been killed

          if (wavespawning) {

            var sum = 0;
            for (var i = 0; i < 3; i++) {
              sum += wavecount[i];
            }
            if (sum == 0) {
              wavespawning = false;
            }
          }

          Entity.prototype.update.call(this);
        }

        GameBoard.prototype.draw = function (ctx) {
          //Draw background
          background.draw(ctx);
		  toolbar.draw(ctx);
          //Draw grid
          for (var i = 0; i < this.gridwidth + 5; i++) {
            for (var j = 0; j < this.gridheight; j++) {
              if(this.grid){
                ctx.strokeStyle = "Red";
                ctx.strokeRect(i * this.size, j * this.size, this.size, this.size);
              }
            }
          }
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

          if (showrange) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.fillStyle = "gray";
            ctx.arc(showrange.x * this.size + 32, showrange.y*this.size + 32, 150, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore;
          }
          //Draw mouse shadow
          if (this.game.mouse) {
            var mx = Math.floor(this.game.mouse.x / 65);
            var my = Math.floor(this.game.mouse.y / 65);
            ctx.save();
            ctx.globalAlpha = 0.5;
            // check if moved within a grid
            if(mx < this.gridwidth && my < this.gridheight){
              if (matrixmap[mx][my] == 0 ) {
                if (buildmode == 1) {
                  ctx.beginPath();
                  ctx.fillStyle = "gray";
                  ctx.arc(mx * this.size + 32, my*this.size + 32, 150, 0, Math.PI * 2, false);
                  ctx.fill();
                  ctx.closePath();
                  ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-towers.png"), this.size,this.size,this.size,this.size, mx * this.size, my * this.size, this.size, this.size);
                } else if (buildmode == 2) {
                  ctx.beginPath();
                  ctx.fillStyle = "gray";
                  ctx.arc(mx * this.size + 32, my*this.size + 32, 150, 0, Math.PI * 2, false);
                  ctx.fill();
                  ctx.closePath();
                  ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 400,360,100,100, mx * this.size, my * this.size, this.size, this.size);
                } else if (buildmode == 3) {
                  ctx.beginPath();
                  ctx.fillStyle = "gray";
                  ctx.arc(mx * this.size + 32, my*this.size + 32, 150, 0, Math.PI * 2, false);
                  ctx.fill();
                  ctx.closePath();
				  ctx.drawImage(ASSET_MANAGER.getAsset("./img/human-buildings.png"), 405,265,95,95, mx * this.size, my * this.size, this.size, this.size);
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
        ASSET_MANAGER.queueDownload("./img/grunt.png");
        ASSET_MANAGER.queueDownload("./img/troll.png");
        ASSET_MANAGER.queueDownload("./img/human-buildings.png");
        ASSET_MANAGER.queueDownload("./img/tower1.png");
        ASSET_MANAGER.queueDownload("./img/human-towers.png");
        ASSET_MANAGER.queueDownload("./img/terrain2.png");
		ASSET_MANAGER.queueDownload("./img/scroll.png");
		ASSET_MANAGER.queueDownload("./img/firewave.png");
		ASSET_MANAGER.queueDownload("./img/buildingheal.png");



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
