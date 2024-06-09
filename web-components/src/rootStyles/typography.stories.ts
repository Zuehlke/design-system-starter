import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

const meta: Meta = {
  title: 'Typography',
}

export default meta;

export const Default: StoryObj = {
  render: () => html`
    <small>Small</small>
    <p>Text</p>
    <h4>h4. Title</h4>
    <h3>h3. Title</h3>
    <h2>h2. Title</h2>
    <h1>h1. Title</h1>
  `,
}