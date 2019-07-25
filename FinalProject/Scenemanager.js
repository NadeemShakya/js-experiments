
class SceneManager {
    constructor() {
        this.startScene = new StartScene(SPRITES.STARTSCREEN);
        this.currentLevel;
        this.levels = [];
        this.levelIndex = 0;
        this.newLevel;
        this.sceneLoop;
        this.setLevels = [

            
            {   // Level1
                // bandit
                backgroundImage: SPRITES.BACKGROUND_1,
                enemyHealth: 30,
                enemyAttackPower : 0.05,
                images: [SPRITES.BANDITICON, SPRITES.BANDITIDLE, SPRITES.BANDITRUNNING, SPRITES.BANDITATTACKING, SPRITES.BANDITDYING],
                enemyLevel: 1,
                isScrollAvailable: game.scrollSlot[0]
            },
            {
                // Level2
                // ork
                backgroundImage: SPRITES.BACKGROUND_3,
                enemyHealth: 60,
                enemyAttackPower: 0.2,
                images: [SPRITES.ORKICON,  SPRITES.ORKIDLE, SPRITES.ORKRUNNING,  SPRITES.ORKATTACKING, SPRITES.ORKDYING],
                enemyLevel: 2,
                isScrollAvailable: game.scrollSlot[1]
        
            },
        
                // Level 3
                // samurai
            {
                backgroundImage: SPRITES.BACKGROUND_3,
                enemeyHealth: 80,
                enemyAttackPower : 0.35,
                images: [SPRITES.SAMURAIICON, SPRITES.SAMURAIDLE, SPRITES.SAMURAIRUNNING, SPRITES.SAMURAIATTACKING, SPRITES.SAMURAIDYING],        
                enemyLevel: 3,
                isScrollAvailable: game.scrollSlot[2]
        
            },
            {
                // Level2
                // ork
                backgroundImage:  SPRITES.BACKGROUND_4,
                enemyHealth: 60,
                enemyAttackPower: 0.5,
                images: [SPRITES.SAMURAIHEAVYICON, SPRITES.SAMURAIHEAVYIDLE,  SPRITES.SAMURAIHEAVYRUNNING, SPRITES.SAMURAIHEAVYATTACKING, SPRITES.SAMURAIHEAVYDYING],
                enemyLevel: 4,
                isScrollAvailable: game.scrollSlot[3]
        
            },
            // BOSS LEVEL
            {
                backgroundImage: SPRITES.BOSS_BACKGROUND,
                enemeyHealth: 100,
                enemyAttackPower : 0.7,
                images: [SPRITES.BOSSICON, SPRITES.BOSSIDLE,  SPRITES.BOSSRUNNING, SPRITES.BOSSATTACKING,  SPRITES.BOSSDEAD],        
                enemyLevel: 5,
                isScrollAvailable: game.scrollSlot[4]
        
            },
        
        
        ]

        this.init();
    }
    



}

SceneManager.prototype.init = function() {
    this.currentLevel = this.startScene;
    this.levels.push(this.newLevel);

    playGameID.addEventListener("click", () => {

        this.currentLevel = new StartScene(SPRITES.CONTROLSCREEN);
        playGameID.style.display = "none";
        okiGotItButton.style.display = "block";
        chooseCharacterButton.style.display = "none";
        viewEnemiesButton.style.display = "none";
    
    })

    
    chooseCharacterID.addEventListener("click", () => {
        this.currentLevel = new StartScene(SPRITES.CHOOSECHARACTER);
        playGameID.style.display = "none";
        chooseCharacterButton.style.display = "none";
        maleCharacter.style.display = "block";
        femaleCharacter.style.display = "block";
        viewEnemiesButton.style.display = "none";

    })

    maleCharacter.addEventListener("click", () => {
        game.playerImages = [SPRITES.NINJABOYICON, SPRITES.NINJABOYIDLE, SPRITES.NINJABOYRUNNING, SPRITES.NINJABOYATTACKING, SPRITES.NINJABOYJUMPING, SPRITES.NINJABOYDEAD, SPRITES.NINJABOYSLIDING, SPRITES.NINJABOYTHROWING];
        game.generatePlayer();
        this.currentLevel = new StartScene(SPRITES.CONTROLSCREEN);
        maleCharacter.style.display = "none";
        femaleCharacter.style.display = "none";
        okiGotItButton.style.display = "block";
        game.character = "male";


    })


    
    femaleCharacter.addEventListener("click", () => {
        game.playerImages = [SPRITES.NINJAGIRLICON, SPRITES.NINJAGIRLIDLE, SPRITES.NINJAGIRLRUNNING, SPRITES.NINJAGIRLATTACKING, SPRITES.NINJAGIRLJUMPING, SPRITES.NINJAGIRLDYING, SPRITES.NINJAGIRLSLIDING, SPRITES.NINJAGIRLTHROWING];
        game.generatePlayer();
        this.currentLevel = new StartScene(SPRITES.CONTROLSCREEN);
        maleCharacter.style.display = "none";
        femaleCharacter.style.display = "none";
        okiGotItButton.style.display = "block";
        game.character = "female";

    })


    
    okiGotItButton.addEventListener("click", () => {

        game.isGameRunning = true;   
        this.newLevel = new Level(this.setLevels[this.levelIndex].backgroundImage, this.setLevels[this.levelIndex].enemyHealth, this.setLevels[this.levelIndex].images, this.setLevels[this.levelIndex].enemyAttackPower, this.setLevels[this.levelIndex].enemyLevel, this.setLevels[this.levelIndex].isScrollAvailable);
       
            this.newLevel.animateCharacters();
        
        this.currentLevel = this.newLevel;
        okiGotItButton.style.display = "none";
        game.enemyThrowsObjects();
        AUDIOS.BACKGROUND.addEventListener('ended', () => {
            AUDIOS.BACKGROUND.currentTime = 0;
            AUDIOS.BACKGROUND.play();
        }, false);    
        AUDIOS.BACKGROUND.play();
    
    
    })
    
    viewEnemiesButton.addEventListener("click", () => {
        this.currentLevel = new StartScene(SPRITES.VIEWENEMIES);
        playGameID.style.display = "none";
        chooseCharacterButton.style.display = "none";
        viewEnemiesButton.style.display = "none";
        okButton.style.display = "block";

    })

    okButton.addEventListener("click", () => {
        okButton.style.display = "none";
        this.currentLevel = new StartScene(SPRITES.CONTROLSCREEN);
        playGameID.style.display = "none";
        okiGotItButton.style.display = "block";
        chooseCharacterButton.style.display = "none";
        viewEnemiesButton.style.display = "none";        
    })
    levelCompletedButton.addEventListener("click", () => {
        
    
        this.levelIndex++;

        game.isNext = false;
        this.newLevel = new Level(this.setLevels[this.levelIndex].backgroundImage, this.setLevels[this.levelIndex].enemyHealth, this.setLevels[this.levelIndex].images, this.setLevels[this.levelIndex].enemyAttackPower, this.setLevels[this.levelIndex].enemyLevel, this.setLevels[this.levelIndex].isScrollAvailable);
        // this.newLevel.animateCharacters();
        
        this.currentLevel = this.newLevel;
        this.levels.push(this.newLevel);
        game.repositionPlayer();
        game.enemyThrowsObjects();

        levelCompletedButton.style.display = "none";
        game.isGameRunning = true;


    })
    
    playAgainButton.addEventListener("click", () => {
        location.reload();
        // game = new Game(canvas);
        // scene = new SceneManager();
        // scene.startInterval();
        // playGameID.style.display = "block";
        // chooseCharacterButton.style.display = "block";
        // playAgainButton.style.display = "none";
    })

}

SceneManager.prototype.startInterval = function() {
            
            this.sceneLoop = requestAnimationFrame(this.startInterval.bind(this));
            if(game.isNext) {
                // if game is completed.
                if(game.scrollCount === 5) {
                    next = new NextScreen(SPRITES.GAMECOMPLETED);
                    next.display();
                    
                }else {
                // move to the next level.
                    game.isGameRunning = false;
                    levelCompletedButton.style.display = "block";
                    next = new NextScreen(SPRITES.LEVELCOMPLETED);
                    
                    // this.currentLevel = next;
                    next.display();
                    next.showInfo();
                }
                
            }else {
                this.currentLevel.display();
            }
         
}
