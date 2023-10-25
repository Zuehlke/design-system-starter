import { customElement, property } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';

/**
 * @property onOutsideClick - This function gets called when a click outside the wrapped component is detected
 */
@customElement('dss-outside-click')
export default class OutsideClick extends BaseElement {

  @property({ attribute: false })
  public onOutsideClick?: () => void;

  override createRenderRoot() {
    return this;
  }

  private handler = (event: MouseEvent) => {
    if (this.onOutsideClick && !event.composedPath().some(node => node === this)) {
      this.onOutsideClick();
    }
  };

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('click', this.handler, { passive: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('click', this.handler);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-outside-click': OutsideClick;
  }
}
