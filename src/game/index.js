import { Application } from 'pixi.js';
import { createDiv, createText } from "./utils";
import Maze from "./maze";
import Player from "./player";

// TODO: http://gameprogrammingpatterns.com/

const GAME_STATUS = {
  ACTIVE: 0,
  STOPPED: 1,
  LOADING: 2
};

export default class Game {

  constructor ({ container, blockSize = 80, players }) {
    this.gameStatus = false;
    this.scoreBoard = {};
    // initialize scoreboard state
    for (let p of players) {
      this.scoreBoard[p.uid] = 0;
    }
    this.blockSize = blockSize;
    this.velocityFactor = 1;
    // initial maze dimensions
    this.mazeDimensions = [2,2];
    this.container = container;
    this.maze = {};
    this.players = {};
    this.playersConfigs = players;

    // pixi.js initialization
    this.app = null;
    this.initializeGame();

  }

  destroy () {
    this.container.removeChild(this.app.view);
  }

  initializeGame () {
    this.app = new Application({
      width: this.mazeDimensions[0] * this.blockSize,
      height: this.mazeDimensions[1] * this.blockSize,
      antialias: true,
      transparent: true,
      resolution: 1
    });
    this.app.view.style.background = 'white';
    this.app.view.classList.add('maze');
    this.container.appendChild(this.app.view);
    this.app.loader.load(() => this.setup());
  }

  setup () {
    // maze generation algorithm
    const [mazeWidth, mazeHeight] = this.mazeDimensions;
    let maze = new Maze(this.blockSize);
    maze.generate(mazeWidth, mazeHeight);
    maze.draw(this.app.stage, this.blockSize);
    this.maze = maze;

    // initialize players on random positions
    let positions = [];
    for (let p of this.playersConfigs) {
      // calculates random available position
      let randomBlock = this.maze.getRandomBlock();
      let stringId = randomBlock.x + '_' + randomBlock.y;
      while (positions.includes(stringId)) {
        randomBlock = this.maze.getRandomBlock();
        stringId = randomBlock.x + '_' + randomBlock.y;
      }
      positions.push(stringId);

      const initialDirection = randomBlock.getRandomEmptyWall();
      let player = new Player({
        uid: p.uid,
        name: p.name,
        position: randomBlock.centerPosition,
        initialDirection,
        size: randomBlock.width / 4,
        keys: p.controls,
        color: p.getColor(),
        velocityFactor: this.velocityFactor
      });
      player.draw(this.app.stage);
      this.players[player.uid] = player;
    }

    // initialize scoreboard container
    this.updateScoreBoardDom();

    // start pixi.js game loop
    this.app.ticker.add(delta => this.gameLoop(delta));

    // animate maze in
    setTimeout(() => {
      this.app.view.classList.add('maze-in');
    }, 100);
  };

  updateScoreBoardDom () {
    if (document.getElementById('scoreboard-container') === null) {
      const container = createDiv('scoreboard-container');
      for (let uid in this.scoreBoard) {
        const player = this.players[uid];
        const score = this.scoreBoard[uid];

        const playerContainer = createDiv(`${uid}-score`, ['player-score']);
        playerContainer.style.color = player.color;

        const name = createText(player.name);
        name.style.fontWeight = 'bold';
        name.style.opacity = '0.5';

        const scoreText = createText(score, `${uid}-kills`);
        scoreText.style.fontSize = '20px';
        scoreText.style.fontWeight = 'bold';
        scoreText.style.margin = '10px';
        scoreText.style.color = player.color;

        playerContainer.append(name, scoreText);
        container.appendChild(playerContainer);
      }

      document.getElementById('game-screen').appendChild(container);
    }

    for (let uid in this.scoreBoard) {
      document.getElementById(`${uid}-kills`).innerText = this.scoreBoard[uid];
    }

  }

  async generateNextLevel () {
    return new Promise(resolve => {
      this.app.view.classList.remove('maze-in');

      // extend maze if it doesn't overflow screen
      const maxMazeSize = this.blockSize * this.mazeDimensions[0] + 200;
      if (maxMazeSize < window.innerHeight && maxMazeSize < window.innerWidth) {
        this.mazeDimensions = [this.mazeDimensions[0] + 1, this.mazeDimensions[1] + 1];
        this.velocityFactor *= 0.8;
      }

      this.destroy();
      this.initializeGame();
      setTimeout(() => resolve(this.app.view.classList.add('maze-in')), 100);
    });
  }

  async gameLoop (delta) {
    if (this.gameStatus === GAME_STATUS.STOPPED) {
      this.updateScoreBoardDom();
      this.gameStatus = GAME_STATUS.LOADING;
      await this.generateNextLevel();
      this.gameStatus = GAME_STATUS.ACTIVE;
    }
    if (this.gameStatus === GAME_STATUS.LOADING) {
      return;
    }

    for (let uid in this.players) {
      let player = this.players[uid];
      player.update(this.maze.getIntersection(player));
      for (let i = 0; i < player.bullets.length; i++) {
        let bullet = player.bullets[i];
        for (let uid in this.players) {
          let targetPlayer = this.players[uid];
          if (isHit(targetPlayer, bullet)) {
            if (player.uid === targetPlayer.uid) {
              for (let p in this.scoreBoard) {
                if (p !== player.uid) this.scoreBoard[p]++;
              }
            } else {
              this.scoreBoard[player.uid]++;
            }
            this.gameStatus = GAME_STATUS.STOPPED;

            return;
          }
        }
        if (!bullet.isActive) {
          player.bullets.splice(i, 1);
        } else {
          bullet.update(this.maze.getIntersection(bullet));
        }
      }
    }
  };

}

function isHit (targetPlayer, bullet) {
  let dx = targetPlayer.position.x - bullet.position.x;
  let dy = targetPlayer.position.y - bullet.position.y;
  let d = Math.sqrt(dx ** 2 + dy ** 2);
  return d <= targetPlayer.radius + bullet.radius;
}