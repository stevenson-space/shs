import type { Meta, StoryObj } from '@storybook/vue3';
import { within, expect } from 'storybook/test';
import { cardWidthDecorator } from './storybook_utils';
import DocumentsCard from './DocumentsCard.vue';

const meta = {
  title: 'Cards/DocumentsCard',
  component: DocumentsCard,
  tags: ['autodocs'],
  decorators: [cardWidthDecorator],
  args: {
    className: 'AP Chemistry',
    documents: [
      { title: 'Syllabus', link: 'https://example.com/syllabus.pdf' },
      { title: 'Lab Report Template', link: 'https://example.com/lab.pdf' },
    ],
  },
} satisfies Meta<typeof DocumentsCard>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('AP Chemistry')).toBeInTheDocument();
    await expect(canvas.getByText('Syllabus')).toBeInTheDocument();
  },
};

export const MultipleDocuments: Story = {
  args: {
    className: 'AP Physics',
    documents: [
      { title: 'Unit 1 Notes', link: 'https://example.com/u1.pdf' },
      { title: 'Unit 2 Notes', link: 'https://example.com/u2.pdf' },
      { title: 'Formula Sheet', link: 'https://example.com/formulas.pdf' },
      { title: 'Past Exams', link: 'https://example.com/exams.pdf' },
    ],
  },
};
