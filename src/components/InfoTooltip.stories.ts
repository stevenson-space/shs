import type { Meta, StoryObj } from '@storybook/vue3'
import { userEvent, expect, waitFor } from 'storybook/test'
import InfoTooltip from './InfoTooltip.vue'

const meta = {
  title: 'Components/InfoTooltip',
  component: InfoTooltip,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'object' },
  },
  args: {},
} satisfies Meta<typeof InfoTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { InfoTooltip },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; justify-content: center; padding: 60px;">
        <InfoTooltip v-bind="args">
          This is helpful tooltip information about the feature.
        </InfoTooltip>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.info-icon') as HTMLElement
    await expect(trigger).toBeInTheDocument()

    await userEvent.hover(trigger)
    await waitFor(() => expect(document.querySelector('.info-tooltip')).toBeInTheDocument())
    await expect(document.querySelector('.info-tooltip')).toHaveTextContent('This is helpful tooltip information about the feature.')

    await userEvent.unhover(trigger)
    await waitFor(() => expect(document.querySelector('.info-tooltip')).not.toBeInTheDocument())
  },
}

export const WithLongText: Story = {
  render: (args) => ({
    components: { InfoTooltip },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; justify-content: center; padding: 60px;">
        <InfoTooltip v-bind="args">
          This tooltip contains a longer description that explains the feature in more detail,
          spanning multiple lines to test how the tooltip handles extended content.
        </InfoTooltip>
      </div>
    `,
  }),
}

export const WithCustomTrigger: Story = {
  render: (args) => ({
    components: { InfoTooltip },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; justify-content: center; padding: 60px;">
        <InfoTooltip v-bind="args">
          <template #trigger>
            <span style="font-size: 13px; font-weight: bold; cursor: help; border-bottom: 1px dashed currentColor;">
              What is this?
            </span>
          </template>
          A custom trigger element replaces the default info icon.
        </InfoTooltip>
      </div>
    `,
  }),
}

export const InlineWithText: Story = {
  render: (args) => ({
    components: { InfoTooltip },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 60px; font-size: 14px; color: var(--primary, #333);">
        <span>Graduation requirement</span>
        <InfoTooltip v-bind="args" style="margin-left: 6px;">
          Students must complete 24 credits to graduate, including required core courses.
        </InfoTooltip>
      </div>
    `,
  }),
}
