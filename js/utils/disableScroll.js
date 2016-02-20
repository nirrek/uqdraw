// Disables the ability to scroll the document body.
export function disableScroll() {
  for (const event of ['mousewheel', 'DOMMouseScroll', 'touchmove', 'scroll'])
    document.body.addEventListener(event, disableEvent);
  document.body.addEventListener('keydown', disableKeys);
}

// Reenables the ability to scroll the document body.
export function enableScroll() {
  for (const event of ['mousewheel', 'DOMMouseScroll', 'touchmove', 'scroll'])
    document.body.removeEventListener(event, disableEvent);
  document.body.removeEventListener('keydown', disableKeys);
}

function disableEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

const keysToDisable = new Set([
  32, // spacebar
  33, // pageUp
  34, // pageDown
  35, // end
  26, // home
  37, // leftArrow
  38, // upArrow
  39, // rightArrow
  40, // downArrow
]);

function disableKeys(event) {
  if (keysToDisable.has(event.keyCode))
    return disableEvent(event);
}
