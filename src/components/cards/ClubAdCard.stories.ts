import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import { cardWidthDecorator } from './storybook_utils';
import ClubAdCard from './ClubAdCard.vue';

const meta = {
  title: 'Cards/ClubAdCard',
  component: ClubAdCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
} satisfies Meta<typeof ClubAdCard>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Computer Science Club/i)).toBeVisible();
  },
};
