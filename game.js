//Screen height and width
const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;

//Stack with undo and redo button where you push or pop
var undoStack = [];
var redoStack = [];

//List of ids to disable for each mode
const entryModeIds = ["hint", "solve", "entryMode"];
const solveModeIds = ["generate", "solveMode"];
const listOfHoverActionIds = ["undo", "redo", "generate", "entryMode", "open", "save", "solveMode", "hint", "solve", "1", "2", "3", "4", "5", "6", "7", "8", "9", "delte"];

//The colors
var regBorderColor = localStorage.getItem("regBorderColor");
var emphBorderColor = localStorage.getItem("emphBorderColor");
var squareSelectColor = localStorage.getItem("squareSelectColor");
var colRowSelectColor = localStorage.getItem("colRowSelectColor");
var regTextColor = localStorage.getItem("regTextColor");
var mistakeTextColor = localStorage.getItem("mistakeTextColor");
var regBackgroundColor = localStorage.getItem("regBackgroundColor");
var hintBackgroundColor = localStorage.getItem("hintBackgroundColor");
var buttonTextColor = localStorage.getItem("buttonTextColor");
var disableButtonColor = localStorage.getItem("disableButtonColor");
var selectButtonColor = localStorage.getItem("selectButtonColor");
var hoverButtonColor = localStorage.getItem("hoverButtonColor");
var screenBackgroundColor = localStorage.getItem("screenBackgroundColor");

//Last number the user chose
var lastNum = 1;

//Size of board for error checking purposes, must be a number that can be evenly square rooted
var boardSize = 9;

//Size of each square in the board for error checking purposes
var squareSize = Math.sqrt(boardSize);

//2d array of button elements
var buttonBoard = createBoard(boardSize, null);

//2d array with the numbers on the sudoku board, 0 represents empty
var numberBoard = createBoard(boardSize, 0);

//2d array with the numbers represting the solution
var solvedNumberBoard = createBoard(boardSize, 0);

//List of squares with mistakes (red circle) may or may not be used
var errors = [];

//Stores the number of hints a user wants
var numHints = 0;

//Tracks what square the user is currently selcting
var userRow = 0;
var userCol = 0;

//Tracks which mode the current game is in
var mode = "entry";

//Set border style
const borderStyle = "solid ";

const doPopUp = localStorage.getItem("popupConfirm") == "true";

//Pass in element to have colors set (only use for non sudoku buttons)
//Returns nothing
function setElmProperties(elm) {
  elm.style.color = buttonTextColor;
  elm.style.backgroundColor = regBackgroundColor;
}

//Centers in element in the screen
//Returns nothing
function centerElm(elm) {
  elm.style.position = "absolute";
  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;
  elm.style.left = windowWidth / 2 - elm.offsetWidth / 2 + "px";
  elm.style.top = windowHeight / 2 - elm.offsetHeight / 2 + "px";
}

//Centers element within element
//Returns nothing
function centerElmInElm(elm1, elm2) {
  elm2.style.position = "absolute";
  let leftChange = elm1.offsetWidth / 2 - elm2.offsetWidth / 2;
  let topChange = elm1.offsetHeight / 2 - elm2.offsetHeight / 2;
  elm2.style.top = parseInt(elm1.style.top) + topChange + "px";
  elm2.style.left = parseInt(elm1.style.left) + leftChange + "px";
}

//Main function, call to start
//Returns nothing
document.addEventListener("DOMContentLoaded", function(event) {
  document.body.style.background = screenBackgroundColor;
  visualBoard();
  createOtherButtons();
  let tempElm = document.getElementById("outerLoading");
  tempElm.style.left = screenWidth - tempElm.offsetWidth + "px";
  tempElm.style.top = "0px";
  centerElmInElm(document.getElementById("outerLoading"), document.getElementById("innerLoading"));
  document.getElementById("innerLoading").style.backgroundColor = localStorage.getItem("screenBackgroundColor");

  entryMode();
  document.getElementById("redo").style.backgroundColor = disableButtonColor;
  document.getElementById("redo").disabled = true;
  document.getElementById("undo").style.backgroundColor = disableButtonColor;
  document.getElementById("undo").disabled = true;
  document.getElementById("" + lastNum).style.backgroundColor = selectButtonColor;
  document.getElementById("" + lastNum).select = true;
  for (let i = 0; i < listOfHoverActionIds.length; i++) {
    //If mouse hover over valid hover element change to hover color
    //Returns nothing
    document.getElementById(listOfHoverActionIds[i]).addEventListener("mouseenter", function(event) {
      let source = event.target;
      if (!source.select && !source.disabled) {
        source.style.backgroundColor = hoverButtonColor;
        source.hover = true;
      }
    });
    //If moust leave hovered element changed to regualr background color
    //Returns nothing
    document.getElementById(listOfHoverActionIds[i]).addEventListener("mouseleave", function(event) {
      let source = event.target;
      if (source.hover && !source.disabled && !source.select) {
        source.style.backgroundColor = regBackgroundColor;
        source.hover = false;
      }
    });
  }
});

//Adds a hint to the screen and board
//Returns nothing
function hintButtonAction() {
  let squares = getWrongSqures();
  if (squares.length == 0) {
    squares = getEmptySquares();
  }
  shuffleArray(squares);
  if (squares.length == 0) {
    return undefined;
  }
  let row = squares[0][0];
  let col = squares[0][1];
  document.getElementById(lastNum).style.backgroundColor = "white";
  lastNum = solvedNumberBoard[row][col];
  clickSquare(row, col, true);
  addHint(row, col, solvedNumberBoard[row][col]);
}

//Call to get all the inncorrect squares
//Returns a 2d array
function getWrongSqures() {
  let returnSquares = [];
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (numberBoard[row][col] != solvedNumberBoard[row][col] && numberBoard[row][col] != 0) {
        returnSquares.push([row, col]);
      }
    }
  }
  return returnSquares;
}

//Get all of the emptry squares
//Returns list of squares [row,col] which are empty (equal 0)
function getEmptySquares() {
  let squares = [];
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (numberBoard[row][col] == 0) {
        squares.push([row, col]);
      }
    }
  }
  return squares;
}


//Call to get how many non empty squares there are
//Return an int
function getNonEmptySquares() {
  let num = 0;
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (numberBoard[row][col] != 0) {
        num++;
      }
    }
  }
  return num;
}

//Call to get the row and col of every square shuffled
//Returns 3d array?
function getAllSquares() {
  let squares = [];
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      squares.push([row, col, solvedNumberBoard[row][col]]);
    }
  }
  shuffleArray(squares);
  //printBoard(squares);
  return squares;
}


//Call to reset the board
//Returns nothing
function resetBoard() {
  boardSize = 9;
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      buttonBoard[row][col].hint = false;
      buttonBoard[row][col].style.color = regTextColor;
      buttonBoard[row][col].isInErrorList = false;
      buttonBoard[row][col].innerHTML = "";
      buttonBoard[row][col].style.backgroundColor = regBackgroundColor;
      numberBoard[row][col] = 0;
      solvedNumberBoard[row][col] = 0;
    }
  }
  errors = [];
  undoStack = [];
  redoStack = [];
  document.getElementById("redo").style.backgroundColor = disableButtonColor;
  document.getElementById("redo").disabled = true;
  document.getElementById("undo").style.backgroundColor = disableButtonColor;
  document.getElementById("undo").disabled = true;
}



//Call when bulding screen 
//Retunrs nothing
function createOtherButtons() {
  let buttonHeight = document.getElementById("square" + 0 + 0).offsetHeight;
  let sudokuButtonWidth = document.getElementById("square" + 0 + 0).offsetWidth;
  let restSize = (screenWidth - sudokuButtonWidth * 9);
  let boardSize = sudokuButtonWidth * 9;
  let buttonWidth = restSize / 5.5;
  let spacing = (restSize - buttonWidth * 3) / 4;
  let numberSpacing = (restSize - buttonWidth * 3) / 2;
  let numberCounter = 0;
  for (let row = 0; row < squareSize; row++) {
    for (let col = 0; col < squareSize; col++) {
      numberCounter++;
      let elm = createElm("button", numberCounter, buttonWidth, buttonHeight, numberSpacing + buttonWidth * col + boardSize, buttonHeight * row, "otherButtons", numberCounter);
      setElmProperties(elm);
      //If click a number button siwtch last number selected and add number to current square
      //Returns nothing
      elm.addEventListener("click", function(event) {
        document.getElementById("" + lastNum).style.backgroundColor = regBackgroundColor;
        document.getElementById("" + lastNum).select = false;
        let elm = event.target || event.srcElement;
        lastNum = parseInt(elm.id);
        elm.select = true;
        clickSquare(userRow, userCol, true);
      });
    }
  }

  //Removes number from current square same as backspace action
  //Returns nothing
  createElm("button", "delte", buttonWidth * 3, buttonHeight, numberSpacing + boardSize, buttonHeight * 3, "otherButtons", "X").addEventListener("click", function(event) {
    clickSquare(userRow, userCol, false, true);
    let elm = event.target || event.srcElement;
    elm.style.background = regBackgroundColor;
  });
  setElmProperties(document.getElementById("delte"));

  let counter = 0;
  let secondGroupHeight = buttonHeight * 4.5;
  //Undo Button
  createElm("button", "undo", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, secondGroupHeight, "otherButtons", "Undo"
  ).addEventListener("click", undo);
  setElmProperties(document.getElementById("undo"));

  //Redo Button
  createElm("button", "redo", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, secondGroupHeight, "otherButtons", "Redo"
  ).addEventListener("click", redo);
  setElmProperties(document.getElementById("redo"));

  //Click to show conformation dialog
  //Returns nothing
  createElm("button", "generate", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, secondGroupHeight, "otherButtons", "Generate").addEventListener("click", function(event) {
    showDialog('generatePuzzleDialog');
  });

  setElmProperties(document.getElementById("generate"));

  boardSize = sudokuButtonWidth * 9;
  let thirdGroupHeight = buttonHeight * 6.5;
  counter = 0;
  //Click to switch to entry mode and rest the board
  //Retuns nothin
  createElm("button", "entryMode", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, thirdGroupHeight, "otherButtons", "Entry\nMode"
  ).addEventListener("click", function(event) {
    entryMode();
    resetBoard();
  });
  setElmProperties(document.getElementById("entryMode"));

  //Click to download a txt save file
  //Returns nothing
  createElm("button", "open", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, thirdGroupHeight, "otherButtons", "Open"
  ).addEventListener("click", function(event) {
    document.getElementById("saveFile").click();
  });
  setElmProperties(document.getElementById("open"));

  //Click to upload a save file and set the specific data on thes creen based on file
  //Returns nothing
  document.getElementById("saveFile").addEventListener("change", function(event) {
    const selectedFile = document.getElementById("saveFile").files[0];
    const reader = new FileReader();
    resetBoard();
    boardSize = 9;
    reader.onload = (evt) => {
      let text = evt.target.result;
      let seperatorRows = [];
      text = text.split("\n");
      for (let i = 0; i < text.length; i++) {
        text[i] = text[i].split(",");
        if (text[i].length == 1) {
          seperatorRows.push(i + 1);
        }
      }
      let mode = text[text.length - 1][0];
      if (mode == "solve") {
        solveMode();
      } else {
        entryMode();
      }
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          numberBoard[row][col] = parseInt(text[row][col]);
          if (numberBoard[row][col] != 0) {
            buttonBoard[row][col].innerHTML = numberBoard[row][col];
          }
          if (mode == "solve") {
            buttonBoard[row][col].hint = "true" == text[row + seperatorRows[0]][col];
            if (buttonBoard[row][col].hint) {
              addHint(row, col, numberBoard[row][col]);
            }
          }
          solvedNumberBoard[row][col] = parseInt(text[row + seperatorRows[1]][col]);
        }
      }
    };
    reader.readAsText(selectedFile);
  });

  //Click to download a save file with the data
  //Returns nothing
  createElm("button", "save", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, thirdGroupHeight, "otherButtons", "Save"
  ).addEventListener("click", function(event) {
    let boardData = "";
    let hintData = "";
    let solvedBoardData = "";
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (col != 0) {
          boardData = boardData + "," + numberBoard[row][col];
          hintData = hintData + "," + buttonBoard[row][col].hint;
          solvedBoardData = solvedBoardData + "," + solvedNumberBoard[row][col];
        } else {
          boardData = boardData + numberBoard[row][col];
          hintData = hintData + buttonBoard[row][col].hint;
          solvedBoardData = solvedBoardData + solvedNumberBoard[row][col];
        }
      }
      boardData = boardData + "\n";
      hintData = hintData + "\n";
      solvedBoardData = solvedBoardData + "\n";
    }
    let allData = boardData + "\n" + hintData + "\n" + solvedBoardData + "\n" + mode;
    let blobData = new Blob([allData], {
      type: 'text/plain'
    });
    let tempElm = document.createElement("a");
    let url = URL.createObjectURL(blobData);
    tempElm.href = url;
    tempElm.download = "save";
    document.body.appendChild(tempElm);
    tempElm.click();
    //Trigger to remove the dowload link
    //Returns nothing
    setTimeout(function() {
      document.body.removeChild(tempElm);
      window.URL.revokeObjectURL(url);
    }, 0);
  });

  setElmProperties(document.getElementById("save"));
  let fourthGroupHeight = screenHeight - buttonHeight;
  counter = 0;
  //Click to switch to solve mode and generate solutionto  use inputted data
  //Retunrs nothing
  createElm("button", "solveMode", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, fourthGroupHeight, "otherButtons", "Solve\nMode"
  ).addEventListener("click", function(event) {
    //resetBoard();
    solveMode(false);
  });
  setElmProperties(document.getElementById("solveMode"));

  //Click to show conformation for hint
  //Returns nothing
  createElm("button", "hint", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, fourthGroupHeight, "otherButtons", "Hint"
  ).addEventListener("click", function(event) {
    if (doPopUp) {
      showDialog('confirmActionDialog2');
    } else {
      hintButtonAction();
    }
  });
  setElmProperties(document.getElementById("hint"));

  //CLick to show the confromation idalong on wether on not to get solution
  //What do you know, returns nothing
  createElm("button", "solve", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, fourthGroupHeight, "otherButtons", "Solve"
  ).addEventListener("click", function(event) {
    document.getElementById('confirmDialogTitle').textContent = "Confirm Solve";
    document.getElementById('confirmDialogMessage').textContent = "Are you sure you want to solve the puzzle now?";
    if (doPopUp) {
      showDialog('confirmActionDialog');
    } else {
      boardSize = 9;
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          addHint(row, col, solvedNumberBoard[row][col]);
        }
      }
    }
  });
  setElmProperties(document.getElementById("solve"));
}

//Triggers when user inputs a number or uses keyboard input user interact with board
//Returnst nothing
document.addEventListener("keydown", function(event) {
  let key = event.key;
  if (key == "ArrowUp" || key == "w") {
    clickSquare(userRow - 1, userCol);
  } else if (key == "ArrowDown" || key == "s") {
    clickSquare(userRow + 1, userCol);
  } else if (key == "ArrowLeft" || key == "a") {
    clickSquare(userRow, userCol - 1);
  } else if (key == "ArrowRight" || key == "d") {
    clickSquare(userRow, userCol + 1);
  } else if (key == "Backspace") {
    clickSquare(userRow, userCol, false, true);
  } else if (key == "z" && event.ctrlKey) {
    undo();
  } else if (key == "y" && event.ctrlKey) {
    redo();
  } else {
    let num = parseInt(key);
    if (num != NaN && num > 0) {
      document.getElementById(lastNum).style.backgroundColor = "white";
      lastNum = num;
      clickSquare(userRow, userCol, true);
    }
  }
});

//Call to build board on screen
//Returns nothing
function visualBoard() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      let button = createElm("button", "square" + row + col, screenHeight / boardSize, screenHeight / boardSize, screenHeight / boardSize * col, screenHeight / boardSize * row, "sudoku");
      button.addEventListener("click", function(event) {
        let row = this.row;
        let col = this.col;
        clickSquare(row, col, false, false);
      })
      buttonBoard[row][col] = button;
      button.hint = false;
      button.style.color = regTextColor;
      button.row = row;
      button.col = col;
      button.isInErrorList = false;
      //button.innerHTML = "1";
      button.style.borderTop = borderStyle + regBorderColor;
      if (row % squareSize == 0) {
        button.style.borderTop = borderStyle + emphBorderColor;
      }
      button.style.borderBottom = borderStyle + regBorderColor;
      if ((row + 1) % squareSize == 0) {
        button.style.borderBottom = borderStyle + emphBorderColor;
      }

      button.style.borderLeft = borderStyle + regBorderColor;
      if (col % squareSize == 0) {
        button.style.borderLeft = borderStyle + emphBorderColor;
      }
      button.style.borderRight = borderStyle + regBorderColor;
      if ((col + 1) % squareSize == 0) {
        button.style.borderRight = borderStyle + emphBorderColor;
      }

    }
  }
}

//Object which represents one specific cell, use for backtracking
class Cell {
  constructor(row, col, nums) {
    this.row = row;
    this.col = col;
    this.nums = nums.length;
  }
}

//Call to get all the possible numbers for a specifc square in a 2d array
//Returns an array of possible numbers
function possibleNumsInCell(row, col, currentBoard) {
  let nums = getAllPossibleNums();
  for (let i = 0; i < boardSize; i++) {
    let num1Index = nums.indexOf(currentBoard[row][i]);
    if (num1Index != -1) {
      nums.splice(num1Index, 1);
    }
    let num2Index = nums.indexOf(currentBoard[i][col]);
    if (num2Index != -1) {
      nums.splice(num2Index, 1);
    }
  }
  let startRow = Math.floor(row / squareSize) * squareSize;
  let startCol = Math.floor(col / squareSize) * squareSize;
  for (let i = 0; i < squareSize; i++) {
    for (let j = 0; j < squareSize; j++) {
      let num3Index = nums.indexOf(currentBoard[startRow + i][startCol + j]);
      if (num3Index != -1) {
        nums.splice(num3Index, 1);
      }
    }
  }
  return nums;
}


//Call to get the solutions for a puzzle
//Returns 3d arrya of solutions
function solveBoard(index, squares, requiredSolutions, currentBoard, solutionBoards) {
  if (index == squares.length) {
    solutionBoards.push(deepCopy(currentBoard));
  } else if (solutionBoards.length == requiredSolutions) {
    return solutionBoards;
  } else {
    let row = squares[index].row;
    let col = squares[index].col;
    let possibleNums = possibleNumsInCell(row, col, currentBoard);
    for (let i = 0; i < possibleNums.length; i++) {
      currentBoard[row][col] = possibleNums[i];
      if (solveBoard(index + 1, squares, requiredSolutions, currentBoard, solutionBoards).length == requiredSolutions) {
        break;
      }
      currentBoard[row][col] = 0;
    }
  }
  return solutionBoards;
}

//Call to set elements into solving mode
//Returns nothing
function solveMode(hasSolution = false) {
  mode = "solve";
  for (let i = 0; i < entryModeIds.length; i++) {
    document.getElementById(entryModeIds[i]).disabled = false;
    document.getElementById(entryModeIds[i]).style.background = regBackgroundColor;
  }
  for (let i = 0; i < solveModeIds.length; i++) {
    document.getElementById(solveModeIds[i]).disabled = true;
    document.getElementById(solveModeIds[i]).style.background = disableButtonColor;
  }
  if (!hasSolution) {
    if (errors.length != 0) {
      //Replace alerts with popup later
      showDialog("confirmActionDialog3");
      //entryMode();
      return;
    }
    let solutions = solveBoard(0, getEmptySquareObjects(), 1, deepCopy(numberBoard), []);
    if (solutions.length == 0) {
      //Replace alerts with popup later
      alert("Error the puzzle is invalid")
      for (let i = 0; i < entryModeIds.length; i++) {
        document.getElementById(entryModeIds[i]).disabled = true;
        document.getElementById(entryModeIds[i]).style.background = disableButtonColor;
      }
      for (let i = 0; i < solveModeIds.length; i++) {
        document.getElementById(solveModeIds[i]).disabled = false;
        document.getElementById(solveModeIds[i]).style.background = regBackgroundColor;
      }
      mode = "entry";
      return;
    } else {
      printBoard(solutions[0]);
      boardSize = 9;
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          buttonBoard[row][col].hint = false;
          buttonBoard[row][col].style.color = regTextColor;
          buttonBoard[row][col].isInErrorList = false;
          buttonBoard[row][col].innerHTML = "";
          buttonBoard[row][col].style.backgroundColor = regBackgroundColor;
          if (numberBoard[row][col] != 0) {
            addHint(row, col, numberBoard[row][col]);
          }
        }
      }
      errors = [];
      undoStack = [];
      redoStack = [];
      document.getElementById("redo").style.backgroundColor = disableButtonColor;
      document.getElementById("redo").disabled = true;
      document.getElementById("undo").style.backgroundColor = disableButtonColor;
      document.getElementById("undo").disabled = true;
      solvedNumberBoard = solutions[0];
    }

  }
}

//Call to set elements into entry mode
//Returns nothing
function entryMode() {
  mode = "entry";
  resetBoard();
  for (let i = 0; i < entryModeIds.length; i++) {
    document.getElementById(entryModeIds[i]).disabled = true;
    document.getElementById(entryModeIds[i]).style.background = disableButtonColor;
    //document.getElementById(entryModeIds[i]).style.background = hintBackgroundColor;
  }
  for (let i = 0; i < solveModeIds.length; i++) {
    document.getElementById(solveModeIds[i]).disabled = false;
    document.getElementById(solveModeIds[i]).style.background = regBackgroundColor;
  }
}

//Call to fill board with a valid solution board
//Retunrs a 2d array with all squares filled
function createFilledBoard() {
  let board = createBoard(boardSize, 0);
  for (let i = 0; i < boardSize; i = i + squareSize) {
    fillSquare(i, i, board);
  }
  numberBoard = deepCopy(board);
  let solutions = solveBoard(0, getEmptySquareObjects(), 1, deepCopy(board), []);
  //printBoard(solutions[0]);
  board = solutions[0];
  return board;
}


//Call to fill in three by three square as they do not overlap with eachother
//Returns a 2d array with the three 3 by 3 digonal squares filled
function fillSquare(row, col, board) {
  let nums = getAllPossibleNums();
  let index = 0;
  let max = squareSize;
  for (let i = row; i < row + max; i++) {
    for (let j = col; j < col + max; j++) {
      board[i][j] = nums[index];
      index++;
    }
  }
}


//Call to add a hint to the board
//Returns nothing
function addHint(row, col, value) {
  numberBoard[row][col] = value;
  buttonBoard[row][col].innerHTML = value;
  buttonBoard[row][col].hint = true;
  buttonBoard[row][col].style.backgroundColor = hintBackgroundColor;
}

//Call to remove an element from an array
//Returns nothing
function removeFromArray(elm, list) {
  let index = list.indexOf(elm);
  if (index != -1) {
    list.splice(index, 1);
  }
}

//Call to get all the number sin the board in a square
//Returns a list of numbers
function getAllNumbersInSquare(row, col) {
  let nums = [];
  let startRow = Math.floor(row / squareSize) * squareSize;
  let startCol = Math.floor(col / squareSize) * squareSize;
  for (let row = startRow; row < startRow + squareSize; row++) {
    for (let col = startCol; col < startCol + squareSize; col++) {
      nums.push(numberBoard[row][col]);
    }
  }
  return nums;
}

//Call to get all the numbers in the board in a column
//Returns list of numbers
function getAllNumbersInCol(col) {
  let nums = [];
  for (let row = 0; row < boardSize; row++) {
    nums.push(numberBoard[row, col]);
  }
  return nums;
}

//Call to get a shuffled array of all possible numbers 1-9
function getAllPossibleNums() {
  let nums = [];
  for (let i = 1; i <= boardSize; i++) {
    nums.push(i);
  }
  shuffleArray(nums);
  return nums;
}

//Call to print out a 2d array
//Returns nothing
function printBoard(board) {
  for (let i = 0; i < board.length; i++) {
    console.log(board[i]);
  }
}


//Call to shuffle an array
//Returns nothing, credit: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//Gets a list of objects with the row and square along with the possible numbers for the cell
//Returns a list of objects
function getEmptySquareObjects() {
  let squares = [];
  let emptySquares = getEmptySquares();
  for (let i = 0; i < emptySquares.length; i++) {
    squares.push(new Cell(emptySquares[i][0], emptySquares[i][1], possibleNumsInCell(emptySquares[i][0], emptySquares[i][1], numberBoard)));
  }
  squares.sort((a, b) => a.nums - b.nums);
  return squares;
}




//Call to make sure that each previous error square is still an error
//Returns nothing
function checkErrors() {
  for (let i = 0; i < errors.length; i++) {
    let row = errors[i][0];
    let col = errors[i][1];
    let tempNum = numberBoard[row][col];
    numberBoard[row][col] = 0;
    if (tempNum == 0 || !errorCheck(row, col, tempNum)) {
      buttonBoard[row][col].style.color = regTextColor;
      buttonBoard[row][col].isInErrorList = false;
      errors.splice(i, 1);
      i--;
    }
    numberBoard[row][col] = tempNum;
  }
  //printBoard(errors);
}

//Call to check for an errors based on the inputted square
//Returns boolean if there are errors
function errorCheck(row, col, number) {
  let isError = false;
  for (let i = 0; i < boardSize; i++) {
    if (numberBoard[row][i] == number) {
      buttonBoard[row][i].style.color = mistakeTextColor;
      isError = true;
      if (!buttonBoard[row][i].isInErrorList) {
        buttonBoard[row][i].isInErrorList = true;
        errors.push([row, i]);
      }
    }
    if (numberBoard[i][col] == number) {
      buttonBoard[i][col].style.color = mistakeTextColor;
      isError = true;
      if (!buttonBoard[i][col].isInErrorList) {
        buttonBoard[i][col].isInErrorList = true;
        errors.push([i, col]);
      }
    }
  }
  let startRow = Math.floor(row / squareSize) * squareSize;
  let startCol = Math.floor(col / squareSize) * squareSize;
  for (let i = 0; i < squareSize; i++) {
    for (let j = 0; j < squareSize; j++) {
      if (numberBoard[startRow + i][startCol + j] == number) {
        buttonBoard[startRow + i][startCol + j].style.color = mistakeTextColor;
        isError = true;
        if (!buttonBoard[startRow + i][startCol + j].isInErrorList) {
          buttonBoard[startRow + i][startCol + j].isInErrorList = true;
          errors.push([startRow + i, startCol + j]);
        }
      }
    }
  }
  if (isError) {
    buttonBoard[row][col].style.color = mistakeTextColor;
    if (!buttonBoard[row][col].isInErrorList) {
      buttonBoard[row][col].isInErrorList = true;
      errors.push([row, col]);
    }
  }
  return isError;
}

//Call to search for a specific list of values in a list
//Returns the index of the element or -1 if element not found
//Note elm is assumed to be an array
function indexOf(list, checkList) {
  for (let i = 0; i < checkList; i++) {
    let curValue = checkList[i];
    let isCorrect = true;
    if (list.length == curValue.length) {
      for (let j = 0; j < list.length; j++) {
        if (curValue[j] != list[j]) {
          isCorrect = false;
          break;
        }
      }
    }
    if (isCorrect) {
      return i;
    }
  }
  return -1;
}

//Use to create and position an element on screen
//Returns the created element
function createElm(type, id, width, height, left, top, className = "", text = "", inputElm = null) {
  let elm = document.createElement(type);
  elm.style.position = "absolute";
  if (inputElm != null) {
    elm = inputElm;
  }
  elm.setAttribute("id", id);
  if (className != "") {
    elm.setAttribute("class", className);
  }
  elm.innerHTML = text;
  elm.style.width = width + "px";
  elm.style.height = height + "px";
  elm.style.left = left + "px";
  elm.style.top = top + "px";
  document.body.append(elm);
  return elm;
}

//Call when the user interacts with a sudoku square and updates the square accordingly
//Returns nothing
function clickSquare(row, col, place = false, remove = false, newAction = true) {
  if (row >= boardSize || col >= boardSize || row < 0 || col < 0) {
    return;
  }
  for (let i = 0; i < boardSize; i++) {
    if (buttonBoard[userRow][i].hint) {
      buttonBoard[userRow][i].style.backgroundColor = hintBackgroundColor;
    } else {
      buttonBoard[userRow][i].style.backgroundColor = regBackgroundColor;
    }
    if (buttonBoard[i][userCol].hint) {
      buttonBoard[i][userCol].style.backgroundColor = hintBackgroundColor;
    } else {
      buttonBoard[i][userCol].style.backgroundColor = regBackgroundColor;
    }
  }
  for (let i = 0; i < boardSize; i++) {
    buttonBoard[row][i].style.backgroundColor = colRowSelectColor;
    buttonBoard[i][col].style.backgroundColor = colRowSelectColor;
  }

  buttonBoard[row][col].style.backgroundColor = squareSelectColor;
  if (place && !buttonBoard[row][col].hint) {
    if (newAction) {
      addToStack(undoStack, new Action(row, col, numberBoard[row][col], lastNum));
    }
    numberBoard[row][col] = 0;
    errorCheck(row, col, lastNum);
    buttonBoard[row][col].innerHTML = lastNum;
    numberBoard[row][col] = lastNum;
    checkErrors();
  } else if (remove && !buttonBoard[row][col].hint) {
    if (newAction) {
      addToStack(undoStack, new Action(row, col, numberBoard[row][col], 0));
    }
    buttonBoard[row][col].innerHTML = "";
    numberBoard[row][col] = 0;
    buttonBoard[row][col].style.color = regTextColor;
    checkErrors();
  }
  document.getElementById(lastNum).style.backgroundColor = selectButtonColor;
  userRow = row;
  userCol = col;
}

//Class which contains all the necessary info about an action
class Action {
  constructor(row, col, orgNum, newNum) {
    this.row = row;
    this.col = col;
    this.orgNum = orgNum;
    this.newNum = newNum;
  }
}


//Call to create a two 2d array with a preset value
//Returns a 2d array with 
function createBoard(size, value) {
  let returnBoard = [];
  for (let row = 0; row < size; row++) {
    let rowList = [];
    for (let col = 0; col < size; col++) {
      rowList.push(value);
    }
    returnBoard.push(rowList);
  }
  return returnBoard;
}

//Duplicate a 2d array
//Returns 2d array
function deepCopy(list) {
  return structuredClone(list);
}

//It adds to the stack
//Returns nothing
function addToStack(stack, action) {
  stack.push(action);
  if (undoStack.length >= 1) {
    document.getElementById("undo").style.backgroundColor = regBackgroundColor;
    document.getElementById("undo").disabled = false;
  }
  if (redoStack.length >= 1) {
    document.getElementById("redo").style.backgroundColor = regBackgroundColor;
    document.getElementById("redo").disabled = false;
  }
}

//Undo's the action
//Returns ntohing
function undo() {
  if (undoStack.length > 0) {
    const action = undoStack.pop();
    if (action.orgNum == 0) {
      clickSquare(action.row, action.col, false, true, false);
    } else {
      document.getElementById(lastNum).style.backgroundColor = "white";
      lastNum = action.orgNum;
      clickSquare(action.row, action.col, true, false, false);
    }
    if (undoStack.length == 0) {
      document.getElementById("undo").style.backgroundColor = disableButtonColor;
      document.getElementById("undo").disabled = true;
    }
    addToStack(redoStack, action);
  }
}

//Redo's the action
//Returns nothing
function redo() {
  if (redoStack.length > 0) {
    const action = redoStack.pop();
    if (action.newNum == 0) {
      clickSquare(action.row, action.col, false, true, false);
    } else {
      document.getElementById(lastNum).style.backgroundColor = "white";
      lastNum = action.newNum;
      clickSquare(action.row, action.col, true, false, false);
    }
    if (undoStack.length == 0) {
      document.getElementById("redo").style.backgroundColor = disableButtonColor;
      document.getElementById("redo").disabled = true;
    }
    addToStack(undoStack, action);
  }
}

//Shows the specific element
//Returns nothing
function showDialog(dialogId) {
  document.getElementById(dialogId).showModal();
}

//Closes a confirm dialog
//Returns nothing
function closeConfirmDialog(result) {
  document.getElementById("confirmActionDialog").close();
  if (result) {
    boardSize = 9;
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        addHint(row, col, solvedNumberBoard[row][col]);
      }
    }
  }
}

//Closes a confirm dialog
//Returns nothing
function closeconfrimdialog2(result) {
  document.getElementById("confirmActionDialog2").close();
  if (result) {
    hintButtonAction();
  }
}


function closeconfrimdialog3() {
  document.getElementById("confirmActionDialog3").close();
  for (let i = 0; i < entryModeIds.length; i++) {
    document.getElementById(entryModeIds[i]).disabled = true;
    document.getElementById(entryModeIds[i]).style.background = disableButtonColor;
  }
  for (let i = 0; i < solveModeIds.length; i++) {
    document.getElementById(solveModeIds[i]).disabled = false;
    document.getElementById(solveModeIds[i]).style.background = regBackgroundColor;
  }
  mode = "entry";
}
///Change hint number selector
//Returns nothing
function modifyNumber(delta) {
  const display = document.getElementById("numberDisplay");
  let number = parseInt(display.textContent);
  number = Math.max(0, number + delta);
  display.textContent = number.toString();
}

//Close hint number dialog and trigger the vent
//Reutns nothing
function closeNumberInputDialog() {
  document.getElementById("numberInputDialog").close();
  const number = parseInt(document.getElementById("numberDisplay").textContent);
}

//Modifys inital number of hints
//Yeah this also returns nothing
function modifyInitialHints(delta) {
  const display = document.getElementById("initialHints");
  let hints = parseInt(display.textContent);
  hints = Math.max(0, hints + delta);
  display.textContent = hints.toString();
}

//Gnerates puzzle
//Retuns noting
function startPuzzleGeneration() {
  document.getElementById("textLabel").innerHTML = "Starting Puzzle Generation";
  document.getElementById("generatePuzzleDialog").close();
  const initialHints = parseInt(document.getElementById("initialHints").textContent);
  resetBoard();
  boardSize = 9;
  solvedNumberBoard = createFilledBoard();
  numberBoard = deepCopy(solvedNumberBoard);
  let allSquares = getAllSquares();
  let noRemove = false;
  while (!noRemove) {
    noRemove = true;
    for (let i = 0; i < allSquares.length; i++) {
      let row = allSquares[i][0];
      let col = allSquares[i][1];
      numberBoard[row][col] = 0;
      if (solveBoard(0, getEmptySquareObjects(), 2, deepCopy(numberBoard), []).length == 1) {
        allSquares.splice(i, 1);
        noRemove = false;
        i--;
      } else {
        numberBoard[row][col] = solvedNumberBoard[row][col];
      }
    }
  }
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (numberBoard[row][col] != 0) {
        addHint(row, col, numberBoard[row][col]);
      }
    }
  }
  solveMode(true);
  let squares = getEmptySquares();
  shuffleArray(squares);
  for (let i = 0; i < initialHints; i++) {
    addHint(squares[i][0], squares[i][1], solvedNumberBoard[squares[i][0]][squares[i][1]]);
  }
}