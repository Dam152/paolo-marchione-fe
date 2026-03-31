'use client';

import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { EmbedField, ImageField, KeyTextField } from '@prismicio/client';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { css, cx } from '../../../../panda/css';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';

export type VideoMetadataItem = {
  label: string | KeyTextField;
  text: string | KeyTextField;
};

export type VideoItem = {
  metadata: VideoMetadataItem[];
  videoUrl: EmbedField;
  overlayImage?: ImageField;
};

type VideoLightboxProps = {
  videos: VideoItem[];
  openIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const styles = {
  backdrop: css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    h: 'var(--root-height, 100dvh)',
    zIndex: 60,
    bg: 'rgba(25, 25, 25, 0.96)',
    _open: { animation: 'fadeIn 0.25s ease' },
    _closed: { animation: 'fadeOut 0.2s ease' },
  }),
  positioner: css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    h: 'var(--root-height, 100dvh)',
    zIndex: 61,
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'auto',
    _closed: { pointerEvents: 'none' },
  }),
  content: css({
    w: '100%',
    px: '16px',
    display: 'flex',
    flexDirection: 'column',
    // Landscape su phone/tablet: layout a due colonne
    '@media (orientation: landscape) and (pointer: coarse)': {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '24px',
      py: '16px',
      px: '16px',
    },
    md: { px: '24px', maxW: 'min(1360px, calc(100% - 48px))', mx: 'auto' },
    lg: { px: '32px', maxW: 'min(1360px, calc(100% - 64px))' },
    '2xl': { px: '48px', maxW: 'min(1360px, calc(100% - 96px))' },
    _open: { animation: 'fadeIn 0.3s ease' },
    _closed: { animation: 'fadeOut 0.2s ease' },
  }),
  videoWrapper: css({
    position: 'relative',
    w: '100%',
    mx: 'auto',
    md: { maxWidth: '840px' },
    xl: { maxWidth: '840px' },
    '2xl': { maxWidth: '1088px' },
    aspectRatio: '1088/611',
    overflow: 'hidden',
    // Landscape su phone/tablet: altezza vincolata al viewport, larghezza proporzionale
    '@media (orientation: landscape) and (pointer: coarse)': {
      flex: '1 1 0',
      mx: '0',
      w: '0',
      maxH: 'calc(var(--root-height, 100dvh) - 32px)',
    },
    '& iframe': { w: '100%', h: '100%', display: 'block' },
  }),
  metaRow: css({
    w: '100%',
    mx: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    mt: '32px',
    // Landscape su phone/tablet: colonna laterale destra
    '@media (orientation: landscape) and (pointer: coarse)': {
      flex: '1 1 0',
      mt: '0',
      flexDirection: 'column',
      maxWidth: 'none',
    },
    md: {
      maxWidth: '840px',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    xl: {
      maxWidth: '840px',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    '2xl': {
      maxWidth: '1088px',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
  }),
  infoRow: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }),
  closeBtn: css({
    display: 'flex',
    alignSelf: 'flex-end',
    mb: '12px',
    cursor: 'pointer',
    bg: 'transparent',
    border: 'none',
    p: 0,
    color: 'token(colors.Gray)',
    transition: 'opacity 0.2s',
    _hover: { opacity: 0.6 },
    '@media (orientation: landscape) and (pointer: coarse)': {
      position: 'absolute',
      top: '12px',
      right: '16px',
      mb: '0',
    },
    md: {
      w: '100%',
      maxW: '900px',
      mx: 'auto',
      alignSelf: 'auto',
      justifyContent: 'flex-end',
      mb: '12px',
    },
    '2xl': { maxW: '1148px' },
  }),
  // container frecce — segue il pattern del content container, frecce a 48px dai bordi
  navContainer: css({
    display: 'none',
    xl: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: '50%',
      left: 0,
      right: 0,
      transform: 'translateY(-50%)',
      w: '100%',
      maxW: 'min(1360px, calc(100% - 64px))', // stesso pattern di content a lg/xl
      mx: 'auto',
      px: '24px',
      pointerEvents: 'none',
      zIndex: 62,
    },
    '2xl': {
      maxW: 'min(1360px, calc(100% - 64px))', // stesso pattern di content a 2xl
      px: '24px',
    },
  }),
  // frecce laterali
  navBtn: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
    bg: 'transparent',
    border: 'none',
    p: '12px',
    lineHeight: 1,
    userSelect: 'none',
    pointerEvents: 'auto',
    transition: 'opacity 0.2s',
    _hover: { opacity: 0.6 },
  }),
  navBtnDisabled: css({
    opacity: 0.25,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  }),
};

export function VideoLightbox({ videos, openIndex, onClose, onPrev, onNext }: VideoLightboxProps) {
  const isOpen = openIndex !== null;
  const video = isOpen ? videos[openIndex] : null;
  const isPrevDisabled = openIndex === 0;
  const isNextDisabled = openIndex === videos.length - 1;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => {
        if (!open) onClose();
      }}
      preventScroll
      lazyMount
      unmountOnExit
    >
      <Portal>
        <Dialog.Backdrop className={styles.backdrop} />

        <Dialog.Positioner
          className={styles.positioner}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <Dialog.Content
            className={styles.content}
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className={styles.navContainer}>
              <Button
                className={cx(styles.navBtn, isPrevDisabled ? styles.navBtnDisabled : undefined)}
                onClick={onPrev}
                disabled={isPrevDisabled}
                aria-label="Video precedente"
              >
                <ChevronLeft size={32} strokeWidth={1} />
              </Button>
              <Button
                className={cx(styles.navBtn, isNextDisabled ? styles.navBtnDisabled : undefined)}
                onClick={onNext}
                disabled={isNextDisabled}
                aria-label="Video successivo"
              >
                <ChevronRight size={32} strokeWidth={1} />
              </Button>
            </div>

            {video && (
              <Dialog.CloseTrigger asChild>
                <Button className={styles.closeBtn} aria-label="Chiudi">
                  <X size={24} strokeWidth={1} aria-hidden="true" />
                </Button>
              </Dialog.CloseTrigger>
            )}

            {video && (video.overlayImage?.url || video.videoUrl?.html) && (
              <div className={styles.videoWrapper}>
                {video.overlayImage?.url ? (
                  <Image
                    src={video.overlayImage.url}
                    alt={video.overlayImage.alt || ''}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 1088px"
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: video.videoUrl.html! }} style={{ width: '100%', height: '100%' }} />
                )}
              </div>
            )}

            {video && (
              <div className={styles.metaRow}>
                <div className={styles.infoRow}>
                  {video.metadata.map((item, i) =>
                    item.label && item.text ? (
                      <Text key={i} as="span" textColor="Gray" fontSize="bodyLarge">
                        {item.label}: {item.text}
                      </Text>
                    ) : null,
                  )}
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
