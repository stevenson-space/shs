import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import TestCard from './TestCard.vue'
import CardPreview from './CardPreview.vue'

const meta = {
  title: 'Beta/TestCard',
  component: TestCard,
  tags: ['autodocs'],
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
    components: { TestCard, CardPreview },
    setup() {
      return { args }
    },
    template: `
      <CardPreview>
        <TestCard :position="args.position" />
      </CardPreview>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Test Card 1')).toBeInTheDocument()
  },
}

export const AnotherCard: Story = {
  render: (args) => ({
    components: { TestCard, CardPreview },
    setup() {
      return { args }
    },
    template: `
      <CardPreview>
        <TestCard :position="args.position" />
      </CardPreview>
    `,
  }),
  args: { position: 3 },
}
