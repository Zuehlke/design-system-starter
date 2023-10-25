import './draggable.component';
import '../icon/icon.component';
import { Meta, StoryFn } from '@storybook/web-components';
import Draggable, { draggableBounds } from './draggable.component';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import docs from './draggable.md?raw';

const meta: Meta<Draggable> = {
  title: 'Components/Draggable',
  component: 'dss-draggable',
  argTypes: {
    axis: { control: 'select', options: ['both', 'x', 'y', 'none'] },
    bounds: { control: 'select', options: draggableBounds },
    snap: { control: 'select', options: ['both', 'x', 'y', 'none'] },
  },
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};
export default meta;

const styles = html`
  <style>
    .draggable {
      display: inline-flex;
      padding: var(--size-1);
      background-color: var(--color-action-tertiary);
      border: 1px solid var(--color-brand-white-100);
      box-shadow: var(--effect-shadow-close);
    }
  </style>
`;

const DefaultTemplate: StoryFn<Draggable> = ({ axis, bounds, snap, position }) => {
  return html`
    ${styles}
    <dss-draggable
      axis="${ifDefined(axis)}"
      bounds="${ifDefined(bounds)}"
      snap="${ifDefined(snap)}"
      .position="${ifDefined(position)}"
    >
      <div class="draggable">Mooove me</div>
    </dss-draggable>
  `;
};

export const Default = DefaultTemplate.bind({});

const HandleTemplate: StoryFn<Draggable> = ({ axis, bounds, snap, position }) => {
  return html`
    ${styles}
    <dss-draggable
      axis="${ifDefined(axis)}"
      bounds="${ifDefined(bounds)}"
      snap="${ifDefined(snap)}"
      .position="${ifDefined(position)}"
    >
      <div class="draggable">
        Mooove me horizontal on my handles
        <dss-icon data-dss-draggable-handle icon="chevron-left"></dss-icon>
        <dss-icon data-dss-draggable-handle icon="chevron-right"></dss-icon>
      </div>
    </dss-draggable>
  `;
};

export const HorizontalWithHandle = HandleTemplate.bind({});
HorizontalWithHandle.args = {
  axis: 'x',
};

const BoundaryTemplate: StoryFn<Draggable> = ({ axis, bounds, snap, position }) => {
  return html`
    ${styles}
    <style>
      .bounds {
        width: 50%;
        height: 10rem;
        background-color: var(--color-brand-interaction-10);
      }
    </style>
    <div class="bounds">
      <dss-draggable
        axis="${ifDefined(axis)}"
        bounds="${ifDefined(bounds)}"
        snap="${ifDefined(snap)}"
        .position="${ifDefined(position)}"
      >
        <div class="draggable">Mooove me inside the box</div>
      </dss-draggable>
    </div>
  `;
};

export const WithParentBounds = BoundaryTemplate.bind({});
WithParentBounds.args = {
  bounds: 'parent',
};

