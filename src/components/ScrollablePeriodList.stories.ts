import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import ScrollablePeriodList from './ScrollablePeriodList.vue'

const sampleSchedule = {
  periods: ['1', '2', 'Lunch', '6'],
  start: ['7:30', '8:35', '11:00', '14:00'],
  end: ['8:30', '9:35', '11:35', '15:00'],
}

const fullDaySchedule = {
  periods: ['1', '2', '3', '4', 'Lunch', '5', '6', '7'],
  start: ['7:30', '8:35', '9:40', '10:45', '11:50', '12:25', '13:30', '14:35'],
  end: ['8:30', '9:35', '10:40', '11:45', '12:20', '13:25', '14:30', '15:35'],
}

const meta = {
  title: 'Components/ScrollablePeriodList',
  component: ScrollablePeriodList,
  tags: ['autodocs'],
  argTypes: {
    schedule: { control: 'object' },
    maxHeight: { control: 'text' },
    tvSpace: { control: 'boolean' },
  },
  args: {
    schedule: sampleSchedule,
    maxHeight: '',
    tvSpace: false,
  },
} satisfies Meta<typeof ScrollablePeriodList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { ScrollablePeriodList },
    setup() {
      return { args }
    },
    template: `<ScrollablePeriodList :schedule="args.schedule" :max-height="args.maxHeight || undefined" :tv-space="args.tvSpace" />`,
  }),
  args: {
    schedule: sampleSchedule,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const lunchPeriod = canvas.getByText('Lunch')
    await expect(lunchPeriod).toBeVisible()
  },
}

export const WithMaxHeight: Story = {
  render: (args) => ({
    components: { ScrollablePeriodList },
    setup() {
      return { args }
    },
    template: `<ScrollablePeriodList :schedule="args.schedule" :max-height="args.maxHeight || undefined" :tv-space="args.tvSpace" />`,
  }),
  args: {
    schedule: fullDaySchedule,
    maxHeight: '200px',
  },
}

export const TvSpaceMode: Story = {
  render: (args) => ({
    components: { ScrollablePeriodList },
    setup() {
      return { args }
    },
    template: `<ScrollablePeriodList :schedule="args.schedule" :max-height="args.maxHeight || undefined" :tv-space="args.tvSpace" />`,
  }),
  args: {
    schedule: sampleSchedule,
    tvSpace: true,
  },
}

export const FullDaySchedule: Story = {
  render: (args) => ({
    components: { ScrollablePeriodList },
    setup() {
      return { args }
    },
    template: `<ScrollablePeriodList :schedule="args.schedule" :max-height="args.maxHeight || undefined" :tv-space="args.tvSpace" />`,
  }),
  args: {
    schedule: fullDaySchedule,
    maxHeight: '300px',
  },
}
