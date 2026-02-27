import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import { faInfoCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import WhatIsThis from './WhatIsThis.vue'

const meta = {
  title: 'Components/WhatIsThis',
  component: WhatIsThis,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'object' },
  },
  args: {
    icon: faQuestionCircle,
  },
} satisfies Meta<typeof WhatIsThis>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { WhatIsThis },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 60px;">
        <WhatIsThis :icon="args.icon">
          This is a helpful tooltip that explains what something does.
        </WhatIsThis>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/helpful tooltip/)).toBeInTheDocument()
  },
}

export const WithInfoIcon: Story = {
  render: (args) => ({
    components: { WhatIsThis },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 60px;">
        <WhatIsThis :icon="args.icon">
          This feature allows you to customize your display settings.
        </WhatIsThis>
      </div>
    `,
  }),
  args: {
    icon: faInfoCircle,
  },
}

export const LongTooltip: Story = {
  render: (args) => ({
    components: { WhatIsThis },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 60px;">
        <WhatIsThis :icon="args.icon">
          This is a longer explanation that provides more context about the feature.
          It may span multiple lines within the info bubble popup that appears on hover.
        </WhatIsThis>
      </div>
    `,
  }),
}
