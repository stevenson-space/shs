import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import { fn, userEvent, within, expect } from 'storybook/test'
import ScrollSelector from './ScrollSelector.vue'

const timeOptions = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM']
const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const numberOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const meta = {
  title: 'Components/ScrollSelector',
  component: ScrollSelector,
  tags: ['autodocs'],
  argTypes: {
    options: { control: 'object' },
    modelValue: { control: 'text' },
    numOptionsAbove: { control: 'number' },
    fontSize: { control: 'text' },
  },
  args: {
    options: timeOptions,
    modelValue: '8:00 AM',
    numOptionsAbove: 1,
    fontSize: '1em',
    'onUpdate:modelValue': fn(),
  },
} satisfies Meta<typeof ScrollSelector>

export default meta
type Story = StoryObj<typeof meta>

function makeRender(initialValue: string) {
  return (args: Parameters<NonNullable<Story['render']>>[0]) => ({
    components: { ScrollSelector },
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
    template: `<ScrollSelector :options="args.options" :model-value="value" :num-options-above="args.numOptionsAbove" :font-size="args.fontSize" @update:modelValue="onUpdate" />`,
  })
}

export const Default: Story = {
  render: makeRender('8:00 AM'),
  args: {
    options: timeOptions,
    modelValue: '8:00 AM',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const selected = canvas.getByText('8:00 AM')
    await expect(selected).toBeVisible()
  },
}

export const DaySelector: Story = {
  render: makeRender('Wednesday'),
  args: {
    options: dayOptions,
    modelValue: 'Wednesday',
  },
}

export const NumberSelector: Story = {
  render: makeRender('5'),
  args: {
    options: numberOptions,
    modelValue: '5',
  },
}

export const TwoOptionsAbove: Story = {
  render: makeRender('8:00 AM'),
  args: {
    options: timeOptions,
    modelValue: '8:00 AM',
    numOptionsAbove: 2,
  },
}

export const LargerFontSize: Story = {
  render: makeRender('8:00 AM'),
  args: {
    options: timeOptions,
    modelValue: '8:00 AM',
    fontSize: '1.4em',
  },
}

export const FirstOptionSelected: Story = {
  render: makeRender('6:00 AM'),
  args: {
    options: timeOptions,
    modelValue: '6:00 AM',
  },
}

export const LastOptionSelected: Story = {
  render: makeRender('10:00 AM'),
  args: {
    options: timeOptions,
    modelValue: '10:00 AM',
  },
}
