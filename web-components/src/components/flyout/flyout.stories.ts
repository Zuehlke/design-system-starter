import { html, TemplateResult } from 'lit-html';
import Flyout from './flyout.component';
import { Meta, StoryFn, StoryObj } from '@storybook/web-components';
import docs from './flyout.md?raw';
import { when } from 'lit-html/directives/when.js';
import './flyout.component';
import '../menu/menu.component';
import '../menuItem/menuItem.component';
import '../icon/icon.component';
import '../button/button.component';
import '../input/input.component';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { placementOptions } from '../../internals/floatingElement/floatingElement';

const meta: Meta<Flyout> = {
  title: 'Components/Flyout',
  component: 'dss-flyout',
  argTypes: {
    placement: {
      control: 'select',
      options: placementOptions,
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


export type FlyoutStory = Flyout & { contentSlot: TemplateResult, triggerSlot: TemplateResult };
const Template: StoryFn<FlyoutStory> = ({
  triggerSlot,
  contentSlot,
  arrow,
  open,
  placement,

}) => {
  return html`
    <div style="margin-left: var(--size-1); margin-top: var(--size-1);">
      <dss-flyout
        ?arrow="${arrow}"
        .open="${open}"
        placement="${ifDefined(placement)}"
      >
        ${when(triggerSlot !== undefined, () => html`
          <span slot="trigger">
            ${triggerSlot}
          </span>
        `)}
        ${contentSlot}
      </dss-flyout>
    </div>
  `;
};

export const ButtonWithMenu: StoryObj<FlyoutStory> = {
  render: Template,
  parameters: {
    actions: {
      handles: ['dss-menu-selection'],
    },
  },
  args: {
    contentSlot: html`
      <dss-menu>
        <dss-menu-item>
          <dss-icon icon="pencil" size="medium"></dss-icon>
          Edit
        </dss-menu-item>
        <hr>
        <dss-menu-item>
          <dss-icon icon="copy" size="medium"></dss-icon>
          Copy
        </dss-menu-item>
        <dss-menu-item>
          <dss-icon icon="paste" size="medium"></dss-icon>
          Paste
        </dss-menu-item>
      </dss-menu>
    `,
    triggerSlot: html`
      <dss-button type="secondary">
        Test
      </dss-button>
    `,
    arrow: true,
  },
};

export const ButtonWithForm: StoryObj<FlyoutStory> = {
  render: Template,
  args: {
    contentSlot: html`
      <form style="padding: var(--size-1);">
        <dss-input>
          <input placeholder="Search...">
        </dss-input>
        <br>
        <dss-button type="secondary">
          Submit
        </dss-button>
      </form>
    `,
    triggerSlot: html`
      <dss-button type="primary" spacing="icon-only">
        <dss-icon icon="settings-ui"></dss-icon>
      </dss-button>
    `,
    placement: 'bottom-start',
  },
};
