import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, waitFor } from 'storybook/test'
import { Bell, Link, Calendar, Music, GraduationCap, Settings } from 'lucide-vue-next'
import CardContainer from './CardContainer.vue'
import TestCard from './TestCard.vue'
import LinkCard from './LinkCard.vue'
import PairCard from './PairCard.vue'
import WeatherWidget from './WeatherWidget/WeatherWidget.vue'

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
  beforeEach() {
    localStorage.removeItem('weatherDataCache_v2')
    const original = window.fetch
    window.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        current: { temperature_2m: 62 },
        hourly: { cloudcover: Array<number>(72).fill(55) },
        daily: {
          time: ['2026-03-24', '2026-03-25', '2026-03-26'],
          temperature_2m_max: [67, 63, 58],
          temperature_2m_min: [51, 52, 49],
          precipitation_probability_max: [10, 5, 45],
        },
      }),
    } as Response)
    return () => { window.fetch = original }
  },
  render: () => ({
    components: { CardContainer, TestCard, PairCard, LinkCard, WeatherWidget },
    setup() {
      return { Bell, Link, Calendar, Music, GraduationCap, Settings }
    },
    template: `
      <CardContainer>
        <WeatherWidget />
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
    await waitFor(() => expect(canvas.getByText('62°')).toBeInTheDocument(), { timeout: 3000 })
    await expect(canvas.getByText('Bell Schedules')).toBeInTheDocument()
    await expect(canvas.getAllByText('Links')).toHaveLength(2)
    await expect(canvas.getAllByText(/Test Card/)).toHaveLength(4)
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
