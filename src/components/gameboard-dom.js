export default function component() {
  const element = document.createElement("div");
  element.classList.add("gameboard");

  const cells = [];
  for (let x = 0; x < 10; x++) {
    cells[x] = [];
    for (let y = 0; y < 10; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cells[x][y] = cell;
      element.appendChild(cell);
    }
  }

  function render(gameboard) {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = cells[x][y];
        const ship = gameboard.getCell(x, y);
        if (ship === null) {
          cell.classList.remove("ship");
          cell.classList.remove("hit");
          cell.classList.remove("miss");
          cell.classList.add("empty");
        } else {
          cell.classList.remove("empty");
          cell.classList.remove("hit");
          cell.classList.remove("miss");
          cell.classList.add("ship");
        }
      }
    }
  }

  return { element, cells };
}
