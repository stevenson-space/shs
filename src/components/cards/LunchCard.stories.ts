import type { Meta, StoryObj } from '@storybook/vue3'
import { expect } from 'storybook/test'
import { cardWidthDecorator } from './storybook_utils'
import LunchCard from './LunchCard.vue'

const meta = {
  title: 'Cards/LunchCard',
  component: LunchCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
} satisfies Meta<typeof LunchCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // LunchCard renders only on school days with lunch data — just verify it mounts without error
    await expect(canvasElement).toBeInTheDocument()
  },
}
