// thorns generated for enemy persona.
class Thorn {
    constructor() {
        this.x = randomNumbers(0, C_WIDTH);
        this.y = C_HEIGHT - 60;
        this.width = 40;
        this.height = 100;
        this.slideVeloctiy = -0.8;
    }
}

// update the position of the thorns.
Thorn.prototype.update = function() {
    if(this.y < C_HEIGHT - 120) {
        
        this.slideVeloctiy *= -1;
    }
    this.y = this.y + this.slideVeloctiy;
}
// display the thorns.
Thorn.prototype.display = function() {
    game.ctx.beginPath();
    game.ctx.fillStyle = "red";
    game.ctx.drawImage(SPRITES.SWORD, this.x, this.y, this.width, this.height);
    game.ctx.closePath();
}
// check if the thorn burns(hits) the player.
Thorn.prototype.isBurning = function(player) {
    if(player.x + player.width >= this.x &&
        player.x <= this.x + this.width &&
        player.y + player.height >= this.y &&
        player.y < this.y + this.height) {
            return true;
        }
}