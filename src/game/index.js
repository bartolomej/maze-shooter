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
      this.scoreBoard[p.uid] = { kills: 0, hits: 0 };
    }
    this.blockSize = blockSize;
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
    // TODO: scale maze to fit screen
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
    for (let p of this.playersConfigs) {
      const randomBlock = this.maze.getRandomBlock();
      const initialDirection = randomBlock.getRandomEmptyWall();
      let player = new Player({
        uid: p.uid,
        name: p.name,
        position: randomBlock.centerPosition,
        initialDirection,
        size: randomBlock.width / 4,
        keys: p.controls,
        color: p.getColor()
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

        const name = createText(player.name);

        const killsWrapper = createDiv(null, ['score-row']);
        const killsLabel = createText('KILLS: ');
        const kills = createText(score.kills, `${uid}-kills`);
        killsWrapper.append(killsLabel, kills);

        const hitsWrapper = createDiv(null, ['score-row']);
        const hitsLabel = createText('HITS: ');
        const hits = createText(score.hits, `${uid}-hits`);
        hitsWrapper.append(hitsLabel, hits);

        playerContainer.append(name, killsWrapper, hitsWrapper);
        container.appendChild(playerContainer);
      }

      document.getElementById('game-screen').appendChild(container);
    }

    for (let uid in this.scoreBoard) {
      const score = this.scoreBoard[uid];
      document
        .getElementById(`${uid}-kills`)
        .innerText = score.kills;
      document
        .getElementById(`${uid}-hits`)
        .innerText = score.hits;
    }

  }

  async generateNextLevel () {
    return new Promise(resolve => {
      this.app.view.classList.remove('maze-in');
      this.mazeDimensions = [
        this.mazeDimensions[0] + 5,
        this.mazeDimensions[1] + 5
      ];
      this.destroy();
      this.initializeGame();
      setTimeout(() => {
        this.app.view.classList.add('maze-in');
        return resolve();
      }, 100);
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
          let dx = targetPlayer.position.x - bullet.position.x;
          let dy = targetPlayer.position.y - bullet.position.y;
          let d = dist(dx, dy);
          if (d <= targetPlayer.radius + bullet.radius) {
            this.scoreBoard[player.uid].kills++;
            this.scoreBoard[targetPlayer.uid].hits++;
            this.gameStatus = GAME_STATUS.STOPPED;
            return;
          }
        }
        if (!bullet.isActive) {
          player.bullets.splice(i, 1);
        }
        bullet.update(this.maze.getIntersection(bullet)[0]);
      }
    }
  };

}

function dist (dx, dy) {
  return Math.sqrt(dx ** 2 + dy ** 2);
}