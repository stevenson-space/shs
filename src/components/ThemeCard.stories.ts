import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import ThemeCard from './ThemeCard.vue'

const mockTheme = {
  metadata: {
    name: 'Ocean Blue',
    author: 'John Doe',
    description: 'A blue ocean theme',
  },
  styling: {
    accent: '#3b82f6',
    background: '#1e3a5f',
  },
}

const meta = {
  title: 'Components/ThemeCard',
  component: ThemeCard,
  tags: ['autodocs'],
  argTypes: {
    theme: { control: 'object' },
    onClick: { action: 'click' },
  },
  args: {
    theme: mockTheme,
  },
} satisfies Meta<typeof ThemeCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { ThemeCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 260px; padding: 16px;">
        <ThemeCard :theme="args.theme" @click="args.onClick" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const name = canvas.getByText('Ocean Blue')
    await expect(name).toBeVisible()
    const author = canvas.getByText('John Doe')
    await expect(author).toBeVisible()
  },
}

export const WithDescription: Story = {
  render: (args) => ({
    components: { ThemeCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 260px; padding: 16px;">
        <ThemeCard :theme="args.theme" @click="args.onClick" />
      </div>
    `,
  }),
  args: {
    theme: {
      metadata: {
        name: 'Forest Green',
        author: 'Jane Smith',
        description: 'A lush forest-inspired theme with deep greens and earthy tones.',
      },
      styling: {
        accent: '#22c55e',
        background: '#14532d',
      },
    },
  },
}

export const WithSeasonalDates: Story = {
  render: (args) => ({
    components: { ThemeCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 260px; padding: 16px;">
        <ThemeCard :theme="args.theme" @click="args.onClick" />
      </div>
    `,
  }),
  args: {
    theme: {
      metadata: {
        name: 'Winter Wonderland',
        author: 'Alice Baker',
      },
      styling: {
        accent: '#93c5fd',
        background: '#1e3a5f',
      },
      seasonalDates: '12/1-12/31',
    },
  },
}

export const NoDescription: Story = {
  render: (args) => ({
    components: { ThemeCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 260px; padding: 16px;">
        <ThemeCard :theme="args.theme" @click="args.onClick" />
      </div>
    `,
  }),
  args: {
    theme: {
      metadata: {
        name: 'Minimal Dark',
        author: 'Bob Chen',
      },
      styling: {
        accent: '#a855f7',
        background: '#1c1c2e',
      },
    },
  },
}

export const Grid: Story = {
  render: (args) => ({
    components: { ThemeCard },
    setup() {
      const themes = [
        {
          metadata: { name: 'Ocean Blue', author: 'John Doe', description: 'A blue ocean theme' },
          styling: { accent: '#3b82f6', background: '#1e3a5f' },
        },
        {
          metadata: { name: 'Sunset Red', author: 'Maria Lopez' },
          styling: { accent: '#ef4444', background: '#7f1d1d' },
        },
        {
          metadata: { name: 'Emerald', author: 'Li Wei', description: 'Clean green theme' },
          styling: { accent: '#10b981', background: '#064e3b' },
        },
        {
          metadata: { name: 'Purple Night', author: 'Sam Patel' },
          styling: { accent: '#8b5cf6', background: '#2e1065' },
        },
      ]
      return { args, themes }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 220px); gap: 16px; padding: 16px;">
        <ThemeCard v-for="t in themes" :key="t.metadata.name" :theme="t" @click="args.onClick" />
      </div>
    `,
  }),
}
