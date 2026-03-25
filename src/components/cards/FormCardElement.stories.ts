import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import FormCardElement from './FormCardElement.vue';

const meta = {
  title: 'Cards/FormCardElement',
  component: FormCardElement,
  tags: ['autodocs'],
  argTypes: {
    submit: { control: 'boolean' },
  },
  args: {
    submit: false,
  },
} satisfies Meta<typeof FormCardElement>;

export default meta;
type Story = StoryObj<typeof meta>

function makeRender(slotContent: string) {
  return (args: Record<string, unknown>) => ({
    components: { FormCardElement },
    setup() { return { args }; },
    template: `<FormCardElement :submit="args.submit">${slotContent}</FormCardElement>`,
  });
}

export const Default: Story = {
  render: makeRender('<label>Name</label><input type="text" name="name" placeholder="Enter your name" />'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Name')).toBeInTheDocument();
    await expect(canvas.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  },
};

export const SubmitButton: Story = {
  render: makeRender('<span>Submit your response</span>'),
  args: {
    submit: true,
  },
};
