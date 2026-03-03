'use client';

import { useEffect } from 'react';

import Aos from 'aos';
import 'aos/dist/aos.css';

export function AosProvider() {
  useEffect(() => {
    setTimeout(() => {
      Aos.init({
        duration: 1000,
        once: true,
        offset: 50,
      });
    }, 100);
  }, []);
  return null;
}
