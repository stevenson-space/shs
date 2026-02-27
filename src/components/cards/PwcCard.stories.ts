import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, waitFor } from 'storybook/test'
import { cardWidthDecorator, mockDateSetup } from './storybook_utils'
import PwcCard from './PwcCard.vue'

const meta = {
  title: 'Cards/PwcCard',
  component: PwcCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
} satisfies Meta<typeof PwcCard>

export default meta
type Story = StoryObj<typeof meta>

// Default — real time, real state (no date mock)
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('PWC')).toBeInTheDocument()
  },
}

// Open — Monday Feb 23 2026 at 5:00 PM. Mon hours: 3:30 PM–8:00 PM → isOpen true.
// closedDays only contains 2024 dates, so this date is safe.
export const Open: Story = {
  ...mockDateSetup(new Date(2026, 1, 23, 17, 0, 0)),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText('Time remaining until closure')).toBeInTheDocument())
  },
}

// ClosedAfterHours — Monday Feb 23 2026 at 9:00 AM. Before opening (3:30 PM) → isOpen false.
export const ClosedAfterHours: Story = {
  ...mockDateSetup(new Date(2026, 1, 23, 9, 0, 0)),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText(/Opens at/)).toBeInTheDocument())
  },
}

// Weekend — Saturday Feb 21 2026 at noon. Sat hours: 10:00 AM–2:00 PM → isOpen true.
export const Weekend: Story = {
  ...mockDateSetup(new Date(2026, 1, 21, 12, 0, 0)),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText('Time remaining until closure')).toBeInTheDocument())
  },
}
