import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import ParticleSystem from './ParticleSystem.vue';

const meta = {
  title: 'Components/ParticleSystem',
  component: ParticleSystem,
  tags: ['autodocs'],
  argTypes: {
    speed: { control: { type: 'range', min: 0, max: 10, step: 0.5 } },
    interaction: { control: 'boolean' },
    size: { control: { type: 'range', min: 1, max: 30, step: 1 } },
    count: { control: { type: 'range', min: 1, max: 100, step: 1 } },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    color: { control: 'color' },
    windPower: { control: { type: 'range', min: -10, max: 10, step: 0.5 } },
    images: { control: 'object' },
  },
  args: {
    speed: 1,
    interaction: false,
    size: 7,
    count: 20,
    opacity: 1,
    color: '#ffffff',
    windPower: 0,
    images: [],
  },
} satisfies Meta<typeof ParticleSystem>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { ParticleSystem },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px; height: 300px; background: #1a1a2e; position: relative; overflow: hidden;">
        <ParticleSystem v-bind="args" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('canvas') as HTMLCanvasElement;
    await expect(canvas).toBeInTheDocument();
  },
};

export const FastSpeed: Story = {
  render: (args) => ({
    components: { ParticleSystem },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px; height: 300px; background: #1a1a2e; position: relative; overflow: hidden;">
        <ParticleSystem v-bind="args" />
      </div>
    `,
  }),
  args: {
    speed: 5,
    count: 30,
  },
};

export const LargeParticles: Story = {
  render: (args) => ({
    components: { ParticleSystem },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px; height: 300px; background: #1a1a2e; position: relative; overflow: hidden;">
        <ParticleSystem v-bind="args" />
      </div>
    `,
  }),
  args: {
    size: 20,
    count: 10,
  },
};

export const ColoredParticles: Story = {
  render: (args) => ({
    components: { ParticleSystem },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px; height: 300px; background: #0f172a; position: relative; overflow: hidden;">
        <ParticleSystem v-bind="args" />
      </div>
    `,
  }),
  args: {
    color: '#f59e0b',
    count: 40,
    size: 5,
  },
};

export const WithWind: Story = {
  render: (args) => ({
    components: { ParticleSystem },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px; height: 300px; background: #1a1a2e; position: relative; overflow: hidden;">
        <ParticleSystem v-bind="args" />
      </div>
    `,
  }),
  args: {
    windPower: 5,
    count: 30,
    speed: 2,
  },
};

export const LowOpacity: Story = {
  render: (args) => ({
    components: { ParticleSystem },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px; height: 300px; background: #1a1a2e; position: relative; overflow: hidden;">
        <ParticleSystem v-bind="args" />
      </div>
    `,
  }),
  args: {
    opacity: 0.3,
    count: 50,
    size: 10,
  },
};
