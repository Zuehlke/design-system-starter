import './button.component';
import '../icon/icon.component';
import Button, { buttonSides, buttonSpacings, buttonTypes } from './button.component';
import { html } from 'lit-html';
import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import docs from './button.md?raw';
import ellipsisDocs from './ellipsis.md?raw';
import { ifDefined } from 'lit/directives/if-defined.js';
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
  <style>
    dss-button {
      max-width: 100%;
    }
  </style>
  <dss-button
    type="${ifDefined(type)}"
    spacing="${ifDefined(spacing)}"
    removeRadius="${ifDefined(removeRadius)}"
    removeBorder="${ifDefined(removeBorder)}"
    tooltip="${ifDefined(tooltip)}"
    ?disabled="${disabled}"
    ?loading="${loading}"
  >
    ${unsafeHTML(slot)}
  </dss-button>
`;

export const Default: StoryObj<Button> = {
  render: Template,
  args: {
    slot: 'Primary Button',
  },
};

export const Primary: StoryObj<Button> = {
  render: Template,
  args: {
    type: 'primary',
    slot: 'Primary Button',
  },
};

export const Secondary: StoryObj<Button> = {
  render: Template,
  args: {
    type: 'secondary',
    slot: '<dss-icon icon="pencil" size="small"></dss-icon> Secondary Button',
  },
};

export const Ghost: StoryObj<Button> = {
  render: Template,
  args: {
    type: 'ghost',
    slot: 'Ghost Button',
  },
};

export const Icon: StoryObj<Button> = {
  render: Template,
  args: {
    spacing: 'icon',
    type: 'secondary',
    slot: '<dss-icon icon="chevron-down" size="large"></dss-icon>',
  },
};

export const DisabledPrimary: StoryObj<Button> = {
  render: Template,
  args: {
    disabled: true,
    type: 'primary',
    slot: 'Disabled Button',
  },
};

export const DisabledPrimaryWithIcon: StoryObj<Button> = {
  render: Template,
  args: {
    disabled: true,
    type: 'primary',
    slot: `<dss-icon icon="settings-ui" size="large"></dss-icon> Disabled`,
  },
};

export const DisabledSecondary: StoryObj<Button> = {
  render: Template,
  args: {
    disabled: true,
    type: 'secondary',
    slot: 'Disabled Button',
  },
};

export const DisabledGhost: StoryObj<Button> = {
  render: Template,
  args: {
    disabled: true,
    type: 'ghost',
    slot: 'Disabled Ghost',
  },
};

export const IconOnlyButton: StoryObj<Button> = {
  render: Template,
  args: {
    type: 'icon-only',
    tooltip: 'Go to start',
    slot: '<dss-icon icon="close-lg" size="large"></dss-icon>',
  },
};

export const LoadingButton: StoryObj<Button> = {
  render: Template,
  args: {
    loading: true,
    slot: 'Loading',
  },
};

export const WithEllipsis = Template.bind({});
WithEllipsis.parameters = {
  docs: {
    description: {
      story: ellipsisDocs,
    },
  },
};
WithEllipsis.args = {
  slot: `
    <span style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
    </span>
  `,
};
