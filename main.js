var moveRandomly = 0;

window.addEventListener("keydown", function() {
  if(event.keyCode == 16) {
    moveRandomly = 1;
  }
});

window.addEventListener("keyup", function() {
  if(event.keyCode == 16) {
    moveRandomly = 0;
  }
});

window.clickOnBoard = function(x,y) {
  var board = document.querySelector("cg-board");
  var ev = new MouseEvent("mousedown", {
    "view": window,
    "bubbles": true,
    "cancelable": false,
    "clientX": x,
    "clientY": y
  });
  board.dispatchEvent(ev);
  ev = new MouseEvent("mouseup", {
    "view": window,
    "bubbles": true,
    "cancelable": false,
    "clientX": x,
    "clientY": y
  });
  board.dispatchEvent(ev);
}

window.getFEN = function() {
  var fen = "";
  var whitePieces = document.querySelectorAll("cg-board .white");
  var blackPieces = document.querySelectorAll("cg-board .black");
  var pieceNames = ["pawn","knight","bishop","rook","queen","king"];
  var pieceLetters = ["P","N","B","R","Q","K"];
  function getPiecePerc(piece) {
    var boardWidth = document.querySelector("cg-board").offsetWidth;
    var pieceTransform = piece.style.transform.match(/\d+px,\s+\d+px/)[0].replace(/\s/g,"").replace(/px/g,""); // "500px,500px"
    var pieceCoords = [Number(pieceTransform.split(",")[0]), Number(pieceTransform.split(",")[1])];
    var piecePerc = [Math.floor(pieceCoords[0] / boardWidth * 8), Math.floor(pieceCoords[1] / boardWidth * 8)];
    return piecePerc;
  }
  var whitePiecesPos = Array.from(whitePieces).map(getPiecePerc);
  var blackPiecesPos = Array.from(blackPieces).map(getPiecePerc);
  for(var i = 0; i < 8; i++) {
    var emptySquareCount = 0;
    for(var j = 0; j < 8; j++) {
      var whiteMatches = whitePiecesPos.map((e) => {
        if(e[0] == j && e[1] == i) {
          return whitePiecesPos.indexOf(e);
        } else {
          return -1;
        }
      }).filter((e) => {
        return (e == -1 ? 0 : 1);
      });
      var blackMatches = blackPiecesPos.map((e) => {
        if(e[0] == j && e[1] == i) {
          return blackPiecesPos.indexOf(e);
        } else {
          return -1;
        }
      }).filter((e) => {
        return (e == -1 ? 0 : 1);
      });
      if(whiteMatches.length > 0) {
        if(emptySquareCount > 0) {
          fen += emptySquareCount;
          emptySquareCount = 0;
        }
        fen += pieceLetters[pieceNames.indexOf(whitePieces[whiteMatches[0]].classList[1])];
      } else if(blackMatches.length > 0) {
        if(emptySquareCount > 0) {
          fen += emptySquareCount;
          emptySquareCount = 0;
        }
        fen += pieceLetters[pieceNames.indexOf(blackPieces[blackMatches[0]].classList[1])].toLowerCase();
      } else {
        emptySquareCount++;
      }
    }
    if(emptySquareCount > 0) {
      fen += emptySquareCount;
      emptySquareCount = 0;
    }
    if(i < 7) {
      fen += "/";
    }
  }
  fen += " w - - 0 1";
  return fen;
};

window.makeAMove = function(from,to) {
  var files = ["a","b","c","d","e","f","g","h"];
  var board = document.querySelector("cg-board");
  var boardWidth = board.offsetWidth;
  var boardX = board.getBoundingClientRect().x;
  var boardY = board.getBoundingClientRect().y;
  var centerOffset = boardWidth / 16;
  var fromCoords = [(files.indexOf(from[0]) / 8 * boardWidth) + boardX + centerOffset, ((8 - Number(from[1])) / 8 * boardWidth) + boardY + centerOffset];
  var toCoords = [(files.indexOf(to[0]) / 8 * boardWidth) + boardX + centerOffset, ((8 - Number(to[1])) / 8 * boardWidth) + boardY + centerOffset];
  console.log(fromCoords, toCoords);
  clickOnBoard(fromCoords[0], fromCoords[1]);
  clickOnBoard(toCoords[0], toCoords[1]);
}

window.isMyTurn = function() {
  var myClock = document.querySelector(".rclock-bottom");
  return myClock.classList.contains("running");
}

setInterval(function() {
  if(isMyTurn() && moveRandomly) {
    var game = new Chess(getFEN());
    var moves = game.moves({verbose:true});
    var moveToMake = moves[Math.floor(Math.random() * moves.length)];
    console.log(moveToMake);
    makeAMove(moveToMake[0],moveToMake[1]);
  }
},1);

setInterval(function() {
  console.log(moveRandomly);
},1);
