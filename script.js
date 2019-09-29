const nof_row = 3;
const nof_col = 3;
const nof_win = 3;
const regexId = /^(c-\d+-\d+)$/;
var turnFlag = false;
var board = new Array(nof_row);
var nofTurn = 0;

startGame();

function initBoard(){
  elementString = "";
  for(let i=0; i<nof_row; i++){
    elementString += "<tr>";
    board[i] = new Array(nof_col);
    for(let j=0; j<nof_col; j++){
      elementString += "<td class='cell' id='"+getStrId(i, j)+"'></td>";
      board[i][j] = 0;
    }
    elementString += "</tr>";
  }
  getElId("table-board").innerHTML += elementString;
}
function getSym(){
  if(turnFlag)
    return "O";
  else
    return "X";
}
function getElId(selector){
  return document.getElementById(selector);
}
function getStrId(row_id, col_id){
  return "c-"+row_id+"-"+col_id;
}
function getRowColId(str_id){
  res = str_id.split("-");
  if(res.length == 3)
    return [parseInt(res[1]), parseInt(res[2])];
  else
    return undefined;
}

function inBetween(row_id, col_id){
  return ((row_id >= 0) && (row_id < nof_row)) && ((col_id >= 0) && (col_id < nof_col));
}

function restart(){
  nofTurn = 0;
  getElId("table-board").innerHTML = "";
}

function startGame() {
  restart();
  initBoard();
  let cells = document.querySelectorAll('.cell');
  document.querySelector('.endgame').style.display = "none";
  document.querySelector('.endgame .text').innerText ="";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  if (regexId.test(square.target.id)) {
    let rowColId = getRowColId(square.target.id);
    if(board[rowColId[0]][rowColId[1]] === 0){
      turn(square.target.id, rowColId, getSym());
      nofTurn++;
      if(nofTurn>=nof_col*nof_row){
        gameOver("Tie game");
      }
      turnFlag = !turnFlag;
    }
  }
}

function turn(squareId, rowColId, player) {
  getElId(squareId).innerHTML = player;
  board[rowColId[0]][rowColId[1]] = player;
  checkWin(rowColId[0], rowColId[1], 0, +1, player);
  checkWin(rowColId[0], rowColId[1], +1, 0, player);
  checkWin(rowColId[0], rowColId[1], +1, +1, player);
  checkWin(rowColId[0], rowColId[1], -1, +1, player);
}

function checkWin(rowId, colId, rowMod, colMod, player) {
  let rowColId = [];
  rowColId = getFurthest(rowId, colId, rowMod, colMod, player);
  if(getLength(rowColId[0], rowColId[1], rowMod*-1, colMod*-1, player) >= nof_win){
    gameOver(player + " win the game");
    nofTurn = -1;
  }
}


function getFurthest(rId, cId, rMod, cMod, p){
  while(inBetween(rId+rMod, cId+cMod)){
    if(board[rId+rMod][cId+cMod] == p){
      rId += rMod;
      cId += cMod;
    } else {
      break;
    }
  }
  return [rId, cId];
}

function getLength(rId, cId, rMod, cMod, p){
  let len = 1;
  while(inBetween(rId+rMod, cId+cMod)){
    if(board[rId+rMod][cId+cMod] == p){
      rId += rMod;
      cId += cMod;
      len++;
    } else {
      break;
    }
  }
  return len; 
}

function gameOver(strInf){
  let cells = document.querySelectorAll('.cell');
  for (let i=0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = strInf;
}