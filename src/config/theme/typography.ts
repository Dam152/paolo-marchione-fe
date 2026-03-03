import { defineTextStyles, defineTokens } from '@pandacss/dev';

export const fonts = defineTokens.fonts({
  neueMontreal: { value: 'var(--font-neue-monteral), sans-serif' },
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

  bodyLarge: {
    value: {
      fontSize: { base: '1.6rem', md: '2rem' },
    },
  },
});
