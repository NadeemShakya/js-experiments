class Powerups {
    constructor() {
        this.currentLane = randomNumbers(1, TOTALLANES + 1);
        this.y = 0;
        this.capacity = randomNumbers(5, 36);
        this.width = 30;
        this.height = 35;
        this.offSet = 20;
        this.speed = 4;
    }

		// draw the ammo on the canvas.
    render() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.drawImage(AMMO_IMAGE,((laneWidth - this.width) / 2 ) + laneWidth * (this.currentLane - 1), this.y , this.width, this.height )
        ctx.closePath();
    }

		// check if player picks up the ammo.
    isPickedBy(player) {
        if(this.currentLane === player.currentLane && this.y + this.height >= HEIGHT - player.height - this.offSet) {
            return true;
        }
            return false;
    }

		// update and move the amo.
    update() {
        this.y += 4;
    }
}