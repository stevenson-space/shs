import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect, waitFor } from 'storybook/test';
import { cardWidthDecorator, mockDateSetup } from './storybook_utils';
import NewThemeCard from './NewThemeCard.vue';

const meta = {
  title: 'Cards/NewThemeCard',
  component: NewThemeCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  beforeEach() {
    localStorage.removeItem('dismissedThemeCards');
  },
} satisfies Meta<typeof NewThemeCard>;

export default meta;
type Story = StoryObj<typeof meta>

// Winter: 12/15–03/15. Dec 25 2025 → parseDateRange yields [Dec 15 2025, Mar 15 2026].
// (For dates in Jan–Mar 2026, the algorithm places the range in Dec 2026–Mar 2027 relative to
// the 2026 reference year, so Dec 25 2025 is the reliable date to activate winter.)
export const Default: Story = {
  ...mockDateSetup(new Date(2025, 11, 25)),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Try')).toBeInTheDocument());
    await expect(canvas.getByText(/The Winter Theme/)).toBeInTheDocument();
  },
};

// Fall: 09/16–12/15. Oct 1 2025 falls within the Fall range but before Halloween (10/20).
// Note: Halloween (10/20–11/01) is always superseded by Fall in the theme iteration order
// because fall.json comes before halloween.json alphabetically and their ranges overlap.
export const Fall: Story = {
  ...mockDateSetup(new Date(2025, 9, 1)),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Try')).toBeInTheDocument());
    await expect(canvas.getByText(/The Fall Theme/)).toBeInTheDocument();
  },
};

// Summer: 05/15–09/15. Jun 15 2025 falls within the Summer range.
export const Summer: Story = {
  ...mockDateSetup(new Date(2025, 5, 15)),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Try')).toBeInTheDocument());
    await expect(canvas.getByText(/the summer theme/i)).toBeInTheDocument();
  },
};

// St. Patrick's: 03/06–03/20. Mar 10 2026 falls within the range.
// parseDateRange("12/15-03/15", Mar 10 2026) yields [Dec 15 2026, Mar 15 2027] — so winter
// does not match, and St. Patrick's correctly shows first.
export const StPatricksDay: Story = {
  ...mockDateSetup(new Date(2026, 2, 10)),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Try')).toBeInTheDocument());
    await expect(canvas.getByText(/The St\. Patrick's Theme/)).toBeInTheDocument();
  },
};
