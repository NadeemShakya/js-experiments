
class Level {
    constructor(backgroundImage, enemyHealth, enemyImages, enemyAttackPower, enemyLevel, isScrollAvailable) {
        this.backgroundImage = backgroundImage;
        this.enemyHealth = enemyHealth;
        this.enemyImages = enemyImages;
        this.enemyAttackPower = enemyAttackPower;
        this.enemyLevel = enemyLevel;
        this.isScrollAvailable = isScrollAvailable;
        this.scroll;
        this.isScrollCollected = false;
        this.animatingLoop;
        this.init();
    }
}

Level.prototype.init = function() {
    if(!game.isNext) {
        // generate new enemies with different health, different images
        // if it's the new level.
        game.generateEnemies(this.enemyHealth, this.enemyImages, this.enemyAttackPower, this.enemyLevel);
        // apply persona of the enemies
        game.enemy.applyPersona();
        // generate scrolls.
        if(this.isScrollAvailable) {
            game.scrollHolder.push(new Grabbable());
        }
        // generate Potions with 70% chance.
        if(Math.random() < 0.7) {
            game.healthPotions.push(new Grabbable());
            game.staminaPotions.push(new Grabbable());
        }
    }
}

Level.prototype.animateCharacters = function() {
    this.animatingLoop = setInterval(function() {
        game.auraSpriteIndex = ++game.auraSpriteIndex % game.auraCount;
        if(!game.player.isPlayerDead()) {
            game.player.animateCharacter();
        }
        if(!game.enemy.isPlayerDead()) {
            if(!game.isPoweringUp) {
                game.enemy.animateCharacter();
            }
        }
    
    }, 60)
}

Level.prototype.display = function() {
    game.ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    game.ctx.drawImage(this.backgroundImage, 0, 0, C_WIDTH, C_HEIGHT);

    // display the enemy persona thorn for level 4.
    for(let i = 0; i < game.thornHolder.length; i++) {
        game.thornHolder[i].update();
        game.thornHolder[i].display();
        if(game.thornHolder[i].isBurning(game.player)) {
            game.player.health -= game.player.health * 0.0025 ;
            if(game.player.health < 1) {
                game.player.health = 0;
            }
        }
    }

    // for the pickable kunais for the player.
    for(let i = 0; i < game.pickableKunais.length; i++) {

        if(i === scene.currentLevel.enemyLevel - 1) {
            for(let j = game.pickableKunais[i].length - 1; j >= 0; j--) {

                if(game.pickableKunais[i][j].isPickedUp(game.player)) {
                    game.pickableKunais[i].splice(j, 1);
                    game.kunaiCount++;
                    var click = AUDIOS.PICKUPKUNAI.cloneNode();
                    click.play();
                }else {
                    game.pickableKunais[i][j].display();
                }
            }

        }

    }

    // show the gameplay info at botom of screen.
    game.ctx.beginPath();
    game.ctx.fillStyle = "grey";
    game.ctx.fillRect(250, 20, 100, 10);
    game.ctx.fillStyle = "#448ccb";
    game.ctx.fillRect(250, 20, game.player.stamina.map(0, 100, 0, 100), 10);
    game.ctx.drawImage(SPRITES.STAMINA_POTION, 210, 12, 30, 35);
    game.ctx.closePath();
    game.ctx.beginPath();
    game.ctx.fillStyle = "#1a131d";
    game.ctx.fillRect(0, C_HEIGHT - 30, C_WIDTH, 30);
    game.ctx.drawImage(SPRITES.HEALTH_POTION, C_WIDTH / 3, C_HEIGHT - 26 , 20, 25);
    game.ctx.fillStyle = "yellow";
    game.ctx.font = "14px Open Sans";
    game.ctx.fillText(`${game.healthPotionsCollected}`, C_WIDTH / 3 + 30, C_HEIGHT - 10);
    game.ctx.drawImage(SPRITES.STAMINA_POTION, C_WIDTH / 2.5, C_HEIGHT - 26 , 20, 25);
    game.ctx.fillText(`${game.staminaPotionsCollected}`, C_WIDTH / 2.5 + 30, C_HEIGHT - 10);
    game.showScrollCount();
    game.showKunaiCount();
    game.ctx.closePath();

    // for scrolls of the gameplay.
    if(game.scrollHolder.length !== 0) {
        if(game.scrollHolder[0].isGrabbed(game.player)) {
            game.scrollCount++;
            AUDIOS.SCROLLGRAB.play();
            this.isScrollCollected = true;
            game.scrollHolder.splice(0, 1);
        }else {
            game.scrollHolder[0].display(SPRITES.SCROLL);  
            game.scrollHolder[0].update();     
        } 
    }

    // for healthpotions of the gameplay.
    for(let i = 0; i < game.healthPotions.length; i++) {
        game.healthPotions[i].display(SPRITES.HEALTH_POTION);
        game.healthPotions[i].update();
        if(game.healthPotions[i].isGrabbed(game.player)) {
            // increasing game.healthPotions count.
            AUDIOS.POTIONGRAB.play();
            game.healthPotionsCollected++;
            game.healthPotions.splice(i, 1);
        }
    }

    // for the staminaPotions of the gameplay.
    for(let i = 0; i < game.staminaPotions.length; i++) {
        game.staminaPotions[i].display(SPRITES.STAMINA_POTION);
        game.staminaPotions[i].update();
        if(game.staminaPotions[i].isGrabbed(game.player)) {
            // increasing healthPotions count.
            AUDIOS.POTIONGRAB.play();
            game.staminaPotionsCollected++;
            game.staminaPotions.splice(i, 1);
        }
    }

    // for the player of the gameplay.
    if(!game.player.isPlayerDead()) {
        game.player.draw();
        game.player.updateCharacteristic();
        game.player.pullByGravity();
        game.player.updatePosition();
        game.player.showHealth(45, 20);
        game.player.swingSword();
        game.player.checkScreenBoundary();
    }else {
        cancelAnimationFrame(this.animatingLoop);
        cancelAnimationFrame(scene.sceneLoop);
        
        if(scene.currentLevel.enemyLevel === 3) {
            clearInterval(level3EnemyPersona);
        }else if(scene.currentLevel.enemyLevel === 4) {
            clearInterval(level4EnemyPersona);
        }else if(scene.currentLevel.enemyLevel === 5) {
            clearInterval(level5EnemyPersona);
        }
        game.player.resetBooleansifDead();
        frameC = 0;
        currentIndex = 0;
        if(game.character === "male") {
            AUDIOS.NINJABOYDYING.play();
        }else if(game.character === "female") {
            AUDIOS.NINJAGIRLDYING.play();
        }
        var playerDyingAnimation = setInterval(() => {
        
            frameC++;
            currentIndex = ++currentIndex % FRAMECOUNT;
            player_clippingX = game.player.runningSpriteIndex * FRAMEWIDTH;
            player_clippingY = currentIndex * FRAMEHEIGHT;
            if(frameC <= 9) {    
            game.ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
            game.ctx.drawImage(this.backgroundImage, 0, 0, C_WIDTH, C_HEIGHT);

            game.enemy.update();
            game.enemy.draw();
            game.enemy.showHealth();
            
            game.player.draw();
            }else {
                clearInterval(playerDyingAnimation);
                clearInterval(game.enemyThrowableInterval);  
                currentLevel = new StartScene(SPRITES.GAMEOVERSCREEN);
                currentLevel.display();
                playAgainButton.style.display = "block";
            }

        },200)

    }

    // for the kunais of the gameplay.
    for(let i = game.kunais.length - 1; i >= 0; i--) {
        game.kunais[i].update();
        game.kunais[i].display();
        if(game.kunais[i].hasHitObject(game.enemy)) {
            // do something here.
            game.enemy.health -= game.player.attackPower * 0.5;
            game.kunais.splice(i, 1);
            if(game.enemy.runningSpriteIndex == 0) {
                game.enemy.x -= game.enemy.width;
                }else if(game.enemy.runningSpriteIndex == 1) {
                game.enemy.x += game.enemy.width;
                }  

        }else if(game.kunais[i].isOffTheScreen()) {
            game.kunais.splice(i, 1);
        }
        
  

    }

    // for the enemypersona of the gameplay.
    for(let i = game.enemyThrowables.length - 1; i >= 0; i--) {
        game.enemyThrowables[i].update();
        game.enemyThrowables[i].display();
        if(game.enemyThrowables[i].hasHitObject(game.player)) {
            game.player.health -= game.enemy.attackPower * 10;
            if(game.player.health < 0) {
                game.player.health = 0;
            }
            game.enemyThrowables.splice(i, 1);
        }else if(game.enemyThrowables[i].hasHitPlatform()) {
            game.enemyThrowables.splice(i, 1);
        }else if(game.enemyThrowables[i].isOffTheScreen()) {
            game.enemyThrowables.splice(i, 1);
        }

    }

    // for the enemy of the gameplay.
    if(!game.enemy.isPlayerDead()) {
        if(scene.currentLevel.enemyLevel === 2) {
            game.enemy.applyPersona();
        }
        game.enemy.attackPlayer(game.player);    
        if(!game.isPoweringUp) {
            game.enemy.update();

        }
        game.enemy.draw();
        game.enemy.updateSpriteIndex();
        game.enemy.followPlayer(game.player);
        game.enemy.checkScreenBoundary();
        game.player.attackingEnemy(game.enemy);
        game.enemy.showHealth(C_WIDTH - 145, 20);
    }else {
        if(scene.currentLevel.enemyLevel === 3) {
            clearInterval(level3EnemyPersona);
        }else if(scene.currentLevel.enemyLevel === 4) {
            clearInterval(level4EnemyPersona);
        }else if(scene.currentLevel.enemyLevel === 5) {
            clearInterval(level5EnemyPersona);
        }
        game.enemy.resetBooleansifDead();
        // game.enemy.update();
        // game.enemy.draw();
        game.enemy.showHealth(C_WIDTH - 100 - 45, 20);
        clearInterval(game.enemyThrowableInterval);
        game.enemyThrowables = [];
        game.kunais = [];        
    }
    
    // moving to new level .
    if(this.isScrollCollected && game.enemy.isPlayerDead()) {
        game.healthPotions = [];
        game.staminaPotions = [];
        game.enemyThrowables = [];
        game.kunais = [];  
        game.isNext = true;
        clearInterval(game.enemyThrowableInterval);
        if(scene.currentLevel.enemyLevel === 3) {
            clearInterval(level3EnemyPersona);
        }else if(scene.currentLevel.enemyLevel === 4) {
            clearInterval(level4EnemyPersona);
        }else if(scene.currentLevel.enemyLevel === 5) {
            clearInterval(level5EnemyPersona);            
        } 

        
    }

    // animating the enemy power up.
    if(game.isPoweringUp && game.enemy) {
        game.enemy.animatePowerup();
}

}
