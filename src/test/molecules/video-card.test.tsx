import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  starring: 'Actor One',
  client: 'Brand X',
  production: 'Studio Y',
  videoUrl: mockVideo,
  image: mockImage,
};

function openDialog() {
  fireEvent.click(screen.getByRole('img', { name: 'Test thumbnail' }));
}

describe('VideoCard', () => {
  describe('rendering', () => {
    it('renders the trigger image', () => {
      render(<VideoCard {...defaultProps} />);

      expect(screen.getByRole('img', { name: 'Test thumbnail' })).toBeInTheDocument();
    });

    it('does not render dialog content before the dialog is opened', () => {
      render(<VideoCard {...defaultProps} />);

      expect(screen.queryByRole('button', { name: 'Chiudi' })).not.toBeInTheDocument();
    });
  });

  describe('dialog content', () => {
    it('shows the title after opening the dialog', async () => {
      render(<VideoCard {...defaultProps} />);
      openDialog();

      await waitFor(() => {
        expect(screen.getByText('Title: My Video')).toBeInTheDocument();
      });
    });

    it('shows the starring field after opening the dialog', async () => {
      render(<VideoCard {...defaultProps} />);
      openDialog();

      await waitFor(() => {
        expect(screen.getByText('Starring: Actor One')).toBeInTheDocument();
      });
    });

    it('shows the client field after opening the dialog', async () => {
      render(<VideoCard {...defaultProps} />);
      openDialog();

      await waitFor(() => {
        expect(screen.getByText('Client: Brand X')).toBeInTheDocument();
      });
    });

    it('shows the production field after opening the dialog', async () => {
      render(<VideoCard {...defaultProps} />);
      openDialog();

      await waitFor(() => {
        expect(screen.getByText('Production: Studio Y')).toBeInTheDocument();
      });
    });

    it('shows the Chiudi close button after opening the dialog', async () => {
      render(<VideoCard {...defaultProps} />);
      openDialog();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Chiudi' })).toBeInTheDocument();
      });
    });

    it('renders the video iframe when videoUrl.html is provided', async () => {
      render(<VideoCard {...defaultProps} />);
      openDialog();

      await waitFor(() => {
        expect(document.querySelector('iframe')).toBeInTheDocument();
      });
    });

    it('sets the dialog to closed state after clicking Chiudi', async () => {
      render(<VideoCard {...defaultProps} />);
      openDialog();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Chiudi' })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Chiudi' }));

      await waitFor(() => {
        const content = document.querySelector('[data-part="content"][data-scope="dialog"]');
        expect(content).toHaveAttribute('data-state', 'closed');
      });
    });
  });

  describe('conditional rendering', () => {
    it('does not render the title element when title is empty', () => {
      render(<VideoCard {...defaultProps} title="" />);
      openDialog();

      expect(screen.queryByText(/^Title:/)).not.toBeInTheDocument();
    });

    it('does not render the starring element when starring is empty', () => {
      render(<VideoCard {...defaultProps} starring="" />);
      openDialog();

      expect(screen.queryByText(/^Starring:/)).not.toBeInTheDocument();
    });

    it('does not render the client element when client is empty', () => {
      render(<VideoCard {...defaultProps} client="" />);
      openDialog();

      expect(screen.queryByText(/^Client:/)).not.toBeInTheDocument();
    });

    it('does not render the production element when production is empty', () => {
      render(<VideoCard {...defaultProps} production="" />);
      openDialog();

      expect(screen.queryByText(/^Production:/)).not.toBeInTheDocument();
    });

    it('does not render the video div when videoUrl.html is null', () => {
      const noVideo = { html: null } as EmbedField;
      render(<VideoCard {...defaultProps} videoUrl={noVideo} />);
      openDialog();

      expect(document.querySelector('iframe')).not.toBeInTheDocument();
    });
  });
});
