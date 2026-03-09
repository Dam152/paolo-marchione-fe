'use client';

import { NextImage } from '@/components/atoms/NextImage';
import { EmbedField, ImageField, KeyTextField } from '@prismicio/client';
import { css } from '../../../../panda/css';
import { text } from '../../../../panda/recipes';

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
    _hover: {
      '& [data-overlay]': { opacity: 0.7 },
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

  function handleClick() {
    if (!disabled && hasVideo && onOpen) onOpen();
  }

  return (
    <div className={styles.triggerWrapper} onClick={handleClick}>
      <NextImage
        alt={image.alt || String(title || 'Guarda video')}
        src={image.url!}
        sizes="820px"
        lazy={!preload}
        preload={preload}
        className={styles.image}
        width={820}
        height={820}
      />
      {!disabled && (
        <div data-overlay aria-hidden="true" className={styles.overlay}>
          <span className={text({ fontSize: 'bodyLarge', textColor: 'White' })}>{title}</span>
        </div>
      )}
    </div>
  );
}
