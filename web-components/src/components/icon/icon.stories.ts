import './icon.component';
import Icon, { ICON_SIZE } from './icon.component';
import { html } from 'lit-html';
import { Meta, StoryObj } from '@storybook/web-components';
import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';
import docs from './icon.md?raw';
import { Icons, ICONS } from './icons';

const meta: Meta<Icon> = {
  title: 'Components/Icons',
  component: 'dss-icon',
  argTypes: {
    icon: { control: 'select', options: ICONS },
    size: { control: 'select', options: ICON_SIZE },
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

export type IconStory = Icon & { color: string };

export const IconGallery: StoryObj<IconStory> = {
  render: ({ color }) => html`
    <style>
      .icon-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 4rem;
        box-shadow: var(--effect-shadow-close);
        color: ${color};
        word-break: break-all;
        overflow: hidden;
      }

      .icon-wrapper div {
        padding: 3.2rem 0;
        flex: none;
        display: flex;
        justify-content: center
      }

      .icon-wrapper dss-icon {
        width: 3.6rem;
        height: 3.6rem;
      }

      .icon-wrapper p {
        background-color: var(--color-brand-interaction-25);
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>
    <lit-virtualizer
      .layout=${grid({
        gap: '20px',
        itemSize: {
          width: '160px',
          height: '160px',
        },
      }) as any}
      .items=${ICONS}
      .renderItem=${((icon: Icons) => html`
        <div class="icon-wrapper">
          <div>
            <dss-icon icon=${icon}></dss-icon>
          </div>
          <p>
            ${icon}
          </p>
        </div>
      `) as any}
    ></lit-virtualizer>
    </div>
  `,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    color: '#000',
  },
};

export const Usage: StoryObj<Icon> = {
  render: ({ size, icon }) => html`
    <dss-icon .icon=${icon} .size=${size}></dss-icon>
  `,
  args: {
    icon: 'ambulance',
    size: 'large',
  },
};
