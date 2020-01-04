export function show (id) {
  getById(id).style.display = 'flex';
}

export function hide (id) {
  getById(id).style.display = 'none';
}

export function getById (id) {
  return document.getElementById(id);
}