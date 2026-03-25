import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import { cardWidthDecorator } from '@/components/cards/storybook_utils';
import TimerCard from './TimerCard.vue';

const meta = {
  title: 'Tools/TimerCard',
  component: TimerCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
} satisfies Meta<typeof TimerCard>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Timer')).toBeInTheDocument();
    await expect(canvas.getByText('Start')).toBeInTheDocument();
  },
};
