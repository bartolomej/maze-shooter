import { Application, Sprite, Graphics } from 'pixi.js';
import Maze from "./maze";

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

    this.init();
  }

  init () {
    this.app = new Application(config(this.container));
    this.container.appendChild(this.app.view);
    this.app.loader
      .add("car.svg")
      .load(() => this.setup());

    window.addEventListener('resize', () => {
      this.app.renderer.resize(this.container.offsetWidth, this.container.offsetHeight);
    });
  };

  setup () {
    this.state['maze'] = new Maze();
    this.state['maze'].generate(20, 20);
    this.state['maze'].draw(this.app.stage, 50);

    this.state['car'] = new Sprite(this.app.loader.resources["car.svg"].texture);
    this.state['car'].y = 0;
    this.state['car'].x = 0;

    this.app.stage.addChild(this.state['car']);

    this.app.ticker.add(delta => this.gameLoop(delta));
  };

  gameLoop (delta) {
    this.state['car'].x += 1;
    this.state['car'].y += 1;
  };

}