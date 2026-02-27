import type { Meta, StoryObj } from '@storybook/vue3'
import { expect } from 'storybook/test'
import EventPopup from './EventPopup.vue'

// Real SHS event from 1/15/2026 (events.json)
const sampleEvent = {
  name: 'Consortium Orchestra Concert',
  start: 1768500000000,
  end: 1768500000000,
  allDay: false,
  location: 'Stevenson High School | Performing Arts Center',
  description: "This is our annual 8th-grade sender school concert, showcasing our talented incoming students to all our consortium schools.",
  categories: ['Fine Arts'],
}

const meta = {
  title: 'Calendar/EventPopup',
  component: EventPopup,
  tags: ['autodocs'],
  argTypes: {
    event: { control: 'object' },
    show: { control: 'boolean' },
  },
  args: {
    event: sampleEvent,
    show: true,
  },
} satisfies Meta<typeof EventPopup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const popup = document.querySelector('.event-details')
    await expect(popup).not.toBeNull()
    const title = document.querySelector('.event-details .title')
    await expect(title).not.toBeNull()
    await expect(title).toHaveTextContent('Consortium Orchestra Concert')
  },
}

// Real SHS all-day event from 1/19/2026 (events.json)
export const AllDay: Story = {
  args: {
    event: {
      name: 'Martin Luther. King, Jr. Day (No School)',
      start: 1768780800000,
      end: 1768867200000,
      allDay: true,
      location: null,
      description: '',
      categories: ['Non-Attendance Days'],
    },
  },
}

// Real SHS event from 3/11/2026 with a location (events.json)
export const WithLocation: Story = {
  args: {
    event: {
      name: 'CCC Presents: College and Career Center Night for Sophomore Families',
      start: 1773255600000,
      end: new Date('2026-03-11T20:00:00').getTime(),
      allDay: false,
      location: 'Stevenson High School | West Auditorium & Virtual Meeting via Zoom',
      description: 'More information coming soon!',
      categories: ['CCC'],
    },
  },
}
