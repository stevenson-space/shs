import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import CardContainer, { type CardConfig } from './CardContainer.vue'

const meta = {
  title: 'Beta/CardContainer',
  component: CardContainer,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="background: #f2f2f7; min-height: 600px;"><story /></div>',
    }),
  ],
  argTypes: {
    cards: { control: 'object' },
  },
  args: {
    cards: [
      { id: 'now', visible: true },
      { id: 'schedule', visible: true },
      { id: 'lunch', visible: true },
      { id: 'weather', visible: true },
      { id: 'events', visible: true },
      { id: 'countdown', visible: true },
      { id: 'announcements', visible: true },
      { id: 'links', visible: true },
    ] as CardConfig[],
  },
} satisfies Meta<typeof CardContainer>

export default meta
type Story = StoryObj<typeof meta>

const render: Story['render'] = (args) => ({
  components: { CardContainer },
  setup() { return { args } },
  template: `<CardContainer :cards="args.cards" />`,
})

export const Default: Story = {
  render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cards = canvas.getAllByText(/Test Card/)
    await expect(cards).toHaveLength(8)
  },
}

export const FewCards: Story = {
  render,
  args: {
    cards: [
      { id: 'now', visible: true },
      { id: 'schedule', visible: true },
      { id: 'countdown', visible: true },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cards = canvas.getAllByText(/Test Card/)
    await expect(cards).toHaveLength(3)
  },
}

export const SomeHidden: Story = {
  render,
  args: {
    cards: [
      { id: 'now', visible: true },
      { id: 'schedule', visible: false },
      { id: 'lunch', visible: true },
      { id: 'weather', visible: false },
      { id: 'events', visible: true },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cards = canvas.getAllByText(/Test Card/)
    await expect(cards).toHaveLength(3)
  },
}

export const AllHidden: Story = {
  render,
  args: {
    cards: [
      { id: 'now', visible: false },
      { id: 'schedule', visible: false },
      { id: 'lunch', visible: false },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByText(/Test Card/)).toHaveLength(0)
  },
}
