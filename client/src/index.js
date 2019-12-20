import Environment from "./environment";


(function component () {
  const container = document.createElement('div');
  container.style.height = '100vh';
  container.style.width = '100vw';
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';

  document.body.appendChild(container);

  new Environment({
    container,
    mazeDimensions: [10, 10]
  });
})();