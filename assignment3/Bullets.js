class Bullet {
  constructor(playerCar) {
    this.x = ((laneWidth - playerCar.width) / 2 ) + laneWidth * (playerCar.currentLane - 1) ;
    this.y = HEIGHT - playerCar.height ;
    this.radius = 8;
    this.power = 100;
    this.currentLane = playerCar.currentLane;
    this.base = playerCar.width;
    this.velocity = {
        x: 0,
        y: -6,
    }
  }

  // to display the bullet
  render() {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(this.x + ((this.base / 2) - this.radius / 2), this.y, this.radius, this.radius);
    ctx.fill();
    ctx.restore();     
  }

  // to move the bullet.
  move() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  // to check if the bullet hits any obstacle car.
  isHitting(cars) {
    for(let i = 1; i < cars.length; i++) {

      if(cars[i].y + cars[i].height +cars[i].offSet >= this.y && this.currentLane == cars[i].currentLane) {

        cars.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  // to check if the bullet is within power range.
  isNotInPowerRange() {
    if(this.y <= this.power) {
      return true;
    }
      return false;
  }
}