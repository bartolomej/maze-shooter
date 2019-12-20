import { Graphics } from 'pixi.js';


export default class Maze {

  constructor (onlineMaze = null) {
    this.maze = onlineMaze;
    this.isOnline = !!onlineMaze;
    this.blockSize = null;
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
        row.push(new Block(j, i));
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

  update () {
    // state update logic if offline mode
    // add weapons on random blocks,...
    // remove random walls,...
  }

  draw (stage, blockSize) {
    this.blockSize = blockSize;
    for (let row of this.maze) {
      for (let block of row) {
        block.draw(blockSize, blockSize, stage);
      }
    }
  }

}

class Block {

  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.path = null;
    this.walls = {
      TOP: true,
      RIGHT: true,
      BOTTOM: true,
      LEFT: true
    };
  }

  draw (width, height, stage) {
    let lines = new Graphics();
    lines.lineStyle(5, 0x000000, 1);

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

    this.path = lines;

    stage.addChild(lines);
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

function isBetween (value, target, diff) {
  return value < target + diff && value > target - diff;
}

function random (max, min = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}