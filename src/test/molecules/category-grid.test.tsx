import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CategoryDocument } from '../../../prismicio-types';

import { CategoryGrid } from '@/components/molecules/CategoryGrid/CategoryGrid';

function makeCategory(id: string, title: string) {
  return {
    id,
    uid: id,
    type: 'category',
    href: '',
    tags: [],
    lang: 'en-us',
    data: { title, video: [] },
  } as unknown as CategoryDocument;
}

const cat1 = makeCategory('cat-1', 'Design');
const cat2 = makeCategory('cat-2', 'Film');
const categories = [cat1, cat2];

describe('CategoryGrid', () => {
  describe('rendering', () => {
    it('renders all category buttons', () => {
      render(<CategoryGrid categories={categories} />);

      expect(screen.getByRole('button', { name: 'Design' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Film' })).toBeInTheDocument();
    });

    it('renders all categories at full opacity initially', () => {
      render(<CategoryGrid categories={categories} />);

      const designWrapper = screen.getByRole('button', { name: 'Design' }).parentElement;
      const filmWrapper = screen.getByRole('button', { name: 'Film' }).parentElement;

      expect(designWrapper).toHaveStyle({ opacity: 1 });
      expect(filmWrapper).toHaveStyle({ opacity: 1 });
    });
  });

  describe('interaction', () => {
    it('dims non-active categories when one is clicked', () => {
      render(<CategoryGrid categories={categories} />);

      fireEvent.click(screen.getByRole('button', { name: 'Design' }));

      const filmWrapper = screen.getByRole('button', { name: 'Film' }).parentElement;
      expect(filmWrapper).toHaveStyle({ opacity: 0.2 });
    });

    it('keeps the active category at full opacity', () => {
      render(<CategoryGrid categories={categories} />);

      fireEvent.click(screen.getByRole('button', { name: 'Design' }));

      const designWrapper = screen.getByRole('button', { name: 'Design' }).parentElement;
      expect(designWrapper).toHaveStyle({ opacity: 1 });
    });

    it('resets all opacities when clicking the active category again', () => {
      render(<CategoryGrid categories={categories} />);

      fireEvent.click(screen.getByRole('button', { name: 'Design' }));
      fireEvent.click(screen.getByRole('button', { name: 'Design' }));

      const filmWrapper = screen.getByRole('button', { name: 'Film' }).parentElement;
      expect(filmWrapper).toHaveStyle({ opacity: 1 });
    });

    it('resets all opacities when clicking a different category while one is active', () => {
      render(<CategoryGrid categories={categories} />);

      fireEvent.click(screen.getByRole('button', { name: 'Design' }));
      // Film is dimmed; clicking Film while Design is active resets (not switches)
      fireEvent.click(screen.getByRole('button', { name: 'Film' }));

      const designWrapper = screen.getByRole('button', { name: 'Design' }).parentElement;
      const filmWrapper = screen.getByRole('button', { name: 'Film' }).parentElement;

      expect(designWrapper).toHaveStyle({ opacity: 1 });
      expect(filmWrapper).toHaveStyle({ opacity: 1 });
    });

    it('resets all opacities on a window click', () => {
      render(<CategoryGrid categories={categories} />);

      fireEvent.click(screen.getByRole('button', { name: 'Design' }));

      const filmWrapper = screen.getByRole('button', { name: 'Film' }).parentElement;
      expect(filmWrapper).toHaveStyle({ opacity: 0.2 });

      fireEvent.click(document.body);

      expect(filmWrapper).toHaveStyle({ opacity: 1 });
    });

    it('does not reset opacity on the same click event that activates the category', () => {
      render(<CategoryGrid categories={categories} />);

      // Clicking the button uses stopPropagation, so window listener should NOT fire
      fireEvent.click(screen.getByRole('button', { name: 'Design' }));

      const filmWrapper = screen.getByRole('button', { name: 'Film' }).parentElement;
      // Film is still dimmed, meaning the window listener did not fire
      expect(filmWrapper).toHaveStyle({ opacity: 0.2 });
    });
  });
});
