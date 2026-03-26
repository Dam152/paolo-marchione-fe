import { type RecipeVariantRecord, defineRecipe } from '@pandacss/dev';

import { colormap } from './colormap';
import { fonts, fontWeights, typography } from './typography';

const fontSizeVariants = Object.fromEntries(
  Object.keys(typography).map((key) => [key, { textStyle: key }]),
) as RecipeVariantRecord[string];

const fontWeightVariants = Object.fromEntries(
  Object.keys(fontWeights).map((key) => [key, { fontWeight: key }]),
) as RecipeVariantRecord[string];

const textColorVariants = Object.fromEntries(
  Object.keys(colormap).map((key) => [key, { color: key }]),
) as RecipeVariantRecord[string];

const fontVariants = Object.fromEntries(
  Object.keys(fonts).map((key) => [key, { font: key }]),
) as RecipeVariantRecord[string];

export const textRecipe = defineRecipe({
  className: 'text',
  description: 'The styles for the Text component',
  base: {},
  variants: {
    fontSize: fontSizeVariants,
    fontWeight: fontWeightVariants,
    font: fontVariants,
    textColor: textColorVariants,
  },
  defaultVariants: {
    font: 'neueMontreal',
  },
});
