import "./style.css";

import GameboardDOM from "./components/gameboard-dom.js";
import ShipDropperDOM from "./components/ship-dropper-dom.js";
import Player, { MediumPlayer, HardPlayer } from "./libs/player.js";

function component() {
  const content = document.createElement("div");
  content.classList.add("content");

  const gameboardContainer = document.createElement("div");
  gameboardContainer.classList.add("gameboards-container");

  content.appendChild(gameboardContainer);

  const setUpGame = () => {
    gameboardContainer.innerHTML = "";

    const p1Board = GameboardDOM("Player");
    gameboardContainer.appendChild(p1Board.element);
    const p1 = Player();

    let difficulty = "easy";

    const shipDropper = ShipDropperDOM(
      playGame,
      p1.placeShip,
      p1.shipLocationCheck,
      () => p1Board.render(p1.getGameboard()),
      (x) => (difficulty = x)
    );
    gameboardContainer.appendChild(shipDropper);

    function playGame() {
      gameboardContainer.removeChild(shipDropper);
      const p2Board = GameboardDOM(`Computer (${difficulty})`);
      gameboardContainer.appendChild(p2Board.element);

      const p2 =
        difficulty === "easy"
          ? Player()
          : difficulty === "medium"
          ? MediumPlayer()
          : HardPlayer();

      p2.populateBoardRandomly();

      p1Board.render(p1.getGameboard());
      p2Board.render(p2.getGameboard(), true);

      p2Board.element.addEventListener("click", (e) => {
        const cell = e.target;
        if (cell.classList.contains("cell")) {
          const x = cell.dataset.x;
          const y = cell.dataset.y;
          if (!p1.attack(p2, x, y)) return;
          p2Board.render(p2.getGameboard(), true);
          if (p2.getGameboard().allSunk()) {
            gameOver("Player");
            return;
          }
          const computerMove = p2.getMove();
          p2.attack(p1, computerMove[0], computerMove[1]);
          p1Board.render(p1.getGameboard());
          if (p1.getGameboard().allSunk()) {
            gameOver("Computer");
          }
        }
      });
    }
  };
  function gameOver(winner) {
    alert(`${winner} Wins!`);
    setUpGame();
  }
  setUpGame();

  return content;
}

(function () {
  const content = component();
  document.body.appendChild(content);
})();
