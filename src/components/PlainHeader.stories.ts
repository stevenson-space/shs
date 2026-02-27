import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import PlainHeader from './PlainHeader.vue'

const meta = {
  title: 'Components/PlainHeader',
  component: PlainHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
  },
  args: {
    title: 'Page Title',
  },
} satisfies Meta<typeof PlainHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Page Title')).toBeInTheDocument()
  },
}

export const LongTitle: Story = {
  args: {
    title: 'This Is a Very Long Page Title That May Overflow',
  },
}

export const ShortTitle: Story = {
  args: {
    title: 'Home',
  },
}
