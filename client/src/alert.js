export default class Alert {

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