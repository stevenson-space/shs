import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import { cardWidthDecorator } from './storybook_utils'
import ScheduleCard from './ScheduleCard.vue'

const mockSchedule = {
  start: ['7:45', '8:37', '9:32', '10:25', '11:18', '12:11', '13:04'],
  end:   ['8:32', '9:27', '10:20', '11:13', '12:06', '12:59', '13:52'],
  periods: ['1', '2', '3', '4', '5', '6', '7'],
}

const meta = {
  title: 'Cards/ScheduleCard',
  component: ScheduleCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  args: {
    title: 'Schedule',
  },
} satisfies Meta<typeof ScheduleCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // Renders only on school days — just verify component mounts without error
    await expect(canvasElement).toBeInTheDocument()
  },
}

export const WithSchedule: Story = {
  args: {
    schedule: mockSchedule,
    title: 'Today\'s Schedule',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Today's Schedule")).toBeInTheDocument()
    await expect(canvas.getByText('7:45')).toBeInTheDocument()
  },
}
