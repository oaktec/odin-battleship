import Gameboard from "./gameboard";

export default function Player() {
  const gameboard = Gameboard();
  const getGameboard = () => gameboard;
  const getRandomMove = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return [x, y];
  };
  const attack = (opponent, x, y) => {
    opponent.getGameboard().receiveAttack(x, y);
  };
  return { getGameboard, getRandomMove, attack };
}
