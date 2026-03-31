import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EmbedField, ImageField } from '@prismicio/client';

import { VideoCard } from '@/components/molecules/VideoCard/VideoCard';

vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn(() => ({ ref: vi.fn(), inView: true })),
}));

const mockImage = {
  url: 'https://example.com/test.jpg',
  alt: 'Test thumbnail',
  dimensions: { width: 800, height: 600 },
  copyright: null,
  id: 'img-1',
} as ImageField;

const mockVideo = {
  html: '<iframe src="https://www.youtube.com/embed/test"></iframe>',
  embed_url: 'https://www.youtube.com/watch?v=test',
} as EmbedField;

const defaultProps = {
  title: 'My Video',
  videoUrl: mockVideo,
  image: mockImage,
};

describe('VideoCard', () => {
  describe('rendering', () => {
    it('renders the trigger image', () => {
      render(<VideoCard {...defaultProps} />);

      expect(screen.getByRole('img', { name: 'Test thumbnail' })).toBeInTheDocument();
    });

    it('renders the hover overlay with title when not disabled', () => {
      render(<VideoCard {...defaultProps} />);

      expect(screen.getByText('My Video')).toBeInTheDocument();
    });

    it('does not render the hover overlay when disabled', () => {
      render(<VideoCard {...defaultProps} disabled />);

      expect(screen.queryByText('My Video')).not.toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('calls onOpenAction when clicked with a valid video', () => {
      const onOpenAction = vi.fn();
      render(<VideoCard {...defaultProps} onOpenAction={onOpenAction} />);

      fireEvent.click(screen.getByRole('img', { name: 'Test thumbnail' }));

      expect(onOpenAction).toHaveBeenCalledTimes(1);
    });

    it('does not call onOpenAction when disabled', () => {
      const onOpenAction = vi.fn();
      render(<VideoCard {...defaultProps} disabled onOpenAction={onOpenAction} />);

      fireEvent.click(screen.getByRole('img', { name: 'Test thumbnail' }));

      expect(onOpenAction).not.toHaveBeenCalled();
    });

    it('does not call onOpenAction when videoUrl.html is null', () => {
      const onOpenAction = vi.fn();
      const noVideo = { html: null } as EmbedField;
      render(<VideoCard {...defaultProps} videoUrl={noVideo} onOpenAction={onOpenAction} />);

      fireEvent.click(screen.getByRole('img', { name: 'Test thumbnail' }));

      expect(onOpenAction).not.toHaveBeenCalled();
    });

    it('does not throw when onOpenAction is not provided', () => {
      render(<VideoCard {...defaultProps} />);

      expect(() =>
        fireEvent.click(screen.getByRole('img', { name: 'Test thumbnail' })),
      ).not.toThrow();
    });
  });
});
