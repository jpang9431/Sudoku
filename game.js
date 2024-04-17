//All the constnat numbers
const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;
const boardSize = screenWidth - screenHeight;
const boardNumberSize = 9;
const squareNumberSize = Math.sqrt(boardNumberSize);
const squareSize = screenHeight / boardNumberSize;

//All the 2d array represetnations of boards
var numberBoard = createBoard(boardNumberSize, 0);
var solvedNumberBoard = createBoard(boardNumberSize, 0);
const buttonBoard = createBoard(boardNumberSize, null);

//List of color variables
var textColor = "black";
var regBackColor = "white";

//Main function aka start function aka something else
document.addEventListener("DOMContentLoaded", function(event){
  createScreen();
});

//Creates the screen
//Returns nothing
function createScreen() {
  for(let row=0; row<boardNumberSize; row++){
    for(let col=0; col<boardNumberSize; col++){
      let button = createElm("button", "square"+row+col, squareSize, squareSize, col*squareSize, row*squareSize, "sudoku");
      button.row = row;
      button.col = col;
      button.addEventListener("click", function(event){
        let row = this.row;
        let col = this.col;
      });
      buttonBoard[row][col] = button;
    }
  }
}

//Call to create a two 2d array with a preset value
//Returns a 2d array with 
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