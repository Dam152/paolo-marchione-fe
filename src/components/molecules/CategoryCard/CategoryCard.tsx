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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isActive?: boolean;
};

export function CategoryCard({
  title,
  className = '',
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isActive = false,
}: CategoryCardProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cx(
        className,
        css({
          w: '100%',
          display: {
            base: 'none',
            md: 'block',
          },
          animation: 'fadeIn 0.6s ease backwards',
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
            bg: isActive ? '#191919' : 'Gray',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            ...(!isActive && {
              _hover: {
                bg: '#191919',
                color: 'White',
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
