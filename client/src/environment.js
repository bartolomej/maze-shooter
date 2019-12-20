import { Application } from 'pixi.js';
import Maze from "./maze";
import Player from "./player";

// TODO: http://gameprogrammingpatterns.com/

export default class Environment {

  constructor ({ container, blockSize = 50, mazeDimensions = [18, 18] }) {
    this.blockSize = blockSize;
    this.mazeDimensions = mazeDimensions;
    this.container = container;
    this.state = {};
    this.app = new Application(this.pixiConfig);
    this.container.appendChild(this.app.view);
    this.app.loader
      .add("car.svg")
      .load(() => this.setup());
    this.addEventListeners();
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

  addEventListeners () {
    window.addEventListener('resize', () => {
      const { offsetWidth, offsetHeight } = this.container;
      this.app.renderer.resize(offsetWidth, offsetHeight);
    });
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
    let player = new Player('TestPlayer1', playerPosition, playerOrientation);
    player.draw(this.app.stage, this.blockSize / 4);
    this.state['player'] = player;

    // start game loop
    this.app.ticker.add(delta => this.gameLoop(delta));
  };

  gameLoop (delta) {
    // TODO: implement collision detection

    this.state['player'].update();
  };

}