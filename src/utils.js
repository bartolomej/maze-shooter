export async function showScreen (id) {
  return new Promise(resolve => {
    getById(id).classList.remove('hide');
    setTimeout(() => {
      getById(id).classList.add('screen-in');
      setTimeout(() => {
        getNavButton(id).classList.add('nav-button-in');
      }, 800 /* must equal screen css transition */);
      return resolve();
    }, 50)
  });
}

export async function hideScreen (id) {
  return new Promise(resolve => {
    getNavButton(id).classList.add('nav-button-out');
    setTimeout(() => {
      getById(id).classList.add('screen-out');
      getById(id).classList.remove('screen-in');
      setTimeout(() => {
        getById(id).classList.add('hide');
        getNavButton(id).classList.remove('nav-button-out');
        getNavButton(id).classList.remove('nav-button-in');
        getById(id).classList.remove('screen-out');
        return resolve();
      }, 800 /* must equal screen css transition */)
    }, 100);
  });
}

function getNavButton (screenId) {
  const children = getById(screenId).childNodes;
  for (let child of children) {
    if (child.classList && child.classList.contains('nav-button')) {
      return child;
    }
  }
  throw new Error(`Nav button not found in ${screenId}`)
}

export function getById (id) {
  return document.getElementById(id);
}