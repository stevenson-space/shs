import type { Meta, StoryObj } from '@storybook/vue3'
import { faStar, faBook } from '@fortawesome/free-solid-svg-icons'
import { fn, userEvent, within, expect } from 'storybook/test'
import { cardWidthDecorator } from './storybook_utils'
import IconTextCard from './IconTextCard.vue'

const meta = {
  title: 'Cards/IconTextCard',
  component: IconTextCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  argTypes: {
    text: { control: 'text' },
    invert: { control: 'boolean' },
  },
  args: {
    icon: faStar,
    text: 'Explore',
    invert: false,
    link: '',
    linkProps: {},
    iconProps: {},
    onClick: fn(),
  },
} satisfies Meta<typeof IconTextCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const text = canvas.getByText('Explore')
    await expect(text).toBeInTheDocument()
    await userEvent.click(text)
  },
}

export const WithLink: Story = {
  args: {
    text: 'Read More',
    icon: faBook,
    link: 'https://example.com',
  },
}

export const Inverted: Story = {
  args: {
    invert: true,
  },
}
