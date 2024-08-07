import './radio.component';
import { html } from 'lit';
import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
import Radio from './radio.component';
import docs from './radio.md?raw';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputErrorStates, inputSizes } from '../input/input.component';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta<Radio> = {
  title: 'Components/Radio',
  component: 'dss-radio',
  argTypes: {
    size: { control: 'select', options: inputSizes },
    errorState: { control: 'select', options: inputErrorStates },
  },
  parameters: {
    actions: {
      handles: ['change'],
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
  decorators: [withActions<WebComponentsRenderer>],
};
export default meta;

const Template: StoryFn<Radio> = ({ label, size, errorState, message, hideMessage }) => {
  return html`
    <dss-radio
      size=${ifDefined(size)}
      label=${ifDefined(label)}
      errorState="${ifDefined(errorState)}"
      message="${ifDefined(message)}"
      ?hideMessage="${hideMessage}"
      style="padding: .3rem .3rem .3rem .8rem;"
    >
      <input type="radio">
    </dss-radio>
  `;
};

export const Default: StoryObj<Radio> = {
  render: Template,
  args: {
    label: 'Radio mit Text',
  },
};

export const Warning: StoryObj<Radio> = {
  render: Template,
  args: {
    label: 'Option 1',
    errorState: 'warning',
    message: 'This radio is problematic',
  },
};

export const Error: StoryObj<Radio> = {
  render: Template,
  args: {
    label: 'Option 7',
    errorState: 'error',
    message: 'This radio is wrong',
  },
};

const DisabledTemplate: StoryFn<Radio> = ({ label }) => {
  return html`
    <dss-radio .label=${`${label} unchecked`} style="padding: .3rem .3rem .3rem .8rem;">
      <input type="radio" disabled>
    </dss-radio>

    <dss-radio .label=${`${label} checked`} style="padding: .3rem .3rem .3rem .8rem;">
      <input type="radio" checked disabled>
    </dss-radio>
  `;
};

export const Disabled: StoryObj<Radio> = {
  render: DisabledTemplate,
  args: {
    label: 'Disabled Radio',
  },
};

const MultipleRadios: StoryFn<Radio> = () => {
  return html`
    <style>
      .add-spacing {
        padding-left: var(--size-0-5);
        display: flex;
        flex-direction: column;
      }
    </style>

    <div class="add-spacing">
      <p style="margin-bottom: var(--size-1)">Group 1</p>
      <dss-radio label='Radio 1'>
        <input id="choice1" type="radio" name="sameGroup" checked>
      </dss-radio>

      <dss-radio label='Radio 2'>
        <input id="choice2" type="radio" name="sameGroup">
      </dss-radio>
    </div>

    <br>

    <div class="add-spacing">
      <p style="margin-bottom: var(--size-1)">Group 2</p>
      <dss-radio label='Radio 1'>
        <input id="choice1" type="radio" name="otherGroup">
      </dss-radio>

      <dss-radio label='Radio 2'>
        <input id="choice2" type="radio" name="otherGroup">
      </dss-radio>

      <dss-radio label='Radio 3'>
        <input id="choice3" type="radio" name="otherGroup">
      </dss-radio>
    </div>
  `;
};

export const Multiple: StoryObj<Radio> = {
  render: MultipleRadios,
  args: {
    label: 'Multiple Radio Buttons',
  },
};
