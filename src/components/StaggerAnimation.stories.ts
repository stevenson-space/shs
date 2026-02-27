import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";
import { userEvent, within, expect } from "storybook/test";
import StaggerAnimation from "./StaggerAnimation.vue";

const meta = {
  title: "Components/StaggerAnimation",
  component: StaggerAnimation,
  tags: ["autodocs"],
  argTypes: {
    align: { control: "select", options: ["left", "right", "center"] },
    direction: { control: "select", options: ["up", "down"] },
    numberOfSlots: { control: "number" },
    isColorSelector: { control: "boolean" },
  },
  args: {
    align: "right",
    direction: "down",
    numberOfSlots: 3,
    isColorSelector: false,
  },
} satisfies Meta<typeof StaggerAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

const optionStyle = {
  backgroundColor: "var(--background)",
  borderRadius: "100px",
  boxShadow: "0px 0px 10px -4px rgba(0,0,0,.6)",
  padding: "5px 12px",
  marginLeft: "8px",
  whiteSpace: "nowrap",
  cursor: "pointer",
  userSelect: "none",
};

export const Default: Story = {
  args: {
    align: "left",
  },

  render: (args) => ({
    components: { StaggerAnimation },
    setup() {
      const open = ref(false);
      const options = ["Monday", "Tuesday", "Wednesday"];
      return { args, open, options, optionStyle };
    },
    template: `
      <div style="position: relative; height: 160px;">
        <button
          @click="open = !open"
          style="background: var(--background); border: 1.5px solid var(--accent); border-radius: 100px; padding: 5px 12px; cursor: pointer; font-weight: bold; color: var(--primary);"
        >
          Toggle ▾
        </button>
        <StaggerAnimation
          :direction="args.direction"
          :number-of-slots="options.length"
          :align="args.align"
          :is-color-selector="args.isColorSelector"
        >
          <template v-if="open">
            <div v-for="(option, i) in options" :key="option" :data-index="i" :style="optionStyle">
              {{ option }}
            </div>
          </template>
        </StaggerAnimation>
      </div>
    `,
  }),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button");
    await userEvent.click(toggle);
    await expect(canvas.getByText("Monday")).toBeInTheDocument();
  },
};

export const DirectionUp: Story = {
  render: (args) => ({
    components: { StaggerAnimation },
    setup() {
      const open = ref(false);
      const options = ["Option A", "Option B", "Option C"];
      return { args, open, options, optionStyle };
    },
    template: `
      <div style="position: relative; height: 160px; padding-top: 120px;">
        <button
          @click="open = !open"
          style="background: var(--background); border: 1.5px solid var(--accent); border-radius: 100px; padding: 5px 12px; cursor: pointer; font-weight: bold; color: var(--primary);"
        >
          Toggle ▴
        </button>
        <StaggerAnimation direction="up" :number-of-slots="options.length" align="right">
          <template v-if="open">
            <div v-for="(option, i) in options" :key="option" :data-index="i" :style="optionStyle">
              {{ option }}
            </div>
          </template>
        </StaggerAnimation>
      </div>
    `,
  }),
};

export const AlignLeft: Story = {
  render: (args) => ({
    components: { StaggerAnimation },
    setup() {
      const open = ref(false);
      const options = ["First", "Second", "Third"];
      return { args, open, options, optionStyle };
    },
    template: `
      <div style="position: relative; height: 160px;">
        <button
          @click="open = !open"
          style="background: var(--background); border: 1.5px solid var(--accent); border-radius: 100px; padding: 5px 12px; cursor: pointer; font-weight: bold; color: var(--primary);"
        >
          Toggle ▾
        </button>
        <StaggerAnimation direction="down" :number-of-slots="options.length" align="left">
          <template v-if="open">
            <div v-for="(option, i) in options" :key="option" :data-index="i" :style="optionStyle">
              {{ option }}
            </div>
          </template>
        </StaggerAnimation>
      </div>
    `,
  }),
};
