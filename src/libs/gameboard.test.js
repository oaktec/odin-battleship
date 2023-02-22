import { test, expect } from "@jest/globals";

import Gameboard from "./gameboard";

test("placeShip places a horizontal ship on the board", () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, 0, 0, "horizontal");
  expect(gameboard.getCell(0, 0).ship).not.toBe(null);
  expect(gameboard.getCell(1, 0).ship).not.toBe(null);
  expect(gameboard.getCell(2, 0).ship).not.toBe(null);
  expect(gameboard.getCell(3, 0).ship).toBe(null);
});

test("placeShip places a vertical ship on the board", () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, 0, 0, "vertical");
  expect(gameboard.getCell(0, 0).ship).not.toBe(null);
  expect(gameboard.getCell(0, 1).ship).not.toBe(null);
  expect(gameboard.getCell(0, 2).ship).not.toBe(null);
});

test("placeShip places a ship on the board", () => {
  const gameboard = Gameboard();
  gameboard.placeShip(4, 3, 3, "horizontal");
  expect(gameboard.getCell(2, 3).ship).toBe(null);
  expect(gameboard.getCell(3, 3).ship).not.toBe(null);
  expect(gameboard.getCell(4, 3).ship).not.toBe(null);
  expect(gameboard.getCell(5, 3).ship).not.toBe(null);
  expect(gameboard.getCell(6, 3).ship).not.toBe(null);
});

test("receiveAttack hits a ship", () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, 0, 0, "horizontal");
  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 0);
  gameboard.receiveAttack(2, 0);
  expect(gameboard.getCell(0, 0).ship.isSunk()).toBe(true);
});

test("receiveAttack hits a ship", () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, 0, 0, "horizontal");
  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 0);
  expect(gameboard.getCell(0, 0).ship.isSunk()).toBe(false);
});

test("receiveAttack misses a ship", () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, 0, 0, "horizontal");
  gameboard.receiveAttack(3, 0);
  expect(gameboard.getCell(3, 0).ship).toBe(null);
  expect(gameboard.getCell(3, 0).hit).toBe(true);
});

test("allSunk returns true when all ships are sunk", () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, 0, 0, "horizontal");
  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 0);
  gameboard.receiveAttack(2, 0);
  expect(gameboard.allSunk()).toBe(true);
});

test("allSunk returns false when not all ships are sunk", () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, 0, 0, "horizontal");
  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 0);
  expect(gameboard.allSunk()).toBe(false);
});
