import './tab.component';
import Tab from './tab.component';
import { html } from 'lit';
import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
import docs from './tab.md?raw';
import { useArgs } from '@storybook/preview-api';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta<Tab> = {
  title: 'Components/Tab',
  component: 'dss-tab',
  argTypes: {
    title: { control: 'text' },
    isActive: { control: 'boolean' },
    isVisible: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
    actions: {
      handles: ['click'],
    },
  },
  decorators: [withActions<WebComponentsRenderer>],
};
export default meta;

const Template: StoryFn<Tab> = ({ title, isVisible }) => {
  const [{ isActive }, updateArgs] = useArgs();

  const handleTabClick = () => {
    updateArgs({ isActive: true });
  };

  return html`
    <dss-tab
      title=${title}
      ?isActive=${isActive}
      ?isVisible=${isVisible}
      @click=${handleTabClick}
    >
    </dss-tab>
  `;
};

export const Default: StoryObj<Tab> = {
  render: Template,
  args: {
    title: 'Tab Title',
    isActive: false,
    isVisible: true,
  }
}


