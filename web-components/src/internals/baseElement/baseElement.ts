import { LitElement, unsafeCSS } from 'lit';
import global from './global.css?inline';

export const ActionKeystrokes = [' ', 'Enter'];

export default class BaseElement<EventsPayloadMap = Record<string, never>> extends LitElement {

  protected static globalStyles = unsafeCSS(global);

  /**
   * Change events are relevant for many form libraries and general form handling. According to the spec they bubble
   * but do not pierce the ShadowDOM (composed: false). When we emit our own change events we should adhere to the spec
   */
  public dispatchChangeEvent(originalEvent?: Event) {
    this.dispatchEvent(new Event('change', originalEvent ?? { bubbles: true, composed: false }));
  }

  public dispatchCustomEvent<EventName extends keyof EventsPayloadMap & string, Payload extends EventsPayloadMap[EventName]>(eventName: EventName, payload?: Payload) {
    const myCustomEvent = new CustomEvent<Payload>(eventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });

    this.dispatchEvent(myCustomEvent);
  }
}
