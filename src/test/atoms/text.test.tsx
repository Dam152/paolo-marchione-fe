import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from '@/components/atoms/Text';

describe('Text component', () => {
  it('should render correctly with as="p"', () => {
    render(
      <Text
        fontSize={'test'}
        fontWeight={'font-light'}
        font={'geist'}
        className="test-class"
        as="p"
      >
        Test
      </Text>,
    );

    const element = screen.getByText('Test');

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Test');
    expect(element).toHaveClass('test-class');
    expect(element.tagName).toBe('P');
  });

  it('should render as span by default', () => {
    render(<Text fontSize={'test'}>Default Span</Text>);

    const element = screen.getByText('Default Span');

    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('should render as heading when as="h1"', () => {
    render(
      <Text as="h1" fontSize={'test'}>
        Heading Text
      </Text>,
    );

    const element = screen.getByText('Heading Text');

    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('H1');
  });

  it('should render without className when not provided', () => {
    render(<Text fontSize={'test'}>No Class</Text>);

    const element = screen.getByText('No Class');

    expect(element).toBeInTheDocument();
  });
});
