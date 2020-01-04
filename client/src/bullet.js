import { Graphics } from 'pixi.js';

// TODO: fix wall edge cases bounce

export default class Bullet {

  constructor (x, y, angle) {
    this.radius = 5;
    this.position = { x, y };
    this.velocityFactor = 2;
    this.velocity = {
      x: Math.sin(angle),
      y: Math.cos(angle)
    };
    this.graphics = null;
  }

  bounceUp() {
    this.velocity.y *= -1;
  }

  bounceDown() {
    this.velocity.y *= -1;
  }

  bounceLeft() {
    this.velocity.x *= -1;
  }

  bounceRight() {
    this.velocity.x *= -1;
  }

  update () {
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