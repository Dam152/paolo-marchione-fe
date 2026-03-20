'use client';

import { KeyTextField } from '@prismicio/client';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
} from '@ark-ui/react/accordion';
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from '@ark-ui/react/dialog';
import { ChevronDown, X } from 'lucide-react';
import { css, cx } from '../../../../panda/css';
import { container } from '../../../../panda/patterns';
import { NextLink } from '@/components/atoms/NextLink';
import { Text } from '@/components/atoms/Text';
import { text } from '../../../../panda/recipes';
import { Button } from '@/components/atoms/Button';

type DrawerItem = {
  label: KeyTextField;
  content: KeyTextField;
};

type CustomDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  items: DrawerItem[];
  appName: string;
};

const styles = {
  backdrop: css({
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    opacity: 0,
    '&[data-state="open"]': {
      animation: 'fadeIn 0.3s ease forwards',
      opacity: 0.4,
    },
    '&[data-state="closed"]': {
      animation: 'fadeOut 0.3s ease forwards',
    },
    '&[hidden]': {
      display: 'none',
    },
  }),
  positioner: css({
    position: 'fixed',
    top: 0,
    right: 0,
    h: '100dvh',
    w: '100%',
    zIndex: 201,
    '&[hidden]': {
      display: 'none',
    },
  }),
  content: css({
    h: '100%',
    w: '100%',
    bg: 'White',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    outline: 'none',
    '&[data-state="open"]': {
      animation: 'slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
    },
    '&[data-state="closed"]': {
      animation: 'slideOutToRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
    },
  }),
  drawerHeader: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    h: '96px',
    flexShrink: 0,
    borderBottom: '1px solid token(colors.Gray)',
  }),
  logoLink: css({
    transition: 'opacity 0.2s ease',
    _hover: { opacity: 0.5 },
  }),
  closeButton: css({
    display: 'flex',
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
  nav: css({
    flex: 1,
    py: '8px',
  }),
  accordionItem: css({
    borderBottom: '1px solid token(colors.Gray)',
  }),
  accordionTrigger: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    w: '100%',
    py: '20px',
    cursor: 'pointer',
    _focusVisible: {
      outline: '2px solid token(colors.Black)',
      outlineOffset: '2px',
    },
  }),
  accordionIndicator: css({
    flexShrink: 0,
    transition: 'transform 0.3s ease',
    '&[data-state="open"]': {
      transform: 'rotate(180deg)',
    },
  }),
  accordionContent: css({
    overflow: 'hidden',
    '&[data-state="open"]': {
      animation: 'collapseDown 0.3s ease forwards',
    },
    '&[data-state="closed"]': {
      animation: 'collapseUp 0.3s ease forwards',
    },
  }),
  accordionContentInner: css({
    pb: '24px',
  }),
};

export function CustomDrawer({ isOpen, onClose, items, appName }: CustomDrawerProps) {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        if (!open) onClose();
      }}
      lazyMount
    >
      <DialogBackdrop className={styles.backdrop} />

      <DialogPositioner className={styles.positioner}>
        <DialogContent className={styles.content}>
          <DialogTitle asChild>
            <div className={cx(container(), styles.drawerHeader)}>
              <NextLink
                type="link"
                href="/"
                fontSize="bodyLarge"
                textColor="Black"
                className={styles.logoLink}
                onClick={onClose}
              >
                {appName}
              </NextLink>

              <DialogCloseTrigger asChild>
                <Button aria-label="Chiudi menu" className={styles.closeButton}>
                  <X size={24} strokeWidth={1} aria-hidden="true" />
                </Button>
              </DialogCloseTrigger>
            </div>
          </DialogTitle>

          <nav aria-label="Navigazione mobile" className={cx(container(), styles.nav)}>
            <AccordionRoot collapsible className={css({ w: '100%' })}>
              {items.map((item) => (
                <AccordionItem
                  key={item.label}
                  value={item.label ?? ''}
                  className={styles.accordionItem}
                >
                  <AccordionItemTrigger asChild>
                    <Button
                      className={cx(
                        styles.accordionTrigger,
                        text({ fontSize: 'bodyLarge', textColor: 'Black' }),
                      )}
                    >
                      {item.label}
                      <AccordionItemIndicator asChild>
                        <span className={styles.accordionIndicator}>
                          <ChevronDown size={20} strokeWidth={1} aria-hidden="true" />
                        </span>
                      </AccordionItemIndicator>
                    </Button>
                  </AccordionItemTrigger>

                  <AccordionItemContent className={styles.accordionContent}>
                    <div className={styles.accordionContentInner}>
                      <Text className={css({ textAlign: 'justify' })}>{item.content}</Text>
                    </div>
                  </AccordionItemContent>
                </AccordionItem>
              ))}
            </AccordionRoot>
          </nav>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
