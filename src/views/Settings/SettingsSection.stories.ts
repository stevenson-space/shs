import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import SettingsSection from './SettingsSection.vue'

const meta = {
  title: 'Settings/SettingsSection',
  component: SettingsSection,
  tags: ['autodocs'],
  argTypes: { title: { control: 'text' } },
  args: { title: 'General' },
} satisfies Meta<typeof SettingsSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('General')).toBeInTheDocument()
  },
}

export const WithContent: Story = {
  render: (args) => ({
    components: { SettingsSection },
    setup() { return { args } },
    template: `
      <SettingsSection :title="args.title">
        <p style="padding: 20px;">
          Feel free to address any questions, comments, or concerns by
          <a href="/getHelp">visiting our contact form</a>.
        </p>
      </SettingsSection>
    `,
  }),
  args: { title: 'Contact' },
}

export const WithHeadingContent: Story = {
  render: (args) => ({
    components: { SettingsSection },
    setup() { return { args } },
    template: `
      <SettingsSection :title="args.title">
        <template #heading-content>
          <button style="font-size:0.8em;">Restore to Defaults</button>
        </template>
        <p style="padding: 20px;">Schedule cards would appear here.</p>
      </SettingsSection>
    `,
  }),
  args: { title: 'Schedules' },
}
