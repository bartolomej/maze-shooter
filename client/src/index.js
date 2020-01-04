import Game from "./game";
import { PlayerSetup } from "./setup";


const getById = id => document.getElementById(id);

window.players = [];

// register buttons click event listeners
getById('local-mode-btn').addEventListener('click', localModeHandler);
getById('play-game-btn').addEventListener('click', playHandler);
getById('back-to-setup-btn').addEventListener('click', backToSetupHandler);
getById('exit-game-btn').addEventListener('click', exitHandler);

function localModeHandler () {
  hideSetup();
  showSettings();

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

  getById('add-player-btn').addEventListener('click', e => {
    if (players.length < 4) {
      addPlayer(getById('players'));
    } else {
      // TODO: display message
    }
  });

  getById('remove-player-btn').addEventListener('click', e => {
    if (players.length > 2) {
      removePlayer(getById('players'))
    } else {
      // TODO: display message
    }
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

  hideSettings();
  showGame();

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

  hideSettings();
  showSetup();
}

function exitHandler () {
  window.game.destroy();
  hideGame();
  showSetup();
}

function showSetup () {
  getById('setup-screen').style.display = 'flex';
}

function hideSetup () {
  getById('setup-screen').style.display = 'none';
}

function showSettings () {
  getById('settings-screen').style.display = 'flex';
}

function hideSettings () {
  getById('settings-screen').style.display = 'none';
}

function showGame () {
  getById('game-screen').style.display = 'flex';
}

function hideGame () {
  getById('game-screen').style.display = 'none';
}