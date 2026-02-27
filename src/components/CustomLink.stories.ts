import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import CustomLink from './CustomLink.vue'

const meta = {
  title: 'Components/CustomLink',
  component: CustomLink,
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    type: { control: 'select', options: ['', 'a', 'router-link', 'none'] },
    newTab: { control: 'boolean' },
  },
  args: {
    href: 'https://example.com',
    type: '',
    newTab: false,
  },
} satisfies Meta<typeof CustomLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { CustomLink },
    setup() {
      return { args }
    },
    template: `
      <CustomLink :href="args.href" :type="args.type" :new-tab="args.newTab">
        Visit Example.com
      </CustomLink>
    `,
  }),
  args: { href: 'https://example.com' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByText('Visit Example.com')
    await expect(link).toBeInTheDocument()
    const anchor = canvasElement.querySelector('a') as HTMLAnchorElement
    await expect(anchor).toBeInTheDocument()
    await expect(anchor).toHaveAttribute('href', 'https://example.com')
  },
}

export const RouterLink: Story = {
  render: (args) => ({
    components: { CustomLink },
    setup() {
      return { args }
    },
    template: `
      <CustomLink :href="args.href" :type="args.type" :new-tab="args.newTab">
        Go to Home
      </CustomLink>
    `,
  }),
  args: { href: '/', type: '' },
}

export const ExternalLinkNewTab: Story = {
  render: (args) => ({
    components: { CustomLink },
    setup() {
      return { args }
    },
    template: `
      <CustomLink :href="args.href" :type="args.type" :new-tab="args.newTab">
        Open in New Tab
      </CustomLink>
    `,
  }),
  args: { href: 'https://example.com', newTab: true },
}

export const ObjectHref: Story = {
  render: (args) => ({
    components: { CustomLink },
    setup() {
      return { args }
    },
    template: `
      <CustomLink :href="{ path: '/', query: { tab: 'events' } }" :new-tab="args.newTab">
        Programmatic Route Object
      </CustomLink>
    `,
  }),
  args: { newTab: false },
}

export const ForcedAnchor: Story = {
  render: (args) => ({
    components: { CustomLink },
    setup() {
      return { args }
    },
    template: `
      <CustomLink :href="args.href" type="a" :new-tab="args.newTab">
        Forced Anchor Tag
      </CustomLink>
    `,
  }),
  args: { href: '/some-path', type: 'a' },
}

export const NoLink: Story = {
  render: (args) => ({
    components: { CustomLink },
    setup() {
      return { args }
    },
    template: `
      <CustomLink href="" type="none" :new-tab="args.newTab">
        Plain Div (No Link)
      </CustomLink>
    `,
  }),
  args: { href: '', type: 'none' },
}
