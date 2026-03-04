'use client';

import { ImageProps } from 'next/image';
import Image from 'next/image';

import { useInView } from 'react-intersection-observer';

import { css, cx } from '../../../../panda/css';

const styles = {
  root: css({
    position: 'relative',
    bg: 'White',
  }),
};

export type NextImageProps = Omit<ImageProps, 'priority'> & {
  lazy?: boolean;
  wrapperStyle?: string;
  objectFit?: 'cover' | 'contain';
  animate?: boolean;
  preload?: boolean;
};

export function NextImage({
  src,
  alt,
  sizes,
  lazy,
  animate,
  className = '',
  wrapperStyle = '',
  preload,
  objectFit = 'cover',
  ...props
}: NextImageProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '120px',
    skip: !lazy,
    threshold: 0.3,
  });

  const imageRef = preload ? undefined : ref;

  return (
    <div
      className={cx(className, styles.root, wrapperStyle)}
      data-aos={animate ? 'fade-up' : undefined}
    >
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        sizes={sizes}
        priority={preload}
        loading={preload ? 'eager' : lazy ? 'lazy' : 'eager'}
        fetchPriority={preload ? 'high' : undefined}
        {...props}
        className={cx(
          className,
          css({
            opacity: preload ? 1 : lazy ? (inView ? 1 : 0) : 1,
            transition: preload ? 'none' : 'opacity 1s ease',
            objectFit: objectFit === 'cover' ? 'cover' : 'contain',
          }),
        )}
      />
    </div>
  );
}
