import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import { wrapDecorator } from '@/components/cards/storybook_utils';
import { makeDates } from './storybook_utils';
import CalendarMobile from './CalendarMobile.vue';

const mar2026Dates = makeDates(2026, 2, new Date(2026, 2, 15));

const meta = {
  title: 'Calendar/CalendarMobile',
  component: CalendarMobile,
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
  decorators: [wrapDecorator('max-width: 400px;')],
} satisfies Meta<typeof CalendarMobile>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Sun')).toBeInTheDocument();
  },
};
