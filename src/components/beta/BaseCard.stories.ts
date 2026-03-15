import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, userEvent, fn } from 'storybook/test'
import BaseCard from './BaseCard.vue'

const meta = {
  title: 'Beta/BaseCard',
  component: BaseCard,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="background: #f2f2f7; padding: 24px; min-height: 200px;"><story /></div>',
    }),
  ],
  argTypes: {
    label: { control: 'text' },
    showMenu: { control: 'boolean' },
    showFlag: { control: 'boolean' },
    default: {
      description: 'Card body content. Rendered below the eyebrow row.',
      table: { disable: true },
    },
  },
  args: {
    label: 'Card Label',
    showMenu: false,
    showFlag: false,
    onFlag: fn(),
    onMenu: fn(),
  },
} satisfies Meta<typeof BaseCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard :label="args.label" :show-menu="args.showMenu" :show-flag="args.showFlag" @flag="args.onFlag" @menu="args.onMenu">
        <p style="margin: 0; font-size: 13px; color: rgba(0,0,0,0.6); line-height: 1.5;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </BaseCard>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Card Label')).toBeInTheDocument()
  },
}

export const WithMenu: Story = {
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard :label="args.label" :show-menu="args.showMenu" :show-flag="args.showFlag" @flag="args.onFlag" @menu="args.onMenu">
        <p style="margin: 0; font-size: 13px; color: rgba(0,0,0,0.6); line-height: 1.5;">
          Click the ellipsis button in the eyebrow.
        </p>
      </BaseCard>
    `,
  }),
  args: {
    showMenu: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('More options')).toBeInTheDocument()
    await userEvent.click(canvas.getByLabelText('More options'))
    await expect(args.onMenu).toHaveBeenCalledOnce()
  },
}

export const WithFlag: Story = {
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard :label="args.label" :show-menu="args.showMenu" :show-flag="args.showFlag" @flag="args.onFlag" @menu="args.onMenu">
        <p style="margin: 0; font-size: 13px; color: rgba(0,0,0,0.6); line-height: 1.5;">
          Click the flag button in the eyebrow.
        </p>
      </BaseCard>
    `,
  }),
  args: {
    showFlag: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Flag')).toBeInTheDocument()
    await userEvent.click(canvas.getByLabelText('Flag'))
    await expect(args.onFlag).toHaveBeenCalledOnce()
  },
}

export const BothButtons: Story = {
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard :label="args.label" :show-menu="args.showMenu" :show-flag="args.showFlag" @flag="args.onFlag" @menu="args.onMenu">
        <p style="margin: 0; font-size: 13px; color: rgba(0,0,0,0.6); line-height: 1.5;">
          Both flag and menu buttons are visible.
        </p>
      </BaseCard>
    `,
  }),
  args: {
    showFlag: true,
    showMenu: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByLabelText('Flag'))
    await expect(args.onFlag).toHaveBeenCalledOnce()
    await expect(args.onMenu).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByLabelText('More options'))
    await expect(args.onMenu).toHaveBeenCalledOnce()
  },
}

export const NoLabel: Story = {
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard @flag="args.onFlag" @menu="args.onMenu">
        <p style="margin: 0; font-size: 13px; color: rgba(0,0,0,0.6); line-height: 1.5;">
          No label — eyebrow row does not render.
        </p>
      </BaseCard>
    `,
  }),
  args: {
    label: undefined,
    showMenu: false,
    showFlag: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByLabelText('Flag')).not.toBeInTheDocument()
    await expect(canvas.queryByLabelText('More options')).not.toBeInTheDocument()
  },
}

export const NoLabelWithButtons: Story = {
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard :show-menu="args.showMenu" :show-flag="args.showFlag" @flag="args.onFlag" @menu="args.onMenu">
        <p style="margin: 0; font-size: 13px; color: rgba(0,0,0,0.6); line-height: 1.5;">
          No label but buttons are shown — eyebrow row still renders.
        </p>
      </BaseCard>
    `,
  }),
  args: {
    label: undefined,
    showFlag: true,
    showMenu: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Flag')).toBeInTheDocument()
    await expect(canvas.getByLabelText('More options')).toBeInTheDocument()
  },
}
