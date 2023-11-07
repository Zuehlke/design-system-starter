import './dropdown.component';
import { html, TemplateResult } from 'lit-html';
import Dropdown from './dropdown.component';
import '../checkbox/checkbox.component';
import '../menu/menu.component';
import '../menuItem/menuItem.component';
import { makeData } from './makeData.story-utils';
import { Meta, StoryFn } from '@storybook/web-components';
import docs from './dropdown.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { placementOptions } from '../../internals/floatingElement/floatingElement';
import { inputSizes } from '../input/input.component';
import { withActions } from '@storybook/addon-actions/decorator';
import { labelPlacementOptions } from '../label/label.component';

const meta: Meta<Dropdown> = {
  title: 'Components/Dropdown',
  component: 'dss-dropdown',
  argTypes: {
    placement: {
      control: 'select',
      options: placementOptions,
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
  decorators: [withActions],
};
export default meta;

const Template: StoryFn<Dropdown & { optionsSlot: TemplateResult | TemplateResult[] }> = (
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
  }) => {
  return html`
    <dss-dropdown
      icon="${ifDefined(icon)}"
      ?editable="${editable}"
      ?disabled="${disabled}"
      ?block="${block}"
      label="${ifDefined(label)}"
      .labelPlacement="${ifDefined(labelPlacement)}"
      .required="${ifDefined(required)}"
      .errorState="${ifDefined(errorState)}"
      .message="${ifDefined(message)}"
      size="${ifDefined(size)}"
      .multiSelect="${ifDefined(multiSelect)}"
      .hideMessage="${ifDefined(hideMessage)}"
    >
      <dss-menu>
        ${optionsSlot}
      </dss-menu>
    </dss-dropdown>
  `;
};


export const Default = Template.bind({});
Default.args = {
  optionsSlot: makeData(5)
    .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
    .map(person => html`
      <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>
    `),
};

const InitialSelectionTemplate: StoryFn<Dropdown> = () => html`
  <dss-dropdown value="1">
    <dss-menu>
      <dss-menu-item value="0">Not selected</dss-menu-item>
      <dss-menu-item value="1">Initially selected</dss-menu-item>
    </dss-menu>
  </dss-dropdown>`;
export const InitialSelection = InitialSelectionTemplate.bind({});

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Select option',
  optionsSlot: makeData(5)
    .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
    .map(person => html`
      <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>
    `),
};

export const Required = Template.bind({});
Required.args = {
  label: 'Required option',
  required: true,
  optionsSlot: makeData(5)
    .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
    .map(person => html`
      <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>
    `),
};

export const Warning = Template.bind({});
Warning.args = {
  label: 'Important',
  errorState: 'warning',
  message: 'This dropdown is problematic',
  optionsSlot: makeData(5)
    .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
    .map(person => html`
      <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>
    `),
};

export const Error = Template.bind({});
Error.args = {
  label: 'Important',
  errorState: 'error',
  message: 'This dropdown is wrong',
  optionsSlot: makeData(5)
    .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
    .map(person => html`
      <dss-menu-item .value=${person}>${person.lastName}, ${person.firstName}</dss-menu-item>
    `),
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
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

export const WithIconsAndSeparator = Template.bind({});
WithIconsAndSeparator.args = {
  optionsSlot: options,
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  icon: 'settings-ui',
  optionsSlot: options,
};

export const MultiSelect = Template.bind({});
MultiSelect.args = {
  multiSelect: true,
  optionsSlot: makeData(5)
    .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }))
    .map(person => html`
      <dss-menu-item .value=${person}>
        <dss-checkbox size="compact" label="${person.firstName} ${person.lastName}"></dss-checkbox>
      </dss-menu-item>
    `),
};
