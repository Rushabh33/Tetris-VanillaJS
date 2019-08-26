const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tetrominoSize = 10;
const dropInterval = 1500;

const canvasWidth = canvas.getAttribute("width")
const canvasHeight = canvas.getAttribute("height")
const canvasScale = 20
const canvasColumns = canvasWidth / canvasScale
const canvasRows = canvasHeight / canvasScale


ctx.scale(canvasScale, canvasScale)

const I = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ]
];

const J = [
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0]
  ],
  [
    [0, 2, 2],
    [0, 2, 0],
    [0, 2, 0]
  ],
  [
    [0, 0, 0],
    [2, 2, 2],
    [0, 0, 2]
  ],
  [
    [0, 2, 0],
    [0, 2, 0],
    [2, 2, 0]
  ]
];

const L = [
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0]
  ],
  [
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3]
  ],
  [
    [0, 0, 0],
    [3, 3, 3],
    [3, 0, 0]
  ],
  [
    [3, 3, 0],
    [0, 3, 0],
    [0, 3, 0]
  ]
];

const O = [
  [
    [0, 0, 0, 0],
    [0, 4, 4, 0],
    [0, 4, 4, 0],
    [0, 0, 0, 0],
  ]
];

const S = [
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0]
  ],
  [
    [0, 5, 0],
    [0, 5, 5],
    [0, 0, 5]
  ],
  [
    [0, 0, 0],
    [0, 5, 5],
    [5, 5, 0]
  ],
  [
    [5, 0, 0],
    [5, 5, 0],
    [0, 5, 0]
  ]
];

const T = [
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0]
  ],
  [
    [0, 6, 0],
    [0, 6, 6],
    [0, 6, 0]
  ],
  [
    [0, 0, 0],
    [6, 6, 6],
    [0, 6, 0]
  ],
  [
    [0, 6, 0],
    [6, 6, 0],
    [0, 6, 0]
  ]
];

const Z = [
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0]
  ],
  [
    [0, 0, 7],
    [0, 7, 7],
    [0, 7, 0]
  ],
  [
    [0, 0, 0],
    [7, 7, 0],
    [0, 7, 7]
  ],
  [
    [0, 7, 0],
    [7, 7, 0],
    [7, 0, 0]
  ]
];


const player = {
  points: 0,
  pos: { x: 4, y: 0 },
  posBottom: false,
  tetrominoMatrix: L[0],
  currentTetrominoRot: 0,
  currentTetrominoType: 4,
  tetrominoTypes: [Z, T, S, O, L, J, I],
  tetrominoColors: [null, "red", "blue", "green", "yellow", "white", "purple", "orange"]
}



function draw() {
  // clearing the canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // drawing the gameGrid
  drawTetromino(gameGrid, { x: 0, y: 0 })
  // drawing the tetromino
  drawTetromino(player.tetrominoMatrix, player.pos)

}

function drawTetromino(tetrominoMatrix, offset) {
  tetrominoMatrix.forEach((row, y) => {
    row.forEach((columnValue, x) => {
      if (columnValue !== 0) {
        ctx.fillStyle = player.tetrominoColors[columnValue];
        ctx.fillRect(
          x + offset.x,
          y + offset.y,
          1, 1);
      }
    })
  })
}



let lastTime = 0
// think about a do while here?
function update(time) {
  if (!lastTime || time - lastTime >= dropInterval) {
    // Enclosing the player.pos.y++ for a better timed down movement
    if (lastTime) {
      moveTetrominoDown()
    }
    lastTime = time
  }
  draw();
  requestAnimationFrame(update);
}

let gameGrid = [];
function createGrid(column, row) {
  for (let i = 0; i < row; i++) {
    gameGrid[i] = [];
    for (let j = 0; j < column; j++) {
      gameGrid[i][j] = 0;
    }
  }
}

canvas.addEventListener('keydown', e => {
  switch (e.keyCode) {
    case 37:
      moveTetrominoHorizontal(-1)
      break;
    case 38:
      rotateTetromino(player)
      break;
    case 39:
      moveTetrominoHorizontal(1)
      break;
    case 40:
      moveTetrominoDown()
      break;
  }
})

// ****************************************************************

function moveTetrominoDown() {
  player.pos.y++;
  if (collisonDetection(player, gameGrid)) {
    player.pos.y--;
    resolveTetromino(player.tetrominoMatrix, gameGrid);
    sweepLine(gameGrid)
    playerReset()
  }
}

// ****************************************************************

function moveTetrominoHorizontal(direction) {
  player.pos.x += direction
  if (collisonDetection(player, gameGrid)) {
    player.pos.x += -direction
  }

}

function rotateTetromino(player) {
  if (player.currentTetrominoType !== 3) {   // Ignoring the Square tetromino
    player.currentTetrominoRot = (player.currentTetrominoRot + 1) % 4;
    player.tetrominoMatrix = player.tetrominoTypes[player.currentTetrominoType][player.currentTetrominoRot];
    if (collisonDetection(player, gameGrid)) {

      // Hitting bottom wall
      if (player.posBottom) {
        // Replace this with recursion?
        while (player.posBottom && collisonDetection(player, gameGrid)) {
          player.pos.y--
        }
      }

      // Hitting left wall
      if (player.pos.x < canvasColumns / 2) {
        console.log("less than, left")
        if (player.currentTetrominoType === 6) {
          player.pos.x += 2;
        }
        player.pos.x++
      }

      // Hitting right wall
      if (player.pos.x > canvasColumns / 2) {
        console.log("more than, right")
        if (player.currentTetrominoType === 6) {
          player.pos.x -= 2;
        }
        player.pos.x--
      }

      //Hitting other pieces
      // else {
      while (collisonDetection(player, gameGrid)) {
        player.pos.y--
        // }
      }
    }
  }
}

function collisonDetection(player, gameGrid) {
  // compare the position of the player tetro with the gamegrid - check for overlap
  // overlap and NOT anticipation... so we'll move it back instead
  // The x and y of each square is offset + the x & y from the for loop index, so we need to recrate it to get exact values to compare the gameGrid
  // using for loop instead of forEach because you can't exit out of a forEach....goddamn
  // gameGrid[y + player.pos.y][x + player.pos.x]
  // ^^ checks if a 1 already exists in the grid AND if gameGrid[x + player.pos.x]exists
  // ASK ABOUT THIs...getting a weird undefined which I've solved but don't understand origin. gameGrid[y + player.pos.y][x + player.pos.x] comes up as with error [y + player.pos.y] is undefined...which is why I put ||
  const matrix = player.tetrominoMatrix
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] !== 0 && (gameGrid[y + player.pos.y] === undefined || gameGrid[y + player.pos.y][x + player.pos.x] !== 0)) {
        if (gameGrid[y + player.pos.y] === undefined) {
          console.log("player is @ bot");
          player.posBottom = true;
        } else { player.posBottom = false }
        return true
      }
    }
  }
  return false
}

function resolveTetromino(tetromino, gameGrid) {
  tetromino.forEach((row, y) => {
    row.forEach((columnValue, x) => {
      if (columnValue !== 0) {
        gameGrid[y + player.pos.y][x + player.pos.x] = columnValue;
      }
    })
  })
}

// splice (index to start changing the array, 1 (number of elements to remove from start))
// unshift () x the amount of rows cleared

function sweepLine(gameGrid) {
  let whichRowsToClear = []
  for (let y = 0; y < gameGrid.length; y++) {
    // check which and how many rows are full
    if (isRowFull(gameGrid[y])) {
      whichRowsToClear.push(y) // which rows to clear & how many = whichRowsToClear.length - 1 
    }
  }

  whichRowsToClear.forEach(rowIndex => {
    gameGrid.splice(rowIndex, 1)
    gameGrid.unshift(new Array(canvasColumns).fill(0))
  })
}

function isRowFull(row) {
  for (let x = 0; x < row.length; x++) {
    if (!row[x]) {
      return false
    }
  }
  return true
}


function playerReset() {
  const nextTetromino = Math.floor(Math.random() * 7);
  console.log(nextTetromino)
  player.tetrominoMatrix = player.tetrominoTypes[nextTetromino][0];
  player.currentTetrominoType = nextTetromino;
  player.pos.y = 0;
  player.pos.x = 4;
  if (collisonDetection(player, gameGrid)) {
    console.log("player reset")
    for (let y = 0; y < gameGrid.length; y++) {
      for (let x = 0; x < gameGrid[y].length; x++) {
        gameGrid[y][x] = 0;
      }
    }
  }
}

createGrid(canvasColumns, canvasRows);
update();

