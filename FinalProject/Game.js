// initializing constants.
const C_WIDTH = 700;
const C_HEIGHT = 450;
const PLAYER_HEIGHT = 105;
const PLAYER_WIDTH = 80;
const LEFT = 0, RIGHT = 1, UP = 2, DOWN = 3;
const AUDIOS = {};
const SPRITES = {};
const PICKABLEKUNAICOUNT = 2;
const TOTALLEVELS = 5;
// manipulating canvas.
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

// making the loading screen.
let assetsStillLoading = 0;
let assetsLoader;
let numAssets;
let loadedPercent;

let game, scene, animatingCharacters;

let randomNumbers = (max, min) => Math.floor(Math.random() * (max - min)) + min;

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

let playGameButton = document.getElementById("playGameID") ;
let okiGotItButton = document.getElementById("gameInstructionID");
let levelCompletedButton = document.getElementById("levelCompletedID");
let playAgainButton = document.getElementById("playAgainID");
let chooseCharacterButton = document.getElementById("chooseCharacterID");
let maleCharacter = document.getElementById("maleCharacterID");
let femaleCharacter = document.getElementById("femaleCharacterID");
let viewEnemiesButton = document.getElementById("viewEnemiesID");
let okButton = document.getElementById("okID");
let characterImage;

class Game {
    constructor(element) {
        this.canvas = element;
        this.ctx = element.getContext("2d");
        this.canvas.width = C_WIDTH;
        this.canvas.height = C_HEIGHT;
        this.auraSpriteIndex = 0;
        this.auraCount = 7;
        this.healthPotions = [];
        this.healthPotionsCollected = 0;
        this.staminaPotions = [];
        this.staminaPotionsCollected = 0;
        this.currentGameLevel;
        this.character = "male";
        // for platforming.
        this.platform = [];
        this.pickableKunais = [];
        this.platform.push(
            {
                x: 130,
                y: 226,
                w: 153,
                h: 12,
                level:1
        
            },
            {
                x: 450,
                y: 245,
                w: 75,
                h: 12,
                level:1
            },
            {
                x: 160,
                y: 275,
                w: 173,
                h: 12,
                level: 2
            },
            {
                x: 470,
                y: 140,
                w: 128,
                h: 12,
                level: 2
            },
           
            {
                x: 160,
                y: 275,
                w: 173,
                h: 12,
                level:3
            },
            {
                x: 470,
                y: 140,
                w: 128,
                h: 12,
                level:3
            },
            {
                x: 33,
                y: 197,
                w: 85,
                h: 20,
                level:4
            },
            {
                x: 530,
                y: 208,
                w: 140,
                h: 20,
                level:4
            },            
            {
                x: 85,
                y: 162,
                w: 230, 
                h: 25,
                level: 5
             },
             {
                 x: 430,
                 y: 238,
                 w: 230,
                 h: 25,
                 level: 5
             }
        )
        
        // initializing necessary game variables.
        this.isPoweringUp = false;
        this.timeTracker = 0;
        this.scrollSlot = [true, true, true, true, true];        
        this.scrollCount = 0;
        this.ninjaBoyAttackPower = 0.5;
        this.enemySpeed = 2.7;
        this.isGameRunning = false;
        this.scrollHolder = [];
        this.playerImages = [SPRITES.NINJABOYICON, SPRITES.NINJABOYIDLE, SPRITES.NINJABOYRUNNING, SPRITES.NINJABOYATTACKING, SPRITES.NINJABOYJUMPING, SPRITES.NINJABOYDEAD, SPRITES.NINJABOYSLIDING, SPRITES.NINJABOYTHROWING];
        this.enemyImages = [SPRITES.BANDITICON, SPRITES.BANDITIDLE, SPRITES.BANDITRUNNING, SPRITES.BANDITATTACKING, SPRITES.BANDITDYING];
        this.isNext = false;
        this.kunaiCount = 25;
        this.kunais= [];
        this.enemyThrowables = [];
        this.thornHolder = [];
        this.enemyThrowableInterval;
        this.player;
        this.enemy;

        // function calls.
        this.generatePlayer();
        this.enemyThrowsObjects();
        this.placePickableKunais();
    }
}

// Game Timer Function.
Game.prototype.timer = function() {
    console.log("timer");
    let timerTracker = setInterval(() => {
        this.isPoweringUp = true;
        this.timeTracker++;
        if(scene.currentLevel.enemyLevel === 2) {
            
            this.enemy.speed = 3;
            this.enemy.attackPower = 0.3;
            this.enemy.width = 130;
            this.enemy.height = 140;
            this.enemy.y -= 7;
        }
        if(this.timeTracker == 30) {

            clearInterval(timerTracker);
            this.timeTracker = 0;
            if(this.enemy.level === 3) {
                this.enemy.y = C_HEIGHT - this.enemy.height - 60;
            }
            this.isPoweringUp = false;

        }
    }, 30);    
}

Game.prototype.generateKunais = function() {
    let newKunai = new Throwable(this.player.x, this.player.y + this.player.height / 2.5, SPRITES.KUNAI_IMG);
    newKunai.init(this.player);
    game.kunais.push(newKunai);
}

Game.prototype.showScrollCount = function() {
    this.ctx.beginPath();
    this.ctx.drawImage(SPRITES.SCROLL, C_WIDTH / 2.1, C_HEIGHT - 25, 20, 25);
    this.ctx.fillText(`${this.scrollCount}`, C_WIDTH / 2.1 + 30, C_HEIGHT - 10);

    this.ctx.closePath();
}

Game.prototype.showKunaiCount = function() {
    this.ctx.beginPath();
    this.ctx.drawImage(SPRITES.KUNAI_ICON, C_WIDTH / 1.84, C_HEIGHT - 28, 20, 25);
    this.ctx.fillText(`${this.kunaiCount}`, C_WIDTH / 1.84 + 30, C_HEIGHT - 10);
    this.ctx.closePath();
}


Game.prototype.generateEnemies = function(enemyHealth, enemyImages, enemyAttackPower, enemyLevel) {
    
    this.enemy = new Enemy(100, null, 110, 120, enemyImages, enemyAttackPower, this.enemySpeed, enemyHealth, enemyLevel)
}

Game.prototype.generatePlayer = function() {
    this.player = new Player(C_WIDTH / 2 - PLAYER_WIDTH, C_HEIGHT  - PLAYER_HEIGHT,
        PLAYER_WIDTH, PLAYER_HEIGHT, RIGHT, 0, this.playerImages, this.ninjaBoyAttackPower, 10);            
}

Game.prototype.repositionPlayer = function() {
    this.player.x = C_WIDTH / 2 - PLAYER_WIDTH;
    this.player.y = C_HEIGHT  - PLAYER_HEIGHT;
}

Game.prototype.enemyThrowsObjects = function() {

    if(this.enemy) {
        if(scene.currentLevel.enemyLevel === 2) {
            
            this.enemyThrowableInterval = setInterval(() => {
                console.log("enemyThrowableInterval");
                if(!this.isPoweringUp) {
                    let tempEnemyThrowable = new Throwable(this.enemy.x, this.enemy.y + this.enemy.height / 2.5, SPRITES.ORK_THROWABLE, null, null, null, 50);
                    tempEnemyThrowable.init(this.enemy);
                    this.enemyThrowables.push(tempEnemyThrowable);
                    var click = AUDIOS.SWING.cloneNode();
                    click.play();
                    AUDIOS.ORKSOUND.play();

                    setTimeout(() => {
                        tempEnemyThrowable = new Throwable(this.enemy.x, this.enemy.y + this.enemy.height / 2.5, SPRITES.ORK_THROWABLE, null, null, null, 50);
                        tempEnemyThrowable.init(this.enemy);
                        this.enemyThrowables.push(tempEnemyThrowable);
                        var click = AUDIOS.SWING.cloneNode();
                        click.play();
                    }, 350)
        
                }

            }, 5000);
        }
    }

}

Game.prototype.placePickableKunais = function() {
    for(let i = 1; i <= TOTALLEVELS; i++) {

        this.pickableKunais[i - 1] = [];
        for(let k = 0; k < this.platform.length; k++) {

            if(this.platform[k].level === i) {
                let gap = this.platform[k].w / PICKABLEKUNAICOUNT;
                for(let j = 0; j < PICKABLEKUNAICOUNT; j++) {

                    this.pickableKunais[i - 1].push(

                        new Kunai(this.platform[k].x + j * gap, this.platform[k].y, RIGHT)
                    )
                }
            }
        }

    }
}


function assetsLoadingLoop(callback) {
    loadedPercent=((numAssets-assetsStillLoading)/numAssets)*100;
    ctx.beginPath();
    ctx.fillStyle='black';
    ctx.fillRect(0,0,C_WIDTH,C_HEIGHT);
    ctx.textAlign="center";
    ctx.fillStyle='#f6b602';
    ctx.fillText('Loading.....',C_WIDTH/2,C_HEIGHT/2);
    ctx.fillStyle='#f6b602';
    ctx.font="50px Jokerman";
    ctx.fillText(`${parseInt(loadedPercent)}%`,C_WIDTH/2,C_HEIGHT/2+80);
    ctx.beginPath();    
    if(assetsStillLoading == 0){
        callback();
        window.cancelAnimationFrame(assetsLoader);
    }else{
        assetsLoader = window.requestAnimationFrame(assetsLoadingLoop.bind(this, callback));
    }
}

function loadAssets(callback) {     
    
    //once this function finishes to load all assets this callback function gets activated

    function loadSprite(fileName) {
      assetsStillLoading++;
  
      let spriteImage = new Image();
      spriteImage.src = fileName;
  
      spriteImage.onload = function() {
        assetsStillLoading--;
      }

      spriteImage.onerror = function() {
          assetsStillLoading--;
      }
      
  
      return spriteImage;
    }

    function loadAudio(fileName){
        assetsStillLoading++;

        let audio = new Audio(fileName);
        audio.oncanplaythrough = function(){
            assetsStillLoading--;
            
            
        };
        return audio;
    }
  
    // loading audios.
    AUDIOS.BACKGROUND = loadAudio('./sounds/backgroundMusic.ogg'); 
    AUDIOS.SWING = loadAudio('./sounds/swing.mp3'); 
    AUDIOS.THROW = loadAudio("./sounds/throw.mp3"); 
    AUDIOS.SCROLLGRAB = loadAudio("./sounds/scrollGrab.mp3");
    AUDIOS.POTIONGRAB = loadAudio("./sounds/potionGrab.mp3");
    AUDIOS.DRINKPOTION = loadAudio("./sounds/drinkPotion.mp3");
    AUDIOS.GROAN = loadAudio("./sounds/groan.ogg");
    AUDIOS.ORKGROAN = loadAudio("./sounds/orkEvolve.wav");
    AUDIOS.ORKSOUND = loadAudio("./sounds/orkSound.wav");
    AUDIOS.DANGER = loadAudio("./sounds/danger.ogg");
    AUDIOS.EARTHCRACKING = loadAudio("./sounds/earthCracking.wav");
    AUDIOS.BOSSDISSAPEAR = loadAudio("./sounds/disappear.wav");
    AUDIOS.BOSSREAPPEAR = loadAudio("./sounds/reappear.wav");
    AUDIOS.PICKUPKUNAI = loadAudio("./sounds/pickupKunai.ogg");
    AUDIOS.NINJABOYDYING = loadAudio("./sounds/ninjaBoyDeath.wav");
    AUDIOS.NINJAGIRLSWINGING = loadAudio("./sounds/ninjaGirlSwinging.mp3");
    AUDIOS.NINJAGIRLDYING = loadAudio("./sounds/ninjaGirlDying.mp3");

    // loading sprite images.
    SPRITES.STARTSCREEN = loadSprite("./images/background/StartScreen.png");
    SPRITES.CONTROLSCREEN = loadSprite("./images/background/controlScreen.png");
    SPRITES.GAMEOVERSCREEN = loadSprite("./images/background/gameoverScreen.png");
    SPRITES.CHOOSECHARACTER = loadSprite("./images/background/chooseCharacter.png");
    SPRITES.GAMECOMPLETED = loadSprite("./images/background/gameCompleted.png");
    SPRITES.VIEWENEMIES = loadSprite("./images/background/enemyPower.png");
    SPRITES.LEVELCOMPLETED = loadSprite("./images/background/levelCompleted1.png");
    SPRITES.BOSS_BACKGROUND = loadSprite("./images/background/bossBackgrounds.png");
    SPRITES.HEALTH_POTION = loadSprite("./images/gameplay/healthPotion.png");
    SPRITES.STAMINA_POTION = loadSprite("./images/gameplay/staminaPotion.png");
    
    // defining the background images
    SPRITES.BACKGROUND_1 = loadSprite("./images/background/platBackground-CH1.png");
    SPRITES.BACKGROUND_2 = loadSprite("./images/background/background-CH2.png");
    SPRITES.BACKGROUND_3 = loadSprite("./images/background/platBackground-CH3.png");
    SPRITES.BACKGROUND_4 = loadSprite("./images/background/background-CH4.png");
    SPRITES.BACKGROUND_4 = loadSprite("./images/background/background-CH5.png");

    // defining boy character image sprites.
    SPRITES.NINJABOYICON = loadSprite("./images/player/ninjaBoyIcon.png");
    SPRITES.NINJABOYRUNNING = loadSprite("./images/player/ninjaBoyMove.png");
    SPRITES.NINJABOYIDLE = loadSprite("./images/player/ninjaBoyIdle.png");
    SPRITES.NINJABOYATTACKING = loadSprite("./images/player/ninjaBoyAttack.png")
    SPRITES.NINJABOYDEAD = loadSprite("./images/player/ninjaBoyDead.png");
    SPRITES.NINJABOYJUMPING = loadSprite("./images/player/ninjaBoyJumping.png");
    SPRITES.NINJABOYSLIDING = loadSprite("./images/player/ninjaBoySliding.png");
    SPRITES.NINJABOYTHROWING = loadSprite("./images/player/ninjaBoyThrowing.png");

    SPRITES.NINJAGIRLICON = loadSprite("./images/player/ninjaGirlIcon.png");
    SPRITES.NINJAGIRLRUNNING = loadSprite("./images/player/ninjaGirlRunning.png");
    SPRITES.NINJAGIRLIDLE = loadSprite("./images/player/ninjaGirlIdle.png");
    SPRITES.NINJAGIRLATTACKING = loadSprite("./images/player/ninjaGirlAttacking.png");
    SPRITES.NINJAGIRLJUMPING = loadSprite("./images/player/ninjaGirlJumping.png");
    SPRITES.NINJAGIRLDYING = loadSprite("./images/player/ninjaGirlDying.png");
    SPRITES.NINJAGIRLSLIDING = loadSprite("./images/player/ninjaGirlSliding.png");
    SPRITES.NINJAGIRLTHROWING = loadSprite("./images/player/ninjaGirlThrowing.png");


    
    // defining level 1 Bandit image sprites.
    SPRITES.BANDITICON = loadSprite("./images/enemy/enemyIcon.png");
    SPRITES.BANDITIDLE = loadSprite("images/enemy/enemyIdle.png");
    SPRITES.BANDITATTACKING = loadSprite("images/enemy/enemyAttacking.png");
    SPRITES.BANDITRUNNING = loadSprite("images/enemy/enemyRunning.png");
    SPRITES.BANDITDYING = loadSprite("images/enemy/enemyDead.png");

    // defining level 2 Ork image sprites.
    SPRITES.ORKICON = loadSprite("./images/enemy/orkIcon.png");
    SPRITES.ORKIDLE = loadSprite("./images/enemy/orkIdle.png");
    SPRITES.ORKATTACKING = loadSprite("./images/enemy/orkAttacking.png");
    SPRITES.ORKRUNNING = loadSprite("./images/enemy/orkRunning.png");
    SPRITES.ORKDYING = loadSprite("./images/enemy/enemyDead.png");
    SPRITES.ORK2ICON = loadSprite("./images/enemy/ork2Icon.png");
    SPRITES.ORK2IDLE = loadSprite("./images/enemy/ork2Idle.png");
    SPRITES.ORK2ATTACKING = loadSprite("./images/enemy/ork2Attacking.png");
    SPRITES.ORK2RUNNING = loadSprite("./images/enemy/ork2Running.png");
    SPRITES.ORK2DYING = loadSprite("./images/enemy/ork2Dying.png");

    // defining level 3 samurai image sprites
    SPRITES.SAMURAIICON = loadSprite("./images/enemy/samuraiIcon.png");
    SPRITES.SAMURAIDLE = loadSprite("./images/enemy/samuraiIdle.png");
    SPRITES.SAMURAIATTACKING = loadSprite("./images/enemy/samuraiAttacking.png");
    SPRITES.SAMURAIRUNNING = loadSprite("./images/enemy/samuraiRunning.png");
    SPRITES.SAMURAIDYING = loadSprite("./images/enemy/samuraiDying.png");

    //defining level 4 samurai image sprites.
    SPRITES.SAMURAIHEAVYICON = loadSprite("./images/enemy/samuraiHeavyIcon.png");
    SPRITES.SAMURAIHEAVYIDLE = loadSprite("./images/enemy/samuraiHeavyIdle.png");
    SPRITES.SAMURAIHEAVYATTACKING = loadSprite("./images/enemy/samuraiHeavyAttacking.png");
    SPRITES.SAMURAIHEAVYRUNNING = loadSprite("./images/enemy/samuraiHeavyRunning.png");
    SPRITES.SAMURAIHEAVYDYING = loadSprite("./images/enemy/samuraiHeavyDying.png");

    // defining level 5 boss image sprites
    SPRITES.BOSSICON = loadSprite("./images/enemy/bossIcon.png");
    SPRITES.BOSSIDLE = loadSprite("./images/enemy/bossRunning.png");
    SPRITES.BOSSATTACKING = loadSprite("./images/enemy/bossAttacking.png");
    SPRITES.BOSSRUNNING = loadSprite("./images/enemy/bossRunning.png");
    SPRITES.BOSSDEAD = loadSprite("./images/enemy/bossDying.png");

    // gameplay image sprites
    SPRITES.AURA = loadSprite("./images/gameplay/auras.png");
    SPRITES.SCROLL = loadSprite("./images/gameplay/scroll.png");
    SPRITES.SWORD = loadSprite("./images/enemy/sword.png");
    SPRITES.KUNAI_IMG = loadSprite("./images/player/kunai.png");
    SPRITES.KUNAI_DOWN = loadSprite("./images/player/kunaiDown.png");
    SPRITES.KUNAI_ICON = loadSprite("./images/player/kunaiIcon.png");
    SPRITES.BOSS_THROWABLE = loadSprite("./images/enemy/bossThrowable.png");
    SPRITES.ORK_THROWABLE = loadSprite("./images/enemy/orkThrowable.png");
    SPRITES.BOMBS = loadSprite("./images/enemy/star.png");


  numAssets = assetsStillLoading;

    assetsLoadingLoop(callback); 
}  

loadAssets(function() {
    
    game = new Game(canvas);
    scene = new SceneManager();
    scene.startInterval();
    playGameID.style.display = "block";
    chooseCharacterButton.style.display = "block";
    viewEnemiesButton.style.display = "block";

});
