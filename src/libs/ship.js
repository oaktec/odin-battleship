export default function Ship(length) {
  let sunk = false;
  let hits = 0;
  const isSunk = () => sunk;
  const hit = () => {
    hits += 1;
    if (hits === length) sunk = true;
  };
  return { hit, isSunk };
}
