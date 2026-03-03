import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HeaderMenu } from '@/components/molecules/HeaderMenu';

const mockItems = [
  { label: 'About', content: 'About content' },
  { label: 'Work', content: 'Work content' },
];

const defaultProps = { items: mockItems, appName: 'Test App' };

describe('HeaderMenu', () => {
  describe('rendering', () => {
    it('renders the app name as a link', () => {
      render(<HeaderMenu {...defaultProps} />);

      const link = screen.getByRole('link', { name: 'Test App' });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    it('renders all nav items as buttons', () => {
      render(<HeaderMenu {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Work' })).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('nav has aria-label', () => {
      render(<HeaderMenu {...defaultProps} />);

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Navigazione principale',
      );
    });

    it('all nav buttons are initially aria-expanded false', () => {
      render(<HeaderMenu {...defaultProps} />);

      within(screen.getByRole('navigation'))
        .getAllByRole('button')
        .forEach((btn) => expect(btn).toHaveAttribute('aria-expanded', 'false'));
    });

    it('all nav buttons have aria-controls pointing to the panel', () => {
      render(<HeaderMenu {...defaultProps} />);

      within(screen.getByRole('navigation'))
        .getAllByRole('button')
        .forEach((btn) => expect(btn).toHaveAttribute('aria-controls', 'header-nav-panel'));
    });

    it('panel is initially inert', () => {
      render(<HeaderMenu {...defaultProps} />);

      expect(document.getElementById('header-nav-panel')).toHaveAttribute('inert');
    });

    it('panel has role region', () => {
      render(<HeaderMenu {...defaultProps} />);

      expect(document.getElementById('header-nav-panel')).toHaveAttribute('role', 'region');
    });
  });

  describe('interaction', () => {
    it('opens the panel on button click', () => {
      render(<HeaderMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'About' }));

      expect(document.getElementById('header-nav-panel')).not.toHaveAttribute('inert');
    });

    it('shows the content of the clicked item', () => {
      render(<HeaderMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'About' }));

      expect(screen.getByText('About content')).toBeInTheDocument();
    });

    it('sets aria-expanded true only on the active button', () => {
      render(<HeaderMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'About' }));

      expect(screen.getByRole('button', { name: 'About' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Work' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('closes the panel when clicking the same button again', () => {
      render(<HeaderMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'About' }));
      fireEvent.click(screen.getByRole('button', { name: 'About' }));

      expect(document.getElementById('header-nav-panel')).toHaveAttribute('inert');
      expect(screen.getByRole('button', { name: 'About' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('switches content when clicking a different item', () => {
      render(<HeaderMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'About' }));
      fireEvent.click(screen.getByRole('button', { name: 'Work' }));

      expect(document.getElementById('header-nav-panel')).not.toHaveAttribute('inert');
      expect(screen.getByText('Work content')).toBeInTheDocument();
    });

    it('closes the panel on Escape key', () => {
      render(<HeaderMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'About' }));
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(document.getElementById('header-nav-panel')).toHaveAttribute('inert');
    });

    it('does not close the panel on other keys', () => {
      render(<HeaderMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'About' }));
      fireEvent.keyDown(document, { key: 'Enter' });

      expect(document.getElementById('header-nav-panel')).not.toHaveAttribute('inert');
    });
  });
});
