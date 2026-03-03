import '@testing-library/dom';
import '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';

// jsdom does not implement document.fonts; stub it so components that await
// document.fonts.ready don't throw.
if (!document.fonts) {
  Object.defineProperty(document, 'fonts', {
    value: { ready: Promise.resolve() },
  });
}

// GSAP ScrollTrigger calls window.matchMedia during plugin registration.
// jsdom does not implement it, so we provide a minimal stub.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
