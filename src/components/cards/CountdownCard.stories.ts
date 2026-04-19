import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import { cardWidthDecorator } from './storybook_utils';
import CountdownCard from './CountdownCard.vue';

const meta = {
  title: 'Cards/CountdownCard',
  component: CountdownCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  args: {
    untilDate: 'January 1, 2027',
    message: 'Days until the new year!',
  },
} satisfies Meta<typeof CountdownCard>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Days until the new year/i)).toBeInTheDocument();
    // Verify countdown unit labels are showing — use getAllByText since "days" appears in both h3 and unit label
    await expect(canvas.getAllByText(/days/i)[0]).toBeInTheDocument();
  },
};

export const NoMessage: Story = {
  args: {
    message: undefined,
  },
};
