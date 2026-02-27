import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import { userEvent, within, expect, waitFor } from 'storybook/test'
import CollapsibleSection from './CollapsibleSection.vue'

const meta = {
  title: 'Components/CollapsibleSection',
  component: CollapsibleSection,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    modelValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
    lockOpen: { control: 'boolean' },
    headerClass: { control: 'text' },
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
  args: {
    title: 'Section Title',
    modelValue: false,
    disabled: false,
    lockOpen: false,
    headerClass: '',
  },
} satisfies Meta<typeof CollapsibleSection>

export default meta
type Story = StoryObj<typeof meta>

function makeRender(initialOpen: boolean) {
  return (args: Parameters<NonNullable<Story['render']>>[0]) => ({
    components: { CollapsibleSection },
    setup() {
      const open = ref(initialOpen)
      watch(() => args.modelValue, (val) => { open.value = val })
      return {
        args,
        open,
        onUpdate: (val: boolean) => {
          open.value = val
          args['onUpdate:modelValue']?.(val)
        },
      }
    },
    template: `
      <CollapsibleSection
        :title="args.title"
        :model-value="open"
        :disabled="args.disabled"
        :lock-open="args.lockOpen"
        @update:modelValue="onUpdate"
      >
        <p style="margin: 0; font-size: 14px; color: var(--secondary, #666);">
          This is the collapsible content area. Click the header above to toggle.
        </p>
      </CollapsibleSection>
    `,
  })
}

export const Default: Story = {
  render: makeRender(false),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const header = canvas.getByText('Section Title')
    const content = canvas.getByText(/collapsible content area/)

    await expect(content).not.toBeVisible()

    await userEvent.click(header)
    await waitFor(() => expect(content).toBeVisible())

    await userEvent.click(header)
    await waitFor(() => expect(content).not.toBeVisible())
  },
}

export const Closed: Story = {
  render: makeRender(false),
  args: { title: 'Closed Section' },
}

export const Expanded: Story = {
  render: makeRender(true),
  args: { title: 'Expanded Section' },
}

export const Disabled: Story = {
  render: makeRender(false),
  args: { title: 'Disabled Section', disabled: true },
}

export const LockedOpen: Story = {
  render: makeRender(false),
  args: { title: 'Always Open', lockOpen: true },
}

export const WithActionSlot: Story = {
  render: (args) => ({
    components: { CollapsibleSection },
    setup() {
      const open = ref(true)
      const enabled = ref(true)
      return {
        args,
        open,
        enabled,
        onUpdate: (val: boolean) => {
          open.value = val
          args['onUpdate:modelValue']?.(val)
        },
      }
    },
    template: `
      <CollapsibleSection
        :title="args.title"
        :model-value="open"
        @update:modelValue="onUpdate"
      >
        <template #action>
          <input type="checkbox" v-model="enabled" aria-label="Enable section" />
        </template>
        <p style="margin: 0; font-size: 14px; color: var(--secondary, #666);">
          The action slot (top-right) can hold controls like toggles or buttons.
        </p>
      </CollapsibleSection>
    `,
  }),
  args: { title: 'Section with Action' },
}

export const LongTitle: Story = {
  render: makeRender(false),
  args: {
    title: 'This Is a Section With a Very Long Title That Tests Text Overflow Behavior',
  },
}
