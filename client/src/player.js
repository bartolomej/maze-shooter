import { Container, Graphics } from 'pixi.js';


export default class Player {

  constructor (uid, position) {
    this.uid = uid;
    this.position = position && position.x && position.y ? position : { x: 20, y: 20 };
    this.velocity = { x: 20, y: 20 };
    this.rotation = 0;
    this.object = null;
  }

  move (keyUp, keyDown, keyRight, keyLeft) {
    const rotationFactor = 0.05;
    const speedFactor = 1;

    if (keyRight) {
      this.rotation -= rotationFactor;
    } else if (keyLeft) {
      this.rotation += rotationFactor;
    }

    if (keyUp) {
      const dx = speedFactor * Math.sin(this.rotation);
      const dy = speedFactor * Math.cos(this.rotation);
      this.position.x += dx;
      this.position.y -= dy;
    } else if (keyDown) {
      const dx = speedFactor * Math.sin(this.rotation);
      const dy = speedFactor * Math.cos(this.rotation);
      this.position.x -= dx;
      this.position.y += dy;
    }
  }

  update () {
    this.object.rotation = this.rotation;
    this.object.x = this.position.x;
    this.object.y = this.position.y;
  }

  draw (stage, size) {
    const width = size;
    const height = size * 2;

    const container = new Container();
    let player = new Graphics();
    player.beginFill(0x0000);
    player.drawRect(0, 0, width, height);
    player.endFill();

    container.addChild(player);
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