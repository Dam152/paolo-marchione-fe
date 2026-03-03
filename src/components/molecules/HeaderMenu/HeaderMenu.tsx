'use client';

import { useEffect, useState } from 'react';
import { KeyTextField } from '@prismicio/client';
import { Button } from '@/components/atoms/Button';
import { NextLink } from '@/components/atoms/NextLink';
import { css, cx } from '../../../../panda/css';
import { container } from '../../../../panda/patterns';
import { text } from '../../../../panda/recipes';
import { Text } from '@/components/atoms/Text';

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
    display: 'flex',
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
};

export function HeaderMenu({ items, appName }: HeaderMenuProps) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const activeItem = items.find((i) => i.label === activeLabel);
  const isOpen = !!activeItem;

  const [displayedContent, setDisplayedContent] = useState<KeyTextField>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLabel(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
                  textColor: isOpen && item.label !== activeLabel ? 'Gray' : 'Black',
                }),
              )}
              onClick={() => {
                const next = activeLabel === item.label ? null : item.label;
                setActiveLabel(next);
                if (next) setDisplayedContent(item.content);
              }}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

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
    </>
  );
}
