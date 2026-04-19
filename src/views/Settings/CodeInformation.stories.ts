import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import CodeInformation from './CodeInformation.vue';

const meta = {
  title: 'Settings/CodeInformation',
  component: CodeInformation,
  tags: ['autodocs'],
} satisfies Meta<typeof CodeInformation>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Code Contribution')).toBeInTheDocument();
    // Verify the real body text: the site is open source and links to GitHub
    await expect(canvas.getByText(/open sourced/i)).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Github' })).toBeInTheDocument();
  },
};
