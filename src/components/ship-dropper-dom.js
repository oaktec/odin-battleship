export default function component(startGameFn, shipLocationCheckFn) {
  const element = document.createElement("div");
  element.classList.add("ship-dropper-wrapper");
  const shipDropperLabel = document.createElement("div");
  shipDropperLabel.classList.add("ship-dropper-label");
  shipDropperLabel.textContent = "Drag your ships onto your board";
  element.appendChild(shipDropperLabel);
  const shipDropperBoard = document.createElement("div");
  shipDropperBoard.classList.add("ship-dropper-board");
  element.appendChild(shipDropperBoard);

  const shipLengths = [5, 4, 3, 3, 2];

  const ships = [];
  let shipClicked;
  let cellClicked;
  let shipDirection = "horizontal";
  let cellsArr;

  for (let i = 0; i < shipLengths.length; i++) {
    const ship = document.createElement("div");
    ship.classList.add("draggable-ship");
    ship.setAttribute("draggable", "true");
    for (let j = 0; j < shipLengths[i]; j++) {
      const cell = document.createElement("div");
      cell.classList.add("draggable-cell");
      cell.setAttribute("draggable", false);

      cell.addEventListener("mousedown", (e) => {
        cellClicked = j;
      });

      ship.appendChild(cell);
    }

    shipDropperBoard.appendChild(ship);

    ship.addEventListener("dragstart", (e) => {
      shipClicked = shipLengths[i];
      cellsArr = [...document.querySelector(".gameboard").children];
    });

    ship.addEventListener("drag", (e) => {
      for (let i = 0; i < cellsArr.length; i++) {
        cellsArr[i].classList.remove("valid-drop");
        cellsArr[i].classList.remove("invalid-drop");
      }
      let cell = getCellOver(e.clientX, e.clientY);
      if (cell) {
        // get the index of the cell
        // const cellsArr = [...cell.parentNode.children];

        const index = cellsArr.indexOf(cell);
        const coord = [index % 10, Math.floor(index / 10)];
        if (shipDirection === "horizontal") {
          coord[0] -= cellClicked;
          if (coord[0] + shipClicked > 10) {
            return;
          }
        } else {
          coord[1] -= cellClicked;
          if (coord[1] + shipClicked > 10) {
            return;
          }
        }
        if (coord[0] < 0 || coord[1] < 0) {
          return;
        }

        const cellsValid = shipLocationCheckFn(
          shipClicked,
          coord[0],
          coord[1],
          shipDirection
        );

        const boardCells = [];
        for (let i = 0; i < shipClicked; i++) {
          let x = coord[0];
          let y = coord[1];
          if (shipDirection === "horizontal") {
            x += i;
          } else {
            y += i;
          }
          if (x > 9 || y > 9) {
            boardCells.push(null);
            continue;
          }
          boardCells.push(cellsArr[x + y * 10]);
        }

        for (let i = 0; i < cellsValid.length; i++) {
          let currCell = boardCells[i];

          if (!currCell) continue;

          if (cellsValid[i]) {
            currCell.classList.add("valid-drop");
          } else {
            currCell.classList.add("invalid-drop");
          }
        }
      }
      e.preventDefault();
    });
  }

  function getCellOver(x, y) {
    const cell = document.elementFromPoint(x, y);
    if (cell.classList.contains("cell")) {
      return cell;
    }
    return null;
  }

  return element;
}
