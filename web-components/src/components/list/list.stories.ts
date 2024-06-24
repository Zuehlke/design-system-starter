import './list.component';
import '../checkbox/checkbox.component';
import '../icon/icon.component';
import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import docs from './list.md?raw';
import List from './list.component';

const meta: Meta<List> = {
  title: 'Components/List',
  component: 'dss-list',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};
export default meta;

const styles = html`
  <style>
    .list {
      max-width: 30rem;
      border-radius: 0.5rem;
      box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);
    }

    .entry {
      display: flex;
      padding: var(--size-1) var(--size-2);
      gap: var(--size-1);

      align-items: center;
      cursor: pointer;
    }

    .entry span {
      width: 100%;
    }

    dss-checkbox {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    dss-icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }
  </style>
`;

export const Default: StoryObj<List> = {
  render: () => html`
    ${styles}
    <dss-list class="list">
      <div class="entry" draggable="true">
        <span>Datum</span>
      </div>
      <div class="entry" draggable="true">
        <span>Geschäftsart</span>
      </div>
      <div class="entry" draggable="true">
        <span>Eingang</span>
      </div>
      <div class="entry" draggable="true">
        <span>Ausgang</span>
      </div>
    </dss-list>
  `,
};

export const Complex: StoryObj<List> = {
  render: () => html`
    ${styles}
    <dss-list class="list">
      <div class="entry" draggable="true">
        <dss-icon icon="hamburger-menu" size="medium"></dss-icon>
        <span>Datum</span>
        <dss-checkbox></dss-checkbox>
      </div>
      <div class="entry" draggable="true">
        <dss-icon icon="hamburger-menu" size="medium"></dss-icon>
        <span>Geschäftsart</span>
        <dss-checkbox></dss-checkbox>
      </div>
      <div class="entry" draggable="true">
        <dss-icon icon="hamburger-menu" size="medium"></dss-icon>
        <span>Eingang</span>
        <dss-checkbox></dss-checkbox>
      </div>
      <div class="entry" draggable="true">
        <dss-icon icon="hamburger-menu" size="medium"></dss-icon>
        <span>Ausgang</span>
        <dss-checkbox></dss-checkbox>
      </div>
    </dss-list>
  `,
};
