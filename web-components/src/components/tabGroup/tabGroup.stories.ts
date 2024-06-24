import './tabGroup.component';
import { html } from 'lit';
import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
import docs from './tabGroup.md?raw';
import TabGroup, { DssTabGroupTabCloseEvent, DssTabGroupTabSelectEvent } from './tabGroup.component';
import { useState } from '@storybook/preview-api';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta<TabGroup> = {
  title: 'Components/Tab Group',
  component: 'dss-tab-group',
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
    actions: {
      handles: ['dss-tab-group-tab-close', 'dss-tab-group-tab-select'],
    },
  },
  decorators: [withActions<WebComponentsRenderer>],
};
export default meta;

const Template: StoryFn<TabGroup> = ({ tabs, activeTabTitle, translations }) => {
  const [tabsState, setTabsState] = useState(tabs);
  const [activeTab, setActiveTab] = useState(activeTabTitle);

  return html`
    <style>
      .wrapper {
        padding-left: var(--size-4);
      }
    </style>

    <div class="wrapper">
      <dss-tab-group
        .tabs=${tabsState}
        .activeTabTitle=${activeTab}
        .translations="${translations}"
        @dss-tab-group-tab-select=${({ detail }: DssTabGroupTabSelectEvent) => setActiveTab(detail.title)}
        @dss-tab-group-tab-close=${({ detail }: DssTabGroupTabCloseEvent) => {
          const filteredTabs = tabsState.filter(tab => tab.title !== detail.title);
          if (detail.title === activeTab) {
            setActiveTab(filteredTabs.find(tab => tab.title !== detail.title)?.title);
          }
          setTabsState(filteredTabs);
        }}
      ></dss-tab-group>
    </div>
  `;
};

export const Default: StoryObj<TabGroup> = {
  render: Template,
  args: {
    tabs: [
      {
        title: '0978944.010',
      },
      {
        title: '7248957.000',
      },
    ],
    activeTabTitle: '0978944.010',
  },
};

export const Folded: StoryObj<TabGroup> = {
  render: Template,
  args: {
    tabs: [
      {
        title: '0978944.010',
      },
      {
        title: '7248957.000',
      },
      {
        title: '0147852.000',
      },
      {
        title: '0233478.015',
      },
      {
        title: '0233479.015',
      },
      {
        title: '0233480.010',
      },
      {
        title: '0233445.017',
      },
    ],
    activeTabTitle: '7248957.000',
  },
};
