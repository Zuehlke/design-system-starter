import './chooser.component';
import { html } from 'lit-html';
import Chooser, { SearchCategory } from './chooser.component';
import { makeBankFilterCategories, makeChooserData, makeReducedBankFilterCategories } from './makeData.story-utils';
import { Meta, StoryFn } from '@storybook/web-components';
import docs from './chooser.md?raw';
import { withActions } from '@storybook/addon-actions/decorator';

let categoriesSet = true;
const togglePayload = (): SearchCategory[] => {
  categoriesSet = !categoriesSet;
  return categoriesSet ? makeBankFilterCategories() : makeReducedBankFilterCategories();
};

export default {
  title: 'Components/Chooser',
  component: 'dss-chooser',
  argTypes: {
    toggleCategoriesPayload: {
      control: 'boolean',
      actionItems: togglePayload,
    },
  },
  parameters: {
    actions: {
      handles: ['dss-menu-selection'],
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
  decorators: [withActions],
} as Meta;

const Template: StoryFn<Chooser> = ({ data }: Chooser) => {
  const toggledPayload = togglePayload();

  return html`
    <dss-chooser
      .data=${data}
      .filterCategories=${toggledPayload}
      .filterFn=${filterPersonFn}
      .mapToDisplay=${mapPersonToString}
    ></dss-chooser>
  `;
};

export const Default = Template.bind({});

Default.args = {
  data: makeChooserData(10),
};

const filterPersonFn = (element: any, term: string): boolean => {
  const searchString = term.toLowerCase();

  const [last, first]: string[] = searchString.split(/\s*,\s*/);
  if (!last && !first) {
    return true;
  }

  const byLast = new RegExp('(' + last + ')', 'gi');
  const byFirst = new RegExp('(' + first + ')', 'gi');

  if (!first) {
    return byLast.test(element.lastName) || byLast.test(element.firstName);
  }
  return byLast.test(element.lastName) && byFirst.test(element.firstName);
};

const mapPersonToString = (elem: any): string => {
  return `${elem.lastName + ', ' + elem.firstName}`;
};
