import './tab.component';
import Tab from './tab.component';
import { html } from 'lit-html';
import { Meta, StoryFn } from '@storybook/web-components';
import docs from './tab.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { useArgs } from '@storybook/addons';
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
  decorators: [withActions],
};
export default meta;

const Template: StoryFn<Tab> = ({ title, isVisible }) => {
  const [{ isActive }, updateArgs] = useArgs();

  const handleTabClick = () => {
    updateArgs({ isActive: true });
  };

  return html`
    <dss-tab
      .title=${ifDefined(title)}
      .isActive=${ifDefined(isActive)}
      .isVisible=${ifDefined(isVisible)}
      @click=${handleTabClick}
    >
    </dss-tab>
  `;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Tab Title',
  isActive: false,
  isVisible: true,
};


