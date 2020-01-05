import Game from "./game/index";
import BackgroundAnimation from './background';
import Alert from "./alert";
import { PlayerSetup } from "./setup";
import { getById, hide, show } from "./utils";


window.players = [];

// register buttons click event listeners
getById('local-mode-btn').addEventListener('click', localModeHandler);
getById('play-game-btn').addEventListener('click', playHandler);
getById('back-to-setup-btn').addEventListener('click', backToSetupHandler);
getById('exit-game-btn').addEventListener('click', exitHandler);
getById('go-to-about-btn').addEventListener('click', goToAboutHandler);
getById('go-to-landing-btn').addEventListener('click', goToLandingHandler);


(function () {
  const container = getById('setup-screen');
  window.setupScreenAnimation = new BackgroundAnimation(container, 50);
  setupScreenAnimation.animate();
})();

function onlineModeHandler (e) {
  window.modal = new Alert('Online mode not available yet!');
  window.modal.show();
}

function localModeHandler () {
  hide('landing-screen');
  show('setup-screen');

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

function playHandler () {
  for (let player of players) {
    let invalidField = player.validate();
    if (invalidField) {
      alert(`${invalidField} key is not selected for ${player.name}`);
    }
  }

  for (let player of players) {
    player.destroy();
  }

  hide('setup-screen');
  show('game-screen');

  window.game = new Game({
    container: getById('game-container'),
    mazeDimensions: [10, 10],
    players: players
  });

  // reset setup state
  window.players = [];
  document.getElementById('players').innerHTML = '';
}

function backToSetupHandler () {
  for (let player of players) {
    player.destroy();
  }

  // reset setup state
  window.players = [];
  document.getElementById('players').innerHTML = '';

  hide('setup-screen');
  show('landing-screen');
}

function exitHandler () {
  window.game.destroy();
  hide('game-screen');
  show('landing-screen');
}

function goToAboutHandler () {
  hide('landing-screen');
  show('about-screen');
}

function goToLandingHandler () {
  hide('about-screen');
  show('landing-screen');
}