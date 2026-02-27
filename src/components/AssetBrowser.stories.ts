import type { Meta, StoryObj } from '@storybook/vue3'
import { fn, expect } from 'storybook/test'
import AssetBrowser from './AssetBrowser.vue'

const meta = {
  title: 'Components/AssetBrowser',
  component: AssetBrowser,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    folder: { control: 'select', options: ['header-images', 'particles'] },
  },
  args: {
    isOpen: true,
    folder: 'header-images',
    onClose: fn(),
    onSelect: fn(),
  },
} satisfies Meta<typeof AssetBrowser>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { AssetBrowser },
    setup() {
      return { args }
    },
    template: `<AssetBrowser :is-open="args.isOpen" :folder="args.folder" @close="args.onClose" @select="args.onSelect" />`,
  }),
  args: {
    isOpen: true,
    folder: 'header-images',
  },
  play: async () => {
    const title = await document.querySelector('.modal-header h3') as HTMLElement
    await expect(title).toBeInTheDocument()
    await expect(title).toHaveTextContent('Browse Header Images')
  },
}

export const ParticlesFolder: Story = {
  render: (args) => ({
    components: { AssetBrowser },
    setup() {
      return { args }
    },
    template: `<AssetBrowser :is-open="args.isOpen" :folder="args.folder" @close="args.onClose" @select="args.onSelect" />`,
  }),
  args: {
    isOpen: true,
    folder: 'particles',
  },
}
