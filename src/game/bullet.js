import { Graphics } from 'pixi.js';

// TODO: fix wall edge cases bounce

export default class Bullet {

  constructor (x, y, angle, velocityFactor = 2) {
    this.radius = 5;
    this.isActive = true;
    this.position = { x, y };
    this.velocityFactor = velocityFactor;
    this.destructionTime = 8;
    this.velocity = {
      x: Math.sin(angle),
      y: Math.cos(angle)
    };
    this.graphics = null;
    // bullet self destruction time in seconds
    setTimeout(this.destroy.bind(this), this.destructionTime * 1000)
  }

  destroy () {
    this.graphics.clear();
    this.isActive = false;
  }

  update (collisions) {
    if (collisions.includes('Y')) {
      this.velocity.y *= -1;
    }
    if (collisions.includes('X')) {
      this.velocity.x *= -1;
    }
    if (collisions.includes('C')) {
      this.velocity.y *= -1;
      this.velocity.x *= -1;
    }

    // calculate position
    this.position.x += this.velocity.x * this.velocityFactor;
    this.position.y -= this.velocity.y * this.velocityFactor;

    // updates view elements
    // this.graphics.rotation = this.rotation;
    this.graphics.x = this.position.x;
    this.graphics.y = this.position.y;

    this.draw();
  }

  draw (parent) {
    if (this.graphics == null) {
      this.graphics = new Graphics();
    }

    this.graphics.x = this.position.x;
    this.graphics.y = this.position.y;
    this.graphics.clear();
    this.graphics.lineStyle(0);
    this.graphics.beginFill(0xDE3249, 1);
    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();

    if (parent) {
      parent.addChild(this.graphics);
    }
  }

}