import './loadingPlaceholder.component';
import docs from './loadingPlaceholder.md?raw';
import { Meta, StoryFn } from '@storybook/web-components';
import LoadingPlaceholder from './loadingPlaceholder.component';
import { html } from 'lit';

const meta: Meta<LoadingPlaceholder> = {
  title: 'Components/Loading Placeholder',
  component: 'dss-loading-placeholder',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};
export default meta;

const Template: StoryFn<LoadingPlaceholder> = () => {
  return html`
    <style>
      .container {
        position: relative;
        width: 50%;
        height: 3rem;
        margin: 1rem;
      }
    </style>
    <div class="container">
      <dss-loading-placeholder></dss-loading-placeholder>
    </div>
  `;
};

export const Default = Template.bind({});
