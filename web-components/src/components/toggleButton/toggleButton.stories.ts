import './toggleButton.component';
import '../icon/icon.component';
import ToggleButton, { toggleButtonTypes } from './toggleButton.component';
import { html } from 'lit-html';
import { Meta, StoryFn } from '@storybook/web-components';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import docs from './toggleButton.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { buttonSpacings } from '../button/button.component';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta<ToggleButton> = {
  title: 'Components/Toggle button',
  component: 'dss-toggle-button',
  argTypes: {
    type: { control: 'select', options: toggleButtonTypes },
    spacing: { control: 'select', options: buttonSpacings },
  },
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
    actions: {
      handles: ['click dss-toggle-button'],
    },
  },
  decorators: [withActions],
};
export default meta;

const Template: StoryFn<ToggleButton> = ({ slot, pressed, spacing, disabled, type, tooltip }) => html`
  <dss-toggle-button
    spacing="${ifDefined(spacing)}"
    type="${ifDefined(type)}"
    tooltip="${ifDefined(tooltip)}"
    ?disabled=${disabled}
    ?selected=${pressed}
  >
    ${unsafeHTML(slot)}
  </dss-toggle-button>
`;

export const Default = Template.bind({});
Default.args = {
  slot: 'Toggle me!',
};

export const IconToggle = Template.bind({});
IconToggle.args = {
  spacing: 'icon',
  slot: '<dss-icon icon="home" size="large"></dss-icon>',
};
