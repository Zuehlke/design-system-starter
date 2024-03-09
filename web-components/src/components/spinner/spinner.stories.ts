import './spinner.component';
import '../icon/icon.component';
import '../button/button.component';
import Spinner, { spinnerSizes, spinnerThickness, spinnerTypes } from './spinner.component';
import { html } from 'lit-html';
import { Meta, StoryFn, StoryObj } from '@storybook/web-components';
import docs from './spinner.md?raw';

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

export type SpinnerStory = Spinner & { backgroundColor: string };
const Template: StoryFn<SpinnerStory> = ({
  type,
  size,
  thickness,
  backgroundColor,
}) => html`
  <div style="height: 4rem; width: 4rem">
    <dss-spinner
      style="${backgroundColor ? `--spinner-background-color: ${backgroundColor}` : ''}"
      type=${type}
      size=${size}
      thickness=${thickness}
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
    backgroundColor: 'papayawhip',
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
