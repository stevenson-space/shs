import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import Contact from './Contact.vue';

const meta = {
  title: 'Settings/Contact',
  component: Contact,
  tags: ['autodocs'],
} satisfies Meta<typeof Contact>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Contact')).toBeInTheDocument();
    // Verify the real body text rendered by Contact.vue
    await expect(canvas.getByText(/visiting our contact form/i)).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /contact form/i })).toBeInTheDocument();
  },
};
