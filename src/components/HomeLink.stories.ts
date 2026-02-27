import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import HomeLink from './HomeLink.vue'

const meta = {
  title: 'Components/HomeLink',
  component: HomeLink,
  tags: ['autodocs'],
  argTypes: {
    invert: { control: 'boolean' },
  },
  args: {
    invert: true,
  },
} satisfies Meta<typeof HomeLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Home')).toBeInTheDocument()
    const link = canvasElement.querySelector('.home') as HTMLElement
    await expect(link).toBeInTheDocument()
    await expect(link).toHaveClass('invert')
  },
}

export const Inverted: Story = {
  args: { invert: true },
}

export const NotInverted: Story = {
  args: { invert: false },
}
