class Ship{
    constructor(length){
        this.length = length;
        this.hits = 0;
        this.status = "afloat";
    }
    hit(){
        this.hits += 1;
        return
    }
    isSunk(){
        if(this.hits >= this.length){
            this.status = "sunk";
        }
    }
}


class Gameboard{
    constructor(){
        this.board = [new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10),new Array(10)];
        
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
}

module.exports = {Ship, Gameboard};