import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import CardContainer from './CardContainer.vue';
import Card from './Card.vue';

const meta = {
  title: 'Components/CardContainer',
  component: CardContainer,
  tags: ['autodocs'],
} satisfies Meta<typeof CardContainer>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { CardContainer, Card },
    template: `
      <CardContainer>
        <Card>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">Announcements</h3>
            <p style="margin: 0; font-size: 14px;">
              Spring semester has begun. Check the calendar for upcoming events and deadlines.
            </p>
          </div>
        </Card>
        <Card>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">Quick Links</h3>
            <ul style="margin: 0; padding-left: 18px; font-size: 14px;">
              <li>Student Portal</li>
              <li>Library Resources</li>
              <li>Schedule</li>
            </ul>
          </div>
        </Card>
        <Card>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">Upcoming Events</h3>
            <ul style="margin: 0; padding-left: 18px; font-size: 14px;">
              <li>Spring Concert — March 15</li>
              <li>Science Fair — April 2</li>
              <li>Art Show — April 20</li>
              <li>Graduation — June 10</li>
            </ul>
          </div>
        </Card>
        <Card>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">Weather</h3>
            <p style="margin: 0; font-size: 14px;">Sunny, 72°F</p>
          </div>
        </Card>
      </CardContainer>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Announcements')).toBeInTheDocument();
    await expect(canvas.getByText('Quick Links')).toBeInTheDocument();
    await expect(canvas.getByText('Upcoming Events')).toBeInTheDocument();
  },
};

export const SingleCard: Story = {
  render: () => ({
    components: { CardContainer, Card },
    template: `
      <CardContainer>
        <Card>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">Single Card</h3>
            <p style="margin: 0; font-size: 14px;">A single card in the masonry grid container.</p>
          </div>
        </Card>
      </CardContainer>
    `,
  }),
};

export const ManyCards: Story = {
  render: () => ({
    components: { CardContainer, Card },
    template: `
      <CardContainer>
        <Card>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">Card A</h3>
            <p style="margin: 0; font-size: 14px;">Short content.</p>
          </div>
        </Card>
        <Card>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">Card B</h3>
            <p style="margin: 0; font-size: 14px;">
              This card has more content and therefore spans more grid rows to accommodate it.
            </p>
          </div>
        </Card>
        <Card>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">Card C</h3>
            <p style="margin: 0; font-size: 14px;">Medium content here.</p>
          </div>
        </Card>
        <Card>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">Card D</h3>
            <p style="margin: 0; font-size: 14px;">Brief.</p>
          </div>
        </Card>
        <Card>
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">Card E</h3>
            <p style="margin: 0; font-size: 14px;">
              Another card to fill out the masonry layout demonstration.
            </p>
          </div>
        </Card>
      </CardContainer>
    `,
  }),
};
