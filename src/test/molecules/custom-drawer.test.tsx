import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CustomDrawer } from '@/components/molecules/CustomDrawer/CustomDrawer';

const mockItems = [
  { label: 'About', content: 'About content' },
  { label: 'Work', content: 'Work content' },
];

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  items: mockItems,
  appName: 'Test App',
};

describe('CustomDrawer', () => {
  describe('rendering', () => {
    it('does not render content when closed (lazyMount)', () => {
      render(<CustomDrawer {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('renders the app name as a link when open', () => {
      render(<CustomDrawer {...defaultProps} />);

      const link = screen.getByRole('link', { name: 'Test App' });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    it('renders the close button with aria-label', () => {
      render(<CustomDrawer {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Chiudi menu' })).toBeInTheDocument();
    });

    it('renders all accordion item triggers', () => {
      render(<CustomDrawer {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Work' })).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('nav has the correct aria-label', () => {
      render(<CustomDrawer {...defaultProps} />);

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Navigazione mobile',
      );
    });

    it('all accordion triggers are initially aria-expanded false', () => {
      render(<CustomDrawer {...defaultProps} />);

      const triggers = screen.getAllByRole('button', { name: /About|Work/ });

      triggers.forEach((btn) => expect(btn).toHaveAttribute('aria-expanded', 'false'));
    });
  });

  describe('interaction', () => {
    it('calls onClose when the app name link is clicked', () => {
      const onClose = vi.fn();
      render(<CustomDrawer {...defaultProps} onClose={onClose} />);

      fireEvent.click(screen.getByRole('link', { name: 'Test App' }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

  });
});
