import { describe, it, expect } from 'vitest';
import { SplitText } from '@/components/atoms/SplitText';
import { render, screen } from '@testing-library/react';
describe('SplitText', () => {
  it('should split text into words and characters', () => {
    render(<SplitText text="Hello World" />);

    const element = screen.getByText('Hello World');
    expect(element).toBeInTheDocument();
  });
});
