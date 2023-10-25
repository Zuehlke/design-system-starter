import { Meta, StoryFn } from '@storybook/web-components';
import { html } from 'lit-html';
import Switch from './switch.component';
import docs from './switch.md?raw';
import './switch.component';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta<Switch> = {
  title: 'Components/Switch',
  component: 'dss-switch',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
    actions: {
      handles: ['change'],
    },
  },
  decorators: [withActions],
};
export default meta;

const Template: StoryFn<Switch> = ({ checked, disabled, loading }) => html`
  <dss-switch ?checked="${checked}" ?disabled="${disabled}" ?loading="${loading}"></dss-switch>
`;


export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const LoadingUnchecked = Template.bind({});
LoadingUnchecked.args = {
  loading: true,
};

export const LoadingChecked = Template.bind({});
LoadingChecked.args = {
  checked: true,
  loading: true,
};
