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
    if (event.code === this.value) {
      if (this.isDown && this.onDown) this.onDown();
      this.isDown = true;
      this.isUp = false;
      event.preventDefault();
    }
  }

  upHandler (event) {
    if (event.code === this.value) {
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


/** DOM MANIPULATION HELPERS **/

export function createDiv (id, classes = []) {
  let div = document.createElement('div');
  if (id) div.id = id;
  for (let c of classes) div.classList.add(c);
  return div;
}

export function createText (text, id, classes = []) {
  let span = document.createElement('span');
  if (id) span.id = id;
  for (let c of classes) span.classList.add(c);
  span.innerText = text;
  return span;
}