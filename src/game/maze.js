import { Container, Graphics } from 'pixi.js';


export default class Maze {

  constructor (blockSize) {
    this.maze = null;
    this.blockSize = blockSize;
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

  getIntersection (bullet) {
    //const blockX = Math.floor(bullet.position.x / this.blockSize);
    //const blockY = Math.floor(bullet.position.y / this.blockSize);

    // check for all surrounding blocks
    for (let y = 0; y < this.maze.length; y++) {
      for (let x = 0; x < this.maze[0].length; x++) {
        const currentBlock = this.maze[y][x];
        const collisions = currentBlock.intersects(bullet);
        if (collisions.length !== 0) return collisions;
      }
    }
    return [];
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
    this.width = size;
    this.height = size;
    this.thickness = 5;
    this.walls = {
      TOP: true,
      RIGHT: true,
      BOTTOM: true,
      LEFT: true
    };
  }

  get centerPosition () {
    return {
      x: (this.x * this.width) + (this.width / 2),
      y: (this.y * this.height) + (this.height / 2)
    }
  }

  get position () {
    return {
      x: this.x * this.width,
      y: this.y * this.height
    }
  }

  intersects (circle) {
    const { TOP, RIGHT, BOTTOM, LEFT } = this.walls;
    const collisions = [];

    const topRect = {
      width: this.width,
      height: this.thickness,
      position: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.thickness
      }
    };

    const bottomRect = {
      ...topRect,
      position: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height - this.thickness
      }
    };

    const leftRect = {
      width: this.thickness,
      height: this.height,
      position: {
        x: this.position.x + this.thickness,
        y: this.position.y + this.height / 2
      }
    };

    const rightRect = {
      ...leftRect,
      position: {
        x: this.position.x + this.width - this.thickness,
        y: this.position.y + this.height / 2
      }
    };

    let isTop = intersectsCircleRect(circle, topRect);
    if (TOP && isTop) {
      collisions.push(isTop);
    }

    let isBottom = intersectsCircleRect(circle, bottomRect);
    if (BOTTOM && isBottom) {
      collisions.push(isBottom);
    }

    let isLeft = intersectsCircleRect(circle, leftRect);
    if (LEFT && isLeft) {
      collisions.push(isLeft);
    }

    let isRight = intersectsCircleRect(circle, rightRect);
    if (RIGHT && isRight) {
      collisions.push(isRight);
    }

    return collisions;
  }

  draw (parent) {
    let lines = new Graphics();
    lines.lineStyle(this.thickness, 0x000000, 1, 0);

    const line = (addX = 0, addY = 0) => {
      lines.lineTo(this.position.x + addX, this.position.y + addY);
    };
    const move = (addX = 0, addY = 0) => {
      lines.moveTo(this.position.x + addX, this.position.y + addY);
    };

    move(0, 0);

    if (this.walls.TOP) line(this.width, 0);
    else move(this.width, 0);

    if (this.walls.RIGHT) line(this.width, this.height);
    else move(this.width, this.height);

    if (this.walls.BOTTOM) line(0, this.height);
    else move(0, this.height);

    if (this.walls.LEFT) line(0, 0);
    else move(0, 0);

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

function intersectsCircleRect (circle, rect) {
  const distance = {
    x: Math.abs(circle.position.x - rect.position.x),
    y: Math.abs(circle.position.y - rect.position.y)
  };

  if (distance.x > (rect.width / 2 + circle.radius)) return false;
  if (distance.y > (rect.height / 2 + circle.radius)) return false;

  if (distance.x <= (rect.width / 2)) return 'Y';
  if (distance.y <= (rect.height / 2)) return 'X';

  const cornerDistance =
    (distance.x - rect.width / 2) ^ 2 +
    (distance.y - rect.height / 2) ^ 2;

  if (cornerDistance <= (circle.radius ^ 2)) {
    return 'C'
  } else {
    return false;
  }
}

function random (max, min = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}