import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect, waitFor } from 'storybook/test';
import { cardWidthDecorator, mockDateSetup } from './storybook_utils';
import EndOfYearCard from './EndOfYearCard.vue';

const meta = {
  title: 'Cards/EndOfYearCard',
  component: EndOfYearCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  ...mockDateSetup(new Date('May 20, 2025')),
} satisfies Meta<typeof EndOfYearCard>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/Thank you to everyone who used Stevenson\.Space this year/i)).toBeVisible());
  },
};
