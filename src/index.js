import "./style.css";

import GameboardDOM from "./components/gameboard-dom.js";

function component() {
  const element = document.createElement("div");

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = "Hello webpack";

  const gameboard = GameboardDOM();
  element.appendChild(gameboard.element);

  return element;
}

document.body.appendChild(component());
