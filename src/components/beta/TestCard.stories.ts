import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import TestCard from './TestCard.vue'

const meta = {
  title: 'Beta/TestCard',
  component: TestCard,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="background: #f2f2f7; padding: 24px; max-width: 320px;"><story /></div>',
    }),
  ],
  argTypes: {
    position: { control: { type: 'number', min: 1 } },
  },
  args: {
    position: 1,
  },
} satisfies Meta<typeof TestCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { TestCard },
    setup() {
      return { args }
    },
    template: '<TestCard :position="args.position" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Test Card 1')).toBeInTheDocument()
  },
}

export const AnotherCard: Story = {
  render: (args) => ({
    components: { TestCard },
    setup() {
      return { args }
    },
    template: '<TestCard :position="args.position" />',
  }),
  args: { position: 3 },
}
