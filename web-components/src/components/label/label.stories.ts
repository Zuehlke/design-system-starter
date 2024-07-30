import docs from './label.md?raw';
import { Meta, StoryFn, StoryObj } from '@storybook/web-components';
import Label from './label.component';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './label.component';

const meta: Meta<Label> = {
  title: 'Components/Label',
  component: 'dss-label',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};
export default meta;

const Template: StoryFn<Label> = ({ label, required }) => html`
  <dss-label label="${ifDefined(label)}" ?required="${required}"></dss-label>
`;

export const Default: StoryObj<Label> = {
  render: Template,
  args: {
    label: 'Standard Label',
  },
};

export const RequiredProperty: StoryObj<Label> = {
  render: Template,
  args: {
    label: 'Required Label',
    required: true,
  },
};

const RequiredStyleTemplate: StoryFn<Label> = ({ label }) => html`
  <style>
    .required-style::part(required) {
      display: inline;
    }
  </style>
  <dss-label class="required-style" label="${ifDefined(label)}"></dss-label>
`;

export const RequiredStyle: StoryObj<Label> = {
  render: RequiredStyleTemplate,
  args: {
    label: 'Required Label',
  },
};
