'use client';

import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { EmbedField, KeyTextField } from '@prismicio/client';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { css, cx } from '../../../../panda/css';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';

export type VideoItem = {
  title: string | KeyTextField;
  starring: string | KeyTextField;
  client: string | KeyTextField;
  production: string | KeyTextField;
  videoUrl: EmbedField;
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
    bg: '#191919',
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
    gap: '16px',
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
  closeBtnMobile: css({
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
    md: { display: 'none' },
    '@media (orientation: landscape) and (pointer: coarse)': {
      display: 'flex',
      position: 'absolute',
      top: '12px',
      right: '16px',
      mb: '0',
    },
  }),
  closeBtnDesktop: css({
    display: 'none',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    bg: 'transparent',
    border: 'none',
    p: 0,
    transition: 'opacity 0.2s',
    _hover: { opacity: 0.6 },
    md: { display: 'flex', alignSelf: 'flex-start' },
  }),
  // frecce laterali — solo desktop
  navBtn: css({
    display: 'none',
    xl: {
      display: 'flex',
      position: 'fixed',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'white',
      cursor: 'pointer',
      bg: 'transparent',
      border: 'none',
      p: '12px',
      lineHeight: 1,
      userSelect: 'none',
      zIndex: 62,
      transition: 'opacity 0.2s',
      _hover: { opacity: 0.6 },
    },
  }),
  navBtnDisabled: css({
    opacity: 0.25,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  }),
  prevBtn: css({ md: { left: '16px' } }),
  nextBtn: css({ md: { right: '16px' } }),
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
            <Button
              className={cx(
                styles.navBtn,
                styles.prevBtn,
                isPrevDisabled ? styles.navBtnDisabled : undefined,
              )}
              onClick={onPrev}
              disabled={isPrevDisabled}
              aria-label="Video precedente"
            >
              <ChevronLeft size={32} strokeWidth={1} />
            </Button>
            <Button
              className={cx(
                styles.navBtn,
                styles.nextBtn,
                isNextDisabled ? styles.navBtnDisabled : undefined,
              )}
              onClick={onNext}
              disabled={isNextDisabled}
              aria-label="Video successivo"
            >
              <ChevronRight size={32} strokeWidth={1} />
            </Button>

            {video && (
              <Dialog.CloseTrigger asChild>
                <Button className={styles.closeBtnMobile} aria-label="Chiudi">
                  <X size={24} strokeWidth={1} aria-hidden="true" />
                </Button>
              </Dialog.CloseTrigger>
            )}

            {video?.videoUrl?.html && (
              <div
                className={styles.videoWrapper}
                dangerouslySetInnerHTML={{ __html: video.videoUrl.html }}
              />
            )}

            {video && (
              <div className={styles.metaRow}>
                <div className={styles.infoRow}>
                  {video.title && (
                    <Text as="span" textColor="Gray" fontSize="bodyLarge">
                      Title: {video.title}
                    </Text>
                  )}
                  {video.starring && (
                    <Text as="span" textColor="Gray" fontSize="bodyLarge">
                      Starring: {video.starring}
                    </Text>
                  )}
                  {video.client && (
                    <Text as="span" textColor="Gray" fontSize="bodyLarge">
                      Client: {video.client}
                    </Text>
                  )}
                  {video.production && (
                    <Text as="span" textColor="Gray" fontSize="bodyLarge">
                      Production: {video.production}
                    </Text>
                  )}
                </div>
                <Dialog.CloseTrigger asChild>
                  <Button className={styles.closeBtnDesktop} aria-label="Chiudi">
                    <Text as="span" textColor="Gray" fontSize="body">
                      Close
                    </Text>
                  </Button>
                </Dialog.CloseTrigger>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
