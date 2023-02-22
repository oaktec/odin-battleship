import "./style.css";

import GameboardDOM from "./components/gameboard-dom.js";

function component() {
  const content = document.createElement("div");
  content.classList.add("content");

  const gameboardContainer = document.createElement("div");
  gameboardContainer.classList.add("gameboards-container");

  const p1Board = GameboardDOM("Player");
  gameboardContainer.appendChild(p1Board.element);

  const p2Board = GameboardDOM("Computer");
  gameboardContainer.appendChild(p2Board.element);

  content.appendChild(gameboardContainer);

  return content;
}

document.body.appendChild(component());
