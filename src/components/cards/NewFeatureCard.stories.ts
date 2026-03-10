import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, waitFor } from 'storybook/test'
import { cardWidthDecorator, mockDateSetup } from './storybook_utils'
import NewFeatureCard from './NewFeatureCard.vue'

const meta = {
  title: 'Cards/NewFeatureCard',
  component: NewFeatureCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  ...mockDateSetup(new Date('March 15, 2026')),
} satisfies Meta<typeof NewFeatureCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText(/We have many new features planned/i)).toBeVisible())
  },
}
