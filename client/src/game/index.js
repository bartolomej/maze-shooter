import { Application } from 'pixi.js';
import Maze from "./maze";
import Player from "./player";

// TODO: http://gameprogrammingpatterns.com/

export default class Game {

  constructor ({ container, blockSize = 80, mazeDimensions = [20, 20], players }) {
    this.blockSize = blockSize;
    this.mazeDimensions = mazeDimensions;
    this.container = container;
    this.state = {
      maze: {},
      players: {}
    };
    this.players = players;
    this.app = new Application(this.pixiConfig);
    this.app.view.style.background = 'white';
    this.container.appendChild(this.app.view);
    this.app.loader.load(() => this.setup());
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
    let maze = new Maze(this.blockSize);
    maze.generate(mazeWidth, mazeHeight);
    maze.draw(this.app.stage, this.blockSize);
    this.state.maze = maze;

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
        keys: p.controls,
        color: p.getColor()
      });
      player.draw(this.app.stage);
      this.state.players[player.uid] = player;
    }

    // start game loop
    this.app.ticker.add(delta => this.gameLoop(delta));
  };

  gameLoop (delta) {
    for (let uid in this.state['players']) {
      let player = this.state.players[uid];
      let wallHit = this.state.maze.checkBulletCollision(player);
      if (wallHit) console.log(wallHit)
      player.update();
      for (let bullet of player.bullets) {
        let bounce = this.state.maze.checkBulletCollision(bullet)[0];
        if (bounce === 'TOP' || bounce === 'BOTTOM') {
          bullet.bounceY();
        }
        if (bounce === 'LEFT' || bounce === 'RIGHT') {
          bullet.bounceX();
        }
        bullet.update();
      }
    }
  };

}