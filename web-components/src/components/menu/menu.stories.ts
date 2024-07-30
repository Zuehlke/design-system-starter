import './menu.component';
import '../menuItem/menuItem.component';
import { html } from 'lit';
import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
import Menu from './menu.component';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import docs from './menu.md?raw';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta<Menu> = {
  title: 'Components/Menu',
  component: 'dss-menu',
  argTypes: {},
  parameters: {
    actions: {
      handles: ['dss-menu-selection'],
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

const Template: StoryFn<Menu> = ({ slot }) => html`
  <dss-menu style="max-width: 20rem; border-radius: 0.5rem; box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);">
    ${unsafeHTML(slot)}
  </dss-menu>
`;

export const Default: StoryObj<Menu> = {
  render: Template,
  args: {
    slot: `
    <dss-menu-item>
      <dss-icon icon="pencil" size="medium"></dss-icon>
      Bearbeiten
    </dss-menu-item>
    <dss-menu-item>
      <dss-icon icon="copy" size="medium"></dss-icon>
      Kopieren
    </dss-menu-item>
  `,
  }
}

export const WithSeparator: StoryObj<Menu> = {
  render: Template,
  args: {
    slot: `
    <dss-menu-item>
      <dss-icon icon="pencil" size="medium"></dss-icon>
      Bearbeiten
    </dss-menu-item>
    <hr>
    <dss-menu-item>
      <dss-icon icon="copy" size="medium"></dss-icon>
      Kopieren
    </dss-menu-item>
    <dss-menu-item>
      <dss-icon icon="paste" size="medium"></dss-icon>
      Einfügen
    </dss-menu-item>
  `,
  }
}

export const WithCheckboxes: StoryObj<Menu> = {
  render: Template,
  args: {
    slot: `
  <dss-menu-item value="pencil">
    <dss-checkbox size="compact" label="Bearbeiten" tabindex="-1"></dss-checkbox>
  </dss-menu-item>
  <hr>
  <dss-menu-item value="copy">
    <dss-checkbox size="compact" label="Kopieren" tabindex="-1"></dss-checkbox>
  </dss-menu-item>
  <dss-menu-item value="paste">
    <dss-checkbox size="compact" label="Einfügen" tabindex="-1"></dss-checkbox>
  </dss-menu-item>
  `,
  }
}

export const WithLinks: StoryObj<Menu> = {
  render: Template,
  args: {
    slot: `
  <dss-menu-item>
    <a href="#">Notizen im Kundendialog öffnen</a>
  </dss-menu-item>
  <dss-menu-item>
    <a href="#">Notizen bearbeiten</a>
  </dss-menu-item>
  <dss-menu-item>
    <a href="#">Notizen löschen</a>
  </dss-menu-item>
  `,
  }
}
