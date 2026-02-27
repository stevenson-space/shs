import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import { fn, userEvent, within, expect } from 'storybook/test'
import SliderInput from './SliderInput.vue'

const meta = {
  title: 'Components/SliderInput',
  component: SliderInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    label: { control: 'text' },
  },
  args: {
    modelValue: 50,
    min: 0,
    max: 100,
    step: 1,
    label: '',
    'onUpdate:modelValue': fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof SliderInput>

export default meta
type Story = StoryObj<typeof meta>

function makeRender(initialValue: number) {
  return (args: Parameters<NonNullable<Story['render']>>[0]) => ({
    components: { SliderInput },
    setup() {
      const value = ref(initialValue)
      watch(() => args.modelValue, (val) => { value.value = val })
      return {
        args,
        value,
        onUpdate: (val: number) => {
          value.value = val
          args['onUpdate:modelValue']?.(val)
        },
      }
    },
    template: `<SliderInput :model-value="value" :min="args.min" :max="args.max" :step="args.step" :label="args.label" @update:modelValue="onUpdate" @blur="args.onBlur" />`,
  })
}

export const Default: Story = {
  render: makeRender(50),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const numberInput = canvas.getByRole('spinbutton')
    await expect(numberInput).toBeVisible()
    await expect(numberInput).toHaveValue(50)
  },
}

export const WithLabel: Story = {
  render: makeRender(50),
  args: { label: 'Volume' },
}

export const AtMinimum: Story = {
  render: makeRender(0),
  args: { modelValue: 0 },
}

export const AtMaximum: Story = {
  render: makeRender(100),
  args: { modelValue: 100 },
}

export const CustomRange: Story = {
  render: makeRender(5),
  args: {
    modelValue: 5,
    min: 1,
    max: 10,
    step: 1,
    label: 'Rating',
  },
}

export const DecimalStep: Story = {
  render: makeRender(0.5),
  args: {
    modelValue: 0.5,
    min: 0,
    max: 1,
    step: 0.1,
    label: 'Opacity',
  },
}
