import { Button } from '@/components/atoms/Button';
import { KeyTextField } from '@prismicio/client';
import { CSSProperties } from 'react';
import { css, cx } from '../../../../panda/css';
import { text } from '../../../../panda/recipes';

type CategoryCardProps = {
  title: string | KeyTextField;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  isActive?: boolean;
};

export function CategoryCard({
  title,
  className = '',
  style,
  onClick,
  isActive = false,
}: CategoryCardProps) {
  return (
    <div
      data-aos="fade-up"
      className={cx(
        className,
        css({
          w: '100%',
          display: {
            base: 'none',
            md: 'block',
          },
        }),
      )}
      style={style}
      suppressHydrationWarning
    >
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={cx(
          text({ fontSize: 'bodyLarge', textColor: isActive ? 'White' : 'Black' }),
          css({
            w: '100%',
            aspectRatio: '1/1',
            bg: isActive ? 'Black' : 'Gray',

            transition: 'background-color 0.3s ease, opacity 0.5s ease',
            ...(!isActive && {
              _hover: {
                opacity: 0.6,
              },
            }),
          }),
        )}
      >
        {title}
      </Button>
    </div>
  );
}
