import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, waitFor } from 'storybook/test'
import { cardWidthDecorator, mockDateSetup } from './storybook_utils'
import ShsHacksCard from './ShsHacksCard.vue'

const meta = {
  title: 'Cards/ShsHacksCard',
  component: ShsHacksCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  ...mockDateSetup(new Date('May 21, 2024')),
} satisfies Meta<typeof ShsHacksCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText(/Windy City Hacks/i)).toBeVisible())
  },
}
