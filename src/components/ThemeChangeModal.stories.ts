import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import ThemeChangeModal from './ThemeChangeModal.vue'

const meta = {
  title: 'Components/ThemeChangeModal',
  component: ThemeChangeModal,
  tags: ['autodocs'],
  argTypes: {
    showModal: { control: 'boolean' },
    newTheme: { control: 'object' },
    onTrue: { action: 'true' },
    onFalse: { action: 'false' },
    onClose: { action: 'close' },
  },
  args: {
    showModal: true,
    newTheme: {
      name: 'Ocean Blue',
      suggestedColor: '#3b82f6',
    },
  },
} satisfies Meta<typeof ThemeChangeModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { ThemeChangeModal },
    setup() {
      return { args }
    },
    template: `<ThemeChangeModal :show-modal="args.showModal" :new-theme="args.newTheme" @true="args.onTrue" @false="args.onFalse" @close="args.onClose" />`,
  }),
  args: {
    showModal: true,
    newTheme: {
      name: 'Ocean Blue',
      suggestedColor: '#3b82f6',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByText('Color Conflict')
    await expect(title).toBeVisible()
    const yesBtn = canvas.getByText('Yes')
    await expect(yesBtn).toBeVisible()
    const noBtn = canvas.getByText('No')
    await expect(noBtn).toBeVisible()
  },
}

export const Hidden: Story = {
  render: (args) => ({
    components: { ThemeChangeModal },
    setup() {
      return { args }
    },
    template: `<ThemeChangeModal :show-modal="args.showModal" :new-theme="args.newTheme" @true="args.onTrue" @false="args.onFalse" @close="args.onClose" />`,
  }),
  args: {
    showModal: false,
    newTheme: {
      name: 'Ocean Blue',
      suggestedColor: '#3b82f6',
    },
  },
}

export const DifferentTheme: Story = {
  render: (args) => ({
    components: { ThemeChangeModal },
    setup() {
      return { args }
    },
    template: `<ThemeChangeModal :show-modal="args.showModal" :new-theme="args.newTheme" @true="args.onTrue" @false="args.onFalse" @close="args.onClose" />`,
  }),
  args: {
    showModal: true,
    newTheme: {
      name: 'Sunset Red',
      suggestedColor: '#ef4444',
    },
  },
}
