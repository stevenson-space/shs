import type { Meta, StoryObj } from '@storybook/vue3'
import { fn, within, expect } from 'storybook/test'
import { faPlus, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import RoundedButton from './RoundedButton.vue'

const meta = {
  title: 'Components/RoundedButton',
  component: RoundedButton,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    icon: { control: 'object' },
    invert: { control: 'boolean' },
    circular: { control: 'boolean' },
    showColor: { control: 'boolean' },
  },
  args: {
    text: 'Button',
    icon: null,
    invert: false,
    circular: true,
    showColor: true,
    onClick: fn(),
  },
} satisfies Meta<typeof RoundedButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Button')).toBeInTheDocument()
  },
}

export const WithIcon: Story = {
  args: {
    text: 'Add Item',
    icon: faPlus,
  },
}

export const Inverted: Story = {
  args: {
    text: 'Inverted',
    invert: true,
  },
}

export const InvertedWithIcon: Story = {
  args: {
    text: 'Favorite',
    icon: faStar,
    invert: true,
  },
}

export const NotCircular: Story = {
  args: {
    text: 'Submit',
    circular: false,
  },
}

export const NoColor: Story = {
  args: {
    text: 'Neutral',
    showColor: false,
  },
}

export const DestructiveAction: Story = {
  args: {
    text: 'Delete',
    icon: faTrash,
    invert: true,
  },
}
