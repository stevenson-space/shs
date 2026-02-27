import type { Meta, StoryObj } from '@storybook/vue3'
import { expect } from 'storybook/test'
import Header from './Header.vue'

const meta = {
  title: 'Home/Header',
  component: Header,
  tags: ['autodocs'],
  args: { fullScreenMode: false },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.header')).not.toBeNull()
  },
}
