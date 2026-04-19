import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import CalendarEvent from './CalendarEvent.vue';

const meta = {
  title: 'Calendar/CalendarEvent',
  component: CalendarEvent,
  tags: ['autodocs'],
  argTypes: {
    invert: { control: 'boolean' },
  },
  args: {
    // "Late Arrival" is a real SHS special schedule name (see schedules.json)
    text: 'Late Arrival',
    invert: false,
  },
} satisfies Meta<typeof CalendarEvent>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Late Arrival')).toBeInTheDocument();
  },
};

export const Inverted: Story = {
  args: { invert: true },
};
