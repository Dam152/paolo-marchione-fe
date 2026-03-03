import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/atoms/Button';

describe('Button', () => {
  it('should render with primary variant', () => {
    render(
      <Button variant={'test'} type="submit" className="button-class">
        Click me
      </Button>,
    );
    const element = screen.getByText('Click me');

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Click me');
    expect(element).toHaveClass('button-class');
    expect(element).toHaveAttribute('type', 'submit');
    expect(element.tagName).toBe('BUTTON');
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();

    render(
      <Button variant={'test'} onClick={handleClick}>
        Clickable
      </Button>,
    );

    const element = screen.getByText('Clickable');
    fireEvent.click(element);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is passed', () => {
    render(
      <Button variant={'test'} disabled>
        Disabled
      </Button>,
    );

    const element = screen.getByText('Disabled');

    expect(element).toBeDisabled();
  });
});
