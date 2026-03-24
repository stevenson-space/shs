import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import { Bell, Link, Calendar, Music, GraduationCap, Settings } from 'lucide-vue-next'
import CardContainer from './CardContainer.vue'
import TestCard from './TestCard.vue'
import LinkCard from './LinkCard.vue'
import PairCard from './PairCard.vue'

const meta = {
  title: 'Beta/CardContainer',
  component: CardContainer,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="background: #f5f5f0; min-height: 600px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof CardContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { CardContainer, TestCard },
    template: `
      <CardContainer>
        <TestCard v-for="i in 8" :key="i" :position="i" />
      </CardContainer>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText(/Test Card/)).toHaveLength(8)
  },
}

export const FewCards: Story = {
  render: () => ({
    components: { CardContainer, TestCard },
    template: `
      <CardContainer>
        <TestCard v-for="i in 3" :key="i" :position="i" />
      </CardContainer>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText(/Test Card/)).toHaveLength(3)
  },
}

export const FullLayout: Story = {
  render: () => ({
    components: { CardContainer, TestCard, PairCard, LinkCard },
    setup() {
      return { Bell, Link, Calendar, Music, GraduationCap, Settings }
    },
    template: `
      <CardContainer>
        <TestCard :position="1" />
        <TestCard :position="2" />
        <PairCard>
          <LinkCard inverted label="Bell Schedules" :icon="Bell" href="/bell" />
          <LinkCard label="Links" :icon="Link" href="/links" />
        </PairCard>
        <TestCard :position="3" />
        <PairCard>
          <LinkCard inverted label="Calendar" :icon="Calendar" href="/calendar" />
          <LinkCard label="Jukebox" :icon="Music" href="/jukebox" />
        </PairCard>
        <TestCard :position="4" />
        <PairCard>
          <LinkCard label="GPA Calc" :icon="GraduationCap" href="/gpa" />
          <LinkCard inverted label="Settings" :icon="Settings" href="/settings" />
        </PairCard>
        <PairCard>
          <LinkCard label="IRC" favicon="https://irc.d125.org/favicon.ico" href="https://irc.d125.org" />
          <LinkCard label="Links" inverted :icon="Link" href="/links" />
        </PairCard>
        <TestCard :position="5" />
      </CardContainer>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Bell Schedules')).toBeInTheDocument()
    await expect(canvas.getByText('Links')).toBeInTheDocument()
    await expect(canvas.getAllByText(/Test Card/)).toHaveLength(5)
  },
}

export const Empty: Story = {
  render: () => ({
    components: { CardContainer },
    template: '<CardContainer />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByText(/Test Card/)).toHaveLength(0)
  },
}
