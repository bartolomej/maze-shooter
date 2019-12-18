import Game from "./game";

(function component() {
  const container = document.createElement('div');
  container.style.height = '100vh';
  container.style.width = '100vw';

  document.body.appendChild(container);

  const game = new Game(container);
})();