import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import HybridInfoModal from './HybridInfoModal.vue';

const meta = {
  title: 'Components/HybridInfoModal',
  component: HybridInfoModal,
  tags: ['autodocs'],
  argTypes: {
    scheduleType: { control: 'text' },
  },
  args: {
    scheduleType: 'Patriot Hybrid',
  },
} satisfies Meta<typeof HybridInfoModal>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    scheduleType: 'Patriot Hybrid',
  },
  play: async ({ canvasElement }) => {
    const infoIcon = canvasElement.querySelector('.info-circle') as HTMLElement;
    await expect(infoIcon).toBeInTheDocument();
    await expect(infoIcon).toBeVisible();
  },
};

export const RemoteLearning: Story = {
  args: {
    scheduleType: 'Remote Learning',
  },
};
