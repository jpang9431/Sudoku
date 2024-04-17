//Screen height and width
const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;

//Stack with undo and redo button where you push or pop
const undoStack = [];
const redoStack = [];

//List of ids to disable for each mode
const entryModeIds = ["hint", "solve", "entryMode"];
const solveModeIds = ["generate", "solveMode"];



//The colors
var regBorderColor = "lightGray";
var emphBorderColor = "black";
var squareSelectColor = "#7CB9E8";
var colRowSelectColor = "LightBlue";
var regTextColor = "black";
var mistakeTextColor = "red";
var regBackgroundColor = "white";
var hintBackgroundColor = "gray";
var buttonTextColor = "black";
var buttonBackColor = "white";


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

//Set border style
const borderStyle = "solid ";

//Main function, call to start
//Returns nothing
document.addEventListener("DOMContentLoaded", function(event) {
  console.log("start");
  visualBoard();
  createOtherButtons();
  document.getElementById(lastNum).style.backgroundColor = "lightgray";
  //addHint(0, 0, 1);
  do {

  } while (getNonEmptySquares() > 20);


  solvedNumberBoard = createFilledBoard();
  numberBoard = deepCopy(solvedNumberBoard);
  let squares = getAllSquares();
  let hasRemoved = true;
  while (hasRemoved) {
    hasRemoved = false;
    for (let i = 0; i < squares.length; i++) {
      let square = squares[i];
      let row = square[0];
      let col = square[1];
      let num = square[2];
      if (num == 0) {
        hasRemoved = true;
        continue;
      }
      removeNumFromMap(row, col, num);
      numberBoard[row][col] = 0;
      if (solveBoard(0, getEmptySquareObjects(), 2, deepCopy(numberBoard), []).length == 1) {
        hasRemoved = true;
        squares.splice(i, 1);
        i--;
        //console.log(row+"|"+col);
      } else {
        numberBoard[row][col] = num;
        addNumToMap(row, col, num);
      }
    }
  }
  //printBoard(numberBoard);


  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (numberBoard[row][col] != 0) {
        addHint(row, col, numberBoard[row][col]);
      }
    }
  }
  //printBoard(numberBoard);
});

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
      createElm("button", numberCounter, buttonWidth, buttonHeight, numberSpacing + buttonWidth * col + boardSize, buttonHeight * row, "otherButtons", numberCounter).addEventListener("click", function(event) {
        document.getElementById(""+lastNum).style.backgroundColor = regBackgroundColor;
        lastNum = event.sour
        clickSquare(userRow, userCol, true);
      });
    }
  }
  createElm("button", "delte", buttonWidth * 3, buttonHeight, numberSpacing + boardSize, buttonHeight * 3, "otherButtons", "X");
  let counter = 0;
  let secondGroupHeight = buttonHeight * 4.5;
  //Undo Button
  createElm("button", "undo", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, secondGroupHeight, "otherButtons", "Undo"
  ).addEventListener("click", undo);

  //Redo Button
  createElm("button", "redo", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, secondGroupHeight, "otherButtons", "Redo"
  ).addEventListener("click", redo);

  createElm("button", "generate", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, secondGroupHeight, "otherButtons", "Generate");

  let thirdGroupHeight = buttonHeight * 6.5;
  counter = 0;
  createElm("button", "entryMode", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, thirdGroupHeight, "otherButtons", "Entry\nMode"
  );
  createElm("button", "open", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, thirdGroupHeight, "otherButtons", "Open"
  ).addEventListener("click", function(event) {
    document.getElementById("saveFile").click();
  });
  document.getElementById("saveFile").addEventListener("change", function(event) {
    const selectedFile = document.getElementById("saveFile").files[0];
    const reader = new FileReader();
    reader.onLoad = (evt) =>{
      console.log(evt.target.result);
    };
    reader.readAsText(selectedFile);
  });
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
    let allData = boardData + "\n" + hintData + "\n" + solvedBoardData;
    let blobData = new Blob([allData], {
      type: 'text/plain'
    });
    let tempElm = document.createElement("a");
    let url = URL.createObjectURL(blobData);
    tempElm.href = url;
    tempElm.download = "save";
    document.body.appendChild(tempElm);
    tempElm.click();
    setTimeout(function() {
      document.body.removeChild(tempElm);
      window.URL.revokeObjectURL(url);
    }, 0);
  });

  let fourthGroupHeight = screenHeight - buttonHeight;
  counter = 0;
  createElm("button", "soveMode", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, fourthGroupHeight, "otherButtons", "Solve\nMode"
  );
  createElm("button", "hint", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, fourthGroupHeight, "otherButtons", "Hint"
  );
  createElm("button", "solve", buttonWidth, buttonHeight, (++counter) * spacing + buttonWidth * (counter - 1) + boardSize, fourthGroupHeight, "otherButtons", "Solve"
  );


  /*//Redo Button
  createElm("button", "solveMode", buttonWidth, buttonHeight, (counter) * spacing + buttonWidth * (counter - 1) + boardSize, screenHeight-buttonHeight, "otherButtons", "Sove\nSolve"
  );*/

}

//Triggers when user inputs a number or uses keyboard input
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
        //console.log(row + ":" + col);
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
        //console.log(row);
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

//Call to setup the puzzle for the user
//Returns nothing
function generateShowPuzzle() {

}

//Object which represents one specific cell, use for backtracking
class Cell {
  constructor(row, col, nums) {
    this.row = row;
    this.col = col;
    this.nums = nums.length;
  }
}


//Call to get the solutions for a puzzle
//Returns 3d arrya of solutions
function solveBoard(index, squares, requiredSolutions, currentBoard, solutionBoards) {
  
}

//Call to set elements into solving mode
//Returns nothing
function solveMode() {
  for (let i = 0; i < entryModeIds.length; i++) {
    document.getElementById(entryModeIds[i]).disabled = false;
  }
  for (let i = 0; i < solveModeIds.length; i++) {
    document.getElementById(solveModeIds[i]).disabled = true;
  }
}

//Call to set elements into entry mode
//Returns nothing
function entryMode() {
  for (let i = 0; i < entryModeIds.length; i++) {
    document.getElementById(entryModeIds[i]).disabled = true;
  }
  for (let i = 0; i < solveModeIds.length; i++) {
    document.getElementById(solveModeIds[i]).disabled = false;
  }
}

//Call to fill board with a valid solution board
//Retunrs a 2d array with all squares filled
function createFilledBoard() {
  let board = createBoard(boardSize, 0);
  for (let i = 0; i < boardSize; i = i + squareSize) {
    fillSquare(i, i, board);
  }
  numberBoard = board;
  let solutions = solveBoard(0, getEmptySquareObjects(), 1, deepCopy(numberBoard), []);
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
      addNumToMap(i, j, nums[index]);
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




//Call to get all the possible numbers for a specific sudoku cell
//Return lsit of numbers which are possible for that square
function getPossibleNums(row, col, board) {
 
  return nums;
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
    squares.push(new Cell(emptySquares[i][0], emptySquares[i][1], getPossibleNums(emptySquares[i][0], emptySquares[i][1])));
  }
  squares.sort((a, b) => a.nums - b.nums);
  return squares;
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

//Call to make sure that each previous error square is still an error
//Returns nothing
function checkErrors() {
  // console.log("---------------");
  // printBoard(errors);
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
  //printBoard(errors);
  if (row >= boardSize || col >= boardSize || row < 0 || col < 0) {
    //console.log(row + "|" + col);
    return;
  }
  //console.log(getPossibleNums(row, col));
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
  document.getElementById(lastNum).style.backgroundColor = "lightgrey";
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
  //console.log(action);
  stack.push(action);
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
    addToStack(undoStack, action);
  }
}

//Add create popup functions here
function confirmPopUp(text) {

}

//Returns number of hints
function counterPopUp() {

}