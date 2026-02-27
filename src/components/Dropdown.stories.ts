import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import { fn, userEvent, within, expect, waitFor } from 'storybook/test'
import Dropdown from './Dropdown.vue'

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    options: { control: 'object' },
    modelValue: { control: 'number' },
    showSelectedAsOption: { control: 'boolean' },
    align: { control: 'select', options: ['left', 'right', 'center'] },
    direction: { control: 'select', options: ['up', 'down'] },
  },
  args: {
    options: ['Option A', 'Option B', 'Option C'],
    modelValue: 0,
    showSelectedAsOption: true,
    align: 'right',
    direction: 'down',
    'onUpdate:modelValue': fn(),
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

function makeRender(initialIndex: number) {
  return (args: Parameters<NonNullable<Story['render']>>[0]) => ({
    components: { Dropdown },
    setup() {
      const value = ref(initialIndex)
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
    template: `<Dropdown :options="args.options" :model-value="value" :show-selected-as-option="args.showSelectedAsOption" :align="args.align" :direction="args.direction" @update:modelValue="onUpdate" />`,
  })
}

export const Default: Story = {
  render: makeRender(0),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByText('Option A')
    await expect(trigger).toBeVisible()

    await userEvent.click(trigger)
    const optionB = canvas.getByText('Option B')
    await waitFor(() => expect(optionB).toBeVisible())

    await userEvent.click(optionB)
  },
}

export const SecondOptionSelected: Story = {
  render: makeRender(1),
  args: { modelValue: 1 },
}

export const HideSelectedAsOption: Story = {
  render: makeRender(0),
  args: { showSelectedAsOption: false },
}

export const AlignLeft: Story = {
  render: makeRender(0),
  args: { align: 'left' },
}

export const AlignCenter: Story = {
  render: makeRender(0),
  args: { align: 'center' },
}

export const DirectionUp: Story = {
  render: makeRender(0),
  args: { direction: 'up' },
}

export const ManyOptions: Story = {
  render: makeRender(0),
  args: {
    options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    modelValue: 0,
  },
}
