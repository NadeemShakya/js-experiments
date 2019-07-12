// setting the canvas width and height variable.
const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 600;

const ROAD_HEIGHT = 100;

class Game {
  constructor(element) {
    // configure the game canvas.
    this.canvas = element;
    this.ctx = element.getContext("2d");
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.width = CANVAS_WIDTH;

    this.PIPE_GENERATION_RATE = 1200;            // every 1 secs, generates two pipes up and down.
    this.score = 0;  // holds the current user's score.
    this.highestScore = localStorage.getItem(`flappyHighScore${this.canvas.id}`) ?      // holds the highest user score from localStorage.
    localStorage.getItem(`flappyHighScore${this.canvas.id}`) : 0;

    // loading images for the game.

    this.backgroundIMG = new Image();     // loads the background image.
    this.backgroundIMG.src = 'nightBackground.png';

    this.flappyBirdIMG = new Image();    // loads the game logo.
    this.flappyBirdIMG.src = "flappyBird.png";

    this.taptoPlayIMG = new Image();    // start screen image.
    this.taptoPlayIMG.src = "taptoPlay.png";

    this.gameoverIMG = new Image();     // loads gameover image.
    this.gameoverIMG.src = "gameover.png";

    this.roadIMG = new Image();         // loads the road image.
    this.roadIMG.src = 'road.png';

    this.birdImg = new Image();         // load the bird's sprite image.
    this.birdImg.src = "flappy-sprite-sheet.png";

    this.pipeHole = new Image();        // load the pipe's upper hole image.
    this.pipeHole.src = "pipe-hole.png";

    this.pipePole = new Image();
    this.pipePole.src = "pipe-pole.png";   // load the pipe's pole image.

    this.pipes = [];           // holds all pipes.
    this.backgroundX = 0;   // initialize background starting position.
    this.isGameStarted = false;  //bool to check if the game is started or not.
    this.isBirdAlive = true;     // bool to check if the bird is alive or not.

    this.init();
    this.moveRoad();

    this.bird = new Bird(this.canvas.height,this.ctx, this.birdImg); // create the bird here.
  }

  // initialize event listeners and intervals
  init() {
    // generate pipes at certain intervals.
    setInterval(() => {

      // only if game is started, make pipes.
      if(this.isGameStarted) {

        this.pipes.push(new Pipe(this.canvas.width, this.canvas.height, this.ctx, this.bird, this.pipeHole, this.pipePole));
      }
    }, this.PIPE_GENERATION_RATE)


    document.addEventListener("keydown",  (e) => {

      // if game is not started and space is hit, start the game.
      if(e.keyCode == 32 && !this.isGameStarted) {

        this.isGameStarted = true; 
      }
      // if bird is alive and space is hit, move move up
      if(e.keyCode == 32 && this.isBirdAlive) {

        this.bird.goUp();
      }

      // if bird is not alive and "a" key is pressed, restart game
      if(e.keyCode == 82 && !this.isBirdAlive) {
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isBirdAlive = true;
        this.isGameStarted = false;
        this.score = 0;
        this.highestScore = localStorage.getItem(`flappyHighScore${this.canvas.id}`) ? localStorage.getItem(`flappyHighScore${this.canvas.id}`) : 0;
        this.bird = new Bird(this.canvas.height, this.ctx, this.birdImg);
        this.pipes = [];
        this.draw();
      }
    }) 
  }

  // slide the background road image.
  moveRoad() {  
    this.backgroundX++;
    if(this.backgroundX >= this.canvas.width) {
      this.backgroundX = 0;
    }
  }

  // draw on canvas.
  draw() {

    // define the animation.
    this.animationFrame = requestAnimationFrame(() => this.draw());

    // drawing canvas.
    this.ctx.beginPath();
    this.ctx.drawImage(this.backgroundIMG, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.roadIMG, this.backgroundX, 0, this.canvas.width, this.canvas.height, 0, this.canvas.height - ROAD_HEIGHT, this.canvas.width, this.canvas.height);
    this.ctx.closePath();

    // to display the current score.
    this.ctx.beginPath();
    this.ctx.font = "bolder 60px Verdana";

    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText(`${this.score}`, this.canvas.width / 2.3 , this.canvas.height / 4.5);

    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 3;
    this.ctx.strokeText(`${this.score}`, this.canvas.width / 2.3 , this.canvas.height / 4.5);

    // to display the highest score on canvas
    this.ctx.font = "bold 16px Verdana";
    this.ctx.fillStyle = "#4a273a";
    this.ctx.fillText(`HIGH SCORE: ${this.highestScore}`, 10, 25);
    this.ctx.closePath();

    // show flappy bird game icon if game not started.
    if(!this.isGameStarted) {

      this.ctx.drawImage(this.flappyBirdIMG, this.canvas.width / 4.8, this.canvas.height / 4);
      this.ctx.drawImage(this.taptoPlayIMG, this.canvas.width / 4.8, this.canvas.height / 4);

    }        

    // move background road untill bird is alive.
    if(this.isBirdAlive) {

      this.moveRoad();
    }

    // update bool if bird hits the ground.
    if(this.bird.hasHittingGround()) {

      this.isBirdAlive  = false;
      cancelAnimationFrame(this.animationFrame); // stop the animation.
    }

    // move and draw the pipes on canvas.
    for(let i = this.pipes.length -1; i >= 0; i--) {

      this.pipes[i].render(); // show the pipe on the screen.

      // if bird is alive, then move the pipes
      if(this.isBirdAlive) {
        this.pipes[i].update();
      }

      // if bird hits the pipe
      if(this.pipes[i].isHittingBird()) {

        // update the highest score if new score is achieved
        if(this.score > this.highestScore) {
        localStorage.setItem(`flappyHighScore${this.canvas.id}`, this.score);
        }
        this.isBirdAlive = false;
        this.bird.die();
      }

      // remove pipe if out the canvas and increase score.
      if(this.pipes[i].isOffTheScreen()) {
        this.score++;
        this.pipes.splice(i, 1);
      }

    }

    // draw bird on canvas
    this.bird.draw();

    // if game is started, then move bird
    if(this.isGameStarted) {
      this.bird.update();
    }

    // show the gameover screen if bird dies.
    if(!this.isBirdAlive) {

      this.ctx.beginPath();
      this.ctx.font = "bold 27px Verdana";
      this.ctx.fillStyle = "#fca048";
      this.ctx.fillText(`Press "R" to Restart.`, 25, this.canvas.height / 3)
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 1;
      this.ctx.strokeText(`Press "R" to Restart.`, 25, this.canvas.height / 3);
      this.ctx.drawImage(this.gameoverIMG, this.canvas.width / 4.8, this.canvas.height / 4);
      this.ctx.closePath();

    }
}     
}
