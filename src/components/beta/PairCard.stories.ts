import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import { Bell, Link, Calendar, Music } from 'lucide-vue-next'
import PairCard from './PairCard.vue'
import LinkCard from './LinkCard.vue'
import PlaceholderCard from './PlaceholderCard.vue'
import CardPreview from './CardPreview.vue'

const meta = {
  title: 'Beta/PairCard',
  component: PairCard,
  tags: ['autodocs'],
} satisfies Meta<typeof PairCard>

export default meta
type Story = StoryObj<typeof meta>

export const InvertAndFilled: Story = {
  render: () => ({
    components: { PairCard, LinkCard, CardPreview },
    setup() {
      return { Bell, Link }
    },
    template: `
      <CardPreview>
        <PairCard>
          <LinkCard label="Bell Schedules" inverted :icon="Bell" href="/bell" />
          <LinkCard label="Links" :icon="Link" href="/links" />
        </PairCard>
      </CardPreview>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Bell Schedules')).toBeInTheDocument()
    await expect(canvas.getByText('Links')).toBeInTheDocument()
  },
}

export const BothInverted: Story = {
  render: () => ({
    components: { PairCard, LinkCard, CardPreview },
    setup() {
      return { Calendar, Music }
    },
    template: `
      <CardPreview>
        <PairCard>
          <LinkCard label="Calendar" inverted :icon="Calendar" href="/calendar" />
          <LinkCard label="Music" inverted :icon="Music" href="/jukebox" />
        </PairCard>
      </CardPreview>
    `,
  }),
}

export const WithPlaceholder: Story = {
  render: () => ({
    components: { PairCard, LinkCard, PlaceholderCard, CardPreview },
    setup() {
      return { Bell }
    },
    template: `
      <CardPreview>
        <PairCard>
          <LinkCard label="Bell Schedules" inverted :icon="Bell" href="/bell" />
          <PlaceholderCard />
        </PairCard>
      </CardPreview>
    `,
  }),
}

export const WithFavicon: Story = {
  render: () => ({
    components: { PairCard, LinkCard, CardPreview },
    setup() {
      return { Bell }
    },
    template: `
      <CardPreview>
        <PairCard>
          <LinkCard label="Bell Schedules" inverted :icon="Bell" href="/bell" />
          <LinkCard
            label="google.com"
            favicon="https://www.google.com/favicon.ico"
            href="https://google.com"
          />
        </PairCard>
      </CardPreview>
    `,
  }),
}

export const HeightConsistency: Story = {
  name: '[TEST] Height Consistency',
  render: () => ({
    components: { PairCard, LinkCard, PlaceholderCard, CardPreview },
    setup() { return { Bell, Link } },
    template: `
      <CardPreview style="display: flex; flex-direction: column; gap: 8px;">
        <PairCard data-testid="pair-1">
          <LinkCard label="Links" :icon="Link" href="/links" />
          <LinkCard label="Links" :icon="Link" href="/links" />
        </PairCard>
        <PairCard data-testid="pair-2">
          <LinkCard label="Links" :icon="Link" href="/links" />
          <PlaceholderCard />
        </PairCard>
        <PairCard data-testid="pair-3">
          <LinkCard label="Links" :icon="Link" href="/links" />
          <LinkCard label="Google" favicon="https://www.google.com/favicon.ico" href="https://google.com" />
        </PairCard>
        <PairCard data-testid="pair-4">
          <PlaceholderCard />
          <PlaceholderCard />
        </PairCard>
        <PairCard data-testid="pair-5">
          <PlaceholderCard />
          <LinkCard label="Google" favicon="https://www.google.com/favicon.ico" href="https://google.com" />
        </PairCard>
        <PairCard data-testid="pair-6">
          <LinkCard label="Google" favicon="https://www.google.com/favicon.ico" href="https://google.com" />
          <LinkCard label="Google" favicon="https://www.google.com/favicon.ico" href="https://google.com" />
        </PairCard>
      </CardPreview>
    `,
  }),
  play: async ({ canvasElement }) => {
    const h = (el: Element | null) => el ? el.getBoundingClientRect().height : -1

    const iconCard = canvasElement.querySelector('[data-testid="pair-1"] .link-card') as HTMLElement
    const faviconCard = canvasElement.querySelector('[data-testid="pair-6"] .link-card') as HTMLElement

    // Diagnostic: report sub-element heights so we can pinpoint the 2px difference
    await expect({
      card: h(faviconCard),
      iconArea: h(faviconCard?.querySelector('.icon-area') ?? null),
      iconAreaContent: h(faviconCard?.querySelector('.icon-area > *') ?? null),
      label: h(faviconCard?.querySelector('.label') ?? null),
    }).toEqual({
      card: h(iconCard),
      iconArea: h(iconCard?.querySelector('.icon-area') ?? null),
      iconAreaContent: h(iconCard?.querySelector('.icon-area > *') ?? null),
      label: h(iconCard?.querySelector('.label') ?? null),
    })
  },
}
