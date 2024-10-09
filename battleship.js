class Ship{
    constructor(length){
        this.length = length;
        this.hits = 0;
        this.status = "afloat";
    }
    hit(){
        this.hits += 1;
        this.isSunk();
        return
    }
    isSunk(){
        if(this.hits >= this.length){
            this.hits;
            this.status = "sunk";
        }
    }
}


class Gameboard{
    constructor(){
        this.board = [new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10)];
        this.result = "In play";
        this.misses = [];
    }
    placeShip(ship,coord1,coord2,direction){
        let shipLength = ship.length;
        let boardLength = this.board.length;
        if(direction == 0){//0 = vertical
            for(let i=0;i<shipLength;i++){
                let verticalIndex = coord1+i;
                if(verticalIndex > boardLength-1){
                    verticalIndex = boardLength - 1 -i;
                }
               if(this.board[verticalIndex][coord2] !== undefined){
                return "Error:overlap of ships, choose another location"
               }
            }
            for(let i=0;i<shipLength;i++){
                let verticalIndex = coord1+i;
                //if out of bounds
                if(verticalIndex > boardLength-1){
                   verticalIndex = boardLength - 1 -i;
                }
                this.board[verticalIndex][coord2] = ship;
            }
        }else{//horizontal
            for(let i=0;i<shipLength;i++){
                let horizontalIndex = coord2+i;
                if(horizontalIndex > boardLength-1){
                    horizontalIndex = boardLength - 1 -i;
                }
               if(this.board[coord1][horizontalIndex] !== undefined){
                return "Error:overlap of ships, choose another location"
               }
            }
            for(let i=0;i<shipLength;i++){
                let horizontalIndex = coord2+i;
                //if out of bounds
                if(horizontalIndex > boardLength-1){
                    horizontalIndex = boardLength - 1 -i;
                }
                this.board[coord1][horizontalIndex] = ship;
            }
        }
    }
    receiveAttack(coord1,coord2){
        let gameboardPosition = this.board[coord1][coord2];
        if(gameboardPosition == undefined){
            this.misses.push([coord1,coord2]);
            this.board[coord1][coord2] = "miss";
        }
        else if(gameboardPosition == "miss"){
            return "already hit, try another"
        }
        else{
            gameboardPosition.hit();
            this.boardStatus();
        }
        

    }
    boardStatus(){
        //filter to not undefined and not miss
        //filter to .status("afloat")
        //if length<1,this.result "game over"
        let boatsAfloat = [];
        for(let i = 0; i<10;i++){
            let j=0
            for(j; j<10;j++){
                if(this.board[i][j] !== undefined && this.board[i][j] !== "miss"){
                    if(this.board[i][j].status == "afloat"){
                        boatsAfloat.push(this.board[i][j])
                    }
                }
            }
        }
        if(boatsAfloat.length<1){
            this.result = "All ships sunk"
        }

    }
}

class Player{
    constructor(type){
        this.type = type;
        this.gameboard = new Gameboard();
    }
}

module.exports = {Ship, Gameboard,Player};