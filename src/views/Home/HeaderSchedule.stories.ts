import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import HeaderSchedule from './HeaderSchedule.vue';

const meta = {
  title: 'Home/HeaderSchedule',
  component: HeaderSchedule,
  tags: ['autodocs'],
  args: {
    inSchool: true,
    range: '10:18 – 11:05',
    period: 'Period 3',
    scheduleType: 'Standard Schedule',
    scheduleModes: [],
    fullScreenMode: false,
  },
} satisfies Meta<typeof HeaderSchedule>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('10:18 – 11:05')).toBeInTheDocument();
    await expect(canvas.getByText('Period 3')).toBeInTheDocument();
  },
};

export const NotInSchool: Story = {
  args: { inSchool: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Standard Schedule')).toBeInTheDocument();
  },
};

export const WithScheduleModes: Story = {
  args: {
    inSchool: true,
    scheduleModes: ['Normal', 'Half Periods'],
  },
};

export const FullScreen: Story = {
  args: {
    inSchool: true,
    scheduleModes: ['Normal', 'Half Periods'],
    fullScreenMode: true,
  },
};
