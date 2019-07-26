// For holding the start screen slides of the gameplay.s
class StartScene {
    constructor(image) {
        this.backgroundImage = image;
    }
}
StartScene.prototype.display = function() {
    game.ctx.beginPath();
    game.ctx.drawImage(this.backgroundImage, 0, 0, C_WIDTH, C_HEIGHT);
    game.ctx.closePath();
}
