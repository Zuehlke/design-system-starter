import './spinner.component';
import '../icon/icon.component';
import '../button/button.component';
import Spinner, { spinnerSizes, spinnerThickness, spinnerTypes } from './spinner.component';
import { html } from 'lit-html';
import { Meta, StoryFn } from '@storybook/web-components';
import docs from './spinner.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { when } from 'lit-html/directives/when.js';

const meta: Meta<Spinner> = {
  title: 'Components/Spinner',
  component: 'dss-spinner',
  argTypes: {
    type: { control: 'select', options: spinnerTypes },
    size: { control: 'select', options: spinnerSizes },
    thickness: { control: 'select', options: spinnerThickness },
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

const Template: StoryFn<Spinner & { backgroundColor: string }> = ({
  type,
  size,
  thickness,
  backgroundColor,
}) => html`
  <div style="height: 4rem; width: 4rem">
    <dss-spinner
      style="${when(backgroundColor, () => `--spinner-background-color: ${backgroundColor}`)}"
      type=${ifDefined(type)}
      size=${ifDefined(size)}
      thickness=${ifDefined(thickness)}
    ></dss-spinner>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
};

export const OverwriteBackground = Template.bind({});
OverwriteBackground.args = {
  type: 'secondary',
  backgroundColor: 'papayawhip',
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
  type: 'primary',
  size: 'small',
};

export const SizeStretch = Template.bind({});
SizeStretch.args = {
  type: 'primary',
  size: 'stretch',
};

export const Thick = Template.bind({});
Thick.args = {
  type: 'secondary',
  thickness: 'thick',
};
