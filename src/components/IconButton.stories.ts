import type { Meta, StoryObj } from '@storybook/vue3'
import { faStar, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { fn, userEvent, within, expect } from 'storybook/test'
import IconButton from './IconButton.vue'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  args: {
    disabled: false,
    ariaLabel: 'Star',
    onClick: fn(),
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { IconButton },
    setup() {
      return { args, faStar }
    },
    template: `
      <IconButton :disabled="args.disabled" :aria-label="args.ariaLabel" @click="args.onClick">
        <font-awesome-icon :icon="faStar" />
      </IconButton>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button') as HTMLButtonElement
    await expect(button).toBeInTheDocument()
    await expect(button).not.toBeDisabled()
    await userEvent.click(button)
  },
}

export const Disabled: Story = {
  render: (args) => ({
    components: { IconButton },
    setup() {
      return { args, faStar }
    },
    template: `
      <IconButton :disabled="args.disabled" :aria-label="args.ariaLabel" @click="args.onClick">
        <font-awesome-icon :icon="faStar" />
      </IconButton>
    `,
  }),
  args: { disabled: true },
}

export const WithPencilIcon: Story = {
  render: (args) => ({
    components: { IconButton },
    setup() {
      return { args, faPencil }
    },
    template: `
      <IconButton :disabled="args.disabled" aria-label="Edit" @click="args.onClick">
        <font-awesome-icon :icon="faPencil" />
      </IconButton>
    `,
  }),
}


export const MultipleButtons: Story = {
  render: (args) => ({
    components: { IconButton },
    setup() {
      return { args, faStar, faPencil, faTrash }
    },
    template: `
      <div style="display: flex; gap: 8px;">
        <IconButton :disabled="args.disabled" aria-label="Edit" @click="args.onClick">
          <font-awesome-icon :icon="faPencil" />
        </IconButton>
        <IconButton :disabled="args.disabled" aria-label="Delete" @click="args.onClick">
          <font-awesome-icon :icon="faTrash" />
        </IconButton>
        <IconButton disabled aria-label="Star" @click="args.onClick">
          <font-awesome-icon :icon="faStar" />
        </IconButton>
      </div>
    `,
  }),
}
