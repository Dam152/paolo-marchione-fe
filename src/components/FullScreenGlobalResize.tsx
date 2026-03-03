'use client';

import { useCallback, useEffect } from 'react';

import { isMobile, isTablet } from 'react-device-detect';

export function FullscreenGlobalResize() {
  const handleChange = useCallback(() => {
    requestAnimationFrame(() => {
      let total = 0;

      total = window.visualViewport ? window.visualViewport.height : window.innerHeight;

      let totalHeaderLess = total;

      const header = document.querySelector('header');
      if (header && window.getComputedStyle(header).display !== 'none') {
        totalHeaderLess -= header.getBoundingClientRect().height;
      }

      document.documentElement.style.setProperty(
        '--root-height-less-header',
        `${totalHeaderLess}px`,
      );
      document.documentElement.style.setProperty('--root-height', `${total}px`);
    });
  }, []);

  useEffect(() => {
    handleChange();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleChange);

      window.visualViewport.addEventListener('scroll', handleChange);
    } else {
      window.addEventListener('resize', handleChange);
    }

    const orientation = window.matchMedia('(orientation: portrait)');
    orientation.addEventListener('change', handleChange);

    const observer = new ResizeObserver(() => {
      setTimeout(handleChange, 100);
    });

    observer.observe(document.documentElement);

    if (isMobile || isTablet) {
      window.addEventListener('scroll', handleChange, { passive: true });

      document.addEventListener('touchstart', () => setTimeout(handleChange, 300), {
        passive: true,
      });
      document.addEventListener('touchend', () => setTimeout(handleChange, 300), { passive: true });
    }

    window.addEventListener('resize', handleChange);

    document.addEventListener('visibilitychange', handleChange);

    return () => {
      observer.disconnect();
      orientation.removeEventListener('change', handleChange);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleChange);
        window.visualViewport.removeEventListener('scroll', handleChange);
      }

      window.removeEventListener('resize', handleChange);

      if (isMobile || isTablet) {
        window.removeEventListener('scroll', handleChange);
        document.removeEventListener('touchstart', () => setTimeout(handleChange, 300));
        document.removeEventListener('touchend', () => setTimeout(handleChange, 300));
      }

      document.removeEventListener('visibilitychange', handleChange);
    };
  }, [handleChange]);

  return null;
}
