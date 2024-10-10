const {Ship,Gameboard,Player} = require('./battleship');
describe("Ship", () => {
    test('new ship should have length as input, 0hits, and is afloat', () => {
        expect(new Ship(1)).toEqual({length:1, hits:0, status:"afloat"});
    });
    
    
    test('ships hit count should increase with hit function', () => {
        const ship = new Ship(4);
        ship.hit();
        expect(ship.hits).toBe(1);
    });

    test('multiple hits', () => {
        const ship = new Ship(4);
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.hits).toBe(5);
    });

    test('sunk true check', () => {
        const ship = new Ship(4);
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        ship.isSunk();
        expect(ship.status).toBe("sunk");
    });

    test('sunk false check', () => {
        const ship = new Ship(4);
        ship.hit();
        ship.hit();
        ship.isSunk();
        expect(ship.status).toBe("afloat");
    });

});
describe("Gameboard", () => {

    test('place ship vertically', () => {
        let gameboard =  new Gameboard();
        let ship = new Ship(2);
        gameboard.placeShip(ship,5,3,0);
        expect(gameboard.board[5][3]).toBe(ship);
        expect(gameboard.board[6][3]).toBe(ship);
        expect(gameboard.board[7][3]).toBe(undefined);
    });
    test('place ship vertically - check for out of bounds', () => {
        let gameboard =  new Gameboard();
        let ship = new Ship(2);
        gameboard.placeShip(ship,9,3,0);
        expect(gameboard.board[7][3]).toBe(undefined);
        expect(gameboard.board[8][3]).toBe(ship);
        expect(gameboard.board[9][3]).toBe(ship);
    });
    test('place ship horizontally', () => {
        let gameboard =  new Gameboard();
        let ship = new Ship(5);
        gameboard.placeShip(ship,3,4,1);
        expect(gameboard.board[3][4]).toBe(ship);
        expect(gameboard.board[3][5]).toBe(ship);
        expect(gameboard.board[3][6]).toBe(ship);
        expect(gameboard.board[3][7]).toBe(ship);
        expect(gameboard.board[3][8]).toBe(ship);
        expect(gameboard.board[3][9]).toBe(undefined);
    });
    test('place ship horizontally - check for out of bounds', () => {
        let gameboard =  new Gameboard();
        let ship = new Ship(4);
        gameboard.placeShip(ship,5,7,1);
        expect(gameboard.board[5][5]).toBe(undefined);
        expect(gameboard.board[5][6]).toBe(ship);
        expect(gameboard.board[5][7]).toBe(ship);
        expect(gameboard.board[5][8]).toBe(ship);
        expect(gameboard.board[5][9]).toBe(ship);
    });
    test('ships overlap', () => {
        let gameboard =  new Gameboard();
        let ship1 = new Ship(3);
        gameboard.placeShip(ship1,3,3,1);
        let ship2 = new Ship(4);
        gameboard.placeShip(ship2,3,3,1)
        expect(gameboard.board[3][3]).toBe(ship1);
        expect(gameboard.board[3][4]).toBe(ship1);
        expect(gameboard.board[3][5]).toBe(ship1);
        expect(gameboard.board[3][6]).toBe(undefined);
        expect(gameboard.placeShip(ship2,3,3,1)).toBe("Error:overlap of ships, choose another location");
    });
    test('ship recieves attack', () => {
        let gameboard =  new Gameboard();
        let ship1 = new Ship(3);
        gameboard.placeShip(ship1,3,3,1);
        gameboard.receiveAttack(3,3);
        expect(ship1.hits).toBe(1);
        expect(ship1.status).toBe("afloat");
    });
    test('ship does not recieve attack', () => {
        let gameboard =  new Gameboard();
        let ship1 = new Ship(3);
        gameboard.placeShip(ship1,3,3,1);
        gameboard.receiveAttack(0,0);
        expect(ship1.hits).toBe(0);
        expect(gameboard.board[0][0]).toBe("miss");
        expect(ship1.status).toBe("afloat");
    });
    test('one ship sunk from attack', () => {
        let gameboard =  new Gameboard();
        let ship1 = new Ship(2);
        let ship2 = new Ship(2);
        gameboard.placeShip(ship1,3,3,1);
        gameboard.placeShip(ship2,0,0,1);
        gameboard.receiveAttack(3,3);
        gameboard.receiveAttack(3,4);
        expect(ship1.hits).toBe(2);
        expect(ship1.status).toBe("sunk");
        expect(ship2.hits).toBe(0);
        expect(ship2.status).toBe("afloat");
        expect(gameboard.result).toBe("In play");
    });
    test('all ships sunk from attack', () => {
        let gameboard =  new Gameboard();
        let ship1 = new Ship(2);
        let ship2 = new Ship(2);
        gameboard.placeShip(ship1,3,3,1);
        gameboard.placeShip(ship2,0,0,1);
        gameboard.receiveAttack(3,3);
        gameboard.receiveAttack(3,4);
        gameboard.receiveAttack(0,0);
        gameboard.receiveAttack(0,1);
        expect(ship1.hits).toBe(2);
        expect(ship1.status).toBe("sunk");
        expect(ship2.hits).toBe(2);
        expect(ship2.status).toBe("sunk");
        expect(gameboard.result).toBe("All ships sunk");
    });
    test('report all misses', () => {
        let gameboard =  new Gameboard();
        gameboard.receiveAttack(3,3);
        gameboard.receiveAttack(3,4);
        gameboard.receiveAttack(0,0);
        gameboard.receiveAttack(0,1);
        expect(gameboard.misses).toEqual([[3,3],[3,4],[0,0],[0,1]]);
    });
   
    
}); 
describe("Player", () => {
    test('player object has type of computer', () => {
        let player = new Player("computer")
        expect(player.type).toEqual("computer");
    });
});
