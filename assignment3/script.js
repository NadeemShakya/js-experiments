// function to generate randomNumbers.
let randomNumbers = (max, min) => Math.floor(Math.random() * (max - min)) + min;

// define all required variables
const WIDTH = 300;
const HEIGHT = 600;
const TOTALLANES = 3;       // total number of lanes.
const ammoActivator = 0     // threshold to activate ammo.
const POWERUP_SPAWN_RATE = 8000;
// player's car image.
const PLAYER_IMAGE = new Image(); 
PLAYER_IMAGE.src = "./playercar.png";

// obstacle's car image.
const OBSTACLE_IMAGE = new Image();
OBSTACLE_IMAGE.src = "./obstaclecar.png";

// ammo's image.
const AMMO_IMAGE = new Image();
AMMO_IMAGE.src = "./ammo.png";

let obstaclesCount = 2;     // count of obstacles generated at once.
let cars = [];              // array to hold cars.
let carsGenerateRate = 1000;    // cars generation rate, below 600 is unplayable.
let score = 0;              // holds current user score.
let bullets = [];           // array to hold every bullet.
let powerups = [];
let totalBulletsCount = 20; // total ammo for the player.
let backgroundSpeed = 4;     // speed for the player car.
let laneWidth = WIDTH / TOTALLANES; // width of each lane.

let isGameStarted = false;   // is game started or not?
let isGameOver = false;     // is game over? 

// initialize canvas.
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;

// create the player's car.
cars.push(new Car(true));

// provide powerups at specific intervals.
setInterval(() => {

  if(isGameStarted && totalBulletsCount <= 5) {
    powerups.push(new Powerups());
}
}, POWERUP_SPAWN_RATE)

// if game is started, then push obstacles randomly.
setInterval(function() {

  if(isGameStarted && !isGameOver) {

    let tempCar = new Car(false);
    cars.push(tempCar);
  }
}, carsGenerateRate);


// make changes to the gameplay depending on the current score.
let makeDifficultyChanges = () => {

  // speed up game play
  if(score >= 15 && score <= 25) {

    carsGenerateRate = 900;
    backgroundSpeed = 4.5;

  }else if(score >= 26 && score <=35) {

    carsGenerateRate = 700;
    backgroundSpeed = 5;        

  }else if(score >= 36 && score <=49) {

    carsGenerateRate = 650;
    backgroundSpeed = 5.5;        

  }else if(score > 50) {

    carsGenerateRate = 600; 
    backgroundSpeed = 6;
  }

}

// event handler for the action buttons.
document.onkeydown = e => {

  // if left arrow is pressed, 
  // move the player's car to left.
  if(e.keyCode == 37) {

    if(cars[0].currentLane != 1) {

      cars[0].currentLane -= 1; 
    }
  }else if(e.keyCode == 39) {
    // if right arrow is pressed, 
    // move the player's card to right.

    if(cars[0].currentLane != 3) {
      cars[0].currentLane += 1;   
    }

  }else if(e.keyCode  == 13) {

    // start the game when is entered is pressed.
    isGameStarted = true;

  }else if(e.keyCode == 32) {

    // fire the bullets if space is pressed
    if(totalBulletsCount > 0) {

      bullets.push(new Bullet(cars[0]));
      totalBulletsCount--;
      if(totalBulletsCount < 0) {

        totalBulletsCount = 0;
      }
    }
  }else if(e.keyCode == 82 && isGameOver) {

    cars = [];
    powerups = [];
    bullets = [];
    score = 0;
    totalBulletsCount = 20;
    cars.push(new Car(true));
    isGameOver = false;
    isGameStarted = true;
    drawCanvas();

  }
}

// update the highest score in localstorage.
let updateScore = () => {
  if(score > localStorage.getItem('highScore')) {

    localStorage.setItem("highScore", score);
  }
}

// animator function 
let drawCanvas = () => {

  // request draw function for animation infinitely.
  var animationFrame = requestAnimationFrame(drawCanvas);

  // initial start screen of the game.
  if(!isGameStarted) {
    // reset canvas
    ctx.beginPath();
    ctx.fillStyle = "#028b75";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fill();
    ctx.closePath();
    // start screen text.
    ctx.beginPath();
    ctx.fillStyle = "pink";
    ctx.font = "35px Verdana";
    ctx.fillText("CAR GAME", WIDTH / 5.5, HEIGHT / 4);
    ctx.fillStyle = "#ffffff";
    ctx.font = "15px Verdana";
    ctx.fillText("Press Enter to Play", WIDTH / 4, HEIGHT / 3);
    ctx.font = "18px Verdana";
    ctx.fillText("INSRUCTIONS:", WIDTH / 8.5, HEIGHT / 2.2)
    ctx.font = "14px Verdana";
    ctx.fillText("* SPACE FOR AMMO.", WIDTH / 8.5, HEIGHT / 1.8)
    ctx.fillText("* LEFT ARROW KEY FOR LEFT.", WIDTH / 8.5, HEIGHT / 1.6)
    ctx.fillText("* RIGHT ARROW KEY FOR RIGHT.", WIDTH / 8.5, HEIGHT / 1.4)
    ctx.fill();
    ctx.closePath();

  }else if(isGameOver) { // screen to show after gameover.

    // reset canvas.
    ctx.beginPath();
    ctx.fillStyle = "#02b875";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fill();
    ctx.closePath();
    // end of game screen text.
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "30px Verdana";
    ctx.fillText("BOOM!", WIDTH / 3, HEIGHT / 4);
    ctx.font = "20px Verdana";
    ctx.fillText("YOU CRASHED!", WIDTH / 4, HEIGHT / 3);

    // show high score.
    ctx.fillStyle = "white";
    ctx.font = "15px Verdana";
    ctx.fillText(`Highest score: ${localStorage.getItem('highScore')}`, WIDTH / 4, HEIGHT / 2);
    ctx.fillText(`Current score: ${score}`, WIDTH / 4, HEIGHT / 1.8);
    ctx.fillStyle = "#02b875";
    ctx.font = "12px Verdana";

    //get high score from localStorage to be displayed in the gameover screen.
    if(score >= localStorage.getItem('highScore')) {

      //congratulations screen if new high score set.
      ctx.fillText("Congrats! New High Score!!", WIDTH / 5, HEIGHT / 1.6);
    }

    // instructions to replay the game.
    ctx.fillStyle = "#f5f5f5";
    ctx.fillText(`Press "R" to play again.`, WIDTH / 4, HEIGHT / 1.2);
    ctx.fill();
    ctx.closePath();    

    // stop the on-going animation.
    cancelAnimationFrame(animationFrame);

  }else if(isGameStarted && !isGameOver){

    // game play screen here.
    // reset the canvas.
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fill();
    ctx.closePath();

    // creating the lane divider.
    for(let i = 1; i <= TOTALLANES - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(WIDTH / 3 * i, 0);
      ctx.lineTo(WIDTH / 3 * i, HEIGHT);
      ctx.setLineDash([10, 50]); /*dashes are 15px and spaces are 25px*/
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";  
      ctx.stroke();
      ctx.closePath();      
    }
    ctx.lineDashOffset -= backgroundSpeed;    

    // make changes to the gameplay.
    makeDifficultyChanges();

    for(let i = cars.length - 1; i >= 0; i--) {

      // update and draw the cars.
      cars[i].updatePosition();
      cars[i].draw();

      if(i != 0) {

        // modify speed of the game as per difficulty
        cars[i].updateSpeed();

        // check if the player car has successfully passed the obstacle car.
        if(cars[i].isPassed(cars[0])) {
          // remove the corresponding obstacle car from the game context.
          cars.splice(i, 1);   
          // increase the user's by one.
          score++;

        }else if(cars[i].isColliding(cars[0])) { // if the car has not successfully passed,
                                                // then check for the collision.

          // if collision occured, update userscore in localStorage before ExtensionScriptApis.                                                 
          updateScore();
          // set isGameOver to true.
          isGameOver = true;

          // isGameStarted = false;r
        }    
      }   
    }


    for(let i = bullets.length - 1; i >= 0; i--) {

      //update and render the bullets.
      bullets[i].move();                
      bullets[i].render();    

      // check if any bullet hits all other obstacle cars.
      if(bullets[i].isHitting(cars)) {

        // remove obstacle cars hit by bullet.
        bullets.splice(i, 1);

        // increase score
        score++;

      }
      else if(bullets[i].isNotInPowerRange()) {
        // if bullets are par their power, then remove them
        bullets.splice(i, 1);
      }
    }

    for(let i = powerups.length - 1; i >= 0; i--) {
      powerups[i].update();
      powerups[i].render();
      if(powerups[i].isPickedBy(cars[0])) {
        totalBulletsCount += powerups[i].capacity;
        powerups.splice(i, 1);
      }

    }

    // display info about user score and ammo.
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.font = "12px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Bullets: ${totalBulletsCount}`, 230, 20);
    ctx.fillText(`Spawn Rate: ${carsGenerateRate / 1000} secs`, 100, 20);
  }
}

// call the animator function.
drawCanvas();

