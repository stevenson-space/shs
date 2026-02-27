import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { userEvent, within, expect } from 'storybook/test'
import ConfirmPopup from './ConfirmPopup.vue'

const meta = {
  title: 'Components/ConfirmPopup',
  component: ConfirmPopup,
  tags: ['autodocs'],
  argTypes: {
    show: { control: 'boolean' },
    okText: { control: 'text' },
    cancelText: { control: 'text' },
    onOk: { action: 'ok' },
    onCancel: { action: 'cancel' },
  },
  args: {
    show: true,
    okText: 'OK',
    cancelText: 'Cancel',
  },
} satisfies Meta<typeof ConfirmPopup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { ConfirmPopup },
    setup() {
      const show = ref(true)
      return {
        args,
        show,
        onOk: () => { show.value = false; args.onOk?.() },
        onCancel: () => { show.value = false; args.onCancel?.() },
      }
    },
    template: `
      <ConfirmPopup :show="show" :ok-text="args.okText" :cancel-text="args.cancelText" @ok="onOk" @cancel="onCancel">
        <div style="padding:20px 30px 0;font-size:1.2em;font-weight:bold;text-align:center;max-width:400px;">
          Are you sure you want to delete this item?
        </div>
      </ConfirmPopup>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const text = canvas.getByText(/Are you sure/)
    await expect(text).toBeVisible()

    const okButton = canvas.getByText('OK')
    await expect(okButton).toBeVisible()

    const cancelButton = canvas.getByText('Cancel')
    await expect(cancelButton).toBeVisible()
  },
}

export const OkOnly: Story = {
  render: (args) => ({
    components: { ConfirmPopup },
    setup() {
      const show = ref(true)
      return {
        args,
        show,
        onOk: () => { show.value = false; args.onOk?.() },
        onCancel: () => { show.value = false; args.onCancel?.() },
      }
    },
    template: `
      <ConfirmPopup :show="show" :ok-text="args.okText" :cancel-text="args.cancelText" @ok="onOk" @cancel="onCancel">
        <div style="padding:20px 30px 0;font-size:1.2em;font-weight:bold;text-align:center;max-width:400px;">
          Session expired. Please log in again.
        </div>
      </ConfirmPopup>
    `,
  }),
  args: {
    cancelText: '',
    okText: 'OK',
  },
}

export const CustomButtonLabels: Story = {
  render: (args) => ({
    components: { ConfirmPopup },
    setup() {
      const show = ref(true)
      return {
        args,
        show,
        onOk: () => { show.value = false; args.onOk?.() },
        onCancel: () => { show.value = false; args.onCancel?.() },
      }
    },
    template: `
      <ConfirmPopup :show="show" :ok-text="args.okText" :cancel-text="args.cancelText" @ok="onOk" @cancel="onCancel">
        <div style="padding:20px 30px 0;font-size:1.2em;font-weight:bold;text-align:center;max-width:400px;">
          Do you want to discard your unsaved changes?
        </div>
      </ConfirmPopup>
    `,
  }),
  args: {
    okText: 'Discard',
    cancelText: 'Keep Editing',
  },
}

export const Hidden: Story = {
  render: (args) => ({
    components: { ConfirmPopup },
    setup() {
      const show = ref(false)
      return {
        args,
        show,
        onOk: () => { show.value = false; args.onOk?.() },
        onCancel: () => { show.value = false; args.onCancel?.() },
      }
    },
    template: `
      <div>
        <ConfirmPopup :show="show" :ok-text="args.okText" :cancel-text="args.cancelText" @ok="onOk" @cancel="onCancel">
          <div style="padding:20px 30px 0;font-size:1.2em;font-weight:bold;text-align:center;max-width:400px;">
            Hidden confirm popup
          </div>
        </ConfirmPopup>
        <p style="color:#666;font-size:14px;">The popup is currently hidden (show=false).</p>
      </div>
    `,
  }),
  args: { show: false },
}
