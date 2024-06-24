import { Meta, StoryFn, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './tooltip.component';
import '../button/button.component';
import Tooltip from './tooltip.component';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import docs from './tooltip.md?raw';
import { ifDefined } from 'lit/directives/if-defined.js';
import { placements } from '@floating-ui/utils';

const meta: Meta<Tooltip> = {
  title: 'Components/Tooltip',
  component: 'dss-tooltip',
  argTypes: {
    placement: {
      control: 'select',
      options: placements,
    },
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

const Template: StoryFn<Tooltip> = ({ slot, placement }) => html`
  <div style="margin: 20rem; display: inline-block">
    <dss-tooltip placement="${ifDefined(placement)}">
      <dss-button type="secondary" slot="trigger">
        Test
      </dss-button>
      ${unsafeHTML(slot)}
    </dss-tooltip>
  </div>
`;

export const Default: StoryObj<Tooltip> = {
  render: Template,
  args: {
    slot: 'My Tooltip',
  }
}

export const Complex: StoryObj<Tooltip> = {
  render: Template,
  args: {
    slot: `
    <p style="display: flex; gap: 1rem;">
      <dss-icon icon="pencil"></dss-icon>
      Test 1
    </p>
  `,
  }
}
