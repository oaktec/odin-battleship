export default function component(name) {
  const element = document.createElement("div");
  element.classList.add("gameboard-wrapper");

  const playerName = document.createElement("div");
  playerName.classList.add("player-name");
  playerName.textContent = name;
  element.appendChild(playerName);

  const gameboard = document.createElement("div");
  gameboard.classList.add("gameboard");
  element.appendChild(gameboard);

  const cells = [];
  for (let x = 0; x < 10; x++) {
    cells[x] = [];
    for (let y = 0; y < 10; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cells[x][y] = cell;
      gameboard.appendChild(cell);
    }
  }

  function render(gameboard) {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = cells[x][y];
        const ship = gameboard.getCell(x, y).ship;
        cell.classList.remove("ship");
        cell.classList.remove("hit");
        cell.classList.remove("miss");
        if (ship === null) {
          cell.classList.add("empty");
          if (gameboard.getCell(x, y).hit) {
            cell.classList.add("miss");
          }
        } else {
          cell.classList.add("ship");
          if (gameboard.getCell(x, y).hit) {
            cell.classList.add("hit");
          }
        }
      }
    }
  }

  return { element, render };
}
