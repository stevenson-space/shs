import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import { cardWidthDecorator } from './storybook_utils'
import ConfettiCard from './ConfettiCard.vue'

// Note: ConfettiCard script is fully commented out (legacy component).
// confettiMode is undefined so "Start 🎉" button renders; confetti functionality is non-functional.
const meta = {
  title: 'Cards/ConfettiCard',
  component: ConfettiCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
} satisfies Meta<typeof ConfettiCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Script is fully commented out; assert on visible text that is not split by child elements
    await expect(canvas.getByText(/Have a great summer!/i)).toBeInTheDocument()
  },
}
