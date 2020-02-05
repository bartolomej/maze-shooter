export default class Alert {

  constructor (message, targetElement, parent = null) {
    this.message = message;
    this.domElement = null;
    this.target = targetElement;
    this.parent = parent;
  }

  show (type, selfDestroy = true) {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.padding = '20px';
    container.style.border = '2px solid black';
    container.style.borderRadius = '20px';

    if (this.target) {
      let rect = this.target.getBoundingClientRect();
      container.style.top = (rect.top - 100) + 'px';
      container.style.left = (rect.left) + 'px';
    } else {
      container.style.top = '20px';
      container.style.right = '20px';
    }
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'flex-end';

    if (type) {
      const title = document.createElement('h3');
      title.innerText = type;
      container.appendChild(title);
    }

    const message = document.createElement('span');
    message.innerText = this.message;
    message.style.fontWeight = '100';

    container.appendChild(message);

    console.log(container.getBoundingClientRect())
    this.domElement = container;
    if (this.parent) {
      this.parent.appendChild(container)
    } else {
      document.body.appendChild(container);
    }

    if (selfDestroy) {
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