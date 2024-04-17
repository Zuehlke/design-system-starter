import './input.component';
import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
import { html, TemplateResult } from 'lit-html';
import Input, { inputErrorStates, inputSizes } from './input.component';
import docs from './input.md?raw';
import docsDisabled from './input.disabled.md?raw';
import docsReadonly from './input.readonly.md?raw';
import docsTextarea from './input.textarea.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { when } from 'lit-html/directives/when.js';
import { withActions } from '@storybook/addon-actions/decorator';
import { labelPlacementOptions } from '../label/label.component';
import '../button/button.component';

const meta: Meta<Input> = {
  title: 'Components/Input',
  component: 'dss-input',
  parameters: {
    actions: {
      handles: ['change', 'dss-input-debounced'],
    },
    docs: {
      description: {
        component: docs,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/erelKF4Udm8mOGjNf6DvhH/Design-System-Showcase?type=design&node-id=5288-3191&mode=design&t=pKlU723mdRHYS6RD-4",
    },
  },
  decorators: [withActions<WebComponentsRenderer>],
  argTypes: {
    labelPlacement: {
      options: labelPlacementOptions,
      control: { type: 'select' },
    },
    errorState: {
      options: inputErrorStates,
      control: { type: 'select' },
    },
    size: {
      options: inputSizes,
      control: { type: 'select' },
    },
  },
};
export default meta;

type InputStory = Input & {
  placeholder?: string,
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  inputSlot?: TemplateResult,
  inputButtonSlot?: TemplateResult
};
const Template: StoryFn<InputStory> = ({
  label,
  size,
  placeholder,
  errorState,
  required,
  message,
  block,
  disabled,
  readonly,
  inputSlot,
  inputButtonSlot,
  countToMax,
  labelPlacement,
  hideMessage,
  loading,
}) => html`
  <dss-input
    label=${label}
    size=${size}
    errorState="${ifDefined(errorState)}"
    message="${ifDefined(message)}"
    ?hideMessage="${hideMessage}"
    ?block=${block}
    labelPlacement="${ifDefined(labelPlacement)}"
    countToMax="${ifDefined(countToMax)}"
    ?loading="${loading}"
  >
    ${when(inputSlot,
      () => inputSlot,
      () => html`
        <input
          placeholder=${ifDefined(placeholder)}
          ?required="${required}"
          ?disabled="${disabled}"
          ?readonly="${readonly}"
        >
      `,
    )}
    ${when(inputButtonSlot, () => inputButtonSlot)}
  </dss-input>
`;
export const Default: StoryObj<InputStory> = {
  render: Template,
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
};

export const Compact: StoryObj<InputStory> = {
  render: Template,
  args: {
    size: 'compact',
  },
};

export const Label: StoryObj<InputStory> = {
  render: Template,
  args: {
    label: 'Label',
  },
};

export const Required: StoryObj<InputStory> = {
  render: Template,
  args: {
    label: 'Required Input',
    required: true,
  },
};

export const Warning: StoryObj<InputStory> = {
  render: Template,
  args: {
    label: 'Input with warning',
    errorState: 'warning',
    message: 'This input is problematic',
  },
};

export const Error: StoryObj<InputStory> = {
  render: Template,
  args: {
    label: 'Input with error',
    errorState: 'error',
    message: 'This input is wrong',
  },
};

export const Placeholder: StoryObj<InputStory> = {
  render: Template,
  args: {
    placeholder: 'Placeholder',
  },
};

export const Readonly: StoryObj<InputStory> = {
  render: Template,
  args: {
    readonly: true,
  },
};
Readonly.parameters = {
  docs: {
    description: {
      story: docsReadonly,
    },
  },
};

export const Disabled: StoryObj<InputStory> = {
  render: Template,
  args: {
    disabled: true,
  },
};
Disabled.parameters = {
  docs: {
    description: {
      story: docsDisabled,
    },
  },
};

export const Loading: StoryObj<InputStory> = {
  render: Template,
  args: {
    loading: true,
  },
};

export const InputWithButton: StoryObj<InputStory> = {
  render: Template,
  args: {
    inputButtonSlot: html`
      <dss-button slot="input-button" type="icon-only">
        <dss-icon icon="date"></dss-icon>
      </dss-button>
    `,
  },
};

export const Textarea: StoryObj<InputStory> = {
  render: Template,
  args: {
    label: 'Textarea',
    countToMax: 255,
    inputSlot: html`
      <textarea placeholder="Write some text" ?required="${true}" rows="5" cols="30"></textarea>
    `,
  },
};
Textarea.parameters = {
  docs: {
    description: {
      story: docsTextarea,
    },
  },
};
