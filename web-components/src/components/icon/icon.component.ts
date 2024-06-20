import { customElement, property, state } from 'lit/decorators.js';
import { nothing, PropertyDeclaration, unsafeCSS } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import styles from './icon.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import { Icons } from './icons';
import { DirectiveResult } from 'lit/directive';

const ICON_CACHE: { [K in Icons]?: DirectiveResult } = {};

/**
 * @property icon - Icon to display as mapped by the IconMap
 * @property size - Specify the icon size
 */
@customElement('dss-icon')
export default class Icon extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: String, reflect: true })
  public icon?: Icons;

  @property({ type: String, reflect: true })
  public size?: IconSize;

  @state()
  private svg?: DirectiveResult;

  requestUpdate(name?: keyof Icon, oldValue?: unknown, options?: PropertyDeclaration): void {
    if (name === 'icon' && this.icon !== undefined) {
      if (ICON_CACHE[this.icon]) {
        this.svg = ICON_CACHE[this.icon];
      } else {
        const iconToLoad = this.icon;
        import(`../../assets/icons/${iconToLoad}.svg`)
          .then(iconModule => {
            ICON_CACHE[iconToLoad] = unsafeSVG(iconModule.default);
            this.svg = ICON_CACHE[iconToLoad];
          })
          .catch(error => console.error(`Caught exception while importing icon: ${this.icon}`, error));
      }
    }
    super.requestUpdate(name, oldValue, options);
  }

  protected render() {
    if (!this.svg) {
      return nothing;
    }

    return this.svg;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-icon': Icon;
  }
}

export const ICON_SIZE = [
  'xsmall',
  'small',
  'medium',
  'large',
  'huge',
] as const;

export type IconSize = typeof ICON_SIZE[number];
