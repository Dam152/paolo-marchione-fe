'use client';

import { NextImage } from '@/components/atoms/NextImage';
import { ImageField, KeyTextField } from '@prismicio/client';
import { useRef } from 'react';
import { css, cx } from '../../../../panda/css';
import { Text } from '@/components/atoms/Text';

type VideoCardProps = {
  title: string | KeyTextField;
  image: ImageField;
  preload?: boolean;
  disabled?: boolean;
  onOpenAction?: () => void;
};

const styles = {
  triggerWrapper: css({
    position: 'relative',
    w: '100%',
    aspectRatio: '1/1',
    overflow: 'hidden',
    cursor: 'pointer',
    _hover: { '& [data-overlay]': { opacity: 0.7 } },
  }),
  triggerWrapperDisabled: css({
    cursor: 'default',
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
  image: css({
    w: '100%',
    aspectRatio: '1/1',
  }),
};

export function VideoCard({
  title,
  image,
  preload,
  disabled = false,
  onOpenAction,
}: VideoCardProps) {
  const isTouchRef = useRef(false);

  function handleTouchStart() {
    isTouchRef.current = true;
  }

  function handleClick() {
    if (disabled) return;
    isTouchRef.current = false;
    onOpenAction?.();
  }

  return (
    <div
      className={cx(styles.triggerWrapper, disabled && styles.triggerWrapperDisabled)}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
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
        <div data-overlay aria-hidden="true" className={styles.overlay}>
          <Text as="span" fontSize="bodyLarge" textColor="White">
            {title}
          </Text>
        </div>
      )}
    </div>
  );
}
