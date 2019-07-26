// To Generate all the grabbables like potions, scrolls etc.

const ELASTICRANGE = 20;
class Grabbable {
    constructor() {
        this.x = randomNumbers(80, 620);
        this.y = randomNumbers(100, C_HEIGHT / 2);
        this.width = 30;
        this.height = 35;
        this.origin = {
            x: this.x,
            y: this.y
        }
        this.gravity = randomNumbers(0.01, 0.9);        
    }
}
// display the grabbables on the game canvas.
Grabbable.prototype.display = function(image) {
    game.ctx.beginPath();
    game.ctx.fillStyle = "#ad7a60";
    game.ctx.fillRect(this.x + this.width / 2, 0, 2, this.y);
    game.ctx.closePath();
    game.ctx.drawImage(image, this.x, this.y, this.width, this.height);
}
// check if the object is grabbed by the player.
Grabbable.prototype.isGrabbed = function(player) {
    if(player.x + player.width >= this.x && 
        player.x <= this.x + this.width &&
        player.y + player.height >= this.y &&
        player.y <= this.y + this.height) {
            return true;
    }
}
// make the object look like it's stretching by rope.
Grabbable.prototype.update = function() {
    this.y += this.gravity;
    if(Math.abs(this.y - this.origin.y) >= ELASTICRANGE) {
        this.gravity = this.gravity * -1;
    }
}