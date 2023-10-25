import { customElement } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';
import { unsafeCSS } from 'lit';
import styles from './loadingPlaceholder.css?inline';

@customElement('dss-loading-placeholder')
export default class LoadingPlaceholder extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];
}
