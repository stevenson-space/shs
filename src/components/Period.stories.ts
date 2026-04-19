import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import Period from './Period.vue';

const meta = {
  title: 'Components/Period',
  component: Period,
  tags: ['autodocs'],
  argTypes: {
    period: { control: 'text' },
    start: { control: 'text' },
    end: { control: 'text' },
    invert: { control: 'boolean' },
    forceMobileLayout: { control: 'boolean' },
    disableProgressBar: { control: 'boolean' },
    tvSpace: { control: 'boolean' },
  },
  args: {
    period: '1',
    start: '7:00',
    end: '7:30',
    invert: false,
    forceMobileLayout: false,
    disableProgressBar: false,
    tvSpace: false,
  },
} satisfies Meta<typeof Period>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    period: '1',
    start: '7:00',
    end: '7:30',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('7:00')).toBeInTheDocument();
    await expect(canvas.getByText('7:30')).toBeInTheDocument();
  },
};

export const Inverted: Story = {
  args: {
    period: '2',
    start: '8:00',
    end: '8:45',
    invert: true,
  },
};

export const LunchPeriod: Story = {
  args: {
    period: 'Lunch',
    start: '11:30',
    end: '12:10',
  },
};

export const ActivityPeriod: Story = {
  args: {
    period: 'Activity Period',
    start: '2:00',
    end: '2:30',
  },
};

export const ForceMobileLayout: Story = {
  args: {
    period: '3',
    start: '9:00',
    end: '9:45',
    forceMobileLayout: true,
  },
};

export const ProgressBarDisabled: Story = {
  args: {
    period: '4',
    start: '7:00',
    end: '7:30',
    disableProgressBar: true,
  },
};
