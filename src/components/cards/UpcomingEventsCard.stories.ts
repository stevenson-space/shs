import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, waitFor } from 'storybook/test'
import { cardWidthDecorator } from './storybook_utils'
import UpcomingEventsCard from './UpcomingEventsCard.vue'

const meta = {
  title: 'Cards/UpcomingEventsCard',
  component: UpcomingEventsCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
} satisfies Meta<typeof UpcomingEventsCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText('Upcoming Events')).toBeVisible(), { timeout: 3000 })
  },
}
