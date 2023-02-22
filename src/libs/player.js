import Gameboard from "./gameboard.js";

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
  const placeShip = (length, x, y, direction) => {
    gameboard.placeShip(length, x, y, direction);
  };
  const populateBoardRandomly = () => {
    const shipLengths = [5, 4, 3, 3, 2];
    for (let i = 0; i < shipLengths.length; i += 1) {
      console.log(`Placing ship of length ${shipLengths[i]}`);
      let ret = null;
      while (ret === null) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        while (gameboard.getCell(x, y).ship) {
          x = Math.floor(Math.random() * 10);
          y = Math.floor(Math.random() * 10);
        }
        let direction = Math.random() > 0.5 ? "horizontal" : "vertical";
        console.log(`Trying to place ship at ${x}, ${y} ${direction}`);
        gameboard.placeShip(shipLengths[i], x, y, direction);
        ret = gameboard.getCell(x, y).ship;
        console.log(`object: ${ret}`);
      }
    }
  };
  return {
    getGameboard,
    getRandomMove,
    attack,
    placeShip,
    populateBoardRandomly,
  };
}
