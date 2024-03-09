import './datepicker.component';
import { html } from 'lit-html';
import { Meta, StoryFn, WebComponentsRenderer } from '@storybook/web-components';
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

export const Default = DatePickerTemplate.bind({});

export const WithDefaultValue = DatePickerTemplate.bind({});
WithDefaultValue.args = {
  value: '2022-07-06',
};

export const WithLabel = DatePickerTemplate.bind({});
WithLabel.args = {
  label: 'Select Date',
};

export const Range = DatePickerTemplate.bind({});
Range.args = {
  label: 'Select Range',
  range: true,
  value: '01.04.2023 - 10.04.2023',
};

export const Required = DatePickerTemplate.bind({});
Required.args = {
  label: 'Required Date',
  required: true,
};

export const Warning = DatePickerTemplate.bind({});
Warning.args = {
  label: 'Warning',
  errorState: 'warning',
  message: 'This date is problematic',
};

export const Error = DatePickerTemplate.bind({});
Error.args = {
  label: 'Error',
  errorState: 'error',
  message: 'This date is not acceptable',
};

export const Disabled = DatePickerTemplate.bind({});
Disabled.args = {
  label: 'Disabled',
  value: '2022-07-06',
  disabled: true,
};