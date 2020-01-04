import Game from "./game";

const getById = id => document.getElementById(id);

window.players = [];

// buttons click event listeners
getById('local-mode-btn').addEventListener('click', localModeHandler);
getById('play-game-btn').addEventListener('click', playHandler);
getById('exit-game-btn').addEventListener('click', exitHandler);


function localModeHandler () {
  hideSetup();
  showSettings();

  // create default fields for 2 players
  let playersContainer = document.getElementById('players');
  addPlayer(playersContainer);
  addPlayer(playersContainer);

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
    container.removeChild(player.element);
  }

  function addPlayer (container) {
    const player = {
      name: `player${players.length}`,
      element: generatePlayerSetupElement(players.length),
      controls: { forward: null, backward: null, left: null, right: null, shoot: null }
    };
    container.appendChild(player.element);
    players.push(player);
  }
}

function playHandler () {
  for (let player of players) {
    for (let key in player.controls) {
      if (player.controls[key] == null) {
        alert(`${key} key is not selected for ${player.name}`);
        return;
      }
    }
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

function exitHandler () {
  window.game.destroy();
  hideGame();
  showSetup();
}

function generatePlayerSetupElement (index) {
  const container = document.createElement('div');
  container.classList.add('player-setup');

  container.appendChild(createNameElement(index));
  container.appendChild(createControlsElement('forward'));
  container.appendChild(createControlsElement('backward'));
  container.appendChild(createControlsElement('left'));
  container.appendChild(createControlsElement('right'));
  container.appendChild(createControlsElement('shoot'));

  return container;

  function createNameElement (index) {
    const container = document.createElement('div');
    const nameInput = document.createElement('input');
    const text = document.createTextNode('username');
    nameInput.addEventListener('input', e => {
      players[index]['name'] = e.target.value;
    });
    container.classList.add('player-setup-row');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('value', `player${index}`);
    container.appendChild(text);
    container.appendChild(nameInput);
    return container;
  }

  function createControlsElement (type) {
    const control = document.createElement('div');
    const btn = document.createElement('button');
    const text = document.createTextNode(type);
    btn.addEventListener('click', e => {
      btn.addEventListener('keyup', e => {
        btn.innerHTML = e.code;
        players[index]['controls'][type] = e.code;
      })
    });
    btn.innerHTML = 'Choose button...';
    control.classList.add('player-setup-row');
    control.appendChild(text);
    control.appendChild(btn);
    return control;
  }
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