import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CategoryCard } from '@/components/molecules/CategoryCard/CategoryCard';

describe('CategoryCard', () => {
  describe('rendering', () => {
    it('renders the title inside a button', () => {
      render(<CategoryCard title="Design" />);

      expect(screen.getByRole('button', { name: 'Design' })).toBeInTheDocument();
    });

    it('renders with a string title', () => {
      render(<CategoryCard title="Film" />);

      expect(screen.getByText('Film')).toBeInTheDocument();
    });

    it('applies the custom className to the wrapper div', () => {
      const { container } = render(<CategoryCard title="Design" className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies inline style to the wrapper div', () => {
      const { container } = render(<CategoryCard title="Design" style={{ opacity: 0.2 }} />);

      expect(container.firstChild).toHaveStyle({ opacity: 0.2 });
    });

  });

  describe('interaction', () => {
    it('calls onClick when the button is clicked', () => {
      const onClick = vi.fn();
      render(<CategoryCard title="Design" onClick={onClick} />);

      fireEvent.click(screen.getByRole('button', { name: 'Design' }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not propagate click to the parent element', () => {
      const parentClick = vi.fn();
      render(
        <div onClick={parentClick}>
          <CategoryCard title="Design" onClick={vi.fn()} />
        </div>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Design' }));

      expect(parentClick).not.toHaveBeenCalled();
    });

    it('does not throw when onClick is not provided', () => {
      render(<CategoryCard title="Design" />);

      expect(() => fireEvent.click(screen.getByRole('button', { name: 'Design' }))).not.toThrow();
    });
  });
});
