export default function component(
  startGameFn,
  placeShipFn,
  shipLocationCheckFn,
  renderFn
) {
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

  let shipCoords = [];

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
      console.log("dragging");
      for (let i = 0; i < cellsArr.length; i++) {
        cellsArr[i].classList.remove("valid-drop");
        cellsArr[i].classList.remove("invalid-drop");
      }
      if (e.screenX === 0) return;
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
        let validPos = true;
        for (let i = 0; i < cellsValid.length; i++) {
          let currCell = boardCells[i];

          if (!currCell) {
            validPos = false;
            continue;
          }

          if (cellsValid[i]) {
            currCell.classList.add("valid-drop");
          } else {
            currCell.classList.add("invalid-drop");
            validPos = false;
          }
        }
        if (validPos) {
          shipCoords = [coord[0], coord[1]];
          console.log("drag good");
        } else {
          shipCoords = [];
          console.log("drag bad");
        }
      } else {
        shipCoords = [];
        console.log("drag bad no cell");
      }
      e.preventDefault();
    });

    ship.addEventListener("dragend", (e) => {
      e.preventDefault();

      console.log("drag end");
      if (shipCoords.length === 0) {
        return;
      }
      placeShipFn(shipClicked, shipCoords[0], shipCoords[1], shipDirection);
      ship.remove();
      renderFn();
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
