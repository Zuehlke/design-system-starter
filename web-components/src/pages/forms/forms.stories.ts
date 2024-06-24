import { html } from 'lit';
import docs from './forms.md?raw';
import browserValidationDocs from './browserValidation.md?raw';
import libraryValidationDocs from './libraryValidation.md?raw';
import '../../components/input/input.component';
import '../../components/buttongroup/buttongroup.component';
import '../../components/toggleButton/toggleButton.component';
import '../../components/checkbox/checkbox.component';
import '../../components/datepicker/datepicker.component';
import '../../components/dropdown/dropdown.component';
import '../../components/menu/menu.component';
import '../../components/menuItem/menuItem.component';
import '../../components/multiselect/multiselect.component';
import { useState } from '@storybook/preview-api';
import * as yup from 'yup';
import { when } from 'lit/directives/when.js';
import { StoryFn, StoryObj } from '@storybook/web-components';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Pages/Forms',
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
};

function formDataToJson(data: FormData): Record<string, FormDataEntryValue | FormDataEntryValue[] | null> {
  return Object.fromEntries(Array.from(data.keys()).map((key) => [
    key,
    data.getAll(key).length > 1
      ? data.getAll(key)
      : data.get(key),
  ]));
}

const BrowserFormValidationTemplate: StoryFn = () => {
  const [formData, setFormData] = useState<any>(undefined);

  return html`
    <form
      name="simpleForm"
      @submit=${(event: SubmitEvent) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const form = document.querySelector('form')!;
        if (form.reportValidity()) {
          setFormData(formDataToJson(new FormData(form)));
        }
      }}
    >
      <div style="margin-bottom: var(--size-1)">
        <dss-dropdown label="Currency" name="currency" ?required="${true}">
          <dss-menu>
            <dss-menu-item value="chf">
              CHF
            </dss-menu-item>
            <dss-menu-item value="euro">
              €
            </dss-menu-item>
          </dss-menu>
        </dss-dropdown>
        <dss-multiselect
          name="person"
          label="Person"
          placeholder="Select an option"
          .options="${TestMultiselectOptions}"
        ></dss-multiselect>
        <dss-input label="First Name">
          <input name="firstName" required>
        </dss-input>
        <dss-input label="Last Name">
          <input name="lastName" required>
        </dss-input>
        <dss-input label="Age">
          <input name="age" type="number" min="16">
        </dss-input>
        <dss-button-group name="length" label="Length" ?required="${true}">
          <dss-toggle-button value="<15">&lt; 15min</dss-toggle-button>
          <dss-toggle-button value="15">15min</dss-toggle-button>
          <dss-toggle-button value="30">30min</dss-toggle-button>
          <dss-toggle-button value="45">45min</dss-toggle-button>
          <dss-toggle-button value=">45">&gt; 45min</dss-toggle-button>
        </dss-button-group>
        <dss-checkbox label="Check this box" .required="${true}" name="accepted"></dss-checkbox>
      </div>

      <dss-button
        type="secondary"
        .submit=${true}
      >
        Submit
      </dss-button>
    </form>
    <div style="margin-top: var(--size-1)">
      <pre>${JSON.stringify(formData, null, 2)}</pre>
    </div>
  `;
};

export const BrowserFormValidation: StoryObj = {
  render: BrowserFormValidationTemplate,
  parameters: {
    docs: {
      description: {
        component: browserValidationDocs,
      },
    },
  },
};

const schema = yup.object().shape({
  currency: yup.string()
    .oneOf(['chf', 'eur'], 'Please select one of the given options.')
    .required('Please select currency.'),
  name: yup.string().required('Please add a name.'),
  age: yup.number()
    .typeError('Please enter the age as a number.')
    .required('Please enter the age as a number.')
    .min(16, 'Age must be at least 16.')
    .max(118, 'Age must be below 118.'),
  createdAt: yup.date()
    .transform((value) => {
      if (isNaN(value)) {
        return undefined;
      }
      return value;
    })
    .default(() => new Date()),
  addEmail: yup.string(),
  email: yup.string().when('addEmail', {
    is: 'on',
    then: () => yup.string().required('Please enter an email address'),
    otherwise: () => yup.string(),
  }),
});

const LibraryFormValidationTemplate: StoryFn = () => {
  const [formData, setFormData] = useState<any>(undefined);
  const [errors, setErrors] = useState<any>({});
  const [addEmail, setAddEmail] = useState<boolean>(false);

  return html`
    <form
      name="complex"
      novalidate
      @submit=${(event: SubmitEvent) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const data = formDataToJson(new FormData(document.getElementsByName('complex')[0] as HTMLFormElement));
        schema
          .validate(data)
          .then((validatedData) => {
            setErrors({});
            setFormData(validatedData);
          })
          .catch(({ path, errors }) => {
            console.log('errored', errors);
            setErrors({ [path]: errors });
          });
      }}
    >
      <div>
        <dss-dropdown
          label="Currency"
          name="currency"
          .errorState="${errors['currency'] && 'error'}"
          message="${ifDefined(errors['currency'])}"
          required
        >
          <dss-menu>
            <dss-menu-item value="chf">CHF</dss-menu-item>
            <dss-menu-item value="eur">€</dss-menu-item>
          </dss-menu>
        </dss-dropdown>
        <dss-input label="Name" .errorState="${errors['name'] && 'error'}" message="${ifDefined(errors['name'])}">
          <input name="name" required>
        </dss-input>
        <dss-input label="Age" .errorState="${errors['age'] && 'error'}" message="${ifDefined(errors['age'])}">
          <input name="age" type="number" required>
        </dss-input>
        <dss-datepicker label="Created At" name="createdAt" value=""></dss-datepicker>
        <dss-checkbox
          label="Email"
          name="addEmail"
          @change="${() => setAddEmail(!addEmail)}"
          style="margin-top: var(--size-2);"
        ></dss-checkbox>
        ${when(addEmail, () => html`
          <dss-input
            label="Email"
            errorState="${errors['email'] && 'error'}"
            message="${ifDefined(errors['email'])}"
          >
            <input name="email" type="email" required>
          </dss-input>
        `)}
      </div>
      <dss-button style="margin-top: var(--size-2)" type="secondary" ?submit="${true}">
        Submit
      </dss-button>
    </form>
    <div style="margin-top: var(--size-1)">
      <pre>${JSON.stringify(formData, null, 2)}</pre>
    </div>
  `;
};

export const LibraryFormValidation: StoryObj = {
  render: LibraryFormValidationTemplate,
  parameters: {
    docs: {
      description: {
        component: libraryValidationDocs,
      },
    },
  },
};

const TestMultiselectOptions: String[] = [
  'Patrick',
  'Dan',
  'Christian',
  'Alexander',
  'Adrian',
];
