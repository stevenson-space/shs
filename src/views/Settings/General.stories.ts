import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import General from './General.vue';

const meta = {
  title: 'Settings/General',
  component: General,
  tags: ['autodocs'],
} satisfies Meta<typeof General>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('General')).toBeInTheDocument();
    await expect(canvas.getByText(/Show PWC Schedule:/i)).toBeInTheDocument();
    await expect(canvas.getByText(/Default Schedule Mode:/i)).toBeInTheDocument();
    await expect(canvas.getByText(/Grade:/i)).toBeInTheDocument();
  },
};
