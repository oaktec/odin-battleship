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

  const shipLocationCheck = (length, x, y, direction) => {
    // check if ship can be placed and return array of boolean values for each cell
    const ret = [];

    let currX = x;
    let currY = y;

    for (let i = 0; i < length; i += 1) {
      if (currX > 9 || currY > 9) {
        ret.push(false);
        continue;
      }

      if (board[currX][currY].ship) {
        ret.push(false);
        continue;
      }

      if (direction === "horizontal") {
        currX += 1;
      } else {
        currY += 1;
      }
      ret.push(true);
    }
    return ret;
  };

  const receiveAttack = (x, y) => {
    if (board[x][y].ship === null) {
      board[x][y].hit = true;
      return;
    }
    board[x][y].hit = true;
    board[x][y].ship.hit();
  };

  const populateBoardRandomly = () => {
    const shipLengths = [5, 4, 3, 3, 2];
    for (let i = 0; i < shipLengths.length; i += 1) {
      let ret = null;
      while (ret === null) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        while (board[x][y].ship) {
          x = Math.floor(Math.random() * 10);
          y = Math.floor(Math.random() * 10);
        }
        let direction = Math.random() > 0.5 ? "horizontal" : "vertical";
        placeShip(shipLengths[i], x, y, direction);
        ret = board[x][y].ship;
      }
    }
  };

  const getShips = () => ships;

  const allSunk = () => ships.every((ship) => ship.isSunk());

  return {
    getCell,
    placeShip,
    receiveAttack,
    allSunk,
    getShips,
    populateBoardRandomly,
    shipLocationCheck,
  };
}
