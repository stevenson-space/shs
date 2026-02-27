import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, waitFor } from 'storybook/test'
import { cardWidthDecorator, mockDateSetup } from './storybook_utils'
import AprilFoolsCard from './AprilFoolsCard.vue'

const meta = {
  title: 'Cards/AprilFoolsCard',
  component: AprilFoolsCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  ...mockDateSetup(new Date('April 1, 2025 12:00:00')),
} satisfies Meta<typeof AprilFoolsCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText(/stevenson\.space will be terminating service/i)).toBeVisible())
  },
}
