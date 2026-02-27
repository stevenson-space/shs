import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import { cardWidthDecorator } from './storybook_utils'
import TimedCard from './TimedCard.vue'

const meta = {
  title: 'Cards/TimedCard',
  component: TimedCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  args: {
    startTime: 'January 1, 2020',
    endTime: 'December 31, 2030',
  },
} satisfies Meta<typeof TimedCard>

export default meta
type Story = StoryObj<typeof meta>

function makeRender(slotText: string) {
  return (args: Record<string, unknown>) => ({
    components: { TimedCard },
    setup() { return { args } },
    template: `<TimedCard :startTime="args.startTime" :endTime="args.endTime">
      <p style="padding: 16px; margin: 0;">${slotText}</p>
    </TimedCard>`,
  })
}

export const Default: Story = {
  render: makeRender('This content appears during the active time window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/active time window/i)).toBeVisible()
  },
}

export const Hidden: Story = {
  render: makeRender('This content is outside the active time window.'),
  args: {
    startTime: 'January 1, 2020',
    endTime: 'January 2, 2020',
  },
}
