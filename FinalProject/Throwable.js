

class Throwable {
    constructor(x, y, image, velX, velY, movDirection, size) {
        this.x = x;
        this.y = y;
        this.velocity = {
            x: velX ? velX : 0,
            y: velY ? velY: 0
        };
        this.width = size ? size : 60;
        this.height = size? size : 15;
        this.movingDirection = movDirection ? movDirection : null;
        this.power = 10;
        this.image = image;
    }
}

Throwable.prototype.init = function(character) {
    
     if(character.movingDirection == RIGHT) {
        this.movingDirection = RIGHT;
        this.velocity.x = 10;
    }else if(character.movingDirection == LEFT) {
        this.movingDirection = LEFT;
        this.velocity.x = -10;
    }
}    

Throwable.prototype.update = function() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

Throwable.prototype.display = function() {
    if(this.movingDirection ==  RIGHT) {

        game.ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width,this.height);
    }else if(this.movingDirection == LEFT) {


        game.ctx.drawImage(this.image, this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }else if(this.movingDirection == DOWN) {
        console.log("DDIWN");
        game.ctx.drawImage(this.image,this.x, this.y, this.width,this.height);
    }else if(this.movingDirection === UP) {
        game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
Throwable.prototype.hasHitObject = function(object) {
    if(!game.isPoweringUp) {

        if(this.x >= object.x && this.x + this.width <= object.x + object.width) {
            if(this.y >= object.y && this.y <= object.y + object.height) {
                return true;
            }
        }
            
    }


}

Throwable.prototype.hasHitPlatform = function() {
    if(!game.isPoweringUp) {
        for(let i = 0; i < game.platform.length; i++) {
            if(game.platform[i].level === scene.currentLevel.enemyLevel) {
                if(this.x + this.width >= game.platform[i].x &&
                    this.x <= game.platform[i].x + game.platform[i].w &&
                    this.y + this.height >= game.platform[i].y &&
                    this.y <= game.platform[i].y + game.platform[i].h) {
                        return true;
                    }
            }
        }
    }
}

Throwable.prototype.isOffTheScreen = function() {
    if(this.x >= C_WIDTH || this.x <= 0) {
        return true;
    }
    if(this.y >= C_HEIGHT || this.y <= 0) {
        return true;
    }
}


