import "./style.css";
import { Ship,Player } from "./battleship.js";
//playerOne and gameboard setting up
let playerOne = new Player("real");
let playerOneBoard = playerOne.gameboard;
let playerTwo = new Player("computer");
let playerTwoBoard = playerTwo.gameboard;
let playerOneCounter=0;
let playerTwoCounter=0;

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
    function getRandomnCell(playerName){
        let rowNumber = Math.floor(Math.random()*10);
        let columnNumber = Math.floor(Math.random()*10);
        let cellNumberString =rowNumber.toString()+columnNumber.toString();
        let cellDOM = document.querySelector("."+playerName+">.board>.index"+cellNumberString);
        return cellDOM;
    }
    return{gameboard,hiddenGameboard,getRandomnCell}
})();

const Computer = (function(){
    function takeTurn(){
        let playerAttacked = playerOne;
        let gameboardAttacked = playerAttacked.gameboard;
        let rowNumber = Math.floor(Math.random()*10);
        let columnNumber = Math.floor(Math.random()*10);
        let cellNumberString =rowNumber.toString()+columnNumber.toString();
        let cellDOM = document.querySelector(".playerOne>.board>.index"+cellNumberString);//fix: replace with getRandomCell
        //if it is space or ship not hit then attack & display & return
        setTimeout(()=>{
            if(gameboardAttacked.board[rowNumber][columnNumber]==undefined || cellDOM.textContent !== "x"){
                //or dom display doesnt have an x
                gameboardAttacked.receiveAttack(rowNumber,columnNumber);
                playerTwoCounter++;
                Display.gameboard(gameboardAttacked,"playerOne");
                Game.winCheck();
             }
             else{
                 Computer.takeTurn();
             }
        },1000)
        
    }
    function placeShips(){
        let shipLengths =[5,4,4,3,3,3,2,2,2,2];
        
        for(let i=0;i<10;i++){
            let shipLength = shipLengths.shift();
            let cellDOM = Display.getRandomnCell("playerTwo");
            let rowNumber = Number(cellDOM.classList.value.charAt(5));
            let columnNumber = Number(cellDOM.classList.value.charAt(6));
            let randomNumber = Math.random();
            let orientationNumber;
            if(randomNumber>0.5){orientationNumber = 1;}
            else{orientationNumber = 0;}
            let ship = new Ship(shipLength);
            let check = playerTwoBoard.checkIfEmpty(rowNumber,columnNumber,shipLength,orientationNumber);
            if (check == false){
                i = i-1;
                shipLengths.unshift(shipLength);
            }
            else{
                playerTwoBoard.placeShip(ship,rowNumber,columnNumber,orientationNumber)
                Display.hiddenGameboard(playerTwoBoard,"playerTwo")
            }

        }

    }
    return{takeTurn, placeShips}
})();

const Game = (function(){
    function play(){
        let allSquareDOM = document.querySelectorAll(".playerTwo>.board>*");
        allSquareDOM.forEach((cell)=>{
            cell.addEventListener("click",(e)=>{
                if(playerOneCounter == playerTwoCounter){
                    //if the rounds are off only allow to player one,else player two
                    let playerAttacked = playerTwo;
                    let playersGameboard = playerOne.gameboard;
                    let gameboardAttacked = playerAttacked.gameboard;
                    //stop if game already finished
                    if(gameboardAttacked.result=="All ships sunk"||playersGameboard.result=="All ships sunk"){return}
                    //find gameboard index
                    let rowNumberClicked = (cell.classList.value).slice(5,6);//index11
                    let columnNumberClicked = (cell.classList.value).slice(6,7);
                    //check if undefined or ship
                    let cellStatus = cell.id;
                    //if cell is already hit dont attack
                    if(cellStatus == "miss"||cellStatus == "shipHit"||cellStatus == "shipSunk"){
                        return
                    }
                    else{ //attack and move game forward
                        //send attack to gameboard
                        gameboardAttacked.receiveAttack(rowNumberClicked,columnNumberClicked);
                        playerOneCounter++;
                        //display attack
                        Display.hiddenGameboard(gameboardAttacked,"playerTwo");
                        let winPopUp  = document.querySelector(".win");
                        let closeButton5 = document.querySelector(".close5");
                        closeButton5.addEventListener("click",(e)=>{
                            winPopUp.close();
                        });
                        //if game over stop 
                        if(Game.winCheck()==true){
                            return
                        }
                        else{//otherwise computer turn
                            Computer.takeTurn();
                        }
                    }
                }
            });
        });
    }
    function winCheck(){
        if(playerTwoBoard.result == "All ships sunk"){
            text.textContent = "Game over. Winner is player 1!";
            winPopUp.showModal();
            return true
        }
        else if(playerOneBoard.result == "All ships sunk"){
            text.textContent = "Game over. Winner is player 2!";
            winPopUp.showModal();
            return true
        }
        else{
            return false
        }
    }
    return {play,winCheck} 
})();

const Form1 = (function(){
    //Length 5 form - ie 1
    let dialog1 = document.querySelector(".dialog1");
    let dialogButton1 = document.querySelector(".modalOpen1");
    let dialogButton2 = document.querySelector(".modalOpen2");
    let closeButton1 = document.querySelector(".close1");
    let submit1 = document.querySelector(".submit1");
    let form = document.querySelector(".dialog1>form").childNodes;
    let orientationOptions = document.querySelectorAll(".dialog1>form>fieldset>div")
    // When the user clicks on the button, open the modal
    dialogButton1.addEventListener("click",(e)=>{
        dialog1.showModal();
    });

    // When the user clicks on <span> (x), close the modal
    closeButton1.addEventListener("click",(e)=>{
        dialog1.close();
    });
    submit1.addEventListener("click",(e)=>{
        e.preventDefault();
        //validity
        if (!form[7].validity.valid ||!form[13].validity.valid) {
            // If it isn't, we display an appropriate error message
            showError(form);
            //then dont do anything
        }
        else{
            let coord1 = Number(form[7].value);
            let coord2 = Number(form[13].value);
            let orientation;
            for(let i=0;i<orientationOptions.length;i++){
                if(orientationOptions[i].childNodes[3].checked){
                    orientation = Number(orientationOptions[i].childNodes[3].value);
                    break
                }
            }
            //placeShip
            let playerOneShip1 = new Ship(5);
            const announceDOM = form[form.length-1];
            let place1 = playerOneBoard.placeShip(playerOneShip1,coord1,coord2,orientation);
            if(place1 == "Error:overlap of ships, choose another location"){
                announceDOM.textContent == "Error: Ship 1 will overlap with another ship,choose another location"
                return
            }
            //refreshdisplay
            Display.gameboard(playerOneBoard,"playerOne");
            //hide dialogButton1
            dialogButton1.style.display ="none"
            //display dialogButton2
            dialogButton2.style.display ="block"
            dialog1.close();
        }
    });

})();
const Form2 = (function(){
    //Length 4 form
    let dialog2 = document.querySelector(".dialog2");
    let dialogButton2 = document.querySelector(".modalOpen2");
    let dialogButton3 = document.querySelector(".modalOpen3");
    let closeButton2 = document.querySelector(".close2");
    let submit2 = document.querySelector(".submit2");
    let form = document.querySelector(".dialog2>form").childNodes;
    let orientationOptions2 = [form[17].childNodes[3],form[17].childNodes[5]];
    let orientationOptions3 = [form[33].childNodes[3],form[17].childNodes[5]];

    dialogButton2.addEventListener("click",(e)=>{
        dialog2.showModal();
    });
    closeButton2.addEventListener("click",(e)=>{
        dialog2.close();
    });
    submit2.addEventListener("click",(e)=>{
        e.preventDefault();
        //validity
        if (!form[7].validity.valid ||!form[13].validity.valid||!form[23].validity.valid ||!form[29].validity.valid) {
            // If it isn't, we display an appropriate error message
            showError(form);
            //then dont do anything
        }
        else{
            let coord21 = Number(form[7].value);
            let coord22 = Number(form[13].value);
            let coord31 = Number(form[23].value);
            let coord32 = Number(form[29].value);
            let orientation2;
            for(let i=0;i<orientationOptions2.length;i++){
                if(orientationOptions2[i].childNodes[3].checked){
                    orientation2 = Number(orientationOptions2[i].childNodes[3].value);
                    break
                }
            }
            let orientation3;
            for(let i=0;i<orientationOptions3.length;i++){
                if(orientationOptions3[i].childNodes[3].checked){
                    orientation3 = Number(orientationOptions3[i].childNodes[3].value);
                    break
                }
            }
            //placeShips
            let playerOneShip2 = new Ship(4);
            let playerOneShip3 = new Ship(4);
            const announceDOM = form[form.length-2];
            let check2 = playerOneBoard.checkIfEmpty(coord21,coord22,4,orientation2);
            let check3 = playerOneBoard.checkIfEmpty(coord31,coord32,4,orientation3);
            if(check2 == false || (coord21 == coord31 && coord22 == coord32)){
                announceDOM.textContent = "Error: Ship 2 will overlap with another ship on the board,choose another location";
            }
            else if(check3 == false){
                announceDOM.textContent = "Error: Ship 3 will overlap with another ship on the board,choose another location";
            }
            else{
                playerOneBoard.placeShip(playerOneShip2,coord21,coord22,orientation2);
                playerOneBoard.placeShip(playerOneShip3,coord31,coord32,orientation3);
                //refreshdisplay
                Display.gameboard(playerOneBoard,"playerOne");
                //hide dialogButton1
                dialogButton2.style.display ="none"
                //display dialogButton2
                dialogButton3.style.display ="block"
                dialog2.close();
            }
            
        }
    });

})();
const Form3 = (function(){
    //Length 3 form
    let dialog3 = document.querySelector(".dialog3");
    let dialogButton3 = document.querySelector(".modalOpen3");
    let dialogButton4 = document.querySelector(".modalOpen4");
    let closeButton3 = document.querySelector(".close3");
    let submit3 = document.querySelector(".submit3");
    let form = document.querySelector(".dialog3>form").childNodes;
    let orientationOptions4 = [form[17].childNodes[3],form[17].childNodes[5]];
    let orientationOptions5 = [form[33].childNodes[3],form[17].childNodes[5]];
    let orientationOptions6 = [form[49].childNodes[3],form[17].childNodes[5]];

    dialogButton3.addEventListener("click",(e)=>{
        dialog3.showModal();
    });
    closeButton3.addEventListener("click",(e)=>{
        dialog3.close();
    });
    submit3.addEventListener("click",(e)=>{
        e.preventDefault();
        //validity
        if (!form[7].validity.valid ||!form[13].validity.valid||!form[23].validity.valid ||!form[29].validity.valid||!form[39].validity.valid ||!form[45].validity.valid) {
            // If it isn't, we display an appropriate error message
            showError(form);
            //then dont do anything
        }
        else{
            let coord41 = Number(form[7].value);
            let coord42 = Number(form[13].value);
            let coord51 = Number(form[23].value);
            let coord52 = Number(form[29].value);
            let coord61 = Number(form[39].value);
            let coord62 = Number(form[45].value);
            let orientation4;
            for(let i=0;i<orientationOptions4.length;i++){
                if(orientationOptions4[i].childNodes[3].checked){
                    orientation4 = Number(orientationOptions4[i].childNodes[3].value);
                    break
                }
            }
            let orientation5;
            for(let i=0;i<orientationOptions5.length;i++){
                if(orientationOptions5[i].childNodes[3].checked){
                    orientation5 = Number(orientationOptions5[i].childNodes[3].value);
                    break
                }
            }
            let orientation6;
            for(let i=0;i<orientationOptions6.length;i++){
                if(orientationOptions6[i].childNodes[3].checked){
                    orientation6 = Number(orientationOptions6[i].childNodes[3].value);
                    break
                }
            }
            //placeShips
            let playerOneShip4 = new Ship(3);
            let playerOneShip5 = new Ship(3);
            let playerOneShip6 = new Ship(3);
            const announceDOM = form[form.length-2];
            let check4 = playerOneBoard.checkIfEmpty(coord41,coord42,3,orientation4);
            let check5 = playerOneBoard.checkIfEmpty(coord51,coord52,3,orientation5);
            let check6 = playerOneBoard.checkIfEmpty(coord61,coord62,3,orientation6);
            if(check4 == false|| (coord41 == coord51 && coord42 == coord52)|| (coord41 == coord61 && coord42 == coord62)){
                announceDOM.textContent = "Error: Ship 4 will overlap with another ship on the board,choose another location"
            }
            else if(check5 == false|| (coord51 == coord61 && coord52 == coord62)){
                announceDOM.textContent = "Error: Ship 5 will overlap with another ship on the board,choose another location"
            }
            else if(check6 == false){
                announceDOM.textContent = "Error: Ship 6 will overlap with another ship on the board,choose another location"
            }
            else{
                playerOneBoard.placeShip(playerOneShip4,coord41,coord42,orientation4);
                playerOneBoard.placeShip(playerOneShip5,coord51,coord52,orientation5);
                playerOneBoard.placeShip(playerOneShip6,coord61,coord62,orientation6);
                //refreshdisplay
                Display.gameboard(playerOneBoard,"playerOne");
                //hide dialogButton1
                dialogButton3.style.display ="none"
                //display dialogButton2
                dialogButton4.style.display ="block"
                dialog3.close();
            }
            
        }
    });

})();
const Form4 = (function(){
    //Length 3 form
    let dialog4 = document.querySelector(".dialog4");
    let dialogButton4 = document.querySelector(".modalOpen4");
    let closeButton4 = document.querySelector(".close4");
    let submit4 = document.querySelector(".submit4");
    let form = document.querySelector(".dialog4>form").childNodes;
    let orientationOptions7 = [form[17].childNodes[3],form[17].childNodes[5]];
    let orientationOptions8 = [form[33].childNodes[3],form[17].childNodes[5]];
    let orientationOptions9 = [form[49].childNodes[3],form[17].childNodes[5]];
    let orientationOptions10 = [form[65].childNodes[3],form[17].childNodes[5]];

    dialogButton4.addEventListener("click",(e)=>{
        dialog4.showModal();
    });
    closeButton4.addEventListener("click",(e)=>{
        dialog4.close();
    });
    submit4.addEventListener("click",(e)=>{
        e.preventDefault();
        //validity
        if (!form[7].validity.valid ||!form[13].validity.valid||!form[23].validity.valid ||!form[29].validity.valid||!form[39].validity.valid ||!form[45].validity.valid||!form[55].validity.valid ||!form[61].validity.valid) {
            // If it isn't, we display an appropriate error message
            showError(form);
            //then dont do anything
        }
        else{
            let coord71 = Number(form[7].value);
            let coord72 = Number(form[13].value);
            let coord81 = Number(form[23].value);
            let coord82 = Number(form[29].value);
            let coord91 = Number(form[39].value);
            let coord92 = Number(form[45].value);
            let coord101 = Number(form[55].value);
            let coord102 = Number(form[61].value);
            let orientation7;
            for(let i=0;i<orientationOptions7.length;i++){
                if(orientationOptions7[i].childNodes[3].checked){
                    orientation7 = Number(orientationOptions7[i].childNodes[3].value);
                    break
                }
            }
            let orientation8;
            for(let i=0;i<orientationOptions8.length;i++){
                if(orientationOptions8[i].childNodes[3].checked){
                    orientation8 = Number(orientationOptions8[i].childNodes[3].value);
                    break
                }
            }
            let orientation9;
            for(let i=0;i<orientationOptions9.length;i++){
                if(orientationOptions9[i].childNodes[3].checked){
                    orientation9 = Number(orientationOptions9[i].childNodes[3].value);
                    break
                }
            }
            let orientation10;
            for(let i=0;i<orientationOptions10.length;i++){
                if(orientationOptions10[i].childNodes[3].checked){
                    orientation10 = Number(orientationOptions10[i].childNodes[3].value);
                    break
                }
            }
            //placeShips
            let playerOneShip7 = new Ship(2);
            let playerOneShip8 = new Ship(2);
            let playerOneShip9 = new Ship(2);
            let playerOneShip10 = new Ship(2);
            const announceDOM = form[form.length-2];
            let check7 = playerOneBoard.checkIfEmpty(coord71,coord72,2,orientation7);
            let check8 = playerOneBoard.checkIfEmpty(coord81,coord82,2,orientation8);
            let check9 = playerOneBoard.checkIfEmpty(coord91,coord92,2,orientation9);
            let check10 = playerOneBoard.checkIfEmpty(coord101,coord102,2,orientation10);
            if(check7 == false|| (coord71 == coord81 && coord72 == coord82)|| (coord71 == coord91 && coord72 == coord92)|| (coord71 == coord101 && coord72 == coord102)){
                announceDOM.textContent = "Error: Ship 7 will overlap with another ship on the board,choose another location"
            }
            else if(check8 == false|| (coord81 == coord91 && coord82 == coord92)|| (coord81 == coord101 && coord82 == coord102)){
                announceDOM.textContent = "Error: Ship 8 will overlap with another ship on the board,choose another location"
            }
            else if(check9 == false|| (coord91 == coord101 && coord92 == coord102)){
                announceDOM.textContent = "Error: Ship 9 will overlap with another ship on the board,choose another location"
            }
            else if(check10 == false){
                announceDOM.textContent = "Error: Ship 10 will overlap with another ship on the board,choose another location"
            }
            else{
                playerOneBoard.placeShip(playerOneShip7,coord71,coord72,orientation7);
                playerOneBoard.placeShip(playerOneShip8,coord81,coord82,orientation8);
                playerOneBoard.placeShip(playerOneShip9,coord91,coord92,orientation9);
                playerOneBoard.placeShip(playerOneShip10,coord101,coord102,orientation10);
                //refreshdisplay
                Display.gameboard(playerOneBoard,"playerOne");
                //hide dialogButton4
                dialogButton4.style.display ="none"
                //start Game
                let text = document.querySelector(".announce");
                text.textContent = "All ships have been place. Make your first move!";
                Computer.placeShips();
                Game.play();
                dialog4.close();
                
            }

        }
    });

})();


function showError(form) {
    const coordError = form[form.length-2];
    let coordInputs=[];
    let formIndex = form.length
    while(formIndex>7){
        coordInputs.push(form[formIndex-10]);
        coordInputs.push(form[formIndex-16]);
        formIndex = formIndex -16;
    }
    for(let i=0;i<coordInputs.length;i++){
        if(coordInputs[i].validity.rangeUnderflow){
            coordError.textContent = "Number must be between 0 - 9.";
        } else if (coordInputs[i].validity.rangeOverflow) {
            coordError.textContent = "Number must be between 0 - 9.";
        } else if (coordInputs[i].validity.valueMissing) {
            coordError.textContent = "Coordinates required";
        }
    }
 
}









