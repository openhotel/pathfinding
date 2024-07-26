// src/utils/grid.utils.ts
var makeSquare = (layout) => {
  const maxLength = Math.max(layout.length, ...layout.map((row) => row.length));
  const squareLayout = Array.from({ length: maxLength }, () =>
    Array(maxLength).fill(null),
  );
  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < layout[i].length; j++) {
      squareLayout[i][j] = layout[i][j];
    }
  }
  return squareLayout;
};
var transpose = (matrix) => {
  const maxCols = Math.max(...matrix.map((row) => row.length));
  const transposed = Array.from({ length: maxCols }, () =>
    Array(matrix.length).fill(null),
  );
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      transposed[j][i] = matrix[i][j];
    }
  }
  return transposed;
};

// src/grid/openList.ts
var OpenList = class {
  constructor(comparator) {
    this.start = null;
    this.size = 0;
    this.comparator = comparator;
  }
  push(value) {
    if (this.start === null) {
      this.start = { value, next: null };
      this.size++;
      return;
    }
    if (this.comparator(value, this.start.value) < 0) {
      this.start = { value, next: this.start };
      this.size++;
      return;
    }
    let aux = this.start;
    while (aux.next !== null && this.comparator(value, aux.next.value) > 0) {
      aux = aux.next;
    }
    aux.next = { value, next: aux.next };
    this.size++;
  }
  pop() {
    if (this.start === null) throw new Error("popping from an empty list");
    const popped = this.start;
    this.start = popped.next;
    this.size--;
    return popped.value;
  }
  length() {
    return this.size;
  }
  isEmpty() {
    return this.start === null;
  }
  toString() {
    let aux = this.start;
    let str = "";
    while (aux !== null) {
      str += aux.value + " -> ";
      aux = aux.next;
    }
    return str;
  }
};

// src/grid/finder.ts
var NOT_REACHED_COST = 999999;
var MAX_JUMP_HEIGHT = 5;
var PathNode = class {
  constructor(point, from, cost, heuristicValue) {
    this.from = from;
    this.point = point;
    this.cost = cost;
    this.heuristicValue = heuristicValue;
  }
  toString() {
    return `(${this.point.x}, ${this.point.y}, cost: ${this.cost}, heuristic: ${this.heuristicValue})`;
  }
};
var findPath = (startPoint, endPoint, grid, config) => {
  const diagonalCostMultiplier = config.diagonalCostMultiplier ?? 1;
  const orthogonalCostMultiplier = config.orthogonalCostMultiplier ?? 1;
  const maxJumpCost = config.maxJumpCost ?? 5;
  const maxIterations = config.maxIterations ?? 99999;
  const index = (point) => {
    return point.y * grid.height + point.x;
  };
  const getMoveCostAt = (src, dst) => {
    if (!grid.inBounds(src) || !grid.inBounds(dst)) return null;
    const srcHeight = grid.getHeightAt(src) ?? NOT_REACHED_COST;
    const dstHeight = grid.getHeightAt(dst) ?? NOT_REACHED_COST;
    if (Math.abs(srcHeight - dstHeight) > MAX_JUMP_HEIGHT) return null;
    return 1 + Math.abs(srcHeight - dstHeight);
  };
  const addOrthogonalJumps = (prevNode, src, srcCost, dirX, dirY) => {
    let jumpDistance = 1;
    let accumulatedCost = 0;
    let prevPoint = src;
    while (true) {
      const target = {
        x: src.x + dirX * jumpDistance,
        y: src.y + dirY * jumpDistance,
      };
      if (!grid.isWalkable(target)) {
        break;
      }
      const moveCost = getMoveCostAt(prevPoint, target);
      if (moveCost === null) {
        break;
      }
      accumulatedCost += moveCost * orthogonalCostMultiplier;
      const targetIndex = index(target);
      const totalCost = srcCost + accumulatedCost;
      if (totalCost < visited[targetIndex]) {
        visited[targetIndex] = totalCost;
        queue.push(
          new PathNode(target, prevNode, totalCost, heuristic(target)),
        );
      }
      prevPoint = target;
      jumpDistance++;
      if (accumulatedCost > maxJumpCost) {
        break;
      }
    }
  };
  const addDiagonal = (prevNode, src, srcCost, dirX, dirY) => {
    const target = { x: src.x + dirX, y: src.y + dirY };
    const moveCost =
      srcCost +
      (getMoveCostAt(src, target) ?? NOT_REACHED_COST) * diagonalCostMultiplier;
    const targetHeight = grid.getHeightAt(target);
    const aux1 = { x: src.x, y: src.y + dirY };
    const aux2 = { x: src.x + dirX, y: src.y };
    const targetIndex = index(target);
    if (
      grid.isWalkable(target) &&
      grid.isWalkable(aux1) &&
      grid.isWalkable(aux2) &&
      targetHeight == grid.getHeightAt(aux1) &&
      targetHeight == grid.getHeightAt(aux2) &&
      moveCost < visited[targetIndex]
    ) {
      visited[targetIndex] = moveCost;
      queue.push(new PathNode(target, prevNode, moveCost, heuristic(target)));
    }
  };
  if (!grid.isWalkable(startPoint) || !grid.isWalkable(endPoint)) {
    return [];
  }
  const visited = new Float32Array(grid.width * grid.height);
  visited.fill(NOT_REACHED_COST);
  config.travelCosts = visited;
  const travelHeuristic = new Float32Array(grid.width * grid.height);
  travelHeuristic.fill(NOT_REACHED_COST);
  grid.walkMatrix((x, y) => {
    travelHeuristic[y * grid.height + x] = grid.distance({ x, y }, endPoint);
  });
  config.travelHeuristic = travelHeuristic;
  const heuristic = (a) => {
    return travelHeuristic[index(a)];
  };
  const comparator = (a, b) => {
    return a.cost + a.heuristicValue - (b.cost + b.heuristicValue);
  };
  const queue = new OpenList(comparator);
  let iterations = 0;
  visited[index(startPoint)] = 0;
  queue.push(new PathNode(startPoint, null, 0, heuristic(startPoint)));
  while (!queue.isEmpty()) {
    if (iterations > maxIterations) {
      return [];
    }
    iterations++;
    const node = queue.pop();
    const point = node.point;
    if (point.x === endPoint.x && point.y === endPoint.y) {
      return pathFromNode(node);
    }
    addOrthogonalJumps(node, point, node.cost, 0, -1);
    addOrthogonalJumps(node, point, node.cost, 0, 1);
    addOrthogonalJumps(node, point, node.cost, -1, 0);
    addOrthogonalJumps(node, point, node.cost, 1, 0);
    addDiagonal(node, point, node.cost, 1, 1);
    addDiagonal(node, point, node.cost, -1, 1);
    addDiagonal(node, point, node.cost, 1, -1);
    addDiagonal(node, point, node.cost, -1, -1);
  }
  return [];
};
var pathFromNode = (lastNode) => {
  const path = [];
  let node = lastNode;
  while (node) {
    path.push(node.point);
    node = node.from;
  }
  return path.reverse();
};

// src/grid/grid.ts
var NON_WALKABLE_HEIGHT = 0;
var Grid = class _Grid {
  constructor(width, height, costMatrix) {
    this.width = width;
    this.height = height;
    this.heightMatrix = costMatrix;
    if (width !== height) throw new Error("grid matrix must be square");
    if (costMatrix.length !== width * height)
      throw new Error("cost matrix must have the same dimensions as the grid");
  }
  static from(matrix) {
    if (matrix[0] === void 0 || matrix[0][0] === void 0)
      throw new Error("grid matrix cannot be empty");
    const mat = makeSquare(matrix);
    const height = mat.length;
    const width = mat[0].length;
    if (height !== width) throw new Error("grid matrix must be square");
    const costMatrix = new Float32Array(height * width);
    mat.forEach((row, y) => {
      row.forEach((cost, x) => {
        costMatrix[y * width + x] = cost;
      });
    });
    return new _Grid(width, height, costMatrix);
  }
  getHeightAt(point) {
    if (!this.inBounds(point)) return null;
    const cost = this.heightMatrix[this.index(point)];
    return cost === NON_WALKABLE_HEIGHT ? null : cost;
  }
  distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }
  index(point) {
    return point.y * this.height + point.x;
  }
  clone() {
    return new _Grid(
      this.width,
      this.height,
      new Float32Array(this.heightMatrix),
    );
  }
  inBounds(point) {
    return (
      point.x >= 0 &&
      point.x < this.width &&
      point.y >= 0 &&
      point.y < this.height
    );
  }
  isWalkable(point) {
    const heightAt = this.getHeightAt(point);
    return (
      this.inBounds(point) &&
      heightAt !== null &&
      heightAt !== NON_WALKABLE_HEIGHT
    );
  }
  walkMatrix(callback) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(x, y, this.heightMatrix[y * this.height + x]);
      }
    }
  }
  mapMatrix(callback) {
    const matrix = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        const value = callback(x, y, this.heightMatrix[y * this.height + x]);
        row.push(value);
      }
      matrix.push(row);
    }
    return matrix;
  }
  findPath(
    startPoint,
    endPoint,
    config = {
      maxJumpCost: 5,
      travelCosts: void 0,
    },
  ) {
    return findPath(startPoint, endPoint, this, config);
  }
};
export { Grid, makeSquare, transpose };
