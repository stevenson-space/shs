import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import { wrapDecorator } from '@/components/cards/storybook_utils';
import { makeDates } from './storybook_utils';
import CalendarMain from './CalendarMain.vue';

const mar2026Dates = makeDates(2026, 2, new Date(2026, 2, 15));

const meta = {
  title: 'Calendar/CalendarMain',
  component: CalendarMain,
  tags: ['autodocs'],
  argTypes: {
    dates: { control: 'object' },
    filterCategories: { control: 'object' },
  },
  args: {
    month: 'March',
    year: 2026,
    dates: mar2026Dates,
    filterCategories: [],
  },
  decorators: [wrapDecorator('min-width: 700px;')],
} satisfies Meta<typeof CalendarMain>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Sunday')).toBeInTheDocument();
  },
};

export const WithFilterCategories: Story = {
  args: {
    filterCategories: ['All', 'Fine Arts', 'Athletics', 'CCC', 'Clubs and Activities', 'Activity Period', 'Non-Attendance Days'],
  },
};
