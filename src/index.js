import Game from "./game/index";
import BackgroundAnimation from './background';
import Alert from "./alert";
import { PlayerSetup } from "./setup";
import { getById, hideScreen, showScreen } from "./utils";


window.players = [];

// register buttons click event listeners
getById('landing-to-setup').addEventListener('click', landingToSetup);
getById('setup-to-game').addEventListener('click', playGame);
getById('setup-to-landing').addEventListener('click', setupToLanding);
getById('game-to-landing').addEventListener('click', gameToLanding);
getById('landing-to-about').addEventListener('click', landingToAbout);
getById('about-to-landing').addEventListener('click', aboutToLanding);


(function () {
  window.setupScreenAnimation = new BackgroundAnimation(6);
  setupScreenAnimation.animate();
  setTimeout(() => showScreen('landing-screen'), 200);
})();

async function landingToSetup () {
  await hideScreen('landing-screen');
  await showScreen('setup-screen');

  // create default controls for 2 players
  let playersContainer = document.getElementById('players');
  addPlayer(playersContainer, {
    forward: 'KeyW',
    backward: 'KeyS',
    left: 'KeyA',
    right: 'KeyD',
    shoot: 'Space'
  });
  addPlayer(playersContainer, {
    forward: 'ArrowUp',
    backward: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    shoot: 'Enter'
  });

  let lastEvent; // prevent double click event bug
  getById('add-player-btn').addEventListener('click', e => {
    if (players.length < 4 && (lastEvent + 50) < e.timeStamp) {
      addPlayer(getById('players'));
    } else {
      // TODO: display message
    }
    lastEvent = e.timeStamp;
  });

  getById('remove-player-btn').addEventListener('click', e => {
    if (players.length > 2 && (lastEvent + 50) < e.timeStamp) {
      removePlayer(getById('players'))
    } else {
      // TODO: display message
    }
    lastEvent = e.timeStamp;
  });

  function removePlayer (container) {
    const player = players.pop();
    container.removeChild(player.domElement);
  }

  function addPlayer (container, controls) {
    const player = new PlayerSetup(players.length, controls);
    container.appendChild(player.domElement);
    players.push(player);
  }
}

async function playGame () {
  for (let player of players) {
    let invalidField = player.validate();
    if (invalidField) {
      alert(`${invalidField} key is not selected for ${player.name}`);
    }
  }

  await hideScreen('setup-screen');
  await showScreen('game-screen');

  for (let player of players) {
    player.destroy();
  }

  window.game = new Game({
    container: getById('game-container'),
    mazeDimensions: [10, 10],
    players: players
  });

  // reset setup state
  window.players = [];
  document.getElementById('players').innerHTML = '';
}

async function setupToLanding () {
  await hideScreen('setup-screen');
  await showScreen('landing-screen');

  for (let player of players) {
    player.destroy();
  }

  // reset setup state
  window.players = [];
  document.getElementById('players').innerHTML = '';
}

async function gameToLanding () {
  await hideScreen('game-screen');
  await showScreen('landing-screen');
  window.game.destroy();
}

async function landingToAbout () {
  await hideScreen('landing-screen');
  await showScreen('about-screen');
}

async function aboutToLanding () {
  await hideScreen('about-screen');
  await showScreen('landing-screen');
}