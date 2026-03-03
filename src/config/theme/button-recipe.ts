import { defineRecipe } from '@pandacss/dev';

export const buttonRecipe = defineRecipe({
  className: 'button',
  description: 'Styles for button component',
  base: { cursor: 'pointer' },
  variants: {
    variant: {
      test: {},
    },
  },
  defaultVariants: {},
});
