import { Grid, transpose } from "./bundle.js";

const getPathFinding = (start, end) => {
  const original = [
    [
      0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 7, 10, 10, 10, 10, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 7, 10, 10, 10, 10, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 7, 10, 10, 10, 10, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 7, 10, 10, 10, 10, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 12, 12, 12, 12, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 15, 15, 15, 15, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 19, 19, 19, 19, 19, 19, 19, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    ],
  ];

  const layout = transpose(original);

  const grid = Grid.from(layout);

  const config = {
    maxJumpCost: 4,
    jumpBlockedDiagonals: Boolean(localStorage.getItem("jumpBlockedDiagonals")),
  };
  const path = grid.findPath(start, end, config);
  const data = new Uint8Array(grid.width * grid.height);

  for (let y = 0; y < grid.height; y++)
    for (let x = 0; x < grid.width; x++)
      data[y * grid.height + x] = grid.getHeightAt({ x, y }) || 0;

  return {
    path,
    start,
    end,
    grid: {
      data,
      width: grid.width,
      height: grid.height,
      metadata: config.travelCosts,
      metadata2: config.travelHeuristic,
    },
  };
};

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#main");
const ctx = canvas.getContext("2d");

let start = {
  x: 19,
  y: 17,
};

let end = {
  x: 19,
  y: 12,
};

async function update() {
  const data = getPathFinding(start, end);
  window.data = data;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cellSize = canvas.width / data.grid.width;
  const metadata = data.grid.metadata ?? [];
  const metadata2 = data.grid.metadata2 ?? [];

  const max = Object.values(data.grid.data).reduce(
    (acc, val) => Math.max(acc, val),
    0,
  );

  for (let y = 0; y < data.grid.height; y++) {
    for (let x = 0; x < data.grid.width; x++) {
      const val = data.grid.data[y * data.grid.height + x];

      if (val === 0) {
        ctx.fillStyle = `black`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - (val / max) * 0.9})`;
      }
      ctx.fillRect(cellSize * x, cellSize * y, cellSize, cellSize);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(cellSize * x, cellSize * y, cellSize, cellSize);

      const height = metadata[y * data.grid.height + x] ?? 999999;
      if (height < 999999) {
        const pad = 1;
        ctx.fillStyle = "#F00";
        ctx.font = "12px Arial";
        ctx.fillText(
          String((height * 10) | 0),
          cellSize * x + 2 + pad,
          cellSize * y + 12 + pad,
        );
      }

      const heuristic = metadata2[y * data.grid.height + x] ?? 999999;
      if (heuristic < 999999) {
        const pad = 1;
        ctx.fillStyle = "#0F0";
        ctx.font = "12px Arial";
        ctx.fillText(
          String((heuristic * 10) | 0),
          cellSize * x + 2 + pad,
          cellSize * y + 12 + pad + 10,
        );
      }
    }
  }

  const pad = cellSize * 0.25;
  ctx.fillStyle = "#0F0";
  ctx.fillRect(
    cellSize * data.start.x + pad,
    cellSize * data.start.y + pad,
    cellSize - pad * 2,
    cellSize - pad * 2,
  );
  ctx.fillStyle = "#F00";
  ctx.fillRect(
    cellSize * data.end.x + pad,
    cellSize * data.end.y + pad,
    cellSize - pad * 2,
    cellSize - pad * 2,
  );

  let prevPoint = data.start;
  data.path.forEach((point, i) => {
    const pad = cellSize * 0.35;

    ctx.fillStyle = `rgba(0, 0, 255, ${i / data.path.length})`;
    ctx.fillRect(
      cellSize * point.x + pad,
      cellSize * point.y + pad,
      cellSize - pad * 2,
      cellSize - pad * 2,
    );

    ctx.beginPath();
    ctx.moveTo(
      cellSize * prevPoint.x + cellSize / 2,
      cellSize * prevPoint.y + cellSize / 2,
    );
    ctx.lineTo(
      cellSize * point.x + cellSize / 2,
      cellSize * point.y + cellSize / 2,
    );
    ctx.closePath();
    let grad = ctx.createLinearGradient(
      cellSize * prevPoint.x + cellSize / 2,
      cellSize * prevPoint.y + cellSize / 2,
      cellSize * point.x + cellSize / 2,
      cellSize * point.y + cellSize / 2,
    );
    grad.addColorStop(0, "#00F");
    grad.addColorStop(1, "#F0F");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineWidth = 1;

    prevPoint = point;
  });

  console.log("start", data.start);
  console.log("end", data.end);
  console.log("path", data.path);
}

canvas.onmousedown = (e) => {
  const cellSize = canvas.width / data.grid.width;
  const x = Math.floor(e.offsetX / cellSize);
  const y = Math.floor(e.offsetY / cellSize);

  if (e.button === 0) {
    start = { x, y };
  } else {
    end = { x, y };
  }

  update();
};

update();

window.oncontextmenu = function () {
  return false;
};
