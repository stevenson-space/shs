import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import { wrapDecorator } from '@/components/cards/storybook_utils';
import ScheduleColumn from './ScheduleColumn.vue';

// Periods from the real SHS Standard Schedule (Normal mode) — periods 1 & 2
// Period 1: 8:30–9:21, Period 2: 9:26–10:13
// ScheduleColumn uses period objects with { name, start, end } where name is a user-given course label
const mockPeriods = [
  { name: 'English', start: '8:30', end: '9:21' },
  { name: 'Chemistry', start: '9:26', end: '10:13' },
];

const meta = {
  title: 'Settings/AddSchedule/ScheduleColumn',
  component: ScheduleColumn,
  tags: ['autodocs'],
  decorators: [wrapDecorator('padding: 20px; min-width: 420px;')],
  // "Standard Schedule" is the real SHS schedule type name used in schedules.json
  args: { name: 'Standard Schedule', isEnabled: true, periods: mockPeriods },
} satisfies Meta<typeof ScheduleColumn>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Standard Schedule')).toBeInTheDocument();
    await expect(canvas.getByText('English')).toBeInTheDocument();
  },
};

export const Disabled: Story = { args: { isEnabled: false } };

export const Empty: Story = { args: { periods: [] } };
