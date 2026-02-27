import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, waitFor } from 'storybook/test'
import { cardWidthDecorator, mockDateSetup } from './storybook_utils'
import ContributeCard from './ContributeCard.vue'

const meta = {
  title: 'Cards/ContributeCard',
  component: ContributeCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  ...mockDateSetup(new Date(2024, 9, 1)),
} satisfies Meta<typeof ContributeCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText(/For people interested in becoming a dedicated contributor/i)).toBeVisible())
  },
}
