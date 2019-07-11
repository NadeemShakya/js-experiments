class Car {
  constructor(isPlayer) {
    this.x;
    this.y;
    this.width = 30;
    this.height = 35;
    this.isPlayer = isPlayer;
    this.speed = 3;
    this.health;
    this.currentLane;
    this.offSet = 0;
    this.imageOffSet = -25;
      
    // if obstacle car.
    if(!this.isPlayer) {
        this.y = 0;
        this.offSet = - this.height;
        this.currentLane = randomNumbers(1, TOTALLANES + 1);
    }
    // if player car.
    if(this.isPlayer) {
        this.y = HEIGHT;
        this.currentLane = 2;
    }
  }

  // to check if any obstacle car is colliding with the player car.
  isColliding(that) {
    if(this.currentLane == that.currentLane && this.y + this.height>= HEIGHT - 20) {
      
      return true;
    }
      return false;
  }

  // to check if the player car has successfully passed the obstacle car.
  isPassed(that) {
    if(this.currentLane != that.currentLane && this.y + this.offSet>= HEIGHT) {
        
      return true;
    }
      return false;  
  }

  // to draw the cars in canvas.
  draw() {
    
    // draw correspondingly for the obstacle car.
    if(!this.isPlayer) {

      ctx.save();
      ctx.beginPath();
      ctx.drawImage(OBSTACLE_IMAGE, ((laneWidth - this.width) / 2 ) + laneWidth * (this.currentLane - 1), this.y + this.offSet);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }else if(this.isPlayer) {

    // draw correspondingly for the player car.
      ctx.save();
      ctx.beginPath();
      ctx.drawImage(PLAYER_IMAGE, ((laneWidth - this.width) / 2 ) + laneWidth * (this.currentLane - 1), this.y - this.height - 20);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
  }

  // update the obstacle car's y position.
  updatePosition() {
    if(!this.isPlayer) {
      this.y += this.speed;
    }
  }

  // update the car's speed to advance gameplay.
  updateSpeed() {
    if(score >= 15 && score <= 25) {
      this.speed = 3.5;
    }else if(score >= 26 && score <=35) {
      this.speed = 4;
    }else if(score >= 36 && score <=49) {
      this.speed = 4.5;
    }else if(score > 50) {
      this.speed = 5;
    }
  }
}
