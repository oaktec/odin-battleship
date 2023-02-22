import { test, expect } from "@jest/globals";

import Player from "./player";

test("player can make a random move", () => {
  const player = Player();
  const move = player.getRandomMove();
  expect(move[0]).toBeGreaterThanOrEqual(0);
  expect(move[0]).toBeLessThanOrEqual(9);
  expect(move[1]).toBeGreaterThanOrEqual(0);
  expect(move[1]).toBeLessThanOrEqual(9);
});

test("player can hit opponent's gameboard", () => {
  const player = Player();
  const opponent = Player();
  const gameboard = opponent.getGameboard();
  gameboard.placeShip(3, 0, 0, "horizontal");
  player.attack(opponent, 0, 0);
  expect(gameboard.getCell(0, 0).ship.isSunk()).toBe(false);
  player.attack(opponent, 1, 0);
  expect(gameboard.getCell(1, 0).ship.isSunk()).toBe(false);
  player.attack(opponent, 2, 0);
  expect(gameboard.getCell(2, 0).ship.isSunk()).toBe(true);
});
