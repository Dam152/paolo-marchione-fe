import { animations } from '@/config/theme/animations';
import { breakpoints } from '@/config/theme/breakpoints';
import { buttonRecipe } from '@/config/theme/button-recipe';
import { colormap } from '@/config/theme/colormap';
import { container } from '@/config/theme/patterns';
import { textRecipe } from '@/config/theme/text-recipe';
import { fonts, fontWeights, typography } from '@/config/theme/typography';
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: colormap,
        fonts: fonts,
        fontWeights: fontWeights,
      },
      textStyles: typography,
      keyframes: animations,
      breakpoints: breakpoints,

      recipes: {
        text: textRecipe,
        button: buttonRecipe,
      },
    },
  },

  patterns: {
    extend: {
      container,
    },
  },

  // The output directory for your css system
  outdir: 'panda',

  staticCss: {
    recipes: {
      text: ['*'],
      button: ['*'],
    },
  },

  globalCss: {
    html: {
      fontSize: '62.5%',
    },
    body: {
      bg: 'White',
      fontSize: '1.6rem',
      fontFamily: 'neueMontreal',
      overflowX: 'hidden',
    },
  },
});
