class Kunai {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 5;

    }
}

Kunai.prototype.display = function() {

    ctx.drawImage(SPRITES.KUNAI_IMG, 0, 0, 60, 15, this.x, this.y - 30, 50, 15);

}
Kunai.prototype.isPickedUp = function(player) {
    if(player.x + player.width >= this.x &&
        player.x <= this.x + this.width &&
        player.y + player.height >= this.y &&
        player.y <= this.y + this.height) {
            return true;
        }

}