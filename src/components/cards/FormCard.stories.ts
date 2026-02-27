import type { Meta, StoryObj } from '@storybook/vue3'
import { within, expect } from 'storybook/test'
import { cardWidthDecorator } from './storybook_utils'
import FormCard from './FormCard.vue'
import FormCardElement from './FormCardElement.vue'

const meta = {
  title: 'Cards/FormCard',
  component: FormCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  argTypes: {
    name: { control: 'text' },
    title: { control: 'text' },
  },
  args: {
    name: 'contact-form',
    title: 'Contact Us',
  },
} satisfies Meta<typeof FormCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { FormCard, FormCardElement },
    setup() { return { args } },
    template: `
      <FormCard :name="args.name" :title="args.title">
        <FormCardElement>
          <label for="name">Name</label>
          <input id="name" type="text" name="name" placeholder="Your name" />
        </FormCardElement>
        <FormCardElement>
          <label for="email">Email</label>
          <input id="email" type="email" name="email" placeholder="your@email.com" />
        </FormCardElement>
        <FormCardElement :submit="true">
          <span>Submit</span>
        </FormCardElement>
      </FormCard>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Contact Us')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Name')).toBeInTheDocument()
    // Do NOT click submit — form POSTs to external service
  },
}
