import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import SwitchByDevice from './SwitchByDevice.vue';

const meta = {
  title: 'Components/SwitchByDevice',
  component: SwitchByDevice,
  tags: ['autodocs'],
} satisfies Meta<typeof SwitchByDevice>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { SwitchByDevice },
    template: `
      <SwitchByDevice>
        <template #mobile>
          <div style="padding: 12px; background: var(--accent, #4a90e2); color: white; border-radius: 8px;">
            Mobile View: Compact layout for small screens
          </div>
        </template>
        <template #tablet>
          <div style="padding: 12px; background: var(--secondary, #666); color: white; border-radius: 8px;">
            Tablet View: Medium layout for tablet screens
          </div>
        </template>
        <template #desktop>
          <div style="padding: 12px; background: var(--primary, #333); color: white; border-radius: 8px;">
            Desktop View: Full layout for large screens
          </div>
        </template>
      </SwitchByDevice>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Mobile View/)).toBeInTheDocument();
    await expect(canvas.getByText(/Tablet View/)).toBeInTheDocument();
    await expect(canvas.getByText(/Desktop View/)).toBeInTheDocument();
  },
};

export const WithDefaultFallback: Story = {
  render: () => ({
    components: { SwitchByDevice },
    template: `
      <SwitchByDevice>
        <div style="padding: 12px; background: var(--background, #f5f5f5); border: 1px solid var(--secondary, #ccc); border-radius: 8px;">
          Default content shown on all devices not covered by a named slot
        </div>
        <template #desktop>
          <div style="padding: 12px; background: var(--primary, #333); color: white; border-radius: 8px;">
            Desktop-specific content overrides the default
          </div>
        </template>
      </SwitchByDevice>
    `,
  }),
};

export const MobileOnly: Story = {
  render: () => ({
    components: { SwitchByDevice },
    template: `
      <SwitchByDevice>
        <template #mobile>
          <div style="padding: 12px; background: var(--accent, #4a90e2); color: white; border-radius: 8px;">
            This content only appears on mobile devices
          </div>
        </template>
      </SwitchByDevice>
    `,
  }),
};

export const AllSlotsWithLabels: Story = {
  render: () => ({
    components: { SwitchByDevice },
    template: `
      <div>
        <p style="font-size: 12px; color: var(--secondary, #666); margin-bottom: 8px;">
          All slots are rendered in DOM. Visibility depends on viewport CSS breakpoints.
        </p>
        <SwitchByDevice>
          <template #mobile>
            <div style="padding: 12px 16px; background: #e8f4fd; border-left: 4px solid #4a90e2; border-radius: 4px; font-size: 14px;">
              Mobile slot
            </div>
          </template>
          <template #tablet>
            <div style="padding: 12px 16px; background: #fdf6e8; border-left: 4px solid #f5a623; border-radius: 4px; font-size: 14px;">
              Tablet slot
            </div>
          </template>
          <template #desktop>
            <div style="padding: 12px 16px; background: #e8fdf0; border-left: 4px solid #4caf50; border-radius: 4px; font-size: 14px;">
              Desktop slot
            </div>
          </template>
        </SwitchByDevice>
      </div>
    `,
  }),
};
