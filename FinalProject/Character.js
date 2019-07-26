let currentIndex = 0;
let player_clippingX =  player_clippingY = 0;
let enemy_clippingX = enemy_clippingY = 0;

const FRAMECOUNT = 10;

const FRAMECOLS = 1;
const FRAMEROWS = 10;

const SPRITEWIDTH = 131;
const SPRITEHEIGHT = 1400;

const FRAMEWIDTH = SPRITEWIDTH / FRAMECOLS;
const FRAMEHEIGHT = SPRITEHEIGHT / FRAMEROWS;

class Character {
    constructor(x, y, width, height, movingDirection, spriteIndex, images, attackPower, movementSpeed, health, level) {
     
      this.height = height;
      this.width = width;
      this.x = x;
      this.y = y ? y : C_HEIGHT - this.height - 60;
      this.movingDirection = movingDirection;
      this.healthCapacity = health ? health : 100;
      this.health = this.healthCapacity;
      this.speed = movementSpeed ? movementSpeed: 5;
      this.gravity = 0.2;
      this.attackPower = attackPower;
      this.jumpingForce = 12;
      this.images = images;
      this.level = level ? level : 1;
      this.hasPoweredup = false;
      this.stamina = 100;
      this.velocity = {
        x: 0,
        y: 0
      }
      this.runningSpriteIndex = spriteIndex;
      this.isRunning = false;
      this.isIdle = true;
      this.isAttacking = false;
      this.isJumping = false;
      this.isDead = false;  
      this.isDisappearing = false;

      this.moveLeft = this.moveLeft.bind(this);
      this.moveRight = this.moveRight.bind(this);
      this.swordAttack = this.swordAttack.bind(this);
      this.slideAttack = this.slideAttack.bind(this);
      this.jump = this.jump.bind(this);
      this.isonPlatform = false;
      this.isonGround = true;
      

    }
}

// pull game.player character by gravity force.
Character.prototype.pullByGravity = function() {
  this.velocity.y += this.gravity;
}

// check if the game.player character is on ground.
Character.prototype.isPlayeronGround = function() {

  if(this.y + this.height >= C_HEIGHT - 60) {
    this.isonGround = true;
    return true;
  }
    this.isonGround = false;
    return false;
}
// move character left.
Character.prototype.moveLeft = function() {
  if(!this.isDead) {
    this.movingDirection = LEFT;
    this.isIdle = false;
    this.isRunning = true;
    this.runningSpriteIndex = 1;

  }

}
// move character right.
Character.prototype.moveRight = function() {
if(!this.isDead) {
  this.movingDirection = RIGHT;
  this.isIdle = false;
  this.isRunning = true;
  this.runningSpriteIndex = 0;  
}
  
}
// character is attacking.
Character.prototype.swordAttack = function() {
  if(!this.isDead) {
    this.isIdle = false;
    this.isRunning = false;
    this.isAttacking = true;  
  }
}
// update if the player is on ground or not.
Character.prototype.updatePlayer = function() {
  if(this.y + this.height >= C_HEIGHT - 60) {
    this.isonGround = true;
  }else {
    this.isonGround = false;
  }
}
Character.prototype.throwAttack = function() {
    if(!this.isDead) {
      if(game.kunaiCount != 0) {
        game.generateKunais();
        var click=AUDIOS.THROW.cloneNode();
        click.play();        
        game.kunaiCount --;
      }
      this.isIdle = false;
      this.isRunning = false;
      this.isSliding = false;
      this.isAttacking = false;
      this.isJumping = false;  
      this.isThrowing = true;   
    }
}
Character.prototype.slideAttack = function() {
  if(!this.isDead) {
    this.isIdle = false;
    this.isRunning = false;
    this.isSliding = true;
    this.isAttacking = false;
    this.isJumping = false;
  }
}
// character is jumping.
Character.prototype.jump = function() {
  if(!this.isDead && game.isGameRunning) {
    
    if(this.isonGround) {
      this.velocity.y -= this.jumpingForce; 
    }
  }
}
// character's health.
Character.prototype.showHealth = function(x, y) {
  game.ctx.beginPath();
  game.ctx.fillStyle= "grey";
  game.ctx.fillRect(x, y, 100, 10);
  if(this.health.map(0, this.healthCapacity, 0, 100) <= 30) {
    game.ctx.fillStyle = "#d91921";
  }else {
    game.ctx.fillStyle = "#02b875";
  }
  game.ctx.fillRect(x, y, this.health.map(0, this.healthCapacity, 0, 100), 10);
  game.ctx.closePath();
  game.ctx.drawImage(game.player.images[0], 10, 10, 30, 30);
  if(game.enemy) {
    game.ctx.drawImage(game.enemy.images[0], C_WIDTH - 40, 10, 30, 30);
  }
}
// is character dead?
Character.prototype.isPlayerDead = function() {
  if(this.health == 0) {
    return true;
  }
}
// reset boolean variables if the game.player is dead.
Character.prototype.resetBooleansifDead = function() {
  this.isDead = true;
  this.isAttacking = false;
  this.isIdle = false;
  this.isJumping = false;
  this.isRunning = false;
}
