import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import { expect, within } from 'storybook/test'
import ColorPicker from './ColorPicker.vue'

const meta = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    allowInherit: { control: 'boolean' },
    disableInlineButton: { control: 'boolean' },
    placeholder: { control: 'text' },
    propertyPath: { control: 'text' },
    label: { control: 'text' },
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
  args: {
    modelValue: '#3b82f6',
    allowInherit: true,
    disableInlineButton: false,
    placeholder: 'Color value',
    propertyPath: '',
    label: '',
  },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

function makeRender(initialValue: string) {
  return (args: Parameters<NonNullable<Story['render']>>[0]) => ({
    components: { ColorPicker },
    setup() {
      const value = ref(initialValue)
      watch(() => args.modelValue, (val) => { value.value = val })
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
      <div style="padding: 24px; max-width: 300px;">
        <ColorPicker
          :model-value="value"
          :allow-inherit="args.allowInherit"
          :disable-inline-button="args.disableInlineButton"
          :placeholder="args.placeholder"
          :property-path="args.propertyPath"
          :label="args.label"
          @update:modelValue="onUpdate"
        />
      </div>
    `,
  })
}

export const Default: Story = {
  render: makeRender('#3b82f6'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await expect(input).toBeVisible()
    await expect(input).toHaveValue('#3b82f6')
  },
}

export const WithLabel: Story = {
  render: makeRender('#3b82f6'),
  args: {
    label: 'Accent Color',
  },
}

export const InheritMode: Story = {
  render: makeRender(''),
  args: {
    modelValue: '',
    allowInherit: true,
  },
}

export const InheritDisabled: Story = {
  render: makeRender('#e11d48'),
  args: {
    modelValue: '#e11d48',
    allowInherit: false,
  },
}

export const InlineButtonDisabled: Story = {
  render: makeRender('#10b981'),
  args: {
    modelValue: '#10b981',
    disableInlineButton: true,
  },
}

export const WithPropertyPath: Story = {
  render: makeRender(''),
  args: {
    modelValue: '',
    propertyPath: 'text.primary',
    label: 'Primary Text',
  },
}

export const VarInheritance: Story = {
  render: makeRender('var(--accent)'),
  args: {
    modelValue: 'var(--accent)',
    label: 'Inheriting Accent',
  },
}
