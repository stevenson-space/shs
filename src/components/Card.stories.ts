import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import Card from './Card.vue';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    shadow: { control: 'boolean' },
    border: { control: 'boolean' },
    wrapperStyle: { control: 'object' },
    ignoreStyleMutations: { control: 'boolean' },
  },
  args: {
    shadow: true,
    border: false,
    wrapperStyle: {},
    ignoreStyleMutations: false,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <Card
        :shadow="args.shadow"
        :border="args.border"
        :wrapper-style="args.wrapperStyle"
        :ignore-style-mutations="args.ignoreStyleMutations"
      >
        <div style="padding: 20px;">
          <h3 style="margin: 0 0 8px; font-size: 16px;">Card Title</h3>
          <p style="margin: 0; font-size: 14px; color: var(--secondary, #666);">
            This is some card content. Cards use a masonry layout and auto-calculate their height.
          </p>
        </div>
      </Card>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Card Title')).toBeInTheDocument();
  },
};

export const WithBorder: Story = {
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <Card
        :shadow="args.shadow"
        :border="args.border"
        :wrapper-style="args.wrapperStyle"
        :ignore-style-mutations="args.ignoreStyleMutations"
      >
        <div style="padding: 20px;">
          <h3 style="margin: 0 0 8px; font-size: 16px;">Bordered Card</h3>
          <p style="margin: 0; font-size: 14px; color: var(--secondary, #666);">
            This card has a visible border and no shadow.
          </p>
        </div>
      </Card>
    `,
  }),
  args: { shadow: false, border: true },
};

export const NoShadow: Story = {
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <Card
        :shadow="args.shadow"
        :border="args.border"
        :wrapper-style="args.wrapperStyle"
        :ignore-style-mutations="args.ignoreStyleMutations"
      >
        <div style="padding: 20px;">
          <h3 style="margin: 0 0 8px; font-size: 16px;">Flat Card</h3>
          <p style="margin: 0; font-size: 14px; color: var(--secondary, #666);">
            This card has neither a shadow nor a border.
          </p>
        </div>
      </Card>
    `,
  }),
  args: { shadow: false, border: false },
};

export const WithCustomWrapperStyle: Story = {
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <Card
        :shadow="args.shadow"
        :border="args.border"
        :wrapper-style="args.wrapperStyle"
        :ignore-style-mutations="args.ignoreStyleMutations"
      >
        <div style="padding: 20px;">
          <h3 style="margin: 0 0 8px; font-size: 16px;">Custom Wrapper Style</h3>
          <p style="margin: 0; font-size: 14px; color: var(--secondary, #666);">
            This card has a custom background applied to its inner wrapper.
          </p>
        </div>
      </Card>
    `,
  }),
  args: { wrapperStyle: { background: 'rgba(128,128,255,0.08)', padding: '4px' } },
};

export const RichContent: Story = {
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <Card
        :shadow="args.shadow"
        :border="args.border"
        :wrapper-style="args.wrapperStyle"
        :ignore-style-mutations="args.ignoreStyleMutations"
      >
        <div style="padding: 20px;">
          <h3 style="margin: 0 0 12px; font-size: 16px;">Upcoming Events</h3>
          <ul style="margin: 0; padding-left: 18px; font-size: 14px; color: var(--secondary, #666);">
            <li>Spring Concert — March 15</li>
            <li>Science Fair — April 2</li>
            <li>Graduation Ceremony — June 10</li>
          </ul>
        </div>
      </Card>
    `,
  }),
};
