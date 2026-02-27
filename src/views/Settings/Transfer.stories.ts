import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, userEvent } from 'storybook/test'
import Transfer from './Transfer.vue'

const meta = {
  title: 'Settings/Transfer',
  component: Transfer,
  tags: ['autodocs'],
} satisfies Meta<typeof Transfer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Transfer')).toBeInTheDocument()
    await expect(canvas.getByText('Send Data')).toBeInTheDocument()
    await expect(canvas.getByText('Receive Data')).toBeInTheDocument()
  },
}

export const SendPopup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sendButton = canvas.getByText('Send Data')
    await userEvent.click(sendButton)
    const popup = document.querySelector('.send-popup')
    await expect(popup).not.toBeNull()
    // The send popup shows "Choose what to send:" with transferable setting checkboxes
    await expect(document.querySelector('.send-popup .title')).not.toBeNull()
  },
}

export const ReceivePopup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const receiveButton = canvas.getByText('Receive Data')
    await userEvent.click(receiveButton)
    const popup = document.querySelector('.receive-popup')
    await expect(popup).not.toBeNull()
  },
}
