import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import Schedules from './Schedules.vue'

const meta = {
  title: 'Settings/Schedules',
  component: Schedules,
  tags: ['autodocs'],
} satisfies Meta<typeof Schedules>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Schedules')).toBeInTheDocument()
    // The "Restore to Defaults" button appears in the heading on desktop;
    // "Restore" appears on mobile — either may render depending on viewport
    const restoreButton = canvasElement.querySelector('.restore-button')
    await expect(restoreButton).not.toBeNull()
    await expect(canvas.getByText(/Add Custom/i)).toBeInTheDocument()
  },
}
