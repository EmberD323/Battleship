const {Ship,Gameboard} = require('./battleship');
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
    //check if another shit is already there
    
}); 
