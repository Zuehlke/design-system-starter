import { Closable } from './closable';

let openComponentStack: Closable[] = [];

window.addEventListener('keyup', (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    openComponentStack[openComponentStack.length - 1]?.close();
  }
}, { passive: true });

export function registerOpenComponent(component: Closable): void {
  openComponentStack.push(component);
}

export function deregisterOpenComponent(component: Closable): void {
  openComponentStack = openComponentStack.filter(currentComponent => currentComponent !== component);
}
