import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, fn } from 'storybook/test'
import { Bell, Link, Calendar, Music } from 'lucide-vue-next'
import LinkCard from './LinkCard.vue'
import PairCard from './PairCard.vue'
import CardPreview from './CardPreview.vue'

const meta = {
  title: 'Beta/LinkCard',
  component: LinkCard,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    inverted: { control: 'boolean' },
    icon: { control: false },
    favicon: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    label: 'Bell Schedules',
    inverted: false,
    onMenu: fn(),
  },
} satisfies Meta<typeof LinkCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { LinkCard, PairCard, CardPreview },
    setup() { return { args, Bell, Link } },
    template: `
      <CardPreview>
        <PairCard>
          <LinkCard :label="args.label" :inverted="args.inverted" :icon="Bell" href="/bell" @menu="args.onMenu" />
          <LinkCard label="Links" inverted :icon="Link" href="/links" @menu="args.onMenu" />
        </PairCard>
      </CardPreview>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Bell Schedules')).toBeInTheDocument()
  },
}

export const Inverted: Story = {
  render: (args) => ({
    components: { LinkCard, PairCard, CardPreview },
    setup() { return { args, Link, Calendar } },
    template: `
      <CardPreview>
        <PairCard>
          <LinkCard label="Links" inverted :icon="Link" href="/links" @menu="args.onMenu" />
          <LinkCard label="Calendar" :icon="Calendar" href="/calendar" @menu="args.onMenu" />
        </PairCard>
      </CardPreview>
    `,
  }),
}

export const WithFavicon: Story = {
  render: (args) => ({
    components: { LinkCard, PairCard, CardPreview },
    setup() { return { args, Bell } },
    template: `
      <CardPreview>
        <PairCard>
          <LinkCard label="Bell Schedules" inverted :icon="Bell" href="/bell" @menu="args.onMenu" />
          <LinkCard label="google.com" favicon="https://www.google.com/favicon.ico" href="https://google.com" @menu="args.onMenu" />
        </PairCard>
      </CardPreview>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('google.com')).toBeInTheDocument()
  },
}

export const BothFavicons: Story = {
  render: (args) => ({
    components: { LinkCard, PairCard, CardPreview },
    setup() { return { args } },
    template: `
      <CardPreview>
        <PairCard>
          <LinkCard label="google.com" favicon="https://www.google.com/favicon.ico" href="https://google.com" @menu="args.onMenu" />
          <LinkCard label="github.com" favicon="https://github.com/favicon.ico" href="https://github.com" @menu="args.onMenu" />
        </PairCard>
      </CardPreview>
    `,
  }),
}

export const AllVariants: Story = {
  render: (args) => ({
    components: { LinkCard, PairCard, CardPreview },
    setup() { return { args, Bell, Link, Calendar, Music } },
    template: `
      <CardPreview>
        <PairCard>
          <LinkCard label="Bell Schedules" :icon="Bell" href="/bell" @menu="args.onMenu" />
          <LinkCard label="Links" inverted :icon="Link" href="/links" @menu="args.onMenu" />
        </PairCard>
        <div style="height: 8px" />
        <PairCard>
          <LinkCard label="Calendar" inverted :icon="Calendar" href="/calendar" @menu="args.onMenu" />
          <LinkCard label="google.com" favicon="https://www.google.com/favicon.ico" href="https://google.com" @menu="args.onMenu" />
        </PairCard>
      </CardPreview>
    `,
  }),
}
