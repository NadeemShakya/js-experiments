
// get the angle of collision between two bubbles.
function getAngleofCollision(own, other) {
  let angle = -Math.atan2(own.y - other.y, own.x - other.x)
  return angle;
}

// rotate the vector by certain angle to horizontally align the axis of collision.
function rotateVector(velocity, angle) {
  rotatedX = velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle);
  rotatedY = velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle);
  return rotatedVelocity = {
    x : rotatedX,
    y: rotatedY
  }
}

// resolve collision.
function resolveCollision(own, other) {
  const xVelocityDiff = own.velocity.x - other.velocity.x;
  const yVelocityDiff = own.velocity.y - other.velocity.y;

  const xDist = other.x - own.x;
  const yDist = other.y - own.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // get angle of collision.
    let angle = getAngleofCollision(own, other);
    // rotate the initial vectors.
    let u1 = rotateVector(own.velocity, angle);
    let u2 = rotateVector(other.velocity, angle);
    // set masses of the bubbles.
    let m1 = own.mass;
    let m2 = other.mass;
    // applying one-dimensional elastic collisions.
    let rotated_v1 = {x: ((m1 - m2) / (m1 + m2)) * u1.x + ((2 * m2) / (m1 + m2)) * u2.x, y: u1.y};
    let rotated_v2 = {x: ((2 * m1) / (m1 + m2)) * u1.x + ((m2 - m1) / (m1 + m2)) * u2.x, y: u2.y};
    // rotate the vectors back to original axis.
    let v1 = rotateVector(rotated_v1, -angle);
    let v2 = rotateVector(rotated_v2, -angle);
    // reset the velocitites.
    own.velocity.x = v1.x;
    own.velocity.y = v1.y;

    other.velocity.x = v2.x;
    other.velocity.y = v2.y;
  }

}