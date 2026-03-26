import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import CountdownCircle from './CountdownCircle.vue'

const meta = {
  title: 'Home/CountdownCircle',
  component: CountdownCircle,
  tags: ['autodocs'],
  argTypes: {
    inSchool: { control: 'boolean' },
  },
  args: {
    inSchool: true,
    countdown: '3:47',
    range: '8:30 – 9:21',
    nextDay: 'Monday,\nMarch 2',
    scheduleType: 'Standard Schedule',
    fullScreenMode: false,
    theme: { name: 'light' }, // ✅ Always pass theme
  },
} satisfies Meta<typeof CountdownCircle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('3:47')).toBeInTheDocument()
    await expect(canvas.getByText('Standard Schedule')).toBeInTheDocument()
  },
}

export const OutOfSchool: Story = {
  args: { inSchool: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/Monday/i)).toBeInTheDocument()
  },
}

export const FullScreen: Story = {
  args: { fullScreenMode: true },
}

export const NoNextDay: Story = {
  args: {
    inSchool: false,
    nextDay: null,
  },
}

export const PromTheme: Story = {
  args: {
    theme: { name: 'prom' },
  },
}