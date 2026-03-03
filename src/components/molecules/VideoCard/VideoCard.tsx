'use client';

import { NextImage } from '@/components/atoms/NextImage';
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { EmbedField, ImageField, KeyTextField } from '@prismicio/client';
import { useState } from 'react';
import { css, cx } from '../../../../panda/css';
import { container } from '../../../../panda/patterns';
import { Button } from '@/components/atoms/Button';

type VideoCardProps = {
  title: string | KeyTextField;
  videoUrl: EmbedField;
  image: ImageField;
};

const styles = {
  trigger: css({ cursor: 'pointer', w: '100%', aspectRatio: '1/1' }),
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
    animation: 'zoomFadeIn 0.5s linear',
    _closed: { animation: 'zoomFadeOut 0.5s linear' },
  }),
  inner: cx(
    container(),
    css({
      display: 'flex',
      alignItems: 'stretch',
      gap: '78px',
    }),
  ),
  titleCol: css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '16px',
    maxW: '334px',
    w: '100%',
    alignSelf: 'stretch',
  }),
  videoCol: css({
    flex: 1,
    aspectRatio: '1230/639',
    border: '1px solid black',
  }),
};

export function VideoCard({ title, videoUrl, image }: VideoCardProps) {
  const [headerOffset, setHeaderOffset] = useState(0);

  function handleOpenChange({ open }: { open: boolean }) {
    if (open) {
      const header = document.querySelector('header');
      setHeaderOffset(header ? Math.max(0, header.getBoundingClientRect().bottom) : 0);
    }
  }

  return (
    <Dialog.Root preventScroll onOpenChange={handleOpenChange}>
      <Dialog.Trigger data-aos="fade-up" suppressHydrationWarning>
        <NextImage
          alt={image.alt ?? ''}
          src={image.url!}
          sizes="410px"
          lazy
          className={styles.trigger}
          fill
        />
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop className={styles.backdrop} />

        <Dialog.Positioner>
          <Dialog.Content
            style={{ justifyContent: headerOffset === 0 ? 'center' : 'flex-start' }}
            className={styles.content}
          >
            <div style={{ height: headerOffset > 0 ? headerOffset + 24 : 0, flexShrink: 0 }} />
            <div className={styles.inner}>
              <div className={styles.titleCol}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <Button
                    className={css({
                      w: 'fit-content',
                    })}
                  >
                    Chiudi
                  </Button>
                </Dialog.CloseTrigger>
              </div>
              <div className={styles.videoCol}>Video</div>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
