import { Application } from 'pixi.js';
import Maze from "./maze";
import Player from "./player";

// TODO: http://gameprogrammingpatterns.com/

export default class Game {

  constructor ({ container, blockSize = 50, mazeDimensions = [20, 20], players }) {
    this.blockSize = blockSize;
    this.mazeDimensions = mazeDimensions;
    this.container = container;
    this.state = {
      players: {}
    };
    this.players = players;
    this.app = new Application(this.pixiConfig);
    this.container.appendChild(this.app.view);
    this.app.loader
      .add("car.svg")
      .load(() => this.setup());
  }

  get pixiConfig () {
    return {
      width: this.mazeDimensions[0] * this.blockSize,
      height: this.mazeDimensions[1] * this.blockSize,
      antialias: true,
      transparent: true,
      resolution: 1
    }
  }

  destroy () {
    this.container.removeChild(this.app.view);
  }

  setup () {
    const [mazeWidth, mazeHeight] = this.mazeDimensions;

    // initialize maze
    let maze = new Maze();
    maze.generate(mazeWidth, mazeHeight);
    maze.draw(this.app.stage, this.blockSize);
    this.state['maze'] = maze;

    // initialize players
    for (let p of this.players) {
      const randomBlock = maze.getRandomBlock();
      const playerOrientation = randomBlock.getRandomEmptyWall();
      const playerPosition = {
        x: (randomBlock.x * this.blockSize) + this.blockSize / 2,
        y: (randomBlock.y * this.blockSize) + this.blockSize / 2
      };
      let player = new Player({
        name: p.name,
        position: playerPosition,
        initialDirection: playerOrientation,
        size: this.blockSize / 4,
        keys: p.controls
      });
      player.draw(this.app.stage);
      this.state['players'][player.uid] = player;
    }

    // start game loop
    this.app.ticker.add(delta => this.gameLoop(delta));
  };

  gameLoop (delta) {

    for (let player in this.state['players']) {
      this.state['players'][player].update(this.app.stage);
      for (let bullet of this.state['players'][player].bullets) {
        let bounce = this.state['maze'].checkBulletCollision(bullet);
        if (bounce === 'TOP') {
          bullet.bounceDown();
        }
        if (bounce === 'BOTTOM') {
          bullet.bounceUp();
        }
        if (bounce === 'LEFT') {
          bullet.bounceLeft();
        }
        if (bounce === 'RIGHT') {
          bullet.bounceRight();
        }
      }
    }
  };

}