import './spinner.component';
import '../icon/icon.component';
import '../button/button.component';
import Spinner, { spinnerSizes, spinnerThickness, spinnerTypes } from './spinner.component';
import { html } from 'lit';
import { Meta, StoryFn, StoryObj } from '@storybook/web-components';
import docs from './spinner.md?raw';
import { ifDefined } from 'lit/directives/if-defined.js';

type SpinnerStory = Spinner & { '--spinner-background-color': string };
const meta: Meta<SpinnerStory> = {
  title: 'Components/Spinner',
  component: 'dss-spinner',
  argTypes: {
    type: { control: 'select', options: spinnerTypes },
    size: { control: 'select', options: spinnerSizes },
    thickness: { control: 'select', options: spinnerThickness },
    '--spinner-background-color': { control: 'color' },
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

const Template: StoryFn<SpinnerStory> = ({
  type,
  size,
  thickness,
  '--spinner-background-color': backgroundColor,
}) => html`
  <div style="height: 4rem; width: 4rem">
    <dss-spinner
      style="${backgroundColor ? `--spinner-background-color: ${backgroundColor}` : ''}"
      type=${ifDefined(type)}
      size=${ifDefined(size)}
      thickness=${ifDefined(thickness)}
    ></dss-spinner>
  </div>
`;

export const Default: StoryObj<SpinnerStory> = {
  render: Template,
};

export const Primary: StoryObj<SpinnerStory> = {
  render: Template,
  args: {
    type: 'primary',
  },
};

export const Secondary: StoryObj<SpinnerStory> = {
  render: Template,
  args: {
    type: 'secondary',
  },
};

export const OverwriteBackground: StoryObj<SpinnerStory> = {
  render: Template,
  args: {
    type: 'secondary',
    '--spinner-background-color': 'papayawhip',
  },
};

export const SizeSmall: StoryObj<SpinnerStory> = {
  render: Template,
  args: {
    type: 'primary',
    size: 'small',
  },
};

export const SizeStretch: StoryObj<SpinnerStory> = {
  render: Template,
  args: {
    type: 'primary',
    size: 'stretch',
  },
};

export const Thick: StoryObj<SpinnerStory> = {
  render: Template,
  args: {
    type: 'secondary',
    thickness: 'thick',
  },
};
