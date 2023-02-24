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

export function HardPlayer() {
  const obj = Player();

  const remainingShips = [5, 4, 3, 3, 2];
  const queuedShots = [];

  const opponentInfo = [];
  const hits = [],
    space = [];
  const spaceLeft = [],
    spaceDown = [],
    spaceUp = [],
    spaceRight = [];
  for (let i = 0; i < 10; i += 1) {
    opponentInfo[i] = [];
    hits[i] = [];
    space[i] = [];
    spaceLeft[i] = [];
    spaceRight[i] = [];
    spaceUp[i] = [];
    spaceDown[i] = [];

    for (let k = 0; k < 10; k += 1) {
      spaceLeft[i][k] = 0;
      spaceRight[i][k] = 0;
      spaceUp[i][k] = 0;
      spaceDown[i][k] = 0;
      hits[i][k] = 0;
      space[i][k] = 0;
      opponentInfo[i][k] = { hit: false, ship: null, sunk: false };
    }
  }

  let lastAttack = [];

  const attack = (opponent, x, y) => {
    if (opponent.getGameboard().getCell(x, y).hit) return false;
    opponent.getGameboard().receiveAttack(x, y);
    opponentInfo[x][y].hit = true;
    opponentInfo[x][y].ship = !!opponent.getGameboard().getCell(x, y).ship;
    lastAttack = [x, y];
    return true;
  };

  const getMove = () => {
    setSunk();

    checkShipPossibilities();

    if (queuedShots.length > 0) {
      const move = queuedShots.shift();
      return move;
    }

    const hitPoint = getHitPoint();
    if (hitPoint) {
      return hitPoint;
    }

    return getMoveFromSpace();

    do {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      if (!opponentInfo[x][y].hit) return [x, y];
    } while (true);
  };

  const getMoveFromSpace = () => {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        computeAdjacentSpace(x, y);
        let sumPoss = 0;
        for (let i = 0; i < remainingShips.length; i++) {
          let leftPos =
            spaceLeft[x][y] < remainingShips[i] - 1
              ? spaceLeft[x][y]
              : remainingShips[i] - 1;
          let rightPos =
            spaceRight[x][y] < remainingShips[i] - 1
              ? spaceRight[x][y]
              : remainingShips[i] - 1;
          let horizontalPoss = leftPos + rightPos + 1 - remainingShips[i] + 1;
          if (horizontalPoss > 0) sumPoss += horizontalPoss;
          let upPos =
            spaceUp[x][y] < remainingShips[i] - 1
              ? spaceUp[x][y]
              : remainingShips[i] - 1;
          let downPos =
            spaceDown[x][y] < remainingShips[i] - 1
              ? spaceDown[x][y]
              : remainingShips[i] - 1;
          let verticalPoss = upPos + downPos + 1 - remainingShips[i] + 1;
          if (verticalPoss > 0) sumPoss += verticalPoss;
        }
        space[x][y] = sumPoss;
      }
    }

    return getLargest(space);
  };

  const computeAdjacentSpace = (x, y) => {
    if (opponentInfo[x][y].hit) {
      spaceUp[x][y] = 0;
      spaceDown[x][y] = 0;
      spaceLeft[x][y] = 0;
      spaceRight[x][y] = 0;
    } else {
      if (x === 0 || opponentInfo[x - 1][y].hit) spaceLeft[x][y] = 0;
      else spaceLeft[x][y] = spaceLeft[x - 1][y] + 1;
      if (x === 0 || spaceRight[x - 1][y] === 0) {
        let cnt = 0;
        for (let xp = x + 1; xp < 10; xp += 1) {
          if (opponentInfo[xp][y].hit) break;
          cnt += 1;
        }
        spaceRight[x][y] = cnt;
      } else spaceRight[x][y] = spaceRight[x - 1][y] - 1;
      if (y === 0 || opponentInfo[x][y - 1].hit) spaceUp[x][y] = 0;
      else spaceUp[x][y] = spaceUp[x][y - 1] + 1;
      if (y === 0 || spaceDown[x][y - 1] === 0) {
        let cnt = 0;
        for (let yp = y + 1; yp < 10; yp += 1) {
          if (opponentInfo[x][yp].hit) break;
          cnt += 1;
        }
        spaceDown[x][y] = cnt;
      } else spaceDown[x][y] = spaceDown[x][y - 1] - 1;
    }
  };

  const getHitPoint = () => {
    let hitSum = 0;
    for (let y = 0; y < 10; y += 1) {
      for (let x = 0; x < 10; x += 1) {
        hits[x][y] = 0;
      }
    }

    for (let y = 0; y < 10; y += 1) {
      for (let x = 0; x < 10; x += 1) {
        if (opponentInfo[x][y].ship && !opponentInfo[x][y].sunk) {
          for (let i = 0; i < remainingShips.length; i++) {
            // horizontal
            let left = x;
            let endLeft = Math.max(x - (remainingShips[i] - 1), 0);
            while (
              left > endLeft &&
              (opponentInfo[left - 1][y].ship || !opponentInfo[left - 1][y].hit)
            )
              left -= 1;

            let right = x;
            let endRight = Math.min(x + (remainingShips[i] - 1), 9);
            while (
              right < endRight &&
              (opponentInfo[right + 1][y].ship ||
                !opponentInfo[right + 1][y].hit)
            )
              right += 1;

            if (right - left + 1 >= remainingShips[i]) {
              for (let j = left; j <= right; j++) {
                if (!opponentInfo[j][y].hit) {
                  hits[j][y] += 1;
                  hitSum += 1;
                }
              }
            }
            // vertical
            let up = y;
            let endUp = Math.max(y - (remainingShips[i] - 1), 0);
            while (
              up > endUp &&
              (opponentInfo[x][up - 1].ship || !opponentInfo[x][up - 1].hit)
            )
              up -= 1;

            let down = y;
            let endDown = Math.min(y + (remainingShips[i] - 1), 9);
            while (
              down < endDown &&
              (opponentInfo[x][down + 1].ship || !opponentInfo[x][down + 1].hit)
            )
              down += 1;

            if (down - up + 1 >= remainingShips[i]) {
              for (let j = up; j <= down; j++) {
                if (!opponentInfo[x][j].hit) {
                  hits[x][j] += 1;
                  hitSum += 1;
                }
              }
            }
          }
        }
      }
    }
    if (hitSum === 0) return null;
    return getLargest(hits);
  };

  const getLargest = (arr) => {
    let largest = 0;
    let count = 0;
    for (let y = 0; y < 10; y += 1) {
      for (let x = 0; x < 10; x += 1) {
        if (arr[x][y] > largest) {
          largest = arr[x][y];
          count = 1;
        } else if (arr[x][y] === largest) {
          count += 1;
        }
      }
    }
    const index = Math.floor(Math.random() * count);
    count = 0;
    for (let y = 0; y < 10; y += 1) {
      for (let x = 0; x < 10; x += 1) {
        if (arr[x][y] === largest) {
          if (count === index) return [x, y];
          count += 1;
        }
      }
    }
  };

  const checkShipPossibilities = () => {
    for (let y = 0; y < 10; y += 1) {
      for (let x = 0; x < 10; x += 1) {
        if (opponentInfo[x][y].ship) {
          let left = x;
          let right = x;
          let up = y;
          let down = y;
          while (
            left > 0 &&
            (opponentInfo[x][y].ship || !opponentInfo[x][y].hit)
          )
            left -= 1;
          while (
            right < 9 &&
            (opponentInfo[x][y].ship || !opponentInfo[x][y].hit)
          )
            right += 1;
          while (up > 0 && (opponentInfo[x][y].ship || !opponentInfo[x][y].hit))
            up -= 1;
          while (
            down < 9 &&
            (opponentInfo[x][y].ship || !opponentInfo[x][y].hit)
          )
            down += 1;

          let sunkWidth = right - left + 1;
          let sunkHeight = down - up + 1;

          if (sunkWidth > 1 && sunkHeight > 1) continue;
          else if (sunkWidth > 1) {
            let numShips = 0;
            let lastHorizontalShip = 0;

            for (let i = 0; i < remainingShips.length; i += 1) {
              if (remainingShips[i] <= sunkWidth) {
                lastHorizontalShip = remainingShips[i];
                numShips += 1;
              }
            }
            if (numShips === 1 && lastHorizontalShip === sunkWidth) {
              for (let i = left; i <= right; i += 1) {
                if (!opponentInfo[i][y].hit) queuedShots.push([i, y]);
                opponentInfo[i][y].sunk = true;
              }
              remainingShips.splice(remainingShips.indexOf(sunkWidth), 1);
            }
          } else if (sunkHeight > 1) {
            let numShips = 0;
            let lastVerticalShip = 0;

            for (let i = 0; i < remainingShips.length; i += 1) {
              if (remainingShips[i] <= sunkHeight) {
                lastVerticalShip = remainingShips[i];
                numShips += 1;
              }
            }
            if (numShips === 1 && lastVerticalShip === sunkHeight) {
              for (let i = up; i <= down; i += 1) {
                if (!opponentInfo[x][i].hit) queuedShots.push([x, i]);
                opponentInfo[x][i].sunk = true;
              }
              remainingShips.splice(remainingShips.indexOf(sunkHeight), 1);
            }
          }
        }
      }
    }
  };

  const setSunk = () => {
    for (let y = 0; y < 10; y += 1) {
      for (let x = 0; x < 10; x += 1) {
        if (opponentInfo[x][y].ship && !opponentInfo[x][y].sunk) {
          let left = x;
          while (left > 0 && opponentInfo[left - 1][y].ship) left -= 1;
          if (left > 0 && !opponentInfo[left - 1][y].hit) continue;
          let right = x;
          while (right < 9 && opponentInfo[right + 1][y].ship) right += 1;
          if (right < 9 && !opponentInfo[right + 1][y].hit) continue;
          let above = y;
          while (above > 0 && opponentInfo[x][above - 1].ship) above -= 1;
          if (above > 0 && !opponentInfo[x][above - 1].hit) continue;
          let below = y;
          while (below < 9 && opponentInfo[x][below + 1].ship) below += 1;
          if (below < 9 && !opponentInfo[x][below + 1].hit) continue;

          opponentInfo[x][y].sunk = true;
        }
      }
    }
  };

  return { ...obj, getMove, attack };
}
