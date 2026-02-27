import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import { cardWidthDecorator } from './storybook_utils'
import ImageTextCard from './ImageTextCard.vue'

const meta = {
  title: 'Cards/ImageTextCard',
  component: ImageTextCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  args: {
    image: 'https://picsum.photos/320/200',
    text: 'Explore Campus',
    link: 'https://example.com',
    linkProps: {},
  },
} satisfies Meta<typeof ImageTextCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Explore Campus')).toBeInTheDocument()
  },
}

export const WithDescription: Story = {
  args: {
    text: 'School Map',
    desc: 'Interactive campus guide',
    image: 'https://picsum.photos/320/200?random=2',
    link: 'https://example.com/map',
  },
}
