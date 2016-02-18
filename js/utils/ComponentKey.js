/**
 * Generates a unique key for a component. Currently just generates
 * a key from the current timestamp and some random numbers.
 */
export default function generateComponentKey() {
  const time = Date.now();
  const random = Math.random() * Math.random();
  return Math.floor(time * random);
}
