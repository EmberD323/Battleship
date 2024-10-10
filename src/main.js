import "./style.css";
import { Ship, Gameboard,Player } from "./battleship.js";
const Display = (function(){
    function gameboard(gameboard,player){
        //select correct board
        let boardSelector = "";
        if(player == "playerOne"){boardSelector = ".playerOne";}
        else{boardSelector = ".playerTwo";}
        let boardDOM = document.querySelector(boardSelector + ">.board").childNodes;
        let gameboardArray = gameboard.board;
        let DOMspaceNumber=1;
        let squareNumber=1;
        for(let i=0;i<10;i++){
            let j=0
            for(j;j<10;j++){
                let space = gameboardArray[i][j]
                //clear board
                boardDOM[DOMspaceNumber].id = "space";
                boardDOM[DOMspaceNumber].textContent = "";
                //display board
                if(space == "miss"){
                    //display an x in that space
                    boardDOM[DOMspaceNumber].id = "miss";
                    boardDOM[DOMspaceNumber].textContent = "x";
                }
                else if(space !== undefined){//ie has a ship
                    //space contains ship with no hit
                    boardDOM[DOMspaceNumber].id = "ship";
                    //space contains ship that has sunk
                    if(space.status == "sunk"){
                        boardDOM[DOMspaceNumber].id = "shipSunk";
                        boardDOM[DOMspaceNumber].textContent = "x";
                    }
                    else{//if space is ship but has been hit but not sunk - problem: not displaying hit ship
                        let hitArray = space.hitLocation;//hit location(1,1)
                        for(let k=0;k<hitArray.length;k++){
                            let hitSquareNumber = Number((hitArray[k][0].toString())+(hitArray[k][1].toString()))+1
                            if(hitSquareNumber == squareNumber){
                                boardDOM[DOMspaceNumber].textContent = "x";
                                boardDOM[DOMspaceNumber].id = "shipHit";
                            }
                        }     
                    }
                }
                //step through DOM
                DOMspaceNumber=DOMspaceNumber+2;//every second Dom element is a space in the grid
                squareNumber = squareNumber+1;
            }
        }
    }
    function hiddenGameboard(gameboard,player){
        //select correct board
        let boardSelector = "";
        if(player == "playerOne"){boardSelector = ".playerOne";}
        else{boardSelector = ".playerTwo";}
        let boardDOM = document.querySelector(boardSelector + ">.board").childNodes;
        let gameboardArray = gameboard.board;
        let DOMspaceNumber=1;
        let squareNumber=1;
        for(let i=0;i<10;i++){
            let j=0
            for(j;j<10;j++){
                let space = gameboardArray[i][j]
                //clear board
                boardDOM[DOMspaceNumber].id = "space";
                boardDOM[DOMspaceNumber].textContent = "";
                //display board
                if(space == "miss"){
                    //display an x in that space
                    boardDOM[DOMspaceNumber].id = "miss";
                    boardDOM[DOMspaceNumber].textContent = "x";
                }
                else if(space !== undefined){//ie has a ship
                    if(space.status == "sunk"){
                        boardDOM[DOMspaceNumber].id = "shipSunk";
                        boardDOM[DOMspaceNumber].textContent = "x";
                    }
                    else{//if space is ship but has been hit but not sunk - problem: not displaying hit ship
                        let hitArray = space.hitLocation;//hit location(1,1)
                        for(let k=0;k<hitArray.length;k++){
                            let hitSquareNumber = Number((hitArray[k][0].toString())+(hitArray[k][1].toString()))+1
                            if(hitSquareNumber == squareNumber){
                                boardDOM[DOMspaceNumber].textContent = "x";
                                boardDOM[DOMspaceNumber].id = "shipHit";
                            }
                        }     
                    }
                }
                //step through DOM
                DOMspaceNumber=DOMspaceNumber+2;//every second Dom element is a space in the grid
                squareNumber = squareNumber+1;
            }
        }
    }
    return{gameboard,hiddenGameboard}
})();

const Computer = (function(){
    function takeTurn(){
        let playerAttacked = playerOne;
        let computerGameboard = playerTwo.gameboard;
        let gameboardAttacked = playerAttacked.gameboard;
        let rowNumber = Math.floor(Math.random()*10);
        let columnNumber = Math.floor(Math.random()*10);
        console.log("["+rowNumber+", "+columnNumber+"]")
        console.log(gameboardAttacked.board[rowNumber][columnNumber]);
        let cellNumberString =rowNumber.toString()+columnNumber.toString();
        console.log(cellNumberString);
        let cellDOM = document.querySelector(".playerOne>.board>.index"+cellNumberString);
        console.log(cellDOM)
        //if it is space or ship not hit then attack & display & return
        
        if(gameboardAttacked.board[rowNumber][columnNumber]==undefined || cellDOM.textContent !== "x"){
           //or dom display doesnt have an x
           gameboardAttacked.receiveAttack(rowNumber,columnNumber);
           Display.gameboard(gameboardAttacked,"playerOne");
        }
        else{
            Computer.takeTurn();
        }
        //else take another Turn
        ///d
        //send attack to gameboard
        //gameboardAttacked.receiveAttack(rowNumberClicked,columnNumberClicked);
    }
    return{takeTurn}
})();

const Game = (function(){
    function play(){
        let allSquareDOM = document.querySelectorAll(".playerTwo>.board>*");
        allSquareDOM.forEach((cell)=>{
            cell.addEventListener("click",(e)=>{
                //if the rounds are off only allow to player one,else player two
                //find gameboard index
                let rowNumberClicked = (cell.classList.value).slice(5,6);//index11
                let columnNumberClicked = (cell.classList.value).slice(6,7);
                let playerAttacked = playerTwo;
                let playersGameboard = playerOne.gameboard;
                let gameboardAttacked = playerAttacked.gameboard;
                //send attack to gameboard
                gameboardAttacked.receiveAttack(rowNumberClicked,columnNumberClicked);
                //display attack
                Display.hiddenGameboard(gameboardAttacked,"playerTwo");
                //if game over stop 
                if(gameboardAttacked.result == "All ships sunk"){
                    console.log("game over. Winner is player 1!")
                }
                else if(playersGameboard.result == "All ships sunk"){
                    console.log("game over. Winner is player 2!")
                    Display.Gameboard(gameboardAttacked,"playerTwo");
                }
                else{//otherwise computer turn
                    Computer.takeTurn();
                }   
            });
        });
    }
    return {play} 
})();
//playerTwo and ship setting up
let playerOne = new Player("real");
let playerOneBoard = playerOne.gameboard;
let playerOneShip1 = new Ship(5);
let playerOneShip2 = new Ship(4);
let playerOneShip3 = new Ship(4);
let playerOneShip4 = new Ship(3);
let playerOneShip5 = new Ship(3);
let playerOneShip6 = new Ship(3);
let playerOneShip7 = new Ship(2);
let playerOneShip8 = new Ship(2);
let playerOneShip9 = new Ship(2);
let playerOneShip10 = new Ship(2);
playerOneBoard.placeShip(playerOneShip1,1,1,0);
playerOneBoard.placeShip(playerOneShip2,7,4,1);
playerOneBoard.placeShip(playerOneShip3,2,8,0);
playerOneBoard.placeShip(playerOneShip4,2,3,0);
playerOneBoard.placeShip(playerOneShip5,2,5,0);
playerOneBoard.placeShip(playerOneShip6,9,0,1);
playerOneBoard.placeShip(playerOneShip7,0,6,1);
playerOneBoard.placeShip(playerOneShip8,7,1,1);
playerOneBoard.placeShip(playerOneShip9,7,9,0);
playerOneBoard.placeShip(playerOneShip10,9,5,1);
Display.gameboard(playerOneBoard,"playerOne");
let playerTwo = new Player("computer");
let playerTwoBoard = playerTwo.gameboard;
let playerTwoShip1 = new Ship(5);
let playerTwoShip2 = new Ship(4);
let playerTwoShip3 = new Ship(4);
let playerTwoShip4 = new Ship(3);
let playerTwoShip5 = new Ship(3);
let playerTwoShip6 = new Ship(3);
let playerTwoShip7 = new Ship(2);
let playerTwoShip8 = new Ship(2);
let playerTwoShip9 = new Ship(2);
let playerTwoShip10 = new Ship(2);
playerTwoBoard.placeShip(playerTwoShip1,8,4,1);
playerTwoBoard.placeShip(playerTwoShip2,1,2,0);
playerTwoBoard.placeShip(playerTwoShip3,3,4,1);
playerTwoBoard.placeShip(playerTwoShip4,0,0,0);
playerTwoBoard.placeShip(playerTwoShip5,5,4,1);
playerTwoBoard.placeShip(playerTwoShip6,7,1,1);
playerTwoBoard.placeShip(playerTwoShip7,0,4,0);
playerTwoBoard.placeShip(playerTwoShip8,5,0,0);
playerTwoBoard.placeShip(playerTwoShip9,6,7,1);
playerTwoBoard.placeShip(playerTwoShip10,9,1,1);
Display.hiddenGameboard(playerTwoBoard,"playerTwo");

console.log("playerOne info");
console.log(playerOne);
console.log("playerTwo info");
console.log(playerTwo);

Game.play();





