import Ship from "./ship";

test("ship is not sunk when created", () => {
  const ship = Ship(3);
  expect(ship.isSunk()).toBe(false);
});
test("ship is sunk when hit 3 times", () => {
  const ship = Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
test("ship is not sunk when hit 2 times", () => {
  const ship = Ship(3);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});
test("ship is sunk when hit 4 times", () => {
  const ship = Ship(4);
  ship.hit();
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
test("ship is not sunk when hit 3 times", () => {
  const ship = Ship(4);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});
