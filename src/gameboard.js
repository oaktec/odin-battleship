import Ship from "./ship";

export default function Gameboard() {
  const board = [];
  const ships = [];
  for (let i = 0; i < 10; i += 1) {
    board[i] = Array(10).fill(null);
  }
  const getCell = (x, y) => board[x][y];

  const missedAttacks = [];
  const getLastMissedAttack = () => missedAttacks[missedAttacks.length - 1];

  const placeShip = (length, x, y, direction) => {
    if (direction === "horizontal" && x + length > 10) return;
    if (direction === "vertical" && y + length > 10) return;
    const ship = Ship(length);
    ships.push(ship);
    if (direction === "vertical") {
      for (let i = 0; i < length; i += 1) {
        board[x][y + i] = ship;
      }
    }
    if (direction === "horizontal") {
      for (let i = 0; i < length; i += 1) {
        board[x + i][y] = ship;
      }
    }
  };

  const receiveAttack = (x, y) => {
    if (board[x][y] === null) {
      missedAttacks.push([x, y]);
      return;
    }
    board[x][y].hit();
  };

  const allSunk = () => ships.every((ship) => ship.isSunk());

  return {
    getCell,
    placeShip,
    receiveAttack,
    getLastMissedAttack,
    allSunk,
  };
}
