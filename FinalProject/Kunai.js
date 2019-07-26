// Generate Kunais to be plaed on platform
// to be grabbed by the player.
class Kunai {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 5;
    }
}
// draw the Kunais.
Kunai.prototype.display = function() {
    ctx.drawImage(SPRITES.KUNAI_IMG, 0, 0, 60, 15, this.x, this.y - 30, 50, 15);
}

// check if object is picked up by player.
Kunai.prototype.isPickedUp = function(player) {
    if(player.x + player.width >= this.x &&
        player.x <= this.x + this.width &&
        player.y + player.height >= this.y &&
        player.y <= this.y + this.height) {
            return true;
        }

}