import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import Privacy from './Privacy.vue'

const meta = {
  title: 'Settings/Privacy',
  component: Privacy,
  tags: ['autodocs'],
} satisfies Meta<typeof Privacy>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Privacy Policy')).toBeInTheDocument()
    // The privacy policy is embedded via an iframe pointing to iubenda
    const iframe = canvasElement.querySelector('iframe[title="Privacy Policy"]')
    await expect(iframe).not.toBeNull()
  },
}
