import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import { wrapDecorator } from '@/components/cards/storybook_utils';
import CalendarDate from './CalendarDate.vue';

const meta = {
  title: 'Calendar/CalendarDate',
  component: CalendarDate,
  tags: ['autodocs'],
  argTypes: {
    date: { control: 'number' },
    schedule: { control: 'object' },
    events: { control: 'object' },
    isToday: { control: 'boolean' },
  },
  args: {
    date: 15,
    schedule: null,
    events: [],
    isToday: false,
  },
  decorators: [wrapDecorator('width: 120px; padding: 4px; border: 1px solid #ccc;')],
} satisfies Meta<typeof CalendarDate>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('15')).toBeInTheDocument();
  },
};

export const Today: Story = {
  args: {
    date: 15,
    isToday: true,
    events: [],
  },
};

export const WithSchedule: Story = {
  args: {
    date: 12,
    // Late Arrival is a real special schedule at SHS (e.g., 3/12/2026)
    schedule: { name: 'Late Arrival', isSpecial: true, dates: ['3/12/2026'], modes: [] },
    events: [],
  },
};

export const WithEvents: Story = {
  args: {
    date: 5,
    events: [
      // Real SHS events from 3/5/2026
      { name: 'Activity Period (Junior Core Curriculum)', start: new Date('2026-03-05').getTime(), allDay: true, categories: ['Activity Period'] },
      { name: 'Winter Band Concert', start: new Date('2026-03-05T19:00:00').getTime(), end: new Date('2026-03-05T21:00:00').getTime(), allDay: false, location: 'Performing Arts Center', categories: ['Fine Arts'] },
    ],
  },
};
