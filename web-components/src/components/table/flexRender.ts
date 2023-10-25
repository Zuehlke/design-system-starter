import { html } from 'lit-html';
import { when } from 'lit-html/directives/when.js';
import '../loadingPlaceholder/loadingPlaceholder.component';

export function flexRender<TProps extends object>(component: any, props: TProps) {
  if (typeof component === 'function') {
    return component(props);
  }
  return component;
}

/**
 * Render cell and show loading placeholder over content if loading state is set
 * Ensure stable line-height by adding non-breaking space when no content rendered
 */
export function flexRenderWithLoadingState<TProps extends object>(component: any, props: TProps, isLoading: boolean) {
  const renderedCell = flexRender(component, props);

  return isLoading
    ? html`
      ${when(!renderedCell, () => html`&nbsp;`)}
      <dss-loading-placeholder></dss-loading-placeholder>
    `
    : renderedCell;
}
