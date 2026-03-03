import { defineTextStyles, defineTokens } from '@pandacss/dev';

export const fonts = defineTokens.fonts({
  geist: { value: 'var(--font-geist-sans), sans-serif' },
  geistMono: { value: 'var(--font-geist-mono), monospace' },
});

export const fontWeights = defineTokens.fontWeights({
  'font-light': {
    value: '300',
    description: 'Font Weight Light',
  },
});

export const typography = defineTextStyles({
  test: {
    value: {
      fontSize: '1.6rem',
    },
  },
});
