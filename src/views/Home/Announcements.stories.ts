import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import Announcements from './Announcements.vue'

const meta = {
  title: 'Home/Announcements',
  component: Announcements,
  tags: ['autodocs'],
  argTypes: {
    fullScreenMode: { control: 'boolean' },
  },
  args: {
    fullScreenMode: false,
  },
} satisfies Meta<typeof Announcements>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Announcements },
    setup() {
      return { args }
    },
    mounted() {
      ;(this.$refs.ann as any).announcements = [
        {
          text: 'Spring Blood Drive on <b>March 15th</b> in the Main Gym — sign up in the Activities Office.',
          showInFullScreen: true,
        },
        {
          text: 'Senior Portraits are due by <b>February 28th</b>. Contact your counselor for details.',
          showInFullScreen: false,
        },
        {
          text: 'SAT testing reminder for <b>March 7th</b>. Doors open at 7:45 AM — arrive early.',
          showInFullScreen: true,
        },
      ]
    },
    template: `<Announcements ref="ann" :full-screen-mode="args.fullScreenMode" />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/Spring Blood Drive/i)).toBeInTheDocument()
  },
}

export const FullScreen: Story = {
  render: (args) => ({
    components: { Announcements },
    setup() {
      return { args }
    },
    mounted() {
      ;(this.$refs.ann as any).announcements = [
        {
          text: 'Today is a <b>Late Arrival</b> day — school starts at 10:30 AM.',
          showInFullScreen: true,
        },
        {
          text: 'AP Exam registration closes <b>Friday</b>. See Mrs. Johnson in Room 214.',
          showInFullScreen: true,
        },
      ]
    },
    template: `<Announcements ref="ann" :full-screen-mode="args.fullScreenMode" />`,
  }),
  args: { fullScreenMode: true },
}

export const Empty: Story = {
  args: { fullScreenMode: false },
}

export const FullScreenFiltered: Story = {
  render: (args) => ({
    components: { Announcements },
    setup() {
      return { args }
    },
    mounted() {
      ;(this.$refs.ann as any).announcements = [
        {
          text: 'Prom tickets on sale now in the Main Office — <b>$65 per person</b>.',
          showInFullScreen: true,
        },
        {
          text: 'Spring sports tryouts begin <b>March 3rd</b>. Register on FinalForms before attending.',
          showInFullScreen: false,
        },
      ]
    },
    template: `<Announcements ref="ann" :full-screen-mode="args.fullScreenMode" />`,
  }),
  args: { fullScreenMode: true },
}
