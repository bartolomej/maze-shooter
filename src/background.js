export default class BackgroundAnimation {

  constructor (balls = 100, parent) {
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
    canvas.style.opacity = '0.2';

    this.ctx = canvas.getContext('2d');
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    if (this.parent) {
      this.parent.appendChild(canvas);
    } else {
      document.body.appendChild(canvas);
    }

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