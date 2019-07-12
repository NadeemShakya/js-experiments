
const BIRD_START_X = 50;
const BIRD_SIZE = 40;
const BIRD_WING_FLAP_RATE = 200; // (200ms)

class Bird {
  constructor(HEIGHT, ctx, birdImg) {
    // setting initial co-ordinates of bird
    this.x = BIRD_START_X; 
    this.y = HEIGHT / 2;

    // setting canvas dimension
    this.ctx = ctx;
    this.HEIGHT = HEIGHT;

    // setting size of bird.
    this.size = BIRD_SIZE;
    this.velocity = 0; // bird velocity.
    this.gravity = .4; // game's gravity.
    this.upLiftForce = -7; // bird's uplift wing force.
    this.deadFallRate = 6; // fall rate of the bird.

    this.birdImg = birdImg; // setting bird image.
    this.i = 0;             // setting initial sprite clipping index.

    // changing sprite's index.
    setInterval(() => {
      this.i += 1
      this.i %= 8;
    }, BIRD_WING_FLAP_RATE);

  }

  // draw the bird on canvas
  draw() {

    this.ctx.beginPath();
    this.ctx.drawImage(this.birdImg, 0, 194.625 * this.i, 200, 194.625, this.x, this.y, this.size, this.size);
    this.ctx.fill();
    this.ctx.closePath();
  }

  //  update the bird's position.
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity; 
  }

  // check if the bird hits the ground.
  isHittingGround() {
    if(this.y + this.size >= this.HEIGHT - 90) {
      return true;
    }
  }

  // move the bird up.
  goUp() {
    this.velocity = this.upLiftForce;
  }

  // if bird dies, bird comes to ground.
  die() {
    this.y += this.deadFallRate;
  }
}   