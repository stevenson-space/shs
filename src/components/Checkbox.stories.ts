import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import { fn, userEvent, within, expect } from 'storybook/test'
import Checkbox from './Checkbox.vue'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'boolean' },
    labelSize: { control: 'text' },
  },
  args: {
    modelValue: false,
    labelSize: '.85em',
    'onUpdate:modelValue': fn(),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

function makeRender(initialChecked: boolean) {
  return (args: Parameters<NonNullable<Story['render']>>[0]) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(initialChecked)
      watch(() => args.modelValue, (val) => { checked.value = val })
      return {
        args,
        checked,
        onUpdate: (val: boolean) => {
          checked.value = val
          args['onUpdate:modelValue']?.(val)
        },
      }
    },
    template: `
      <Checkbox
        :model-value="checked"
        :label-size="args.labelSize"
        @update:modelValue="onUpdate"
      >
        Accept terms and conditions
      </Checkbox>
    `,
  })
}

export const Default: Story = {
  render: makeRender(false),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const label = canvas.getByText('Accept terms and conditions')
    await expect(label).toBeInTheDocument()

    const container = canvasElement.querySelector('.checkbox-container') as HTMLElement
    await expect(container).toBeInTheDocument()

    const checkbox = canvasElement.querySelector('.checkbox') as HTMLElement
    await expect(checkbox).not.toHaveClass('checked')

    await userEvent.click(container)
    await expect(checkbox).toHaveClass('checked')

    await userEvent.click(container)
    await expect(checkbox).not.toHaveClass('checked')
  },
}

export const Checked: Story = {
  render: makeRender(true),
  args: { modelValue: true },
}

export const Unchecked: Story = {
  render: makeRender(false),
  args: { modelValue: false },
}

export const NoLabel: Story = {
  render: (args: Parameters<NonNullable<Story['render']>>[0]) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(false)
      watch(() => args.modelValue, (val) => { checked.value = val })
      return {
        args,
        checked,
        onUpdate: (val: boolean) => {
          checked.value = val
          args['onUpdate:modelValue']?.(val)
        },
      }
    },
    template: `
      <Checkbox
        :model-value="checked"
        :label-size="args.labelSize"
        @update:modelValue="onUpdate"
      />
    `,
  }),
  args: { modelValue: false },
}

export const LargeLabel: Story = {
  render: makeRender(false),
  args: { labelSize: '1.1em' },
}

export const SmallLabel: Story = {
  render: makeRender(false),
  args: { labelSize: '.7em' },
}
