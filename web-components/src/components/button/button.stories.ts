import './button.component';
import '../icon/icon.component';
import Button, { buttonSides, buttonSpacings, buttonTypes } from './button.component';
import { html } from 'lit-html';
import { Meta, StoryFn, WebComponentsRenderer } from '@storybook/web-components';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import docs from './button.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta<Button> = {
  title: 'Components/Button',
  component: 'dss-button',
  argTypes: {
    type: { control: 'select', options: buttonTypes },
    spacing: { control: 'select', options: buttonSpacings },
    removeRadius: { control: 'select', options: buttonSides },
    removeBorder: { control: 'select', options: buttonSides },
  },
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
    actions: {
      handles: ['click'],
    },
  },
  decorators: [withActions<WebComponentsRenderer>],
};
export default meta;

const Template: StoryFn<Button> = ({
  type,
  spacing,
  removeRadius,
  removeBorder,
  slot,
  disabled,
  tooltip,
  loading,
}) => html`
  <dss-button
    type=${ifDefined(type)}
    spacing=${ifDefined(spacing)}
    removeRadius=${ifDefined(removeRadius)}
    removeBorder=${ifDefined(removeBorder)}
    tooltip=${ifDefined(tooltip)}
    ?disabled=${disabled}
    ?loading="${loading}"
  >
    ${unsafeHTML(slot)}
  </dss-button>
`;

export const Default = Template.bind({});
Default.args = {
  slot: 'Primary Button',
};

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  slot: 'Primary Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
  slot: '<dss-icon icon="pencil" size="small"></dss-icon> Secondary Button',
};

export const Ghost = Template.bind({});
Ghost.args = {
  type: 'ghost',
  slot: 'Ghost Button',
};

export const Icon = Template.bind({});
Icon.args = {
  spacing: 'icon',
  type: 'secondary',
  slot: '<dss-icon icon="chevron-down" size="large"></dss-icon>',
};

export const DisabledPrimary = Template.bind({});
DisabledPrimary.args = {
  disabled: true,
  type: 'primary',
  slot: 'Disabled Button',
};

export const DisabledPrimaryWithIcon = Template.bind({});
DisabledPrimaryWithIcon.args = {
  disabled: true,
  type: 'primary',
  slot: `<dss-icon icon="settings-ui" size="large"></dss-icon> Disabled`,
};

export const DisabledSecondary = Template.bind({});
DisabledSecondary.args = {
  disabled: true,
  type: 'secondary',
  slot: 'Disabled Button',
};

export const DisabledGhost = Template.bind({});
DisabledGhost.args = {
  disabled: true,
  type: 'ghost',
  slot: 'Disabled Ghost',
};

export const IconOnlyButton = Template.bind({});
IconOnlyButton.args = {
  type: 'icon-only',
  tooltip: 'Go to start',
  slot: '<dss-icon icon="close-lg" size="large"></dss-icon>',
};

export const LoadingButton = Template.bind({});
LoadingButton.args = {
  loading: true,
  slot: 'Loading',
};
