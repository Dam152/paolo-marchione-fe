import { NextLink } from '@/components/atoms/NextLink';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('NextLink', () => {
  it('should render as button type with button styles', () => {
    render(
      <NextLink href="/test" className="text-link" variant={'test'} type="button">
        Test Link
      </NextLink>,
    );
    const link = screen.getByText('Test Link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('text-link');
    expect(link).toHaveClass('button');
    expect(link.tagName).toBe('A');
  });

  it('should render as link type by default with text styles', () => {
    render(
      <NextLink href="/default" fontSize={'test'}>
        Default Link
      </NextLink>,
    );
    const link = screen.getByText('Default Link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/default');
    expect(link).not.toHaveClass('button');
    expect(link.tagName).toBe('A');
  });

  it('should render with text styling props', () => {
    render(
      <NextLink href="/styled" fontSize={'test'} fontWeight={'font-light'} type="link">
        Styled Text Link
      </NextLink>,
    );
    const link = screen.getByText('Styled Text Link');

    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('should pass additional link props', () => {
    render(
      <NextLink href="/external" target="_blank" rel="noopener noreferrer">
        External Link
      </NextLink>,
    );
    const link = screen.getByText('External Link');

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
