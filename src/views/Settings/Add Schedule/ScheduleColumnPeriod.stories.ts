import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import { wrapDecorator } from '@/components/cards/storybook_utils'
import ScheduleColumnPeriod from './ScheduleColumnPeriod.vue'

const meta = {
  title: 'Settings/AddSchedule/ScheduleColumnPeriod',
  component: ScheduleColumnPeriod,
  tags: ['autodocs'],
  decorators: [wrapDecorator('width: 350px; padding: 20px;')],
  argTypes: {
    name: { control: 'text' },
    start: { control: 'text' },
    end: { control: 'text' },
    closed: { control: 'boolean' },
  },
  args: {
    // Period 3 from the real SHS Standard Schedule (Normal mode): 10:18 AM – 11:05 AM
    name: 'Period 3',
    start: '10:18',
    end: '11:05',
    closed: false,
  },
} satisfies Meta<typeof ScheduleColumnPeriod>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Period 3')).toBeInTheDocument()
  },
}

// Activity period from the Activity Period schedule: 10:06 AM – 10:49 AM
export const Closed: Story = {
  args: { closed: true, name: 'Activity', start: '10:06', end: '10:49' },
}
