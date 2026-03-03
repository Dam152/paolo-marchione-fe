export const animations = {
  slideInFromRight: {
    '0%': {
      transform: 'translateX(100%)',
    },
    '100%': {
      transform: 'translateX(0)',
    },
  },
  slideOutToRight: {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: 'translateX(100%)',
    },
  },
  fadeIn: {
    '0%': {
      opacity: '0',
    },
    '100%': {
      opacity: '1',
    },
  },
  fadeOut: {
    '0%': {
      opacity: '1',
    },
    '100%': {
      opacity: '0',
    },
  },
  slideDown: {
    '0%': {
      transform: 'translateY(-100%)',
    },
    '100%': {
      transform: 'translateY(0)',
    },
  },
  slideUp: {
    '0%': {
      transform: 'translateY(0)',
    },
    '100%': {
      transform: 'translateY(-100%)',
    },
  },
  collapseDown: {
    '0%': { height: '0' },
    '100%': { height: 'var(--height)' },
  },
  collapseUp: {
    '0%': { height: 'var(--height)' },
    '100%': { height: '0' },
  },
  zoomFadeIn: {
    '0%': { transform: 'translateY(100%)' },
    '100%': { transform: 'translateY(0)' },
  },
  zoomFadeOut: {
    '0%': { transform: 'translateY(0)' },
    '100%': { transform: 'translateY(100%)' },
  },
};
