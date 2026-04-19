import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, waitFor } from 'storybook/test';
import TimePicker from './TimePicker.vue';

const meta = {
  title: 'Settings/AddSchedule/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { TimePicker },
    mounted() {
      // Options from the real SHS Standard Schedule (Normal mode) start times — periods 1–8
      // Used to pre-populate period start time choices when a user edits their custom schedule
      const options = [
        { text: 'Period 1', time: '8:30', scheduleMode: 'Normal', name: '1' },
        { text: 'Period 2', time: '9:26', scheduleMode: 'Normal', name: '2' },
        { text: 'Period 3', time: '10:18', scheduleMode: 'Normal', name: '3' },
        { text: 'Period 4', time: '11:10', scheduleMode: 'Normal', name: '4' },
        { text: 'Period 5', time: '12:02', scheduleMode: 'Normal', name: '5' },
        { text: 'Period 6', time: '12:54', scheduleMode: 'Normal', name: '6' },
        { text: 'Period 7', time: '13:46', scheduleMode: 'Normal', name: '7' },
        { text: 'Period 8', time: '14:38', scheduleMode: 'Normal', name: '8' },
      ]
      // Pre-select 9:26 (Period 2 start) as the active time in the picker
      ;(this.$refs.picker as any).pickTime(options, '9:26').catch(() => {});
    },
    template: '<TimePicker ref="picker" />',
  }),
  play: async ({ canvasElement }) => {
    // TimePicker renders inside a Popup (teleport) — check document body
    await waitFor(() => {
      const picker = document.querySelector('.time-picker');
      expect(picker).not.toBeNull();
    });
  },
};
