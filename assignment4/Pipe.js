// set the pipe variables.
const PIPE_WIDTH = 70;
const PIPE_SPEED = -4;
const PIPE_COLLISION_OFFSET = 5;
const PIPEHOLE_HEIGHT = 11;
const PIPEPOLE_LEFT_OFFSET = 3;
const PIPEPOLE_WIDTH = 64;

// function to get random numbers.
let getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

class Pipe {
  constructor(WIDTH, HEIGHT, ctx, bird, pipeHole, pipePole) {
    this.ctx = ctx;

    // setting the co-ordinates
    this.x = WIDTH;
    this.HEIGHT = HEIGHT;

    // pipe width;
    this.width = PIPE_WIDTH;
    this.topOffset = this.bottomOffset = 50; // pipe's offset from top and bottom.
    this.pipeGap = 150; // gap between the pipes.

    // get a random top co-ordinate for top pipe.
    this.topEndPoint = getRandomArbitrary(this.topOffset, HEIGHT / 2);

    // set the moving speed of the pipe.
    this.speed = PIPE_SPEED;

    // setting the pipe images.
    this.pipeHole = pipeHole;
    this.pipePole = pipePole;

    // setting the bird object.
    this.bird = bird;
  }

  // draw the pipe on canvas
  render() {
    this.ctx.beginPath();
    // draw the top pipe.
    this.ctx.drawImage(this.pipeHole,this.x, this.topEndPoint - PIPEHOLE_HEIGHT, this.width, PIPEHOLE_HEIGHT);
    this.ctx.drawImage(this.pipePole,this.x + PIPEPOLE_LEFT_OFFSET, 0, PIPEPOLE_WIDTH,  this.topEndPoint - PIPEHOLE_HEIGHT);

    // draw the bottom pipe
    this.ctx.drawImage(this.pipeHole,this.x, this.topEndPoint + this.pipeGap,this.width,  PIPEHOLE_HEIGHT);
    this.ctx.drawImage(this.pipePole,this.x + PIPEPOLE_LEFT_OFFSET, this.topEndPoint + this.pipeGap + PIPEHOLE_HEIGHT, PIPEPOLE_WIDTH, this.HEIGHT - (this.topEndPoint + this.pipeGap + 10) - ROAD_HEIGHT);
    this.ctx.closePath();
  }

  // move the pipes.
  update() {
    this.x += this.speed;
  }

  // check if any pipe is off the canvas.
  isOffTheScreen() {
  if(this.x + this.width <= 0) {
    return true;
  }
    return false;
  }

  // check if bird hits the pipe.
  isHittingBird() {

    if(this.bird.y <= this.topEndPoint - PIPE_COLLISION_OFFSET|| this.bird.y + this.bird.size >= this.topEndPoint + this.pipeGap + PIPE_COLLISION_OFFSET) {

      if(this.bird.x + this.bird.size > this.x + PIPE_COLLISION_OFFSET &&  this.bird.x < this.x + this.width) {
        return true;
      }
    } 
  }
}