import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NextImage } from '@/components/atoms/NextImage';

vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn(() => ({
    ref: vi.fn(),
    inView: true,
  })),
}));

describe('NextImage', () => {
  it('should render image with correct attributes', () => {
    render(
      <NextImage
        src="/test.jpg"
        alt="Test Image"
        width={500}
        height={300}
        className="test-class-img"
      />,
    );

    const imgElement = screen.getByRole('img', { name: 'Test Image' });

    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAccessibleName('Test Image');
    expect(imgElement).toHaveClass('test-class-img');
    expect(imgElement.tagName).toBe('IMG');
  });

  it('should render with lazy loading', () => {
    render(<NextImage src="/lazy.jpg" alt="Lazy Image" width={500} height={300} lazy />);

    const imgElement = screen.getByRole('img', { name: 'Lazy Image' });

    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('loading', 'lazy');
  });

  it('should render with preload priority', () => {
    render(<NextImage src="/preload.jpg" alt="Preload Image" width={500} height={300} preload />);

    const imgElement = screen.getByRole('img', { name: 'Preload Image' });

    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('loading', 'eager');
    expect(imgElement).toHaveAttribute('fetchpriority', 'high');
  });

  it('should render with animate data attribute', () => {
    const { container } = render(
      <NextImage src="/animate.jpg" alt="Animate Image" width={500} height={300} animate />,
    );

    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveAttribute('data-aos', 'fade-up');
  });

  it('should not have data-aos when animate is false', () => {
    const { container } = render(
      <NextImage src="/no-animate.jpg" alt="No Animate" width={500} height={300} />,
    );

    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).not.toHaveAttribute('data-aos');
  });
});
