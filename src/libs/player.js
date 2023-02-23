import Gameboard from "./gameboard.js";

export default function Player() {
  const gameboard = Gameboard();
  const getGameboard = () => gameboard;

  const getMove = () => {
    do {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      if (!gameboard.getCell(x, y).hit) return [x, y];
    } while (true);
  };
  const attack = (opponent, x, y) => {
    if (opponent.getGameboard().getCell(x, y).hit) return false;
    opponent.getGameboard().receiveAttack(x, y);
    return true;
  };
  const shipLocationCheck = (length, x, y, direction) => {
    return gameboard.shipLocationCheck(length, x, y, direction);
  };
  const placeShip = (length, x, y, direction) => {
    gameboard.placeShip(length, x, y, direction);
  };
  const populateBoardRandomly = () => {
    gameboard.populateBoardRandomly();
  };
  return {
    getGameboard,
    getMove,
    attack,
    placeShip,
    populateBoardRandomly,
    shipLocationCheck,
  };
}

export function MediumPlayer() {
  const obj = Player();

  const opponentInfo = [];
  for (let i = 0; i < 10; i += 1) {
    opponentInfo[i] = [];
    for (let k = 0; k < 10; k += 1)
      opponentInfo[i][k] = { hit: false, ship: null };
  }

  let lastAttack = [];
  let queueMoves = [];
  let queuedMoveLast = false;

  const attack = (opponent, x, y) => {
    if (opponent.getGameboard().getCell(x, y).hit) return false;
    opponent.getGameboard().receiveAttack(x, y);
    opponentInfo[x][y].hit = true;
    opponentInfo[x][y].ship = !!opponent.getGameboard().getCell(x, y).ship;
    lastAttack = [x, y];
    return true;
  };

  const getMove = () => {
    if (queuedMoveLast) {
      const x = lastAttack[0];
      const y = lastAttack[1];
      if (opponentInfo[x][y].ship) {
        queueMoves = [];
      }
    }

    queuedMoveLast = false;
    if (queueMoves.length > 0) {
      const move = queueMoves.shift();
      queuedMoveLast = true;
      return move;
    }
    if (lastAttack.length > 0) {
      const x = lastAttack[0];
      const y = lastAttack[1];
      if (opponentInfo[x][y].ship) {
        if (x > 0 && !opponentInfo[x - 1][y].hit) queueMoves.push([x - 1, y]);
        if (x < 9 && !opponentInfo[x + 1][y].hit) queueMoves.push([x + 1, y]);
        if (y > 0 && !opponentInfo[x][y - 1].hit) queueMoves.push([x, y - 1]);
        if (y < 9 && !opponentInfo[x][y + 1].hit) queueMoves.push([x, y + 1]);
        if (queueMoves.length > 0) {
          const move = queueMoves.shift();
          queuedMoveLast = true;
          return move;
        }
      }
    }
    do {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      if (!opponentInfo[x][y].hit) return [x, y];
    } while (true);
  };
  return { ...obj, getMove, attack };
}
