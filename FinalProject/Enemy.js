

class Enemy extends Character{
  constructor(x, y, width, height, images, attackPower, movementSpeed, enemyHealth, enemyLevel) {
    super(x, y, width, height, null, null, images, attackPower, movementSpeed, enemyHealth, enemyLevel);
  }
}

// update the enemy character's sprite image.
Enemy.prototype.animateCharacter = function() {
  enemy_clippingX = this.runningSpriteIndex * FRAMEWIDTH;
  enemy_clippingY = currentIndex * FRAMEHEIGHT;
}
// render the enemy character on canvas.
Enemy.prototype.draw = function() {

    if(this.level === 1) {
      offsettedY = this.y + 25;
    }else if(this.level === 2) {
      offsettedY = this.y + 15;
    }else if(this.level === 3) {
      offsettedY = this.y + 5;
    }else if(this.level === 4) {
      offsettedY = this.y;  
    }else if(this.level === 5) {
      offsettedY = this.y;
    }
    if(this.isIdle) {
      game.ctx.drawImage(this.images[1], enemy_clippingX, enemy_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x, offsettedY, this.width, this.height);    
    }else if(this.isAttacking) {
      game.ctx.drawImage(this.images[3], enemy_clippingX, enemy_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x, offsettedY, this.width, this.height);    
    }else if(this.isRunning) {
      game.ctx.drawImage(this.images[2], enemy_clippingX, enemy_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x, offsettedY, this.width, this.height);    
    }else if(this.isDead) {
      game.ctx.drawImage(this.images[4], enemy_clippingX, enemy_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x, offsettedY, this.width, this.height);    
    }else if(this.isDisappearing) {
      game.ctx.drawImage(this.images[4], enemy_clippingX, enemy_clippingY, FRAMEWIDTH, FRAMEHEIGHT, this.x, offsettedY, this.width, this.height);    
    }
}
// update position of the enemy.
Enemy.prototype.update = function() {
  this.x += this.velocity.x;
  this.y += this.velocity.y;
}
// check if the enemy is close the player character.
Enemy.prototype.isTouchingPlayer = function() {
  if(game.player.y >= this.y && game.player.y <=this.y + this.height) {
    if(game.player.x + game.player.width > this.x && game.player.x < this.x + this.width) {
      return true;
    }
  }

}

Enemy.prototype.attackPlayer = function(player) {

  if(!this.isDisappearing) {
    if(this.isTouchingPlayer(player)) {
      AUDIOS.SWING.play();

      this.isAttacking = true;
      this.isRunning = false;
      player.health -= this.attackPower;
      if(player.health < 0) {
        player.health = 0;
      }       
    }else if(player.y <= this.y &&
      player.x + player.width >= this.x && player.x <= this.x + this.width) {
        // player is on platform or jumping.
        this.isIdle = true;
      
    }else {
      this.isIdle = false;
      this.isAttacking = false;
      this.isRunning = true;
    }
  }

}
// update the facing direction of enemy
// depending on the the player's position.
Enemy.prototype.updateSpriteIndex = function() {
  if(game.player.x > this.x) {
    this.runningSpriteIndex = 0;
  }else if(game.player.x < this.x){
    this.runningSpriteIndex = 1;
  }
}
// check and re-position enemy character's position on screen boundary.

Enemy.prototype.checkScreenBoundary = function() {
  if(this.x <= 0) {
    this.x += 150;
  }else if(this.x + this.width>= C_WIDTH) {
    this.x = C_WIDTH - this.width;
  }
  if(this.y + this.height >= C_HEIGHT - 60) {
    if(!game.isPoweringUp) {
      this.velocity.y = 0;
    }
    
  }

  if(this.y <= 100) {
    this.velocity.y = 0;
  }
}
// chase the player character.
Enemy.prototype.followPlayer = function(player) {
  if(!this.isDisappearing) {
    if(this.runningSpriteIndex === 0) {
      // enemy is facing east
      if(player.x - (this.x + this.width / 2) >= 5) {
        this.velocity.x = this.speed;
        this.isRunning = true;
        this.isIdle = false;
        this.movingDirection = RIGHT;
      }else {
        this.velocity.x = 0;
        this.isRunning = false;
      }
    }else if(this.runningSpriteIndex === 1) {
      if(this.x - (player.x + player.width / 2) >= 5) {
        this.velocity.x = -this.speed;
        this.isRunning = true;
        this.isIdle = false;
        this.movingDirection = LEFT;
      }else {
        this.velocity.x = 0;
        this.isRunning = false;
      }
    }
  }

  
}

Enemy.prototype.applyPersona = function() {
  
  if(this.level === 2) {
    if(this.health <= 30) {
      if(!this.hasPoweredup) {
          var clip = AUDIOS.ORKGROAN.cloneNode();
          clip.play();
        
        this.y = C_HEIGHT;
        game.timer();
        this.hasPoweredup = true;
      }

    }
  }else if(this.level === 3) {


    function flyAttack(){

      AUDIOS.DANGER.play();
      for(let i = 1; i <= 20; i++) {
        let tempEnemyThrowable = new Throwable(randomNumbers(15, 685), 0,SPRITES.BOMBS, 0, randomNumbers(4, 8), DOWN, 20);
        game.enemyThrowables.push(tempEnemyThrowable);

      }
    
    }

    level3EnemyPersona = setInterval(flyAttack.bind(this), 8000);

  }else if(this.level === 4) {

    function generateThorns() {  
      AUDIOS.EARTHCRACKING.play();
      for(let i = 0; i < 15; i++) {

        game.thornHolder.push(new Thorn());
        
      }
      setTimeout(function() {
        game.thornHolder = [];
      }, 4000)

    }

    level4EnemyPersona = setInterval(generateThorns.bind(this), 8000);

  
  }else if(this.level === 5) {

    function bossPersona() {
      AUDIOS.BOSSDISSAPEAR.play();
      this.isDisappearing = true;
      this.isRunning = false;
      this.isDead = false;
      this.isIdle = false;
      this.isAttacking = false;  
      this.velocity.x = 0;
      for(let i = 1; i <= 20; i++) {
        let tempEnemyThrowable = new Throwable(randomNumbers(15, 685), C_HEIGHT - 60, SPRITES.BOSS_THROWABLE, 0, -randomNumbers(4, 8), UP, 40);
        game.enemyThrowables.push(tempEnemyThrowable);
  
      }
      
      setTimeout(() => {
        AUDIOS.BOSSREAPPEAR.play();
        this.x = game.player.x;
        this.isDisappearing = false;
        
      }, 2000);
    }

    level5EnemyPersona = setInterval(bossPersona.bind(this), 5000);
  }
}

Enemy.prototype.animatePowerup = function() {
    this.images = [SPRITES.ORK2ICON ,  SPRITES.ORK2IDLE, SPRITES.ORK2RUNNING, SPRITES.ORK2ATTACKING,  SPRITES.ORK2DYING ];
    game.ctx.drawImage( SPRITES.AURA, game.auraSpriteIndex * 128, 0, 128, 129, this.x - 77, C_HEIGHT - 129 - 60, 250, 200);
    game.ctx.closePath();
}