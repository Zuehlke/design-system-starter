import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import styles from './radiogroup.css?inline';
import '../label/label.component';
import '../../internals/hint/hint';
import BaseElement from '../../internals/baseElement/baseElement';
import { InputErrorState } from '../input/input.component';
import Radio from '../radio/radio.component';
import { ifDefined } from 'lit-html/directives/if-defined.js';


/**
 * @property required - Specify if this element is required
 * @property errorState - Specify the errorState of the underlying input
 * @property {string} message - Pass message to be shown with the underlying input
 * @property label - Pass label to be shown
 * @slot {Radio[]} slot - Radio buttons to be grouped
 */
@customElement('dss-radiogroup')
export default class RadioGroup extends BaseElement {

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: Boolean })
  public required = false;

  @property()
  public errorState?: InputErrorState;

  @property()
  public message?: string;

  @property()
  public label = '';

  @queryAssignedElements({ selector: 'dss-radio' })
  private radios!: NodeListOf<Radio>;

  override render(): unknown {
    return html`
      <fieldset>
        <dss-label label="${ifDefined(this.label)}" ?required="${this.required}"></dss-label>
        <div>
          <slot @slotchange="${this.handleSlotChange}"></slot>
        </div>
        <dss-hint .state="${this.errorState}" .message="${this.message}"></dss-hint>
      </fieldset>
    `;
  }

  private handleSlotChange() {
    this.syncPropsToRadios();
  }

  protected willUpdate(_changedProperties: PropertyValues): void {
    if (_changedProperties.has('errorState')) {
      this.syncPropsToRadios();
    }
  }

  private syncPropsToRadios() {
    this.radios.forEach(radio => radio.errorState = this.errorState);
    this.radios.forEach(radio => radio.hideMessage = true);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-radiogroup': RadioGroup;
  }
}
