import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect, waitFor } from 'storybook/test';
import { cardWidthDecorator, mockDateSetup } from './storybook_utils';
import HolidayCard from './HolidayCard.vue';

const meta = {
  title: 'Cards/HolidayCard',
  component: HolidayCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  ...mockDateSetup(new Date('December 25, 2022')),
} satisfies Meta<typeof HolidayCard>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/Good luck on finals and have an amazing break/i)).toBeVisible());
  },
};
