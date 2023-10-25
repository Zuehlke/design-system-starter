import { Meta, StoryFn } from '@storybook/web-components';
import './radiogroup.component';
import '../radio/radio.component';
import '../label/label.component';
import { html } from 'lit';
import RadioGroup from './radiogroup.component';
import { inputErrorStates } from '../input/input.component';
import docs from './radiogroup.md?raw';

const meta: Meta<RadioGroup> = {
  title: 'Components/Radio Group',
  component: 'dss-radiogroup',
  argTypes: {
    errorState: {
      control: 'select',
      options: inputErrorStates,
    },
  },
  args: {
    required: false,
    label: 'Please choose an option',
    message: '',
  }, parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};

export default meta;

const Template: StoryFn<RadioGroup> = ({
    errorState,
    message,
    required,
    label,
  },
) => {
  return html`
    <dss-radiogroup
      .errorState="${errorState}"
      .message="${message}"
      .label="${label}"
      ?required="${required}"
    >
      <dss-radio class="radio" label="Option 1">
        <input type="radio" name="option" ?required="${required}">
      </dss-radio>
      <dss-radio class="radio" label="Option 2">
        <input type="radio" name="option" ?required="${required}">
      </dss-radio>
      <dss-radio class="radio" label="Option 3">
        <input type="radio" name="option" ?required="${required}">
      </dss-radio>
    </dss-radiogroup>
  `;
};
export const Default = Template.bind({});
Default.args = {};
