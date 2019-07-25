class NextScreen extends Level{
    constructor(backgroundImage) {
        super();
        this.backgroundImage = backgroundImage;
    }
}


NextScreen.prototype.showInfo = function() {

    game.ctx.beginPath();
    game.ctx.fillStyle = "#ffffff";
    game.ctx.font = "36px Segoe Script";
    game.ctx.fillText(`${scene.levelIndex + 1}`, 275, 90);

    game.ctx.font = "26px Segoe Script";
    game.ctx.fillText(`${Math.floor(game.player.health)}`, 310, 225);
    game.ctx.fillText(`${game.kunaiCount}`, 275, 280);
    game.ctx.fillText(`${5 - game.scrollCount}`, 380, 340);
    game.ctx.closePath();
}



NextScreen.prototype.showEndscreen = function() {
    game.ctx.beginPath();
    game.ctx.fillStyle = "#fff";
    game.ctx.font = "30px Verdana";
    game.ctx.fillText("GAME COMPLETED!", C_WIDTH/2, C_HEIGHT / 2);
    game.ctx.closePath();
}

NextScreen.prototype.display = function() {
    game.ctx.drawImage(this.backgroundImage, 0, 0);
}