import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/prismicio', () => ({
  createClient: vi.fn(() => ({
    getSingle: vi.fn().mockResolvedValue({
      data: {
        menu_voice: [
          { label: 'About', content: 'About content' },
          { label: 'Work', content: 'Work content' },
        ],
      },
    }),
  })),
}));

vi.mock('@/config/env', () => ({
  env: { NEXT_PUBLIC_APP_NAME: 'Test App' },
}));

import { Header } from '@/components/organisms/Header';

describe('Header', () => {
  it('renders a header element', async () => {
    const jsx = await Header();
    render(jsx);

    expect(document.querySelector('header')).toBeInTheDocument();
  });

  it('renders the app name', async () => {
    const jsx = await Header();
    render(jsx);

    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('renders all menu items from Prismic', async () => {
    const jsx = await Header();
    render(jsx);

    expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Work' })).toBeInTheDocument();
  });

  it('renders the navigation landmark', async () => {
    const jsx = await Header();
    render(jsx);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
