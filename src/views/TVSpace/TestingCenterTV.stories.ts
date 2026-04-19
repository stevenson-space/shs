import type { Meta, StoryObj } from '@storybook/vue3';
import { within, waitFor, expect } from 'storybook/test';
import useClockStore from '@/stores/clock';
import TestingCenterTV from './TestingCenterTV.vue';

// The component is designed exclusively for 1920×1080. Scale it down to fit the Storybook canvas.
const scaleDecorator = () => ({
  template: `<div style="width:1000px;height:562px;overflow:hidden;position:relative;">
    <div style="transform:scale(0.52);transform-origin:top left;width:1920px;height:1080px;position:absolute;">
      <story />
    </div>
  </div>`,
});

const meta = {
  title: 'TVSpace/TestingCenterTV',
  component: TestingCenterTV,
  tags: ['autodocs'],
  decorators: [scaleDecorator],
} satisfies Meta<typeof TestingCenterTV>;

export default meta;
type Story = StoryObj<typeof meta>

// Wed March 4, 2026, 10:30 AM — Period 3 in session (10:18–11:05), Standard Schedule
const MOCK_DATE = new Date(2026, 2, 4, 10, 30, 0);

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // Patch clock store — must happen in play, not beforeEach, because Pinia
    // isn't active until the Vue app mounts
    const clockStore = useClockStore();
    clockStore.stopClock(); // freeze the interval so the time doesn't drift
    clockStore.$patch({
      urlDate: MOCK_DATE,
      startTime: MOCK_DATE.getTime(),
      currentTime: MOCK_DATE.getTime(),
    });
    // waitFor the reactive re-render triggered by the store patch
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('10:30 AM')).toBeInTheDocument());
    await expect(canvas.getByText('WEDNESDAY, MARCH 4')).toBeInTheDocument();
    await expect(canvas.getByText('STANDARD SCHEDULE')).toBeInTheDocument();
  },
};
