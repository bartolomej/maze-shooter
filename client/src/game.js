import { Application } from 'pixi.js';
import Maze from "./maze";
import Player from "./player";
import { KeyHandler, keys } from "./input";


// TODO: http://gameprogrammingpatterns.com/

const config = container => ({
  width: container.offsetWidth,
  height: container.offsetHeight,
  antialias: true,
  transparent: true,
  resolution: 1
});

export default class Game {

  constructor (container) {
    this.container = container;
    this.state = {};
    this.keyboard = {};
    this.init();
  }

  init () {
    this.app = new Application(config(this.container));
    this.container.appendChild(this.app.view);
    this.app.loader
      .add("car.svg")
      .load(() => this.setup());
    this.addEventListeners();
  };

  addEventListeners () {
    this.keyboard['left'] = new KeyHandler(keys.LEFT);
    this.keyboard['up'] = new KeyHandler(keys.UP);
    this.keyboard['right'] = new KeyHandler(keys.RIGHT);
    this.keyboard['down'] = new KeyHandler(keys.DOWN);
    // window resize handler
    window.addEventListener('resize', () => {
      this.app.renderer.resize(
        this.container.offsetWidth,
        this.container.offsetHeight
      );
    });
  }

  setup () {
    const blockSize = 50;

    this.state['maze'] = new Maze();
    this.state['maze'].generate(18, 18);
    this.state['maze'].draw(this.app.stage, blockSize);

    this.state['player'] = new Player('test');
    this.state['player'].draw(this.app.stage, blockSize / 5);

    this.app.ticker.add(delta => this.gameLoop(delta));
  };

  gameLoop (delta) {
    this.state['player'].move(
      this.keyboard.up.isDown,
      this.keyboard.down.isDown,
      this.keyboard.left.isDown,
      this.keyboard.right.isDown
    );
    this.state['player'].update();
  };

}