import { Meta, StoryFn } from '@storybook/web-components';
import { html } from 'lit-html';
import './tag.component';
import Tag, { tagStates } from './tag.component';
import docs from './tag.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';

const meta: Meta<Tag> = {
  title: 'Components/Tag',
  component: 'dss-tag',
  argTypes: {
    state: {
      control: 'select',
      options: tagStates,
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

const Template: StoryFn<Tag> = ({ slot, state }) => html`
  <dss-tag state="${ifDefined(state)}">${slot}</dss-tag>
`;


export const Default = Template.bind({});
Default.args = {
  slot: 'Inaktiv: 12.02.2021',
};

export const Error = Template.bind({});
Error.args = {
  slot: 'Error',
  state: 'error',
};

export const Warning = Template.bind({});
Warning.args = {
  slot: 'Warning',
  state: 'warning',
};

export const Success = Template.bind({});
Success.args = {
  slot: 'Success',
  state: 'success',
};

export const Info = Template.bind({});
Info.args = {
  slot: 'Info',
  state: 'info',
};
