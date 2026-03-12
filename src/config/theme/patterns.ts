import { definePattern } from '@pandacss/dev';

export const container = definePattern({
  description: 'Centred Container for Padding responsive',
  properties: {
    fluid: { type: 'boolean' },
  },
  blocklist: ['maxWidth'],
  transform(props) {
    const { fluid, ...rest } = props;
    return {
      width: '100%',
      maxWidth: fluid
        ? '100%'
        : {
            base: 'min(960px, calc(100% - 32px))',
            md: 'min(960px, calc(100% - 48px))',
            xl: 'min(960px, calc(100% - 64px))',
            '2xl': 'min(1360px, calc(100% - 96px))',
          },
      mx: 'auto',
      ...rest,
    };
  },
});
