import type { Meta, StoryObj } from '@storybook/vue3';
import { fn, within, expect } from 'storybook/test';
import { wrapDecorator } from '@/components/cards/storybook_utils';
import CalendarNavigation from './CalendarNavigation.vue';

const meta = {
  title: 'Calendar/CalendarNavigation',
  component: CalendarNavigation,
  tags: ['autodocs'],
  argTypes: {
    filterCategories: { control: 'object' },
  },
  args: {
    month: 'March',
    year: 2026,
    filterCategories: [],
    onPreviousMonth: fn(),
    onNextMonth: fn(),
    onFilterSelected: fn(),
  },
  decorators: [wrapDecorator('position: relative; min-width: 600px;')],
} satisfies Meta<typeof CalendarNavigation>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('March')).toBeInTheDocument();
    await expect(canvas.getByText('2026')).toBeInTheDocument();
  },
};

export const WithFilters: Story = {
  args: {
    filterCategories: ['All', 'Fine Arts', 'Athletics', 'CCC', 'Clubs and Activities', 'Activity Period', 'Non-Attendance Days'],
  },
};
