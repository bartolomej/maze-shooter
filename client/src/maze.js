import { Graphics, Container } from 'pixi.js';


export default class Maze {

  constructor (onlineMaze = null) {
    this.maze = onlineMaze;
    this.isOnline = !!onlineMaze;
    this.blockSize = 50;
  }

  generate (rows, cols) {
    let stack = [];
    let grid = this.generateGrid(rows, cols);
    let current = grid[random(cols)][random(rows)];
    current.visited = true;
    stack.push(current);
    while (stack.length > 0) {
      let next = current.getRandomNeighbour(grid);
      if (next) {
        next.visited = true;
        stack.push(current);
        current.removeWall(next);
        current = next;
      } else if (stack.length > 0) {
        current = stack.pop();
      }
    }
    this.maze = grid;
  }

  generateGrid (rows, cols) {
    let grid = [];
    for (let i = 0; i < cols; i++) {
      let row = [];
      for (let j = 0; j < rows; j++) {
        row.push(new Block(j, i, this.blockSize));
      }
      grid.push(row);
    }
    return grid;
  }

  getRandomBlock () {
    let y = random(this.maze.length);
    let x = random(this.maze[y].length);
    return this.maze[y][x];
  }

  checkBulletCollision (bullet) {
    const blockX = Math.floor(bullet.position.x / this.blockSize);
    const blockY = Math.floor(bullet.position.y / this.blockSize);

    if (
      blockY < this.maze.length && blockX < this.maze[0].length &&
      blockY >= 0 && blockX >= 0
    ) {
      const currentBlock = this.maze[blockY][blockX];
      return currentBlock.checkWallCollision(bullet);
    }
  }

  update () {
    // state update logic if offline mode
    // add weapons on random blocks,...
    // remove random walls,...
  }

  draw (stage) {
    const container = new Container();
    for (let row of this.maze) {
      for (let block of row) {
        block.draw(container);
      }
    }
    stage.addChild(container);
  }

}

class Block {

  constructor (x, y, size) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.graphics = null;
    this.size = size;
    this.wallWidth = 5;
    this.walls = {
      TOP: true,
      RIGHT: true,
      BOTTOM: true,
      LEFT: true
    };
  }

  get positionX () {
    return this.x * this.size;
  }

  get positionY () {
    return this.y * this.size;
  }

  checkWallCollision (bullet) {
    const { TOP, RIGHT, BOTTOM, LEFT } = this.walls;
    const { x, y } = bullet.position;
    const r = bullet.radius;

    if (
      TOP &&
      dist(0, y - this.positionY - this.wallWidth) <= r &&
      y > this.positionY &&
      x > this.positionX &&
      x < this.positionX + this.size
    ) {
      return 'TOP';
    }

    if (
      BOTTOM &&
      dist(0, y - (this.positionY + this.size - this.wallWidth)) <= r &&
      y < this.positionY + this.size &&
      x > this.positionX &&
      x < this.positionX + this.size
    ) {
      return 'BOTTOM';
    }

    if (
      LEFT &&
      dist(x - this.positionX - this.wallWidth, 0) <= r &&
      x > this.positionX &&
      y > this.positionY &&
      y < this.positionY + this.size
    ) {
      return 'LEFT';
    }

    if (
      RIGHT &&
      dist(x - (this.positionX + this.size - this.wallWidth), 0) <= r &&
      x < this.positionX + this.size &&
      y > this.positionY &&
      y < this.positionY + this.size
    ) {
      return 'RIGHT';
    }
  }

  draw (parent) {
    let width = this.size;
    let height = this.size;

    let lines = new Graphics();
    lines.lineStyle(this.wallWidth, 0x000000, 1);

    const lineTo = (addX = 0, addY = 0) => {
      lines.lineTo(this.x * width + addX, this.y * height + addY);
    };
    const moveTo = (addX = 0, addY = 0) => {
      lines.moveTo(this.x * width + addX, this.y * height + addY);
    };

    moveTo(0, 0);

    if (this.walls.TOP) lineTo(width, 0);
    else moveTo(width, 0);

    if (this.walls.RIGHT) lineTo(width, height);
    else moveTo(width, height);

    if (this.walls.BOTTOM) lineTo(0, height);
    else moveTo(0, height);

    if (this.walls.LEFT) lineTo(0, 0);
    else moveTo(0, 0);

    this.graphics = lines;

    parent.addChild(lines);
  }

  getRandomEmptyWall () {
    let emptyWalls = [];
    for (let key of Object.keys(this.walls)) {
      if (!this.walls[key]) emptyWalls.push(key);
    }
    return emptyWalls[random(emptyWalls.length)];
  }

  getRandomNeighbour (grid) {
    let neighbours = [];
    const n = (x, y) => grid[y] ? grid[y][x] : undefined;

    let top = n(this.x, this.y - 1);
    let bottom = n(this.x, this.y + 1);
    let left = n(this.x - 1, this.y);
    let right = n(this.x + 1, this.y);

    if (top && !top.visited) {
      neighbours.push(top);
    }
    if (right && !right.visited) {
      neighbours.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbours.push(bottom);
    }
    if (left && !left.visited) {
      neighbours.push(left);
    }

    if (neighbours.length > 0) {
      return neighbours[random(neighbours.length)];
    } else {
      return undefined;
    }
  }

  removeWall (block) {
    let dx = this.x - block.x;
    if (dx === 1) {
      block.walls.RIGHT = false;
      this.walls.LEFT = false;
    } else if (dx === -1) {
      block.walls.LEFT = false;
      this.walls.RIGHT = false;
    }
    let dy = this.y - block.y;
    if (dy === 1) {
      block.walls.BOTTOM = false;
      this.walls.TOP = false;
    } else if (dy === -1) {
      block.walls.TOP = false;
      this.walls.BOTTOM = false;
    }
  }
}

function dist (dx, dy) {
  return Math.sqrt(dx ** 2 + dy ** 2);
}

function isBetween (value, target, diff) {
  return value < target + diff && value > target - diff;
}

function random (max, min = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}