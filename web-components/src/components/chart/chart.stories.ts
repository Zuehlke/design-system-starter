import './chart.component';
import { html } from 'lit-html';
import { Meta, StoryFn, StoryObj } from '@storybook/web-components';
import docs from './chart.md?raw';
import Chart from './chart.component';

const meta: Meta<Chart> = {
  title: 'Components/Chart',
  component: 'dss-chart',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};
export default meta;

const Template: StoryFn<Chart> = ({ series }) => html`
  <dss-chart
    style="height: 37rem; margin: var(--constraints-size-3) var(--constraints-size-1)"
    .series="${series}"
  ></dss-chart>
`;

export const BarChart: StoryObj<Chart> = {
  render: Template,
  args: {
    series: [{
      type: 'bar',
      colorByPoint: true,
      name: 'Mio.',
      data: [
        ['Stocks<br><small>12’341’932 (32%)</small>', 17],
        ['Funds<br><small>8’343’422 (24%)</small>', 11],
        ['Accounts<br><small>6’293’211 (16%)</small>', 7],
        ['Precious metals<br><small>4’734’023 (11%)</small>', 3],
        ['High Yield<br><small>4’393’733 (9%)</small>', 2],
        ['Alternative investments<br><small>3’443’108 (7%)</small>', 1],
      ],
    }],
  }
}

export const ColumnChart: StoryObj<Chart> = {
  render: Template,
  args: {
    series: [{
      type: 'column',
      colorByPoint: true,
      name: 'Mio.',
      data: [
        ['Stocks<br><small>12’341’932 (17%)</small>', 17],
        ['Funds<br><small>8’343’422 (3%)</small>', 3],
        ['Accounts<br><small>-6’293’211 (-7%)</small>', -7],
        ['Precious metals<br><small>4’734’023 (11%)</small>', 11],
        ['High Yield<br><small>4’393’733 (9%)</small>', -2],
        ['Alternative investments<br><small>3’443’108 (7%)</small>', 7],
      ],
    }],
  }
}

export const PieChart: StoryObj<Chart> = {
  render: Template,
  args: {
    series: [{
      type: 'pie',
      data: [
        { name: 'Energie<br><small>12’341’932 (32%)</small>', y: 35 },
        { name: 'Versorger<br><small>8’343’422 (24%)</small>', y: 26 },
        { name: 'Basis Konsumgüter<br><small>6’293’211 (16%)</small>', y: 20 },
        { name: 'Gesundheit<br><small>4’734’023 (11%)</small>', y: 15 },
        { name: 'Industrie<br><small>3’443’108 (7%)</small>', y: 4 },
        { name: 'Andere<br><small>4’393’733 (9%)</small>', y: 4 },
      ],
    }],
  }
}
