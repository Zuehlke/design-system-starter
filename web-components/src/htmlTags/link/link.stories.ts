import { html } from 'lit-html';
import { Meta, StoryFn } from '@storybook/web-components';
import docs from './link.md?raw';

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

const Template: StoryFn<HTMLLinkElement> = () => html`
  <a href="/">Link/action within app</a>
`;

export const Default = Template.bind({});

const ExternalTemplate: StoryFn<HTMLLinkElement> = () => html`
  <a href="https://www.dreyfusbank.ch/">
    Link to external application or web page
    <dss-icon icon="link"></dss-icon>
  </a>
`;

export const External = ExternalTemplate.bind({});

const InternalTemplate: StoryFn<HTMLLinkElement> = () => html`
  <a href="/">Link/action within app</a>
`;

export const Internal = InternalTemplate.bind({});

