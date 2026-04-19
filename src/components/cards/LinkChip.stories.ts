import type { Meta, StoryObj } from '@storybook/vue3';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { within, expect } from 'storybook/test';
import LinkChip from './LinkChip.vue';

const meta = {
  title: 'Cards/LinkChip',
  component: LinkChip,
  tags: ['autodocs'],
  argTypes: {
    background: { control: 'color' },
    color: { control: 'color' },
  },
  args: {
    href: 'https://example.com',
    label: 'Example',
    background: '#f0f0f0',
    color: '#333',
    alt: '',
  },
} satisfies Meta<typeof LinkChip>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /Example/i });
    await expect(link).toBeInTheDocument();
    await expect(link).toHaveAttribute('href', 'https://example.com');
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Visit Link',
    href: 'https://example.com',
    icon: faLink,
    background: '#4f46e5',
    color: '#fff',
  },
};

export const CustomColors: Story = {
  args: {
    label: 'Custom Style',
    href: 'https://example.com',
    background: 'var(--accent)',
    color: 'var(--iconCardsRegular)',
  },
};
