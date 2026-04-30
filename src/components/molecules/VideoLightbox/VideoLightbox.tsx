'use client';

import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { EmbedField, ImageField, KeyTextField } from '@prismicio/client';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Player from '@vimeo/player';
import { css, cx } from '../../../../panda/css';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { NextImage } from '@/components/atoms/NextImage';

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
  onCloseAction: () => void;
  onPrevAction: () => void;
  onNextAction: () => void;
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
    md: { px: '24px', maxW: 'min(1360px, calc(100% - 48px))', mx: 'auto' },
    lg: { px: '32px', maxW: 'min(1360px, calc(100% - 64px))' },
    '2xl': { px: '48px', maxW: 'min(1360px, calc(100% - 96px))' },
    _open: { animation: 'fadeIn 0.3s ease' },
    _closed: { animation: 'fadeOut 0.2s ease' },
    // Landscape: video full-viewport, niente padding né max-width
    '@media (orientation: landscape) and (pointer: coarse)': {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '0',
      p: '0',
      maxW: '100% !important',
      mx: '0 !important',
    },
  }),
  videoWrapper: css({
    position: 'relative',
    w: '100%',
    mx: 'auto',
    bg: 'transparent',
    '& > div': { bg: 'transparent' },
    md: { maxWidth: '840px' },
    xl: { maxWidth: '840px' },
    '2xl': { maxWidth: '1088px' },
    aspectRatio: '1088/611',
    overflow: 'hidden',
    '& iframe': { w: '100%', h: '100%', display: 'block' },
    // Landscape: full-viewport
    '@media (orientation: landscape) and (pointer: coarse)': {
      flex: '1 1 auto',
      w: '100%',
      maxW: 'none !important',
      mx: '0',
      aspectRatio: 'unset',
      h: 'var(--root-height, 100dvh)',
      maxH: 'var(--root-height, 100dvh)',
    },
  }),
  // In landscape con overlay image: stesse regole del videoWrapper
  videoWrapperImageLandscape: css({
    '@media (orientation: landscape) and (pointer: coarse)': {
      w: '100%',
      aspectRatio: 'unset',
      h: 'var(--root-height, 100dvh)',
    },
  }),
  metaRowHiddenLandscape: css({
    '@media (orientation: landscape) and (pointer: coarse)': {
      display: 'none',
    },
  }),
  metaRow: css({
    w: '100%',
    mx: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    mt: '32px',
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
    md: {
      w: '100%',
      maxW: '900px',
      mx: 'auto',
      alignSelf: 'auto',
      justifyContent: 'flex-end',
      mb: '12px',
    },
    '2xl': { maxW: '1148px' },
    '@media (orientation: landscape) and (pointer: coarse)': {
      display: 'none',
    },
  }),
  // container frecce — larghezza allineata al container della card grid, frecce fuori dalla griglia
  navContainer: css({
    display: 'none',
    '@media (orientation: landscape) and (pointer: coarse)': {
      display: 'none',
    },
    lg: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: '50%',
      left: 0,
      right: 0,
      transform: 'translateY(-50%)',
      w: '100%',
      maxW: 'min(980px, calc(100% - 48px))', // allineato al container della card grid
      mx: 'auto',
      pointerEvents: 'none',
      zIndex: 62,
    },
    '2xl': {
      maxW: 'min(1360px, calc(100% - 64px))', // allineato al container della card grid (2xl)
    },
  }),
  // traslazione freccia sinistra: stanghette al bordo griglia, punta fuori
  navBtnPrev: css({
    lg: { transform: 'translateX(calc(-100% - 8px))' },
  }),
  // traslazione freccia destra: stanghette al bordo griglia, punta fuori
  navBtnNext: css({
    lg: { transform: 'translateX(calc(100% + 8px))' },
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

function addAutoplay(html: string): string {
  return html.replace(/(<iframe[^>]+src=["'])([^"']+)(["'])/i, (_, pre, src, post) => {
    const url = new URL(src);
    url.searchParams.set('autoplay', '1');
    return `${pre}${url.toString()}${post}`;
  });
}

export function VideoLightbox({
  videos,
  openIndex,
  onCloseAction,
  onPrevAction,
  onNextAction,
}: VideoLightboxProps) {
  const isOpen = openIndex !== null;
  const video = isOpen ? videos[openIndex] : null;
  const isPrevDisabled = openIndex === 0;
  const isNextDisabled = openIndex === videos.length - 1;

  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = videoContainerRef.current;
    if (openIndex === null || !container) return;

    const iframe = container.querySelector('iframe');
    if (!iframe) return;

    const player = new Player(iframe);

    function tryFullscreen() {
      if (!window.matchMedia('(orientation: landscape)').matches) return;
      iframe!.requestFullscreen?.().catch(() => {});
    }

    function handleOrientationChange() {
      if (!window.matchMedia('(orientation: landscape)').matches) return;
      player.getPaused().then((paused) => {
        if (!paused) iframe!.requestFullscreen?.().catch(() => {});
      });
    }

    player.on('play', tryFullscreen);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      player.off('play', tryFullscreen);
      window.removeEventListener('orientationchange', handleOrientationChange);
      player.destroy().catch(() => {});
    };
  }, [openIndex]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => {
        if (!open) onCloseAction();
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
            if (e.target === e.currentTarget) onCloseAction();
          }}
        >
          <Dialog.Content
            className={styles.content}
            onClick={(e) => {
              if (e.target === e.currentTarget) onCloseAction();
            }}
          >
            <div className={styles.navContainer}>
              <Button
                className={cx(
                  styles.navBtn,
                  styles.navBtnPrev,
                  isPrevDisabled ? styles.navBtnDisabled : undefined,
                )}
                onClick={onPrevAction}
                disabled={isPrevDisabled}
                aria-label="Video precedente"
              >
                <ChevronLeft size={32} strokeWidth={1} />
              </Button>
              <Button
                className={cx(
                  styles.navBtn,
                  styles.navBtnNext,
                  isNextDisabled ? styles.navBtnDisabled : undefined,
                )}
                onClick={onNextAction}
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
                  <NextImage
                    src={video.overlayImage.url}
                    alt={video.overlayImage.alt || ''}
                    fill
                    objectFit="cover"
                    sizes="(max-width: 768px) 100vw, 1088px"
                    lazy
                    className={css({ w: '100%', h: '100%' })}
                  />
                ) : (
                  <div
                    ref={videoContainerRef}
                    dangerouslySetInnerHTML={{ __html: addAutoplay(video.videoUrl.html!) }}
                    style={{ width: '100%', height: '100%' }}
                    onClick={() => {
                      const iframe = videoContainerRef.current?.querySelector('iframe');
                      if (!iframe) return;
                      if (window.matchMedia('(orientation: landscape)').matches) {
                        iframe.requestFullscreen?.().catch(() => {});
                      }
                    }}
                  />
                )}
              </div>
            )}

            {video && (
              <div className={cx(styles.metaRow, styles.metaRowHiddenLandscape)}>
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
