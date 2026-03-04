'use client';

import { NextImage } from '@/components/atoms/NextImage';
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { EmbedField, ImageField, KeyTextField } from '@prismicio/client';
import React, { useState } from 'react';
import { css, cx } from '../../../../panda/css';
import { container } from '../../../../panda/patterns';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { text } from '../../../../panda/recipes';

type VideoCardProps = {
  title: string | KeyTextField;
  starring: string | KeyTextField;
  client: string | KeyTextField;
  production: string | KeyTextField;
  videoUrl: EmbedField;
  image: ImageField;
  preload?: boolean;
};

const styles = {
  trigger: css({
    cursor: 'pointer',
    w: '100%',
    aspectRatio: '1/1',
  }),
  backdrop: css({
    position: 'fixed',
    inset: 0,
    h: 'var(--root-height, 100vh)',
    w: '100%',
    zIndex: 60,
  }),
  content: css({
    position: 'fixed',
    bg: 'White',
    inset: 0,
    h: 'var(--root-height, 100vh)',
    w: '100%',
    zIndex: 61,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    animation: 'zoomFadeIn 0.5s linear',
    _closed: { animation: 'zoomFadeOut 0.5s linear' },
  }),
  inner: cx(
    container(),
    css({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '32px',
      pb: '32px',
      md: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '48px',
        pb: '48px',
      },
      lg: {
        gap: '78px',
      },
    }),
  ),
  titleCol: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    w: '100%',
    md: {
      justifyContent: 'space-between',
      alignSelf: 'stretch',
      maxW: '280px',
      minH: '639px',
      gap: '16px',
    },
    lg: {
      maxW: '334px',
    },
  }),
  infoGrid: css({
    display: 'grid',
    gap: '16px',
    md: {
      gap: '24px',
    },
  }),
  closeButton: cx(
    text({
      fontSize: 'bodyLarge',
      textColor: 'Black',
    }),
    css({
      display: 'flex',
      w: 'fit-content',
    }),
  ),

  videoCol: css({
    w: '100%',
    aspectRatio: '16/9',
    order: -1,
    overflow: 'hidden',
    md: {
      flex: 1,
      aspectRatio: '1230/639',
      order: 0,
    },
    '& iframe': {
      w: '100%',
      h: '100%',
      display: 'block',
    },
  }),
};

const animatedItemClass = css({ animation: 'fadeInUp 0.7s ease-out both' });

function animStyle(delay: string): React.CSSProperties {
  return { animationDelay: delay };
}

export function VideoCard({
  title,
  starring,
  client,
  production,
  videoUrl,
  image,
  preload,
}: VideoCardProps) {
  const [headerOffset, setHeaderOffset] = useState(0);

  function handleOpenChange({ open }: { open: boolean }) {
    if (open) {
      const header = document.querySelector('header');
      setHeaderOffset(header ? Math.max(0, header.getBoundingClientRect().bottom) : 0);
    }
  }

  return (
    <Dialog.Root lazyMount preventScroll onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        aria-label={String(title || 'Guarda video')}
        data-aos="fade-up"
        suppressHydrationWarning
      >
        <NextImage
          alt={image.alt ?? ''}
          src={image.url!}
          sizes="410px"
          lazy={!preload}
          preload={preload}
          className={styles.trigger}
          width={410}
          height={410}
        />
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop className={styles.backdrop} />

        <Dialog.Positioner>
          <Dialog.Content style={{ justifyContent: 'flex-start' }} className={styles.content}>
            <div style={{ height: Math.max(96, headerOffset + 24), flexShrink: 0 }} />
            <div className={styles.inner}>
              <div className={styles.titleCol}>
                <div className={styles.infoGrid}>
                  {title && (
                    <Dialog.Title
                      className={cx(
                        text({ fontSize: 'bodyLarge', textColor: 'Black' }),
                        animatedItemClass,
                      )}
                      style={animStyle('0.3s')}
                    >
                      Title: {title}
                    </Dialog.Title>
                  )}
                  {starring && (
                    <Text className={animatedItemClass} style={animStyle('0.38s')}>
                      Starring: {starring}
                    </Text>
                  )}
                  {client && (
                    <Text className={animatedItemClass} style={animStyle('0.46s')}>
                      Client: {client}
                    </Text>
                  )}
                  {production && (
                    <Text className={animatedItemClass} style={animStyle('0.54s')}>
                      Production: {production}
                    </Text>
                  )}
                </div>
                <Dialog.CloseTrigger asChild>
                  <Button
                    className={cx(styles.closeButton, animatedItemClass)}
                    style={animStyle('0.62s')}
                  >
                    Chiudi
                  </Button>
                </Dialog.CloseTrigger>
              </div>
              {videoUrl.html && (
                <div
                  className={cx(styles.videoCol, animatedItemClass)}
                  style={animStyle('0.3s')}
                  dangerouslySetInnerHTML={{ __html: videoUrl.html }}
                />
              )}
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
