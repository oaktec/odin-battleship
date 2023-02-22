import Ship from "./ship.js";

export default function Gameboard() {
  const board = [];
  const ships = [];
  for (let i = 0; i < 10; i += 1) {
    board[i] = [];
    for (let k = 0; k < 10; k += 1) {
      board[i][k] = { hit: false, ship: null, display: null };
    }
  }
  const getCell = (x, y) => board[x][y];

  const placeShip = (length, x, y, direction) => {
    if (direction === "horizontal" && x + length > 10) return;
    if (direction === "vertical" && y + length > 10) return;

    for (let i = 0; i < length; i += 1) {
      if (direction === "horizontal" && board[x + i][y].ship !== null) return;
      if (direction === "vertical" && board[x][y + i].ship !== null) return;
    }

    const ship = Ship(length);
    ships.push(ship);
    if (direction === "vertical") {
      for (let i = 0; i < length; i += 1) {
        board[x][y + i].ship = ship;

        if (i === 0) board[x][y + i].display = "top";
        else if (i === length - 1) board[x][y + i].display = "bottom";
        else board[x][y + i].display = "middle-vertical";
      }
    }
    if (direction === "horizontal") {
      for (let i = 0; i < length; i += 1) {
        board[x + i][y].ship = ship;

        if (i === 0) board[x + i][y].display = "left";
        else if (i === length - 1) board[x + i][y].display = "right";
        else board[x + i][y].display = "middle-horizontal";
      }
    }
  };

  const receiveAttack = (x, y) => {
    if (board[x][y].ship === null) {
      board[x][y].hit = true;
      return;
    }
    board[x][y].ship.hit();
  };

  const allSunk = () => ships.every((ship) => ship.isSunk());

  return {
    getCell,
    placeShip,
    receiveAttack,
    allSunk,
  };
}
