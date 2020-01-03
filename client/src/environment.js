import { Application } from 'pixi.js';
import Maze from "./maze";
import Player from "./player";

// TODO: http://gameprogrammingpatterns.com/

export default class Environment {

  constructor ({ container, blockSize = 50, mazeDimensions = [20, 20] }) {
    this.blockSize = blockSize;
    this.mazeDimensions = mazeDimensions;
    this.container = container;
    this.state = {};
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

  setup () {
    const [mazeWidth, mazeHeight] = this.mazeDimensions;

    // initialize maze
    let maze = new Maze();
    maze.generate(mazeWidth, mazeHeight);
    maze.draw(this.app.stage, this.blockSize);
    this.state['maze'] = maze;

    // initialize player
    const randomBlock = maze.getRandomBlock();
    const playerOrientation = randomBlock.getRandomEmptyWall();
    const playerPosition = {
      x: (randomBlock.x * this.blockSize) + this.blockSize / 2,
      y: (randomBlock.y * this.blockSize) + this.blockSize / 2
    };
    let player = new Player('TestPlayer1', playerPosition, this.blockSize / 4, playerOrientation);
    player.draw(this.app.stage);
    this.state['player'] = player;

    // start game loop
    this.app.ticker.add(delta => this.gameLoop(delta));
  };

  gameLoop (delta) {
    // TODO: implement collision detection

    this.state['player'].update();
  };

}