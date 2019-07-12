class Bubble {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.radius = r;
		this.mass = 1;
		this.velocity = {
			x: Math.random() < 0.5 ? -.5 : .5,
			y: Math.random() < 0.5 ? -.5 : .5
		}

	}

	// method to draw the bubbles with ants
	showBubbles() {
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = "red";
		ctx.drawImage(antImage, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
		ctx.closePath();
	}

	// move the ants around.
	moveBubbles() {
		this.x = this.x + this.velocity.x;
		this.y = this.y + this.velocity.y;
    this.checkBorderCollision();
	}

	// checkBorderCollision
	checkBorderCollision() {
		if(this.x <= this.radius || this.y <= this.radius || 
      this.x + this.radius >= canvas.width || this.y + this.radius >= canvas.height) {
      this.velocity.x = - this.velocity.x;
      this.velocity.y = - this.velocity.y;
		} 
	}

	// check if one bubble touches other bubbles.
	isTouching(anotherBubble) {
		let x1 = this.x, y1 = this.y, x2 = anotherBubble.x, y2 = anotherBubble.y;
		let part1 = Math.pow((x2 - x1), 2);
		let part2 = Math.pow((y2 - y1), 2);
		let part3 = part1 + part2;
		let d = Math.sqrt(part3);
		let r = this.radius + anotherBubble.radius;
		if(d <= r) {
			return true;
		}
			return false;
	}
}