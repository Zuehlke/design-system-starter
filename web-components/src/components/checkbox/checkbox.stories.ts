import './checkbox.component';
import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
import { html } from 'lit-html';
import Checkbox from './checkbox.component';
import docs from './checkbox.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputErrorStates, inputSizes } from '../input/input.component';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta<Checkbox> = {
  title: 'Components/Checkbox',
  component: 'dss-checkbox',
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

const Template: StoryFn<Checkbox> = ({
  label,
  size,
  checked,
  indeterminate,
  errorState,
  message,
  disabled,
  required,
}) => {
  return html`
    <dss-checkbox
      label=${label}
      size=${size}
      ?checked=${checked}
      ?indeterminate=${indeterminate}
      errorState="${ifDefined(errorState)}"
      message="${ifDefined(message)}"
      ?disabled="${disabled}"
      ?required="${required}"
    ></dss-checkbox>
  `;
};

export const Default: StoryObj<Checkbox> = {
  render: Template,
  args: {
    label: 'Checkbox mit Text',
  }
}

export const Required: StoryObj<Checkbox> = {
  render: Template,
  args: {
    label: 'Required checkbox',
    required: true,
  }
}

export const Warning: StoryObj<Checkbox> = {
  render: Template,
  args: {
    label: 'Warning Checkbox',
    errorState: 'warning',
    message: 'This checkbox is problematic',
  }
}

export const Error: StoryObj<Checkbox> = {
  render: Template,
  args: {
    label: 'Error Checkbox',
    errorState: 'error',
    message: 'This checkbox is wrong',
  }
}

const DisabledTemplate: StoryFn<Checkbox> = ({ label, size }) => {
  return html`
    <div style="display: flex; flex-direction: column; gap: var(--constraints-size-0-5)">
      <dss-checkbox label=${label} size=${size} ?disabled=${true}></dss-checkbox>
      <dss-checkbox label=${`${label} — checked`} size=${size} ?disabled=${true} ?checked=${true}></dss-checkbox>
      <dss-checkbox
        label=${`${label} — indeterminate`}
        size=${size}
        ?disabled=${true}
        ?indeterminate=${true}
      ></dss-checkbox>
    </div>
  `;
};

export const Disabled: StoryObj<Checkbox> = {
  render: DisabledTemplate,
  args: {
    label: 'Disabled Checkbox',
    size: 'comfortable',
  }
}

const IndeterminateTemplate: StoryFn<Checkbox> = ({ label, size }) => {
  return html`
    <dss-checkbox label=${label} size=${size} ?indeterminate=${true}></dss-checkbox>
  `;
};

export const Indeterminate: StoryObj<Checkbox> = {
  render: IndeterminateTemplate,
  args: {
    label: 'Indeterminate Checkbox',
  }
}
