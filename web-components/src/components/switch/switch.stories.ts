import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
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
    design: {
      type: "figma",
      url: "https://www.figma.com/file/erelKF4Udm8mOGjNf6DvhH/Design-System-Showcase?type=design&node-id=5288-2422&mode=design&t=pKlU723mdRHYS6RD-4",
    },
  },
  decorators: [withActions<WebComponentsRenderer>],
};
export default meta;

const Template: StoryFn<Switch> = ({ checked, disabled, loading }) => html`
  <dss-switch ?checked="${checked}" ?disabled="${disabled}" ?loading="${loading}"></dss-switch>
`;


export const Default: StoryObj<Switch> = {
  render: Template,
};

export const Disabled: StoryObj<Switch> = {
  render: Template,
  args: {
    disabled: true,
  },
};

export const LoadingUnchecked: StoryObj<Switch> = {
  render: Template,
  args: {
    loading: true,
  },
};

export const LoadingChecked: StoryObj<Switch> = {
  render: Template,
  args: {
    checked: true,
    loading: true,
  },
};
