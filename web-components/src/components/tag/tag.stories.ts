import { Meta, StoryFn, StoryObj } from '@storybook/web-components';
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


export const Default: StoryObj<Tag> = {
  render: Template,
  args: {
    slot: 'Inaktiv: 12.02.2021',
  },
};

export const Error: StoryObj<Tag> = {
  render: Template,
  args: {
    slot: 'Error',
    state: 'error',
  },
};

export const Warning: StoryObj<Tag> = {
  render: Template,
  args: {
    slot: 'Warning',
    state: 'warning',
  },
};

export const Success: StoryObj<Tag> = {
  render: Template,
  args: {
    slot: 'Success',
    state: 'success',
  },
};

export const Info: StoryObj<Tag> = {
  render: Template,
  args: {
    slot: 'Info',
    state: 'info',
  },
};
