import { defineRecipe } from '@pandacss/dev';

export const buttonRecipe = defineRecipe({
  className: 'button',
  description: 'Styles for button component',
  base: {},
  variants: {
    variant: {
      test: {},
    },
  },
  defaultVariants: {},
});
