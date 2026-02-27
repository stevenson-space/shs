import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import EventChip from './EventChip.vue'

const march15 = new Date(2026, 2, 15)
const april2 = new Date(2026, 3, 2)
const december31 = new Date(2026, 11, 31)

const meta = {
  title: 'Components/EventChip',
  component: EventChip,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    direction: { control: 'select', options: ['left', 'right'] },
    date: { control: false },
  },
  args: {
    name: 'Spring Concert',
    direction: 'left',
    date: march15,
  },
} satisfies Meta<typeof EventChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Spring Concert')).toBeInTheDocument()
    await expect(canvas.getByText('Mar')).toBeInTheDocument()
    await expect(canvas.getByText('15')).toBeInTheDocument()
  },
}

export const DirectionRight: Story = {
  args: {
    name: 'Science Fair',
    direction: 'right',
    date: april2,
  },
}

export const DirectionLeft: Story = {
  args: {
    name: 'Graduation Ceremony',
    direction: 'left',
    date: december31,
  },
}

export const LongEventName: Story = {
  args: {
    name: 'Annual Student Awards Night Ceremony and Celebration',
    direction: 'left',
    date: march15,
  },
}

export const NoDate: Story = {
  args: {
    name: 'TBD Event',
    direction: 'left',
    date: null as unknown as Date,
  },
}
