import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  enableShortcuts: false,
  theme: {
    ...themes.normal,
    brandTitle: 'Design System Starter',
    brandUrl: '/',
    brandTarget: '_self',
  },
});
