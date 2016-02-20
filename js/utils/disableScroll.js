// disableScroll :: () -> Function
// Disables the body element from scrolling. Produces a function for re-enabling
// scrolling.
export function disableScroll() {
  for (const event of ['mousewheel', 'DOMMouseScroll', 'touchmove', 'scroll'])
    document.addEventListener(event, disableEvent);
  document.addEventListener('keydown', disableKeys);
}

export function enableScroll() {
  for (const event of ['mousewheel', 'DOMMouseScroll', 'touchmove', 'scroll'])
    document.removeEventListener(event, disableEvent);
  document.removeEventListener('keydown', disableKeys);
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
