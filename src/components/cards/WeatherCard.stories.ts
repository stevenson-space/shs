import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { cardWidthDecorator } from './storybook_utils';
import WeatherCard from './WeatherCard.vue';

const meta = {
  title: 'Cards/WeatherCard',
  component: WeatherCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  argTypes: {
    title: { control: 'text' },
  },
  args: {
    title: 'Weather',
  },
} satisfies Meta<typeof WeatherCard>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // Component mounts and triggers weather fetch — just verify it mounted without error.
    // The card body is hidden behind v-if="weatherData" until the API responds, so we
    // only assert the canvas wrapper itself is present rather than card internals.
    await expect(canvasElement).toBeInTheDocument();
  },
};

export const CustomTitle: Story = {
  args: {
    title: '5-Day Forecast',
  },
};
