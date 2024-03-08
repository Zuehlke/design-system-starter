import './menuItem.component';
import '../menuItem/menuItem.component';
import '../checkbox/checkbox.component';
import { html, TemplateResult } from 'lit-html';
import { Meta, StoryFn } from '@storybook/web-components';
import docs from './menuItem.md?raw';
import MenuItem from './menuItem.component';

const meta: Meta<MenuItem> = {
  title: 'Components/MenuItem',
  component: 'dss-menu-item',
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};
export default meta;

const Template: StoryFn<MenuItem & { itemSlot: TemplateResult }> = (
  {
    value,
    selected,
    itemSlot,
  }) => {
  return html`
    <style>
      dss-menu-item {
        max-width: 20rem;
        border-radius: 0.5rem;
        box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);
      }
    </style>

    <dss-menu-item
      .value="${value}"
      .selected="${selected}"
    >
      ${itemSlot}
    </dss-menu-item>
  `;
};

export const Default = Template.bind({});
Default.args = {
  itemSlot: html`Menu Item`,
};

export const Icon = Template.bind({});
Icon.args = {
  itemSlot: html`
    <dss-icon icon="pencil" size="medium"></dss-icon>Edit`,
};

export const Checkbox = Template.bind({});
Checkbox.args = {
  itemSlot: html`
    <dss-checkbox size="compact" label="Check"></dss-checkbox>`,
};

export const PrimitiveValue = Template.bind({});
PrimitiveValue.args = {
  value: 'Primitive Value',
  itemSlot: html`Primitive Value`,
};

export const ObjectValue = Template.bind({});
ObjectValue.args = {
  value: { id: 42, text: 'Object Value' },
  itemSlot: html`Object Value`,
};
