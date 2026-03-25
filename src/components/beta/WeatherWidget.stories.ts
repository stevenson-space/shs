import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect, waitFor, userEvent, fn } from 'storybook/test'
import WeatherWidget from './WeatherWidget.vue'
import CardPreview from './CardPreview.vue'

function makeHourly(pct: number): number[] {
  return Array<number>(72).fill(pct)
}

const PARTLY_CLOUDY_RESPONSE = {
  current: { temperature_2m: 62 },
  hourly: { cloudcover: makeHourly(55) },
  daily: {
    time: ['2026-03-24', '2026-03-25', '2026-03-26'],
    temperature_2m_max: [67, 63, 58],
    temperature_2m_min: [51, 52, 49],
    precipitation_probability_max: [10, 5, 45],
  },
}

const SUNNY_RESPONSE = {
  current: { temperature_2m: 74 },
  hourly: { cloudcover: makeHourly(15) },
  daily: {
    time: ['2026-03-24', '2026-03-25', '2026-03-26'],
    temperature_2m_max: [78, 75, 72],
    temperature_2m_min: [55, 53, 50],
    precipitation_probability_max: [0, 0, 5],
  },
}

const CLOUDY_RESPONSE = {
  current: { temperature_2m: 54 },
  hourly: { cloudcover: makeHourly(85) },
  daily: {
    time: ['2026-03-24', '2026-03-25', '2026-03-26'],
    temperature_2m_max: [58, 56, 60],
    temperature_2m_min: [44, 42, 46],
    precipitation_probability_max: [5, 10, 15],
  },
}

const RAINY_RESPONSE = {
  current: { temperature_2m: 48 },
  hourly: { cloudcover: makeHourly(80) },
  daily: {
    time: ['2026-03-24', '2026-03-25', '2026-03-26'],
    temperature_2m_max: [52, 50, 55],
    temperature_2m_min: [40, 38, 44],
    precipitation_probability_max: [70, 80, 55],
  },
}

function stubFetchWith(payload: object): () => void {
  localStorage.removeItem('weatherDataCache_v2')
  const original = window.fetch
  window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve(payload) } as Response)
  return () => { window.fetch = original }
}

function stubFetchPending(): () => void {
  localStorage.removeItem('weatherDataCache_v2')
  const original = window.fetch
  window.fetch = () => new Promise(() => {}) as Promise<Response>
  return () => { window.fetch = original }
}

function stubFetchError(): () => void {
  localStorage.removeItem('weatherDataCache_v2')
  const original = window.fetch
  window.fetch = () => Promise.reject(new Error('Network error')) as Promise<Response>
  return () => { window.fetch = original }
}

const meta = {
  title: 'Beta/WeatherWidget',
  component: WeatherWidget,
  tags: ['autodocs'],
  args: {
    onFlag: fn(),
  },
} satisfies Meta<typeof WeatherWidget>

export default meta
type Story = StoryObj<typeof meta>

const renderInPreview = (args: Record<string, unknown>) => ({
  components: { WeatherWidget, CardPreview },
  setup() { return { args } },
  template: `<CardPreview><WeatherWidget @flag="args.onFlag" /></CardPreview>`,
})

export const Live: Story = {
  beforeEach() {
    localStorage.removeItem('weatherDataCache_v2')
  },
  render: renderInPreview,
}

export const Default: Story = {
  beforeEach() {
    return stubFetchWith(PARTLY_CLOUDY_RESPONSE)
  },
  render: renderInPreview,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText('62°')).toBeInTheDocument(), {
      timeout: 3000,
    })
    await expect(canvas.getByText('Partly cloudy')).toBeInTheDocument()
    await expect(canvas.getByText(/H:67° · L:51°/)).toBeInTheDocument()
    const chips = canvasElement.querySelectorAll('[data-testid="forecast-chip"]')
    await expect(chips).toHaveLength(2)
    await expect(canvas.getByText('63°')).toBeInTheDocument()
    await userEvent.click(canvas.getByLabelText('Flag'))
    await expect(args.onFlag).toHaveBeenCalledOnce()
  },
}

export const Loading: Story = {
  beforeEach() {
    return stubFetchPending()
  },
  render: renderInPreview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(
      () => expect(canvasElement.querySelector('.skeleton-body')).toBeInTheDocument(),
      { timeout: 1000 }
    )
    await expect(canvas.queryByText(/°/)).not.toBeInTheDocument()
  },
}

export const Error: Story = {
  beforeEach() {
    return stubFetchError()
  },
  render: renderInPreview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(
      () => expect(canvas.getByText('Unable to load weather')).toBeInTheDocument(),
      { timeout: 3000 }
    )
  },
}

export const Sunny: Story = {
  beforeEach() {
    return stubFetchWith(SUNNY_RESPONSE)
  },
  render: renderInPreview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText('Sunny')).toBeInTheDocument(), {
      timeout: 3000,
    })
    await expect(canvas.getByText('74°')).toBeInTheDocument()
  },
}

export const Cloudy: Story = {
  beforeEach() {
    return stubFetchWith(CLOUDY_RESPONSE)
  },
  render: renderInPreview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText('Cloudy')).toBeInTheDocument(), {
      timeout: 3000,
    })
    await expect(canvas.getByText('54°')).toBeInTheDocument()
  },
}

export const Rainy: Story = {
  beforeEach() {
    return stubFetchWith(RAINY_RESPONSE)
  },
  render: renderInPreview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText('Rainy')).toBeInTheDocument(), {
      timeout: 3000,
    })
    await expect(canvas.getByText('48°')).toBeInTheDocument()
  },
}

export const HeightConsistency: Story = {
  name: '[TEST] Height Consistency',
  beforeEach() {
    localStorage.removeItem('weatherDataCache_v2')
    let calls = 0
    const original = window.fetch
    window.fetch = () => {
      calls++
      if (calls === 1) return Promise.resolve({ ok: true, json: () => Promise.resolve(PARTLY_CLOUDY_RESPONSE) } as Response)
      if (calls === 2) return new Promise<Response>(() => {})
      return Promise.reject(new Error('fail')) as Promise<Response>
    }
    return () => { window.fetch = original }
  },
  render: () => ({
    components: { WeatherWidget, CardPreview },
    template: `
      <CardPreview style="display: flex; flex-direction: column; gap: 8px;">
        <div data-testid="card-loaded"><WeatherWidget /></div>
        <div data-testid="card-loading"><WeatherWidget /></div>
        <div data-testid="card-error"><WeatherWidget /></div>
      </CardPreview>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByText('62°')).toBeInTheDocument(), { timeout: 3000 })
    await waitFor(() => expect(canvas.getByText('Unable to load weather')).toBeInTheDocument(), { timeout: 3000 })

    const h = (testid: string) => {
      const el = canvasElement.querySelector(`[data-testid="${testid}"] .base-card`)
      return el ? Math.round(el.getBoundingClientRect().height) : -1
    }

    const loadedH = h('card-loaded')
    const loadingH = h('card-loading')
    const errorH = h('card-error')

    await expect(loadingH).toEqual(loadedH)
    await expect(errorH).toEqual(loadedH)
  },
}
