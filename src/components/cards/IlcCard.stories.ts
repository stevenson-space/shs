import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, waitFor } from 'storybook/test'
import { cardWidthDecorator, mockDateSetup } from './storybook_utils'
import IlcCard from './IlcCard.vue'

const meta = {
  title: 'Cards/IlcCard',
  component: IlcCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  args: {
    rentroom: "Rent a room?",
    documents: [
        {link: 'https://d125.libanswers.com/faq/376376'}
    ]
  }
} satisfies Meta<typeof IlcCard>

export default meta
type Story = StoryObj<typeof meta>

// Default — real time, real state (no date mock)
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('ILC')).toBeInTheDocument()
  },
}

// Open — Monday Feb 23 2026 at 5:00 PM. Mon hours: 3:30 PM–8:00 PM → isOpen true.
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

// Weekend — closed → isOpen false.
export const Weekend: Story = {
  ...mockDateSetup(new Date(2026, 1, 23, 9, 0, 0)),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText(/Opens at/)).toBeInTheDocument())
  },
}

export const MultipleDocuments: Story = {
  args: {
    rentroom: 'Rent a Room?',
    documents: [
      { title: 'Unit 1 Notes', link: 'https://d125.libanswers.com/faq/376376' },
    ],
  },
}
