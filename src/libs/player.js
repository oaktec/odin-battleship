import Gameboard from "./gameboard.js";

export default function Player() {
  const gameboard = Gameboard();
  const getGameboard = () => gameboard;
  const getMove = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return [x, y];
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
  const getMove = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return [x, y];
  };
  return {
    ...Player(),
    getMove,
  };
}
