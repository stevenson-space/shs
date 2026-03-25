import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import AddSchedule from './AddSchedule.vue';

const meta = {
  title: 'Settings/AddSchedule/AddSchedule',
  component: AddSchedule,
  tags: ['autodocs'],
  args: { mode: 'add' },
} satisfies Meta<typeof AddSchedule>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Save Schedule')).toBeVisible();
    await expect(canvas.getByText('Add Period to All')).toBeVisible();
  },
};
