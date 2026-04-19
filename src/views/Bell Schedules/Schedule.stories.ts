import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import Schedule from './Schedule.vue';

// Real SHS Standard Schedule from schedules.json — periods 1–8, 8:30 AM–3:25 PM
const standardSchedule = {
  name: 'Standard Schedule',
  modes: [
    {
      name: 'Normal',
      start: ['8:30', '9:26', '10:18', '11:10', '12:02', '12:54', '13:46', '14:38'],
      end: ['9:21', '10:13', '11:05', '11:57', '12:49', '13:41', '14:33', '15:25'],
      periods: ['1', '2', '3', '4', '5', '6', '7', '8'],
    },
    {
      name: 'Half Periods',
      start: ['8:30', '9:01', '9:26', '9:53', '10:18', '10:45', '11:10', '11:37', '12:02', '12:29', '12:54', '13:21', '13:46', '14:13', '14:38', '15:05'],
      end: ['8:54', '9:21', '9:46', '10:13', '10:38', '11:05', '11:30', '11:57', '12:22', '12:49', '13:14', '13:41', '14:06', '14:33', '14:58', '15:25'],
      periods: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B'],
    },
  ],
};

const meta = {
  title: 'BellSchedules/Schedule',
  component: Schedule,
  tags: ['autodocs'],
  args: { schedule: standardSchedule },
} satisfies Meta<typeof Schedule>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Standard Schedule')).toBeInTheDocument();
  },
};

// Real SHS Activity Period schedule — includes an Activity period between periods 2 and 3
export const ActivityPeriod: Story = {
  args: {
    schedule: {
      name: 'Activity Period',
      modes: [
        {
          name: 'Normal',
          start: ['8:30', '9:20', '10:06', '10:54', '11:40', '12:26', '13:12', '13:58', '14:44'],
          end: ['9:15', '10:01', '10:49', '11:35', '12:21', '13:07', '13:53', '14:39', '15:25'],
          periods: ['1', '2', '!Activity', '3', '4', '5', '6', '7', '8'],
        },
        {
          name: 'Half Periods',
          start: ['8:30', '8:58', '9:20', '9:44', '10:06', '10:54', '11:18', '11:40', '12:04', '12:26', '12:50', '13:12', '13:36', '13:58', '14:22', '14:44', '15:08'],
          end: ['8:51', '9:15', '9:37', '10:01', '10:49', '11:11', '11:35', '11:57', '12:21', '12:43', '13:07', '13:29', '13:53', '14:15', '14:39', '15:01', '15:25'],
          periods: ['1A', '1B', '2A', '2B', '!Activity', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B'],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Activity Period')).toBeInTheDocument();
  },
};
