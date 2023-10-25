import './pagination.component';
import { html } from 'lit-html';
import { Meta, StoryFn } from '@storybook/web-components';
import docs from './pagination.md?raw';
import Pagination from './pagination.component';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta<Pagination> = {
  title: 'Components/Pagination',
  component: 'dss-pagination',
  parameters: {
    actions: {
      handles: ['dss-pagination-page-index-selected'],
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

const Template: StoryFn<Pagination> = ({ pageCount, activePageIndex }) => html`
  <dss-pagination .pageCount=${pageCount} .activePageIndex=${activePageIndex}></dss-pagination>
`;

export const Default = Template.bind({});
Default.args = {
  activePageIndex: 0,
  pageCount: 10,
};
