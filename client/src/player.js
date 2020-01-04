import { Container, Graphics } from 'pixi.js';
import { KeyHandler } from "./input";
import Bullet from "./bullet";
import uuid from 'uuid/v4';

export default class Player {

  constructor ({uid, name, position, keys, size, initialDirection = 'RIGHT'}) {
    this.uid = uid ? uid : uuid();
    this.name = name;
    this.size = size;
    this.tick = 0;
    this.position = position && position.x && position.y ? position : { x: 20, y: 20 };
    this.rotation = this._getDegreeOrientation(initialDirection);
    this.bullets = [];
    this.graphics = null;

    // player coefficients
    this.velocityFactor = 1;
    this.rotationFactor = 0.06;
    this.shootingFactor = 20;

    // support keys as params in the future (for multiple local players)
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

  move () {
    const { left, right, forward, backward } = this.keyboard;

    if (right.isDown) {
      this.rotation += this.rotationFactor;
    } else if (left.isDown) {
      this.rotation -= this.rotationFactor;
    }

    // calculate player velocity vector
    const dx = this.velocityFactor * Math.sin(this.rotation);
    const dy = this.velocityFactor * Math.cos(this.rotation);

    if (forward.isDown) {
      this.position.x += dx;
      this.position.y -= dy;
    } else if (backward.isDown) {
      this.position.x -= dx;
      this.position.y += dy;
    }
  }

  update (parent) {
    // calculates player position
    this.move();

    // create new bullets on shoot
    if (
      this.keyboard.shoot.isDown &&
      this.tick % this.shootingFactor === 0
    ) {
      const bullet = new Bullet(
        this.position.x,
        this.position.y,
        this.rotation
      );
      bullet.draw(this.graphics.bullets);
      this.bullets.push(bullet);
    }

    for (let bullet of this.bullets) {
      bullet.update();
    }

    // updates view elements
    this.graphics.player.rotation = this.rotation;
    this.graphics.player.x = this.position.x;
    this.graphics.player.y = this.position.y;

    this.tick++;
  }

  draw (stage) {
    const width = this.size;
    const height = this.size * 2;

    const body = new Graphics();
    body.beginFill(0x4287f5);
    body.drawRect(0, 0, width, height);
    body.endFill();

    const frontMark = new Graphics();
    frontMark.beginFill(0x0000);
    frontMark.drawCircle(width / 2, -2, width / 2);
    frontMark.endFill();

    // wrap player components in container
    // to allow rotation and grouping
    const player = new Container();
    player.addChild(body);
    player.addChild(frontMark);

    player.x = this.position.x;
    player.y = this.position.y;
    player.width = width;
    player.height = height;
    player.pivot.x = player.width / 2;
    player.pivot.y = player.height / 2;

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