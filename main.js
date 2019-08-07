function draw() {
  const c = document.getElementById("canvas");
  const ctx = c.getContext("2d");

  const tetrominoSize = 10

  if (canvas.getContext) {
    // ctx.fillStyle = 'rgb(200, 0, 0)';
    // ctx.fillRect(10, 10, 50, 50);

    // drawing each piece out right, without a 4x4 grid.
    const TetrominoL = [
      { x: 10, y: 40 },
      { x: 10, y: 50 },
      { x: 20, y: 50 },
      { x: 30, y: 50 }
    ]


    tetrominoCoordinates(TetrominoL)





    function drawSquare(coordinate) {
      ctx.fillStyle = 'rgb(200, 0, 0)';
      ctx.fillRect(coordinate.x, coordinate.y, tetrominoSize, tetrominoSize);
    }
    function tetrominoCoordinates(tetromino) {
      tetromino.forEach(drawSquare)
    }










  }
  else {
    return alert("get a better browser...")
  }
}

draw();