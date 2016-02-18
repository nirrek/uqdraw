// hasPath :: (object, [string|Symbol]) -> boolean
// Determines if obj contains the path (given as an array of keys).
export function hasPath(obj, path) {
  let node = obj;
  for (const key of path) {
    if (!node || !node.hasOwnProperty(key)) return false;
    node = node[key];
  }
  return true;
}
