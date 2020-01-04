import Color from "color";


export class ModalWindow {

  constructor (message, type, x, y, parent, selfDestroy = true) {
    this.message = message;
    this.type = type;
    this.domElement = null;
    this.position = { x, y };
    this.parent = parent;
    this.selfDestroy = selfDestroy;
  }

  show () {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    if (!this.position.x || !this.position.y) {
      container.style.top = '20px';
      container.style.right = '20px';
    } else {
      container.style.top = this.position.y + 'px';
      container.style.left = this.position.x + 'px';
    }
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'flex-end';

    if (this.type) {
      const title = document.createElement('h3');
      title.innerText = this.type;
      container.appendChild(title);
    }

    const message = document.createElement('span');
    message.innerText = this.message;
    message.style.fontWeight = '100';

    container.appendChild(message);

    this.domElement = container;
    if (this.parent) {
      this.parent.appendChild(container)
    } else {
      document.body.appendChild(container);
    }

    if (this.selfDestroy) {
      setTimeout(() => {
        this.hide();
      }, 3000);
    }
  }

  hide () {
    if (this.parent) {
      this.parent.removeChild(this.domElement);
    } else {
      document.body.removeChild(this.domElement);
    }
  }

}

export class PlayerSetup {

  constructor (index, controls) {
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


export class BackgroundAnimation {

  constructor (parent, balls = 100) {
    this.balls = balls;
    this.animationFrame = null;
    this.parent = parent;
    this.ctx = null;
    this.state = {
      balls: []
    };
    this.setup();
  }

  setup () {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.filter = 'blur(2px)';

    this.ctx = canvas.getContext('2d');
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    this.animationFrame = requestAnimationFrame(this.animate.bind(this));

    for (let i = 0; i < this.balls; i++) {
      this.state.balls.push({
        x: Math.random() * this.ctx.canvas.width,
        y: Math.random() * this.ctx.canvas.height,
        size: Math.random() * 20,
        dx: Math.random(),
        dy: Math.random(),
        color: `rgba(0,0,0,${Math.random()})`
      })
    }

    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize () {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }

  animate () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (let ball of this.state.balls) {
      this.ctx.beginPath();
      this.ctx.fillStyle = ball.color;
      this.ctx.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();

      if (ball.x >= window.innerWidth || ball.x <= 0) {
        ball.dx *= -1;
      }
      if (ball.y >= window.innerHeight || ball.y <= 0) {
        ball.dy *= -1;
      }

      ball.x += ball.dx;
      ball.y += ball.dy;
    }

    requestAnimationFrame(this.animate.bind(this))
  }

  destroy () {
    this.parent.removeChild(this.ctx.canvas);
    cancelAnimationFrame(this.animationFrame);
  }

}