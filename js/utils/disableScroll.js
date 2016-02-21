// Disables the ability to scroll the document body.
export function disableScroll() {
  for (const event of ['mousewheel', 'DOMMouseScroll', 'touchmove', 'scroll'])
    document.body.addEventListener(event, disableMovementTriggeredScroll);
  document.body.addEventListener('keydown', disableKeyTriggeredScroll);
}

// Reenables the ability to scroll the document body.
export function enableScroll() {
  for (const event of ['mousewheel', 'DOMMouseScroll', 'touchmove', 'scroll'])
    document.body.removeEventListener(event, disableMovementTriggeredScroll);
  document.body.removeEventListener('keydown', disableKeyTriggeredScroll);
}

function disableMovementTriggeredScroll(event) {
  if (event.target.className === 'Modal-backdrop') {
    event.preventDefault();
    event.stopPropagation();
  }
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

function disableKeyTriggeredScroll(event) {
  if (keysToDisable.has(event.keyCode) &&
      document.activeElement.nodeName === 'BODY') {
    event.preventDefault();
    event.stopPropagation();
  }
}
