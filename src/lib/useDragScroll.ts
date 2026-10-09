import { useCallback, useRef } from 'react';

const DRAG_THRESHOLD = 5;

/** Scrolls to the child nearest the current position, so a drag ends on a snap point. */
function settle(element: HTMLElement) {
  const start =
    element.getBoundingClientRect().left +
    parseFloat(getComputedStyle(element).scrollPaddingLeft || '0');
  let target = element.scrollLeft;
  let best = Infinity;
  for (const child of element.children) {
    const offset = child.getBoundingClientRect().left - start;
    if (Math.abs(offset) < best) {
      best = Math.abs(offset);
      target = element.scrollLeft + offset;
    }
  }
  const restoreSnap = () => (element.style.scrollSnapType = '');
  element.addEventListener('scrollend', restoreSnap, { once: true });
  // Browsers without scrollend still get snapping back.
  window.setTimeout(restoreSnap, 600);
  element.scrollTo({ left: target, behavior: 'smooth' });
}

/**
 * Lets a mouse drag a horizontal scroll list. Touch already swipes natively.
 * A drag does not count as a click, so links and buttons inside stay safe.
 * Returns the element ref and the callback ref to put on the list.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  const attach = useCallback((element: T | null) => {
    ref.current = element;
    if (!element) return;
    let startX = 0;
    let startScroll = 0;
    let pressed = false;
    let dragged = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      pressed = true;
      dragged = false;
      startX = event.clientX;
      startScroll = element.scrollLeft;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pressed) return;
      const distance = event.clientX - startX;
      if (!dragged) {
        if (Math.abs(distance) < DRAG_THRESHOLD) return;
        dragged = true;
        element.setPointerCapture(event.pointerId);
        element.style.scrollSnapType = 'none';
        element.dataset.dragging = 'true';
      }
      element.scrollLeft = startScroll - distance;
    };

    const onPointerUp = () => {
      if (!pressed) return;
      pressed = false;
      if (dragged) {
        delete element.dataset.dragging;
        settle(element);
      }
    };

    // Runs before the click reaches a link or button inside the list.
    const onClick = (event: MouseEvent) => {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const onDragStart = (event: DragEvent) => event.preventDefault();

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerUp);
    element.addEventListener('click', onClick, true);
    element.addEventListener('dragstart', onDragStart);
    return () => {
      ref.current = null;
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerUp);
      element.removeEventListener('click', onClick, true);
      element.removeEventListener('dragstart', onDragStart);
    };
  }, []);

  return [ref, attach] as const;
}
