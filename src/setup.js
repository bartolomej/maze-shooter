import Color from "color";
import uuid from 'uuid/v4';

export class PlayerSetup {

  constructor (index, controls) {
    this.uid = uuid();
    this.index = index;
    this.name = `player${index}`;
    this.color = PlayerSetup.getRandomColor();
    this.domElement = null;
    this.animationFrame = null;
    this.counter = 0;
    this.animationState = {};
    this.ctx = null;
    this.controls = controls
      ? controls
      : { forward: null, backward: null, left: null, right: null, shoot: null };

    this.generate();
  }

  getColor () {
    let color = this.color.hex();
    return parseInt(color.substring(1, color.length), 16)
  }

  static getRandomColor () {
    const rand = () => Math.random() * 255;
    return Color.rgb(rand(), rand(), rand());
  }

  validate () {
    for (let key in this.controls) {
      if (this.controls[key] == null) {
        return key;
      }
    }
    return null;
  }

  destroy () {
    window.cancelAnimationFrame(this.animationFrame);
  }

  generate (index) {
    const controls = this.controls;
    const container = document.createElement('div');
    container.classList.add('player-setup');

    container.appendChild(this.createGraphicElement());
    container.appendChild(this.createNameElement());
    container.appendChild(this.createControlsElement('forward', controls && controls.forward));
    container.appendChild(this.createControlsElement('backward', controls && controls.backward));
    container.appendChild(this.createControlsElement('left', controls && controls.left));
    container.appendChild(this.createControlsElement('right', controls && controls.right));
    container.appendChild(this.createControlsElement('shoot', controls && controls.shoot));

    this.domElement = container;
  }

  createGraphicElement () {
    const container = document.createElement('div');
    const canvas = document.createElement('canvas');
    this.ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let bindedAnimate = this.animate.bind(this);
    this.animationFrame = window.requestAnimationFrame(bindedAnimate);

    // initialize animation state
    this.animationState.x = this.ctx.canvas.width / 2;
    this.animationState.y = this.ctx.canvas.height / 2;

    return container;
  }

  animate () {
    const {x, y} = this.animationState;
    const sizeX = this.ctx.canvas.width;
    const sizeY = this.ctx.canvas.height;

    this.ctx.clearRect(0, 0, sizeX, sizeY);
    this.ctx.beginPath();

    this.ctx.fillStyle = this.color.hex();
    this.ctx.arc(x, y, sizeY / 5, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.arc(x, y, sizeY / 10, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.fillRect(x, y - sizeY / 20, sizeY / 5, sizeY / 10);

    this.counter++;

    let bindedAnimate = this.animate.bind(this);
    window.requestAnimationFrame(bindedAnimate);
  }

  createNameElement () {
    const container = document.createElement('div');
    const nameInput = document.createElement('input');
    const text = document.createTextNode('username');
    nameInput.addEventListener('input', e => {
      players[this.index]['name'] = e.target.value;
    });
    container.classList.add('player-setup-row');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('value', `player${this.index}`);
    container.appendChild(text);
    container.appendChild(nameInput);
    return container;
  }

  createControlsElement (type, value) {
    const control = document.createElement('div');
    const btn = document.createElement('button');
    const text = document.createTextNode(type);
    btn.addEventListener('click', e => {
      btn.addEventListener('keyup', e => {
        btn.innerHTML = e.code;
        players[this.index]['controls'][type] = e.code;
      })
    });
    btn.innerHTML = value ? value : 'Choose button...';
    control.classList.add('player-setup-row');
    control.appendChild(text);
    control.appendChild(btn);
    return control;
  }

}