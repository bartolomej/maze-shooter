import { Container, Graphics } from 'pixi.js';
import { KeyHandler } from "./utils";
import Bullet from "./bullet";
import uuid from 'uuid/v4';


export default class Player {

  constructor ({ uid, name, position, keys, size, initialDirection = 'RIGHT', color }) {
    this.uid = uid ? uid : uuid();
    this.name = name;
    this.radius = size;
    this.color = color;
    this.lastShootingTime = 0;
    this.position = position && position.x && position.y ? position : { x: 20, y: 20 };
    this.rotation = this._getDegreeOrientation(initialDirection);
    this.bullets = [];
    this.graphics = null;

    // player coefficients
    this.velocityFactor = 1;
    this.rotationFactor = 0.06;
    this.shootingRate = 200;

    this.keyboard = {
      left: new KeyHandler(keys.left),
      right: new KeyHandler(keys.right),
      forward: new KeyHandler(keys.forward),
      backward: new KeyHandler(keys.backward),
      shoot: new KeyHandler(keys.shoot)
    };
  }

  _getDegreeOrientation (direction) {
    switch (direction) {
      case 'TOP':
        return 0;
      case 'BOTTOM':
        return Math.PI;
      case 'LEFT':
        return Math.PI / 2;
      case 'RIGHT':
        return -Math.PI / 2;
      default: {
        throw new Error("Unexpected player direction");
      }
    }
  }

  update (collisions) {
    // calculates player position
    const { left, right, forward, backward } = this.keyboard;

    if (right.isDown) {
      this.rotation += this.rotationFactor;
    } else if (left.isDown) {
      this.rotation -= this.rotationFactor;
    }

    let dx = this.velocityFactor * Math.sin(this.rotation);
    let dy = this.velocityFactor * Math.cos(this.rotation);

    let deltaPosX = this.position.x - this.position0.x;
    let deltaPosY = this.position.y - this.position0.y;

    if (collisions.includes('X')) {
      if (deltaPosX > 0 && dx > 0) dx = 0;
      if (deltaPosX < 0 && dx < 0) dx = 0;
    }

    if (collisions.includes('Y')) {
      if (deltaPosY > 0 && dy > 0) dy = -dy;
      if (deltaPosY < 0 && dy < 0) dy = -dy;
      else dy = 0;
    }

    if (collisions.includes('C')) {
      dx = 0;
      dy = 0;
    }

    this.position0 = Object.assign({}, this.position);

    if (forward.isDown) {
      this.position.x += dx;
      this.position.y -= dy;
    } else if (backward.isDown) {
      this.position.x -= dx;
      this.position.y += dy;
    }

    // create new bullets on shoot
    if (
      this.keyboard.shoot.isDown &&
      this.lastShootingTime + this.shootingRate <= Date.now()
    ) {
      // TODO: - Math.PI / 2 is a quick dirty fix because I don't want to deal with this shit now
      const ballPosX = (Math.cos(this.rotation - Math.PI / 2) * (this.radius + 6)) + this.position.x;
      const ballPosY = (Math.sin(this.rotation - Math.PI / 2) * (this.radius + 6)) + this.position.y;
      const bullet = new Bullet(ballPosX, ballPosY, this.rotation);
      bullet.draw(this.graphics.bullets);
      this.bullets.push(bullet);
      this.lastShootingTime = Date.now()
    }

    // updates view elements
    this.graphics.player.rotation = this.rotation;
    this.graphics.player.x = this.position.x;
    this.graphics.player.y = this.position.y;
  }

  draw (stage) {
    const body = new Graphics();
    body.beginFill(this.color);
    body.drawCircle(0, 0, this.radius);
    body.endFill();

    const frontMark = new Graphics();
    frontMark.lineStyle(2, 0x0000);
    frontMark.beginFill(0x0000);
    frontMark.drawCircle(0, 0, this.radius / 3);
    frontMark.endFill();
    frontMark.position.set(0, 0);

    const line = new Graphics();
    line.lineStyle(this.radius / 4, 0x0000);
    line.moveTo(0, 0);
    line.lineTo(0, -this.radius);
    line.endFill();
    line.position.set(0, 0);

    // wrap player components in container
    // to allow rotation and grouping
    const player = new Container();
    player.addChild(body);
    player.addChild(frontMark);
    player.addChild(line);

    player.x = this.position.x;
    player.y = this.position.y;

    const bullets = new Container();
    bullets.width = stage.width;
    bullets.height = stage.height;

    const container = new Container();
    container.addChild(player, bullets);

    this.graphics = { player, bullets };

    stage.addChild(player);
    stage.addChild(bullets)
  }
}