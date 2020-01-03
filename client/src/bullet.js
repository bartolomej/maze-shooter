import { Graphics } from 'pixi.js';


export default class Bullet {

  // TODO: CHANGE TO difference in speed for x/y instead of rotation angle

  constructor (x, y, angle) {
    this.radius = 5;
    this.rotation = angle;
    this.position = { x, y };
    this.velocityFactor = 2;
    this.graphics = null;
  }

  bounceUp() {
    this.rotation += Math.PI - 2 * this.rotation;
  }

  bounceDown() {
    this.rotation += Math.PI - 2 * this.rotation;
  }

  bounceLeft() {
    let a = (Math.PI / 2) + this.rotation;
    this.rotation += Math.PI + a;
  }

  bounceRight() {
    let a = (Math.PI / 2) + this.rotation;
    this.rotation += Math.PI + a;
  }

  update () {
    // calculate bullet velocity vector
    const dx = this.velocityFactor * Math.sin(this.rotation);
    const dy = this.velocityFactor * Math.cos(this.rotation);

    this.position.x += dx;
    this.position.y -= dy;

    // updates view elements
    // this.graphics.rotation = this.rotation;
    this.graphics.x = this.position.x;
    this.graphics.y = this.position.y;

    this.draw();
  }

  draw (parent) {
    const { x, y } = this.position;
    if (this.graphics == null) {
      this.graphics = new Graphics();
    }

    this.graphics.x = x;
    this.graphics.y = y;
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