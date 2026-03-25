import type { Meta, StoryObj } from "@storybook/vue3";
import { computed } from "vue";
import { within, expect, fn, userEvent } from "storybook/test";
import CountdownWidget from "./CountdownWidget.vue";
import CardPreview from "../CardPreview.vue";
import { mockDateSetup } from "../../cards/storybook_utils";

const TARGET_MS = new Date("2026-04-15T08:00:00").getTime();

const meta = {
  title: "Beta/CountdownWidget",
  component: CountdownWidget,
  tags: ["autodocs"],
  args: {
    eventName: "Spring Break",
    targetDate: TARGET_MS as unknown as Date,
    onMenu: fn(),
  },
} satisfies Meta<typeof CountdownWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderInPreview = (args: Record<string, unknown>) => ({
  components: { CountdownWidget, CardPreview },
  setup() {
    const targetDate = computed(() => new Date(args.targetDate as number));
    return { args, targetDate };
  },
  template: `<CardPreview><CountdownWidget :eventName="args.eventName" :targetDate="targetDate" @menu="args.onMenu" /></CardPreview>`,
});

export const Default: Story = {
  render: renderInPreview,
};

export const DaysAway: Story = {
  ...mockDateSetup(new Date("2026-03-25T08:00:00")),
  render: renderInPreview,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Spring Break")).toBeInTheDocument();
    await expect(canvas.getByText("Days")).toBeInTheDocument();
    await expect(canvas.getByText("Hrs")).toBeInTheDocument();
    await expect(canvas.getByText("Min")).toBeInTheDocument();
    const values = canvasElement.querySelectorAll(".unit-value");
    await expect(values[0].textContent).toBe("21");
    await userEvent.click(canvas.getByLabelText("More options"));
    await expect(args.onMenu).toHaveBeenCalledOnce();
  },
};

export const MonthsAway: Story = {
  ...mockDateSetup(new Date("2026-01-10T08:00:00")),
  render: renderInPreview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Months")).toBeInTheDocument();
    await expect(canvas.getByText("Days")).toBeInTheDocument();
    await expect(canvas.getByText("Hrs")).toBeInTheDocument();
  },
};

export const LastDay: Story = {
  ...mockDateSetup(new Date("2026-04-14T20:30:00")),
  render: renderInPreview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Hrs")).toBeInTheDocument();
    await expect(canvas.getByText("Min")).toBeInTheDocument();
    await expect(canvas.getByText("Sec")).toBeInTheDocument();
    const values = canvasElement.querySelectorAll(".unit-value");
    await expect(values[0].textContent).toBe("11");
  },
};

export const Ended: Story = {
  ...mockDateSetup(new Date("2026-04-15T09:00:00")),
  render: renderInPreview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Reached")).toBeInTheDocument();
    await expect(canvasElement.querySelector(".reached-box")).toBeInTheDocument();
  },
};

export const HeightConsistency: Story = {
  name: "[TEST] Height Consistency",
  ...mockDateSetup(new Date("2026-03-25T08:00:00")),
  render: () => ({
    components: { CountdownWidget, CardPreview },
    setup() {
      const activeDate = new Date("2026-04-15T08:00:00");
      const endedDate = new Date("2020-01-01T00:00:00");
      return { activeDate, endedDate };
    },
    template: `
      <CardPreview style="display: flex; flex-direction: column; gap: 8px;">
        <div data-testid="card-active"><CountdownWidget eventName="Spring Break" :targetDate="activeDate" /></div>
        <div data-testid="card-ended"><CountdownWidget eventName="Spring Break" :targetDate="endedDate" /></div>
      </CardPreview>
    `,
  }),
  play: async ({ canvasElement }) => {
    const h = (testid: string) => {
      const el = canvasElement.querySelector(`[data-testid="${testid}"] .base-card`);
      return el ? Math.round(el.getBoundingClientRect().height) : -1;
    };

    const activeH = h("card-active");
    const endedH = h("card-ended");

    await expect(endedH).toEqual(activeH);
  },
};

export const WidthConsistency: Story = {
  name: "[TEST] Width Consistency",
  ...mockDateSetup(new Date("0001-01-01T00:00:00")),
  render: () => ({
    components: { CountdownWidget, CardPreview },
    setup() {
      const shortTarget = new Date("0001-01-01T00:10:00");
      const longTarget = new Date("9999-12-31T23:59:59");
      return { shortTarget, longTarget };
    },
    template: `
      <CardPreview style="display: flex; flex-direction: column; gap: 8px;">
        <div data-testid="card-short"><CountdownWidget eventName="Soon" :targetDate="shortTarget" /></div>
        <div data-testid="card-long"><CountdownWidget eventName="Far Away" :targetDate="longTarget" /></div>
      </CardPreview>
    `,
  }),
  play: async ({ canvasElement }) => {
    const w = (testid: string) => {
      const el = canvasElement.querySelector(`[data-testid="${testid}"] .base-card`);
      return el ? Math.round(el.getBoundingClientRect().width) : -1;
    };

    const shortW = w("card-short");
    const longW = w("card-long");

    await expect(shortW).toEqual(longW);
  },
};
