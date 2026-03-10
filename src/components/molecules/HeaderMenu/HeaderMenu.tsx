'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { KeyTextField } from '@prismicio/client';
import { Button } from '@/components/atoms/Button';
import { NextLink } from '@/components/atoms/NextLink';
import { Text } from '@/components/atoms/Text';
import { CustomDrawer } from '@/components/molecules/CustomDrawer';
import { css, cx } from '../../../../panda/css';
import { container } from '../../../../panda/patterns';
import { text } from '../../../../panda/recipes';

type MenuItem = {
  label: KeyTextField;
  content: KeyTextField;
};

type HeaderMenuProps = {
  items: MenuItem[];
  appName: string;
};

const styles = {
  topRow: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: { base: '24px' },
    h: {
      base: '96px',
      md: '172px',
    },
  }),
  nav: css({
    display: { base: 'none', md: 'flex' },
    alignItems: 'center',
    gap: { base: '16px', md: '54px' },
  }),
  link: css({
    transition: 'opacity 0.3s linear',
    _hover: {
      opacity: 0.5,
    },
  }),
  navButton: css({
    transition: 'color 0.3s ease',
  }),
  panelWrapper: css({
    display: 'grid',
    gridTemplateRows: '0fr',
    transition: 'grid-template-rows 0.4s ease',
  }),
  panelWrapperOpen: css({
    gridTemplateRows: '1fr',
  }),
  panelInner: css({
    overflow: 'hidden',
  }),
  panel: css({
    w: '100%',
    bg: 'White',
    pb: {
      base: '48px',
      md: '86px',
    },
  }),
  hamburger: css({
    display: { base: 'flex', md: 'none' },
    alignItems: 'center',
    justifyContent: 'center',
    w: '44px',
    h: '44px',
    mr: '-14px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'opacity 0.2s ease',
    _hover: { opacity: 0.6 },
    _focusVisible: {
      outline: '2px solid token(colors.Black)',
      outlineOffset: '2px',
    },
  }),
};

export function HeaderMenu({ items, appName }: HeaderMenuProps) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeItem = items.find((i) => i.label === activeLabel);
  const isOpen = !!activeItem;

  const [displayedContent, setDisplayedContent] = useState<KeyTextField>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLabel(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleWindowClick() {
      setActiveLabel(null);
    }
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [isOpen]);

  return (
    <>
      <div className={cx(container(), styles.topRow)}>
        <NextLink
          type="link"
          href="/"
          fontSize="bodyLarge"
          textColor="Black"
          className={styles.link}
        >
          {appName}
        </NextLink>

        {/* Desktop nav */}
        <nav aria-label="Navigazione principale" className={styles.nav}>
          {items.map((item) => (
            <Button
              key={item.label}
              aria-expanded={activeLabel === item.label}
              aria-controls="header-nav-panel"
              className={cx(
                styles.navButton,
                text({
                  fontSize: 'bodyLarge',
                  textColor:
                    (isOpen && item.label !== activeLabel) ||
                    (hoveredLabel !== null && item.label === hoveredLabel)
                      ? 'Gray'
                      : 'Black',
                }),
              )}
              onMouseEnter={() => setHoveredLabel(item.label)}
              onMouseLeave={() => setHoveredLabel(null)}
              onClick={(e) => {
                e.stopPropagation();
                const next = activeLabel === item.label ? null : item.label;
                setActiveLabel(next);
                if (next) setDisplayedContent(item.content);
              }}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <Button
          aria-label="Apri menu"
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-nav-drawer"
          className={styles.hamburger}
          onClick={() => setIsDrawerOpen(true)}
        >
          <Menu size={24} strokeWidth={1} aria-hidden="true" />
        </Button>
      </div>

      {/* Desktop dropdown panel */}
      <div className={cx(styles.panelWrapper, isOpen && styles.panelWrapperOpen)}>
        <div
          id="header-nav-panel"
          role="region"
          aria-label={activeLabel ?? undefined}
          inert={!isOpen}
          className={styles.panelInner}
        >
          <div className={cx(container(), styles.panel)}>
            <Text>{displayedContent}</Text>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={items}
        appName={appName}
      />
    </>
  );
}
