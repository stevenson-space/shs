import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import { fn, expect, within } from 'storybook/test'
import ImageUpload from './ImageUpload.vue'

const meta = {
  title: 'Components/ImageUpload',
  component: ImageUpload,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    label: { control: 'text' },
    minAspectRatio: { control: 'number' },
    assetThumbnailSquare: { control: 'boolean' },
  },
  args: {
    modelValue: '',
    label: '',
    minAspectRatio: 2,
    assetSources: ['header-images/'],
    assetTitle: 'Browse Header Images',
    assetThumbnailSquare: false,
    'onUpdate:modelValue': fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof ImageUpload>

export default meta
type Story = StoryObj<typeof meta>

function makeRender(initialValue: string) {
  return (args: Parameters<NonNullable<Story['render']>>[0]) => ({
    components: { ImageUpload },
    setup() {
      const value = ref(initialValue)
      watch(() => args.modelValue, (val) => { value.value = val ?? '' })
      return {
        args,
        value,
        onUpdate: (val: string) => {
          value.value = val
          args['onUpdate:modelValue']?.(val)
        },
      }
    },
    template: `
      <div style="padding: 24px;">
        <ImageUpload
          :model-value="value"
          :label="args.label"
          :min-aspect-ratio="args.minAspectRatio"
          :asset-sources="args.assetSources"
          :asset-title="args.assetTitle"
          :asset-thumbnail-square="args.assetThumbnailSquare"
          @update:modelValue="onUpdate"
          @blur="args.onBlur"
        />
      </div>
    `,
  })
}

export const Default: Story = {
  render: makeRender(''),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const preview = canvasElement.querySelector('.image-preview') as HTMLElement
    await expect(preview).toBeInTheDocument()
    await expect(preview).toBeVisible()
  },
}

export const WithLabel: Story = {
  render: makeRender(''),
  args: {
    label: 'Header Image',
  },
}

export const ParticleAssetFolder: Story = {
  render: makeRender(''),
  args: {
    label: 'Particle Image',
    assetSources: ['particles/'],
    assetTitle: 'Browse Particle Images',
    assetThumbnailSquare: true,
  },
}
