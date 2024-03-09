import { html } from 'lit-html';
import './multiselect.component';
import Multiselect from './multiselect.component';
import { Meta, StoryFn, StoryObj } from '@storybook/web-components';
import docs from './multiselect.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { labelPlacementOptions } from '../label/label.component';

const meta: Meta<Multiselect> = {
  title: 'Components/Multiselect',
  component: 'dss-multiselect',
  argTypes: {
    labelPlacement: {
      options: labelPlacementOptions,
      control: { type: 'select' },
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

const Template: StoryFn<Multiselect> = ({
  label,
  labelPlacement,
  options,
  value,
  placeholder,
  required,
  limit,
}) => html`
  <dss-multiselect
    label=${ifDefined(label)}
    labelPlacement="${ifDefined(labelPlacement)}"
    placeholder=${ifDefined(placeholder)}
    .options=${options}
    .value=${value}
    ?required="${required}"
    limit="${ifDefined(limit)}"
  >
  </dss-multiselect>
`;

const TestMultiselectOptions: String[] = [
  'Patrick',
  'Dan',
  'Christian',
  'Alexander',
  'Adrian',
];
export const Default: StoryObj<Multiselect> = {
  render: Template,
  args: {
    label: 'Teammitglieder',
    placeholder: 'Suche',
    options: TestMultiselectOptions,
    value: ['Adrian'],
  },
};

export const LimitedToThree: StoryObj<Multiselect> = {
  render: Template,
  args: {
    label: 'Teammitglieder - Limited to three options',
    placeholder: 'Suche',
    options: TestMultiselectOptions,
    value: ['Adrian', 'Christian'],
  },
};

export const LimitedToOne: StoryObj<Multiselect> = {
  render: Template,
  args: {
    label: 'Teammitglieder - Limited to one option',
    placeholder: 'Suche',
    options: TestMultiselectOptions,
    value: ['Adrian'],
  },
};