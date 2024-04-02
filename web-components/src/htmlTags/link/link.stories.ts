import { html } from 'lit-html';
import { Meta, StoryObj } from '@storybook/web-components';
import docs from './link.md?raw';
import '../../components/icon/icon.component';

export default {
  title: 'HTML Tags/Link <a>',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} as Meta<HTMLLinkElement>;

export const Default: StoryObj<HTMLLinkElement> = {
  render: () => html`
    <a href="/">Link/action within app</a>
  `,
};

export const External: StoryObj<HTMLLinkElement> = {
  render: () => html`
    <a href="https://www.google.com/">
      Link to external application or web page
      <dss-icon icon="link"></dss-icon>
    </a>
  `,
};

export const Internal: StoryObj<HTMLLinkElement> = {
  render: () => html`
    <a href="/">Link/action within app</a>
  `,
};
