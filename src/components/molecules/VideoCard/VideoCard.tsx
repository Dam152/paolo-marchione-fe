'use client';

import { NextImage } from '@/components/atoms/NextImage';
import { EmbedField, ImageField, KeyTextField } from '@prismicio/client';
import { useRef, useState } from 'react';
import { css, cx } from '../../../../panda/css';
import { Text } from '@/components/atoms/Text';

type VideoCardProps = {
  title: string | KeyTextField;
  videoUrl: EmbedField;
  image: ImageField;
  preload?: boolean;
  disabled?: boolean;
  onOpen?: () => void;
};

const styles = {
  triggerWrapper: css({
    position: 'relative',
    w: '100%',
    aspectRatio: '1/1',
    overflow: 'hidden',
    cursor: 'pointer',
    '@media (pointer: fine)': {
      _hover: { '& [data-overlay]': { opacity: 0.7 } },
    },
  }),
  overlay: css({
    position: 'absolute',
    inset: 0,
    bg: '#2B2B2B',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: '16px',
    pointerEvents: 'none',
  }),
  overlayRevealed: css({
    opacity: 0.7,
  }),
  image: css({
    w: '100%',
    aspectRatio: '1/1',
  }),
};

export function VideoCard({
  title,
  videoUrl,
  image,
  preload,
  disabled = false,
  onOpen,
}: VideoCardProps) {
  const hasVideo = !!videoUrl?.html;
  const [revealed, setRevealed] = useState(false);
  const isTouchRef = useRef(false);

  function handleTouchStart() {
    isTouchRef.current = true;
  }

  function handleClick() {
    if (disabled || !hasVideo) return;

    if (isTouchRef.current) {
      isTouchRef.current = false;
      onOpen?.();
      return;
    }

    onOpen?.();
  }

  function handleBlur() {
    setRevealed(false);
  }

  return (
    <div
      className={styles.triggerWrapper}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onBlur={handleBlur}
      tabIndex={0}
    >
      <NextImage
        alt={image.alt || String(title || 'Guarda video')}
        src={image.url!}
        sizes="1230px"
        lazy={!preload}
        preload={preload}
        className={styles.image}
        width={image.dimensions?.width}
        height={image.dimensions?.height}
      />
      {!disabled && (
        <div
          data-overlay
          aria-hidden="true"
          className={cx(styles.overlay, revealed && styles.overlayRevealed)}
        >
          <Text as="span" fontSize="bodyLarge" textColor="White">
            {title}
          </Text>
        </div>
      )}
    </div>
  );
}
