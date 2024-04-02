import './datepicker.component';
import { html } from 'lit-html';
import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
import Datepicker from './datepicker.component';
import docs from './datepicker.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputSizes } from '../input/input.component';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta<Datepicker> = {
  title: 'Components/Datepicker',
  component: 'dss-datepicker',
  argTypes: {
    value: { control: 'text' },
    locale: { control: 'select', options: ['de-CH', 'en-US', 'fr-CH', 'it-CH'] },
    size: { control: 'select', options: inputSizes },
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

const DatePickerTemplate: StoryFn<Datepicker> = ({
  required,
  label,
  value,
  errorState,
  message,
  locale,
  range,
  size,
  disabled,
  block,
}) => html`
  <dss-datepicker
    value="${value}"
    label="${ifDefined(label)}"
    locale="${ifDefined(locale)}"
    ?required="${required}"
    errorState="${ifDefined(errorState)}"
    message="${ifDefined(message)}"
    ?range="${range}"
    size="${size}"
    style="margin-bottom: 30rem"
    ?disabled="${disabled}"
    ?block="${block}"
  ></dss-datepicker>
`;

export const Default: StoryObj<Datepicker> = {
  render: DatePickerTemplate,
};

export const WithDefaultValue: StoryObj<Datepicker> = {
  render: DatePickerTemplate,
  args: {
    value: '2022-07-06',
  },
};

export const WithLabel: StoryObj<Datepicker> = {
  render: DatePickerTemplate,
  args: {
    label: 'Select Date',
  },
};

export const Range: StoryObj<Datepicker> = {
  render: DatePickerTemplate,
  args: {
    label: 'Select Range',
    range: true,
    value: '01.04.2023 - 10.04.2023',
  },
};

export const Required: StoryObj<Datepicker> = {
  render: DatePickerTemplate,
  args: {
    label: 'Required Date',
    required: true,
  },
};

export const Warning: StoryObj<Datepicker> = {
  render: DatePickerTemplate,
  args: {
    label: 'Warning',
    errorState: 'warning',
    message: 'This date is problematic',
  },
};

export const Error: StoryObj<Datepicker> = {
  render: DatePickerTemplate,
  args: {
    label: 'Error',
    errorState: 'error',
    message: 'This date is not acceptable',
  },
};

export const Disabled: StoryObj<Datepicker> = {
  render: DatePickerTemplate,
  args: {
    label: 'Disabled',
    value: '2022-07-06',
    disabled: true,
  },
};