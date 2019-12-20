import { Container, Graphics } from 'pixi.js';
import { KeyHandler, keys } from "./input";


export default class Player {

  constructor (uid, position, initialDirection = 'RIGHT') {
    this.uid = uid;
    this.position = position && position.x && position.y ? position : { x: 20, y: 20 };
    this.velocityFactor = 1;
    this.rotationFactor = 0.05;
    this.rotation = this.getDegreeOrientation(initialDirection);
    this.object = null;
    // support keys as params in the future (for multiple local players)
    this.keyboard = {
      left: new KeyHandler(keys.LEFT),
      right: new KeyHandler(keys.RIGHT),
      up: new KeyHandler(keys.UP),
      down: new KeyHandler(keys.DOWN)
    };
  }

  getDegreeOrientation (direction) {
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
    const { left, right, up, down } = this.keyboard;

    if (right.isDown) {
      this.rotation += this.rotationFactor;
    } else if (left.isDown) {
      this.rotation -= this.rotationFactor;
    }

    // calculate player velocity vector
    const dx = this.velocityFactor * Math.sin(this.rotation);
    const dy = this.velocityFactor * Math.cos(this.rotation);

    if (up.isDown) {
      this.position.x += dx;
      this.position.y -= dy;
    } else if (down.isDown) {
      this.position.x -= dx;
      this.position.y += dy;
    }
  }

  update () {
    // calculates player position
    this.move();

    // updates view elements
    this.object.rotation = this.rotation;
    this.object.x = this.position.x;
    this.object.y = this.position.y;
  }

  draw (stage, size) {
    const width = size;
    const height = size * 2;
    let components = [];

    const player = new Graphics();
    player.beginFill(0x4287f5);
    player.drawRect(0, 0, width, height);
    player.endFill();
    components.push(player);

    const frontMark = new Graphics();
    frontMark.beginFill(0x0000);
    frontMark.drawCircle(width / 2, -2, width / 2);
    frontMark.endFill();
    components.push(frontMark);

    // wrap player components in container
    // to allow rotation and grouping
    const container = new Container();
    // add all components as children
    for (let ele of components) {
      container.addChild(ele);
    }
    container.x = this.position.x;
    container.y = this.position.y;
    container.width = width;
    container.height = height;
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    this.object = container;
    stage.addChild(this.object);
  }
}