import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import { wrapDecorator } from '@/components/cards/storybook_utils'
import MultiDayPeriod from './MultiDayPeriod.vue'

// Based on the Early Dismissal Day schedule from schedules.json, which has two days:
// Day 1: periods 6, 2, 3, 4, Makeup — Day 2: periods 5, 1, 7, 8, Makeup
// Shared times (same each day): 8:30–9:10, 9:20–10:00, 10:10–10:50, 11:00–11:40, 11:40–12:30
const earlyDismissalTimes = {
  start: ['8:30', '9:20', '10:10', '11:00', '11:40'],
  end:   ['9:10', '10:00', '10:50', '11:40', '12:30'],
}

const meta = {
  title: 'BellSchedules/MultiDayPeriod',
  component: MultiDayPeriod,
  tags: ['autodocs'],
  decorators: [wrapDecorator('padding: 20px; max-width: 400px;')],
  args: {
    periods: ['6', '2', '3', '4', 'Makeup'],
    start: earlyDismissalTimes.start,
    end: earlyDismissalTimes.end,
    day: 1,
  },
} satisfies Meta<typeof MultiDayPeriod>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Day 1')).toBeInTheDocument()
  },
}

export const DayTwo: Story = {
  args: {
    periods: ['5', '1', '7', '8', 'Makeup'],
    start: earlyDismissalTimes.start,
    end: earlyDismissalTimes.end,
    day: 2,
  },
}
