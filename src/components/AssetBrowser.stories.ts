import type { Meta, StoryObj } from '@storybook/vue3'
import { fn, expect } from 'storybook/test'
import AssetBrowser from './AssetBrowser.vue'

const meta = {
  title: 'Components/AssetBrowser',
  component: AssetBrowser,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    thumbnailSquare: { control: 'boolean' },
  },
  args: {
    isOpen: true,
    sources: ['header-images/'],
    title: 'Browse Header Images',
    thumbnailSquare: false,
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
    template: `<AssetBrowser :is-open="args.isOpen" :sources="args.sources" :title="args.title" :thumbnail-square="args.thumbnailSquare" @close="args.onClose" @select="args.onSelect" />`,
  }),
  args: {
    isOpen: true,
    sources: ['header-images/'],
    title: 'Browse Header Images',
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
    template: `<AssetBrowser :is-open="args.isOpen" :sources="args.sources" :title="args.title" :thumbnail-square="args.thumbnailSquare" @close="args.onClose" @select="args.onSelect" />`,
  }),
  args: {
    isOpen: true,
    sources: ['particles/'],
    title: 'Browse Particle Images',
    thumbnailSquare: true,
  },
}
