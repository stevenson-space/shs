import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { fn, userEvent, within, expect, waitFor } from 'storybook/test'
import Popup from './Popup.vue'

const meta = {
  title: 'Components/Popup',
  component: Popup,
  tags: ['autodocs'],
  argTypes: {
    show: { control: 'boolean' },
  },
  args: {
    show: true,
    onClose: fn(),
  },
} satisfies Meta<typeof Popup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Popup },
    setup() {
      const show = ref(true)
      return {
        args,
        show,
        onClose: () => { show.value = false; args.onClose?.() },
      }
    },
    template: `<Popup :show="show" @close="onClose"><div style="background:white;padding:20px;border-radius:8px;">Popup content here</div></Popup>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const content = canvas.getByText('Popup content here')
    await waitFor(() => expect(content).toBeVisible())
  },
}

export const Hidden: Story = {
  render: (args) => ({
    components: { Popup },
    setup() {
      const show = ref(false)
      return {
        args,
        show,
        onClose: () => { show.value = false; args.onClose?.() },
      }
    },
    template: `<Popup :show="show" @close="onClose"><div style="background:white;padding:20px;border-radius:8px;">This content is hidden</div></Popup>`,
  }),
  args: { show: false },
}

export const WithRichContent: Story = {
  render: (args) => ({
    components: { Popup },
    setup() {
      const show = ref(true)
      return {
        args,
        show,
        onClose: () => { show.value = false; args.onClose?.() },
      }
    },
    template: `
      <Popup :show="show" @close="onClose">
        <div style="background:white;padding:30px;border-radius:8px;max-width:320px;text-align:center;">
          <h2 style="margin:0 0 12px;">Title</h2>
          <p style="margin:0 0 20px;color:#666;">This is a popup with richer content including a title, body text, and a button.</p>
          <button @click="onClose" style="padding:8px 24px;border-radius:100px;border:none;background:#333;color:white;cursor:pointer;">Close</button>
        </div>
      </Popup>
    `,
  }),
  args: { show: true },
}

export const ClosesOnBackdropClick: Story = {
  render: (args) => ({
    components: { Popup },
    setup() {
      const show = ref(true)
      const closed = ref(false)
      return {
        args,
        show,
        closed,
        onClose: () => { show.value = false; closed.value = true; args.onClose?.() },
      }
    },
    template: `
      <div>
        <Popup :show="show" @close="onClose">
          <div style="background:white;padding:20px;border-radius:8px;">Click outside to close</div>
        </Popup>
        <p v-if="closed" style="color:green;">Popup was closed!</p>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const content = canvas.getByText('Click outside to close')
    await waitFor(() => expect(content).toBeVisible())

    const backdrop = canvasElement.querySelector('.popup') as HTMLElement
    if (backdrop) {
      await userEvent.click(backdrop)
    }
  },
}
