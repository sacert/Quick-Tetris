// great wall of global variables
// travelers beware
var c = document.getElementsByTagName('canvas')[0];
var ctx = c.getContext("2d");
var w = 350;
var h = 600;
var ROWS = 20;
var COLS = 10;
var BLOCK_W = w/ COLS;
var BLOCK_H  = h/ ROWS;
var shape;
var tetrisBoard = [];
var currX, currY;
var firstTime = true;
var pieceSize;
var gameOver = false;

window.addEventListener('resize', resizeCanvas, false);
window.addEventListener("keydown", controls, false);

function controls(e) {
  if(e.keyCode == 38) { // up key
    e.preventDefault();
    var rotShape = rotate();
    if(valid(0,0,rotShape)) {
      shape = rotShape;
    }
  } else if(e.keyCode == 39) { // right key
    e.preventDefault();
    if(valid(1)) {
      currX++;
    }
  } else if(e.keyCode == 37) { // left key
    e.preventDefault();
    if(valid(-1)) {
      currX--;
    }
  } else if(e.keyCode == 40) { // down key
    e.preventDefault();
    if(valid(0,1)) {
      currY++;
    }
  } else if(e.keyCode == 32) { // spacebar
    e.preventDefault();
    dropDown();
  } else if(e.keyCode == 82) { // reset 'r'
    newGame();
  }
}

var pieces = [
                    [1,1,1,1],
                    [2,2,2,
                     2],
                    [3,3,3,
                     0,0,3],
                    [4,4,4,
                     0,4,0],
                    [0,5,5,
                     0,5,5],
                    [0,6,6,
                     6,6],
                    [7,7,0,
                     0,7,7]];


function createShape() {

  var randomShape = Math.floor(Math.random() * pieces.length)

  if (randomShape == 0) { // if I shape, the matrix will be 4x4
    pieceSize = 4;
  } else {
    pieceSize = 3;
  }

  var counter = -pieceSize;
  shape = [];
  for (i = 0; i < pieceSize; i++) {
    shape[ i ] = [];
    for (j = 0; j < pieceSize; j++) {
      if( counter < pieces[randomShape].length && i > 0) {
        shape[i][j] = pieces[randomShape][counter];
        } else {
          shape[i][j] = 0;
        }
        counter++;
      }
    }

    // set dimensions for the shape on the board
    currX = 3;
    currY = -1;

}

function rotate() {

  shapeString = shape.toString();
  boxString = [[0,0,0],[0,5,5],[0,5,5]].toString();

  // don't rotate the square
  if (shapeString == boxString) {
    return shape;
  }
  var rotShape = [];
  for ( i = 0; i < pieceSize; ++i ) {
      rotShape[ i ] = [];
      for ( j = 0; j < pieceSize; ++j ) {
          rotShape[ i ][ j ] = shape[ pieceSize - j - 1 ][ i ];
      }
  }

  // set the shape to be that of the rotated shape
  return rotShape;
}

// clears the board
function init() {
    for(i = 0; i < ROWS; i++) {
        tetrisBoard[i] = [];
      for(j = 0; j < COLS; j++) {
        tetrisBoard[i][j] = 0;
      }
    }
}

var colors = [
    'cyan', 'orange', 'deepskyblue', 'yellow', 'tomato', 'lime', 'violet'
];

// draws the board and the moving shape
function draw() {

    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( tetrisBoard[ y ][ x ] ) {
              ctx.strokeStyle = 'black';
                ctx.lineWidth = "4";
                ctx.fillStyle = colors[ tetrisBoard[ y ][ x ] - 1 ];
                ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
                ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
            }
            else {
              ctx.strokeStyle = 'black';
              ctx.lineWidth = "0.8";
              ctx.fillStyle = 'white';
              ctx.fillRect( BLOCK_W * x+1, BLOCK_H * y+1, BLOCK_W - 1 , BLOCK_H - 1 );
              ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
            }
        }
    }

      ctx.strokeStyle = 'black';
      for ( var y = 0; y < pieceSize; ++y ) {
          for ( var x = 0; x < pieceSize; ++x ) {
              if ( shape[ y ][ x ] ) {
                ctx.fillStyle = colors[ shape[ y ][ x ] - 1 ];
                ctx.lineWidth = "4";
                ctx.fillRect( BLOCK_W * (x+currX)  , BLOCK_H * (y+currY) , BLOCK_W - 1 , BLOCK_H - 1 );
                ctx.strokeRect( BLOCK_W * (x+currX)  , BLOCK_H * (y+currY) , BLOCK_W - 1 , BLOCK_H - 1 );
              }
          }
      }
}


function tick() {

  if(valid(0, 1)) {
    currY++;
  } else {
    modifyBoard();
    lineCheck();
    if(gameOver) {
      return;
    }
    createShape();
  }
}

function lineCheck() {

  for ( var y = ROWS-1; y >= 0; --y ) {
      var clearLine = true;
      for ( var x = 0; x < COLS; ++x ) {
        if(!tetrisBoard[y][x]) {
          clearLine = false;
          break;
        }
      }

      if(clearLine) {
        for ( var i = y; i> 0; --i ) {
            for ( var j = 0; j < COLS; ++j ) {
              tetrisBoard[i][j] = tetrisBoard[i-1][j];
            }
          }
          y++;
      }
  }
}

function modifyBoard() {
    for ( var y = 0; y < pieceSize; ++y ) {
      for ( var x = 0; x < pieceSize; ++x ) {
        if ( shape[ y ][ x ] ) {
          tetrisBoard[currY + y][currX + x] = shape[y][x]
        }
      }
    }
}

function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currX + offsetX;
    offsetY = currY + offsetY;
    newCurrent = newCurrent || shape;

    for ( var y = 0; y < pieceSize; ++y ) {
        for ( var x = 0; x < pieceSize; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof tetrisBoard[ y + offsetY ] == 'undefined'
                  || typeof tetrisBoard[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || tetrisBoard[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
                    if((offsetY == 0 || offsetY == 1) && (offsetX >= 0 && offsetX < 11 - pieceSize)) {
                      gameOver = true;
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

function dropDown() {

  for ( var y = pieceSize - 1; y >= 0; --y ) {
      for ( var x = pieceSize - 1; x >= 0; --x ) {
          if ( shape[ y ][ x ] ) {
            for ( var offsetY = currY; offsetY < ROWS; ++offsetY ) {

              if(valid(0,1)) {
                  currY++;
              }
            }
        }
    }
  }
}

function newGame() {
  for ( var y = 0; y < ROWS; ++y ) {
    for ( var x = 0; x < COLS; ++x ) {
      tetrisBoard[y][x] = 0;
    }
  }
  gameOver = false;
  createShape();
}

function startGame() {
    resizeCanvas();
    init();
    createShape();
    draw();

    setInterval( tick, 250 );
    setInterval( draw, 30 );

}

function resizeCanvas() {
  c.width = ((window.innerHeight/1.3) / 1.714);
  c.height = window.innerHeight/1.3;
  w = c.width;
  h = c.height;
  BLOCK_W = w/ COLS;
  BLOCK_H  = h/ ROWS;
}

startGame();
