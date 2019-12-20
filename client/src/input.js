export const keys = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown'
};

export class KeyHandler {

  constructor (value) {
    // key value
    this.value = value;
    // key states
    this.isDown = false;
    this.isUp = true;
    // attach custom event handlers
    this.onDown = undefined;
    this.onRelease = undefined;

    this.registerListeners();
  }

  downHandler (event) {
    if (event.key === this.value) {
      if (this.isDown && this.onDown) this.onDown();
      this.isDown = true;
      this.isUp = false;
      event.preventDefault();
    }
  }

  upHandler (event) {
    if (event.key === this.value) {
      if (this.isDown && this.onRelease) this.onRelease();
      this.isDown = false;
      this.isUp = true;
      event.preventDefault();
    }
  }

  registerListeners () {
    const bindedUpHandler = this.upHandler.bind(this);
    const bindedDownHandler = this.downHandler.bind(this);
    window.addEventListener("keydown", bindedDownHandler);
    window.addEventListener("keyup", bindedUpHandler);
  }

  unsubscribe () {
    window.removeEventListener("keydown", this.downHandler);
    window.removeEventListener("keyup", this.upHandler);
  }

}