
const NINJAOFFSET = 25;
// ninja boy sword attack offsets.
let NINJAATTACKOFFSET = 12;
let NINJAATTACKSWORDOFFSET = 50;


class Player extends Character{
  

  constructor(x, y, width, height, movingDirection, spriteIndex, images, attackPower, level) {
    super(x, y, width, height, movingDirection, spriteIndex, images, attackPower, null, null, level);
    this.init();
    this.keyboardController(
        {
          37: this.moveLeft,
          39: this.moveRight,
          38: this.jump,
        
        }
      , 60)
  }
}

Player.prototype.updateCharacteristic = function() {

  this.speed = this.stamina.map(0, 100, 1.5, 6);
  
}
// check if game.player is close to the enemy.
Player.prototype.isPlayerClose = function(enemy) {
  if(enemy.x + enemy.width > this.x && enemy.x < this.x + this.width) {
    if(game.player.y >= enemy.y && game.player.y <= enemy.y + enemy.height) {
      return true;
    }
  }
}

Player.prototype.swingSword = function() {
  // decrease the stamina if sword is swinging.
  if(this.isAttacking) {
    AUDIOS.SWING.play();
    if(game.character === "male") {
      AUDIOS.GROAN.play();
    }else if(game.character === "female") {
      AUDIOS.NINJAGIRLSWINGING.play();
    }
    this.stamina -= this.stamina * 0.009;
    // console.log(this.stamina);
    if(this.stamina < 1) {
      this.stamina = 0;
    }

  }  
}
// game.player attacks enemy.
Player.prototype.attackingEnemy = function(enemy) {


  if(this.isPlayerClose(enemy) && this.isAttacking && !game.isPoweringUp) {

      enemy.health -= this.attackPower;
      // if(enemy.runningSpriteIndex == 0) {
      //   enemy.x -= enemy.width / 2;
      // }else if(enemy.runningSpriteIndex == 1) {
      //   enemy.x += enemy.width / 2;
      // }  
    
  }
  if(this.isPlayerClose(enemy) && this.isSliding) {
    enemy.health -= (this.attackPower * 0.25);
    
  }
  if(enemy.health < 0) {
    enemy.health = 0;
  }

}

// render the game.player character.
Player.prototype.draw = function() {

  if(this.isDead) {
    game.ctx.drawImage(this.images[5], player_clippingX, player_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x + NINJAOFFSET / 2, this.y, this.width + 20, this.height + 10);
  }else if(this.isJumping) {
    game.ctx.drawImage(this.images[4], player_clippingX, player_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x + NINJAOFFSET / 2, this.y, this.width, this.height + 10);    
  }else if(this.isIdle) {
    game.ctx.drawImage(this.images[1], player_clippingX, player_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x + NINJAOFFSET / 2, this.y, this.width - NINJAOFFSET, this.height);
  }else if(this.isRunning) {
    game.ctx.drawImage(this.images[2], player_clippingX, player_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x, this.y, this.width, this.height);
  }else if(this.isAttacking) {
    if(this.movingDirection == RIGHT) {
        game.ctx.drawImage(this.images[3], player_clippingX, player_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x , this.y + NINJAATTACKOFFSET, this.width + 35, this.height);
    }else if(this.movingDirection == LEFT){
      game.ctx.drawImage(this.images[3] , player_clippingX, player_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x - NINJAATTACKSWORDOFFSET, this.y, this.width + 35, this.height + 12);        
    }
  }else if(this.isSliding) {
    game.ctx.drawImage(this.images[6], player_clippingX, player_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x + NINJAOFFSET / 2, this.y, this.width , this.height );    
  }else if(this.isThrowing) {
    game.ctx.drawImage(this.images[7], player_clippingX, player_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x + NINJAOFFSET / 2, this.y, this.width, this.height);    
  }
}
// animate sprite index.
Player.prototype.animateCharacter = function() {
  currentIndex = ++currentIndex % FRAMECOUNT;
  player_clippingX = this.runningSpriteIndex * FRAMEWIDTH;
  player_clippingY = currentIndex * FRAMEHEIGHT;
}
  // pull game.player character by gravity force.
  Player.prototype.pullByGravity = function() {
    this.velocity.y += this.gravity;
}

Player.prototype.updatePosition = function() {
    this.isonGround = false;
    for(let i = 0; i < game.platform.length; i++) {
      if(game.platform[i].level === scene.currentLevel.enemyLevel) {

        if(this.x + this.width / 2> game.platform[i].x && this.x + this.width / 2< game.platform[i].x + game.platform[i].w &&
          this.y + this.height > game.platform[i].y && this.y + this.height < game.platform[i].y + game.platform[i].h) {  
            this.y = game.platform[i].y - this.height;
            this.velocity.y = 0;  
            this.isonGround = true;
        }
      }

  
    }

    if(!this.isonGround) {
      this.velocity.y += this.gravity;
    }


  if(this.isIdle && (!this.isRunning || !this.isJumping)) {
    this.velocity.x = 0;
  }

    if(this.isRunning) {
    this.stamina -= this.stamina * 0.0002;
    // console.log(this.stamina);
    if(this.stamina < 1) {
      this.stamina = 0;
    }      
      // console.log("Running");
    if(this.movingDirection == RIGHT) {
        this.velocity.x = this.speed;
    }else if(this.movingDirection == LEFT) {
        this.velocity.x= -this.speed;
    }
  }

  if(this.isRunning && this.isJumping) {
    this.stamina -= this.stamina * 0.003;
    // console.log(this.stamina);
    if(this.stamina < 1) {
      this.stamina = 0;
    }
    if(this.movingDirection == RIGHT) {
      this.velocity.x = 11;
    }else if(this.movingDirection == LEFT) {
      this.velocity.x = -11;
    }
  }
  // if(this.isJumping && this.isonGround) {
  //   this.velocity.y = -this.gravity;
  // }

  if(this.isSliding) {
    this.stamina -= this.stamina * 0.009;
    // console.log(this.stamina);
    if(this.stamina < 1) {
      this.stamina = 0;
    }
    if(this.movingDirection == RIGHT) {
        this.x += 8;
    }else if(this.movingDirection == LEFT) {
      this.x += -8;
    }
  }
  this.x += this.velocity.x;
  this.y += this.velocity.y;

}
// check if the game.player hits the canvas top.

// check and re-position game.player character's position on screen boundary.
Player.prototype.checkScreenBoundary = function() {
  if(this.x <= 0) {
    this.x = 0
  }
  if(this.x + this.width>= C_WIDTH) {
    if(!game.isNext) {
      this.x = C_WIDTH - this.width;
    }
  }
  if(this.y + this.height >= C_HEIGHT - 60) {
    this.velocity.y = 0;
    this.isonGround = true;
    this.y = C_HEIGHT - this.height - 60;
  }
}

// initialize booleans on keyup keyboard event.
Player.prototype.init = function() {

  let down = false;
  document.addEventListener("keydown", (e) => {
 
    if(down) {
      if(e.keyCode === 65 || e.keyCode === 68 || e.keyCode === 83) {
        if(this == game.player) {
          if(game.isGameRunning) {
            this.isRunning = false;
            this.isIdle = true;
            this.isJumping = false;
            this.isAttacking = false;
            this.isSliding = false;
            this.isThrowing = false;
            return;
          }

        }

      }


    }else {
      
      down = true;
      if(this == game.player) {
        if(game.isGameRunning) {

          if(e.keyCode === 65) {
            this.swordAttack();
          }else if(e.keyCode === 68) {
            this.slideAttack();
          }else if(e.keyCode === 83) {
            this.throwAttack();
          }else if(e.keyCode === 72) {
            this.useHealthPotion();
          }else if(e.keyCode === 32) {
            this.useStaminaPotion();
          }
        }

      }

    }
  })

  document.addEventListener("keyup", (e) => {
    if(!this.isDead) {
      down = false;
      this.isRunning = false;
      this.isIdle = true;
      this.isJumping = false;
      this.isAttacking = false;
      this.isSliding = false;
      this.isThrowing = false;
    }
    
  })  
 
}

// utility function for keyboard event handling.
Player.prototype.keyboardController = function(keys, delay) {  
  let executionTimers = {};
  let that = this;
  document.onkeydown =  function(e){
    let keyCode = e.keyCode;
    if(!(keyCode in keys)) {
      return true;
    }else if(!(keyCode in executionTimers)) {
      executionTimers[keyCode] = null;
      keys[keyCode]();
      
      if(delay != 0) {
        executionTimers[keyCode] = setInterval(keys[keyCode].bind(that), delay);
      }
    }

    return false;
  }

  document.onkeyup = function(e){
    let keyCode = e.keyCode;
    if(keyCode in executionTimers) {
      if(executionTimers[keyCode] !== 0) {
        clearInterval(executionTimers[keyCode]);
        delete executionTimers[keyCode];
      }
    }
  }
}

Player.prototype.useHealthPotion = function() {
  if(game.healthPotionsCollected !== 0) {
    var audio = AUDIOS.DRINKPOTION.cloneNode();
    audio.play();
    this.health += 20;
    game.healthPotionsCollected--;
    if(game.healthPotionsCollected < 0) {
      game.healthPotionsCollected = 0;
    }
    if(this.health > 100) {
      this.health = 100;
    }
  }
}


Player.prototype.useStaminaPotion = function() {
  if(game.staminaPotionsCollected !== 0) {
    var audio = AUDIOS.DRINKPOTION.cloneNode();
    audio.play();
    this.stamina += 20;
    game.staminaPotionsCollected--;
    if(game.staminaPotionsCollected < 0) {
      game.staminaPotionsCollected = 0;
    }
    if(this.stamina > 100) {
      this.stamina = 100;
    }
  }
}
