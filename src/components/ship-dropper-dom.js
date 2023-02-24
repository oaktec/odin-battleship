export default function component(
  startGameFn,
  placeShipFn,
  shipLocationCheckFn,
  renderFn,
  setDifficultyFn
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
    ships.push(ship);

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
          if (x > 10 || y > 10) {
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
        } else {
          shipCoords = [];
        }
      } else {
        shipCoords = [];
      }
      e.preventDefault();
    });

    ship.addEventListener("dragend", (e) => {
      e.preventDefault();

      if (shipCoords.length === 0) {
        return;
      }
      placeShipFn(shipClicked, shipCoords[0], shipCoords[1], shipDirection);
      ship.remove();
      ships.splice(ships.indexOf(ship), 1);
      renderFn();
      if (ships.length === 0) startGameFn();

      e.preventDefault();
    });
  }

  const rotateButton = document.createElement("button");
  rotateButton.classList.add("rotate-button");
  rotateButton.textContent = "Rotate";
  rotateButton.addEventListener("click", (e) => {
    let newDir = shipDirection === "horizontal" ? "vertical" : "horizontal";
    shipDirection = newDir;
    for (let i = 0; i < ships.length; i += 1) {
      ships[i].classList.toggle("vertical");
    }
    document.querySelector(".ship-dropper-board").classList.toggle("vertical");
  });
  element.appendChild(rotateButton);

  const difficultyLabel = document.createElement("div");
  difficultyLabel.classList.add("difficulty-label");
  difficultyLabel.textContent = "Difficulty:";
  element.appendChild(difficultyLabel);

  const difficultyOptions = document.createElement("div");
  difficultyOptions.classList.add("difficulty-options");
  element.appendChild(difficultyOptions);

  const easySection = document.createElement("div");
  easySection.classList.add("difficulty-section");
  difficultyOptions.appendChild(easySection);

  const easyLabel = document.createElement("div");
  easyLabel.classList.add("difficulty-label");
  easyLabel.textContent = "Easy";
  easySection.appendChild(easyLabel);

  const easyRadio = document.createElement("input");
  easyRadio.setAttribute("type", "radio");
  easyRadio.setAttribute("name", "difficulty");
  easyRadio.setAttribute("value", "easy");
  easyRadio.setAttribute("checked", "true");
  easyRadio.addEventListener("click", (e) => {
    setDifficultyFn("easy");
  });
  easySection.appendChild(easyRadio);

  const mediumSection = document.createElement("div");
  mediumSection.classList.add("difficulty-section");
  difficultyOptions.appendChild(mediumSection);

  const mediumLabel = document.createElement("div");
  mediumLabel.classList.add("difficulty-label");
  mediumLabel.textContent = "Medium";
  mediumSection.appendChild(mediumLabel);

  const mediumRadio = document.createElement("input");
  mediumRadio.setAttribute("type", "radio");
  mediumRadio.setAttribute("name", "difficulty");
  mediumRadio.setAttribute("value", "medium");
  mediumRadio.addEventListener("click", (e) => {
    setDifficultyFn("medium");
  });
  mediumSection.appendChild(mediumRadio);

  const hardSection = document.createElement("div");
  hardSection.classList.add("difficulty-section");
  difficultyOptions.appendChild(hardSection);

  const hardLabel = document.createElement("div");
  hardLabel.classList.add("difficulty-label");
  hardLabel.textContent = "Hard";
  hardSection.appendChild(hardLabel);

  const hardRadio = document.createElement("input");
  hardRadio.setAttribute("type", "radio");
  hardRadio.setAttribute("name", "difficulty");
  hardRadio.setAttribute("value", "hard");
  hardRadio.addEventListener("click", (e) => {
    setDifficultyFn("hard");
  });
  hardSection.appendChild(hardRadio);

  function getCellOver(x, y) {
    const cell = document.elementFromPoint(x, y);
    if (cell.classList.contains("cell")) {
      return cell;
    }
    return null;
  }

  return element;
}
