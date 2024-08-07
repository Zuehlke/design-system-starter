import './dropdown.component';
import { html, TemplateResult } from 'lit';
import Dropdown from './dropdown.component';
import '../checkbox/checkbox.component';
import '../menu/menu.component';
import '../menuItem/menuItem.component';
import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
import docs from './dropdown.md?raw';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputSizes } from '../input/input.component';
import { withActions } from '@storybook/addon-actions/decorator';
import { labelPlacementOptions } from '../label/label.component';
import { simplePersonData } from '../../mockdata.story-utils';
import { placements } from '@floating-ui/utils';

const meta: Meta<Dropdown> = {
  title: 'Components/Dropdown',
  component: 'dss-dropdown',
  argTypes: {
    placement: {
      control: 'select',
      options: placements,
    },
    labelPlacement: {
      options: labelPlacementOptions,
      control: { type: 'select' },
    },
    size: {
      control: 'select',
      options: inputSizes,
    },
  },
  parameters: {
    actions: {
      handles: ['change', 'dss-menu-selection'],
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

export type DropdownStory = Dropdown & { optionsSlot: TemplateResult | TemplateResult[] };
const Template: StoryFn<DropdownStory> = (
  {
    optionsSlot,
    editable,
    block,
    icon,
    disabled,
    label,
    labelPlacement,
    required,
    errorState,
    message,
    size,
    multiSelect,
    hideMessage,
    placement,
  }) => {
  return html`
    <dss-dropdown
      icon="${ifDefined(icon)}"
      ?editable="${editable}"
      ?disabled="${disabled}"
      ?block="${block}"
      label="${ifDefined(label)}"
      labelPlacement="${labelPlacement}"
      ?required="${required}"
      errorState="${ifDefined(errorState)}"
      message="${ifDefined(message)}"
      size="${size}"
      ?multiSelect="${multiSelect}"
      ?hideMessage="${hideMessage}"
      placement="${ifDefined(placement)}"
    >
      <dss-menu>
        ${optionsSlot}
      </dss-menu>
    </dss-dropdown>
  `;
};


export const Default: StoryObj<DropdownStory> = {
  render: Template,
  args: {
    optionsSlot: simplePersonData.slice(0, 5)
      .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
      .map(person => html`
        <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>
      `),
  },
};

export const InitialSelection: StoryObj<DropdownStory> = {
  render: () => html`
    <dss-dropdown value="1">
      <dss-menu>
        <dss-menu-item value="0">Not selected</dss-menu-item>
        <dss-menu-item value="1">Initially selected</dss-menu-item>
      </dss-menu>
    </dss-dropdown>`,
};

export const WithLabel: StoryObj<DropdownStory> = {
  render: Template,
  args: {
    label: 'Select option',
    optionsSlot: simplePersonData.slice(0, 5)
      .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
      .map(person => html`
        <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>
      `),
  },
};

export const Required: StoryObj<DropdownStory> = {
  render: Template,
  args: {
    label: 'Required option',
    required: true,
    optionsSlot: simplePersonData.slice(0, 5)
      .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
      .map(person => html`
        <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>
      `),
  },
};

export const Warning: StoryObj<DropdownStory> = {
  render: Template,
  args: {
    label: 'Important',
    errorState: 'warning',
    message: 'This dropdown is problematic',
    optionsSlot: simplePersonData.slice(0, 5)
      .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
      .map(person => html`
        <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>
      `),
  },
};

export const Error: StoryObj<DropdownStory> = {
  render: Template,
  args: {
    label: 'Important',
    errorState: 'error',
    message: 'This dropdown is wrong',
    optionsSlot: simplePersonData.slice(0, 5)
      .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
      .map(person => html`
        <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>
      `),
  },
};

export const Disabled: StoryObj<DropdownStory> = {
  render: Template,
  args: {
    disabled: true,
  },
};

const options = html`
  <dss-menu-item value="edit">
    <dss-icon icon="pencil"></dss-icon>
    Bearbeiten
  </dss-menu-item>
  <hr>
  <dss-menu-item value="copy">
    <dss-icon icon="copy"></dss-icon>
    Kopieren
  </dss-menu-item>
  <dss-menu-item value="paste">
    <dss-icon icon="paste"></dss-icon>
    Einfügen
  </dss-menu-item>
`;

export const WithIconsAndSeparator: StoryObj<DropdownStory> = {
  render: Template,
  args: {
    optionsSlot: options,
  },
};

export const CustomIcon: StoryObj<DropdownStory> = {
  render: Template,
  args: {
    icon: 'settings-ui',
    optionsSlot: options,
  },
};

export const MultiSelect: StoryObj<DropdownStory> = {
  render: Template,
  args: {
    multiSelect: true,
    optionsSlot: simplePersonData.slice(0, 5)
      .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
      .map(person => html`
        <dss-menu-item .value=${person}>
          <dss-checkbox size="compact" label="${person.firstName} ${person.lastName}"></dss-checkbox>
        </dss-menu-item>
      `),
  },
};
